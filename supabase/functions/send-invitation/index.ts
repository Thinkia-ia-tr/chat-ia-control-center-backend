
// This file is a placeholder for the removed send-invitation function
// It has been retained as part of the project structure but its functionality has been disabled
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Return a friendly message indicating the function is disabled
  return new Response(
    JSON.stringify({ 
      error: 'This functionality has been disabled'
    }),
    { 
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
};

serve(handler);
