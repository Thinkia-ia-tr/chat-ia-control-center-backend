import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface UserWithRole {
  id: string;
  email: string;
  username: string | null;
  role: "super_admin" | "admin" | "usuario";
}

export function UsersList() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get profiles data with email
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, email');
        
      if (profilesError) throw profilesError;
      
      if (!profilesData || profilesData.length === 0) {
        setUsers([]);
        return;
      }
      
      // Fetch roles separately
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
      }
      
      // Combine the data
      const combinedUsers: UserWithRole[] = profilesData.map(profile => {
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
      
      setUsers(combinedUsers);
      
      // Check if 'thinkia' user exists and update to super_admin if needed
      const thinkiaUser = combinedUsers.find(u => u.username === 'thinkia');
      if (thinkiaUser && thinkiaUser.role !== 'super_admin') {
        await updateUserRole(thinkiaUser.id, 'super_admin');
        toast.success("Usuario 'thinkia' actualizado a Super Admin");
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError(`Error al cargar usuarios: ${error.message}`);
      toast.error("Error al cargar usuarios: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const updateUserRole = async (userId: string, newRole: "super_admin" | "admin" | "usuario") => {
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
      
      // Update local list
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
      
      toast.success(`Rol actualizado a ${newRole}`);
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast.error("Error al actualizar el rol: " + error.message);
    }
  };
  
  const promoteSuperAdmin = async (userId: string) => {
    await updateUserRole(userId, 'super_admin');
  };
  
  const columns = [
    {
      header: "Usuario",
      accessorKey: "username",
      cell: ({ row }: { row: { original: UserWithRole } }) => (
        <div>
          <p className="font-medium">{row.original.username || "Sin nombre de usuario"}</p>
        </div>
      )
    },
    {
      header: "Correo electrónico",
      accessorKey: "email",
      cell: ({ row }: { row: { original: UserWithRole } }) => (
        <div>
          <p className="text-sm">{row.original.email}</p>
        </div>
      )
    }
  ];
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={users}
        className="bg-card"
      />
      {loading && <p className="text-center py-4">Cargando usuarios...</p>}
    </div>
  );
}
