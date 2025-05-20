
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the current user who's making the request (for created_by field)
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseServiceKey,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin or super_admin role
    const { data: hasAdminRole, error: roleCheckError } = await supabase.rpc(
      'has_role',
      { _user_id: user.id, _role: 'admin' }
    );

    const { data: hasSuperAdminRole, error: superRoleCheckError } = await supabase.rpc(
      'has_role',
      { _user_id: user.id, _role: 'super_admin' }
    );

    if (roleCheckError || superRoleCheckError) {
      console.error('Error checking role:', roleCheckError || superRoleCheckError);
      return new Response(
        JSON.stringify({ error: 'Error checking role' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!hasAdminRole && !hasSuperAdminRole) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Requires admin privileges' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    let data;
    try {
      data = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email } = data as InvitationRequest;
    
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a secure random token
    const token = crypto.randomUUID();
    
    // Set expiration time (48 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // Check if an invitation already exists for this email
    const { data: existingInvitation } = await supabase
      .from('registration_invitations')
      .select('*')
      .eq('email', email)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    let invitationId;

    if (existingInvitation) {
      // Update the existing invitation with a new token and expiration
      const { data: updatedInvitation, error: updateError } = await supabase
        .from('registration_invitations')
        .update({
          token,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
          created_by: user.id
        })
        .eq('id', existingInvitation.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating invitation:', updateError);
        return new Response(
          JSON.stringify({ error: 'Error updating invitation' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      invitationId = updatedInvitation.id;
    } else {
      // Create a new invitation
      const { data: newInvitation, error: insertError } = await supabase
        .from('registration_invitations')
        .insert({
          email,
          token,
          expires_at: expiresAt.toISOString(),
          created_by: user.id
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating invitation:', insertError);
        return new Response(
          JSON.stringify({ error: 'Error creating invitation' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      invitationId = newInvitation.id;
    }

    // Get the base URL from the request (for building the registration link)
    const url = new URL(req.url);
    const origin = req.headers.get('origin') || `${url.protocol}//${url.host}`;
    
    // Create the registration link
    const registrationLink = `${origin}/auth/register?token=${token}`;
    
    // Log for debugging
    console.log(`[INFO] Generated registration link for ${email}: ${registrationLink}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation link generated', 
        invitationId,
        debug: {
          email,
          token,
          registrationLink
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in send-invitation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);
