
import { supabase } from "@/integrations/supabase/client";
import { UserWithRole } from "@/components/users/demoUsers";
import { toast } from "sonner";

export async function fetchUsersData() {
  try {
    // Get profiles data with email
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, email');
      
    if (profilesError) throw profilesError;
    
    let combinedUsers: UserWithRole[] = [];
    
    if (profilesData && profilesData.length > 0) {
      // Fetch roles separately
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
      }
      
      // Combine the data
      combinedUsers = profilesData.map(profile => {
        // Type assertion since we know the structure
        const typedProfile = profile as { id: string; username: string | null; email: string | null };
        
        // Find role for this user
        const roleRecord = rolesData?.find(r => r.user_id === typedProfile.id);
        
        return {
          id: typedProfile.id,
          username: typedProfile.username,
          email: typedProfile.email || "No disponible",
          role: (roleRecord?.role as "super_admin" | "admin" | "usuario") || "usuario"
        };
      });
    }
    
    return { users: combinedUsers, error: null };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return { users: [], error: error.message };
  }
}

export async function updateUserRole(userId: string, newRole: "super_admin" | "admin" | "usuario") {
  // No actualizar roles para usuarios de demostración
  if (userId.startsWith('demo-user-')) {
    toast.error("No se puede cambiar el rol de usuarios de demostración");
    return false;
  }
  
  try {
    // First check if the user has a role assigned
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingRole) {
      // Update existing role
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);
        
      if (updateError) throw updateError;
    } else {
      // Insert new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });
        
      if (insertError) throw insertError;
    }
    
    toast.success(`Rol actualizado a ${newRole}`);
    return true;
  } catch (error: any) {
    console.error("Error updating role:", error);
    toast.error("Error al actualizar el rol: " + error.message);
    return false;
  }
}

export async function checkAndUpdateThinkiaUser(users: UserWithRole[]) {
  try {
    const thinkiaUser = users.find(u => u.username === 'thinkia');
    if (thinkiaUser && thinkiaUser.role !== 'super_admin') {
      await updateUserRole(thinkiaUser.id, 'super_admin');
      toast.success("Usuario 'thinkia' actualizado a Super Admin");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating thinkia user:", error);
    return false;
  }
}
