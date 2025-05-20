
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const { user: currentUser, userRole: currentUserRole } = useAuth();
  
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

  // Check if current user can modify roles (must be admin or super_admin)
  const canModifyRoles = currentUserRole === 'admin' || currentUserRole === 'super_admin';
  
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
    },
    {
      header: "Rol",
      accessorKey: "role",
      cell: ({ row }: { row: { original: UserWithRole } }) => {
        const user = row.original;
        const isSuperAdmin = user.role === "super_admin";
        const isCurrentUser = currentUser?.id === user.id;
        const isThinkia = user.username === "thinkia";
        
        // Always show super admin badge with icon
        if (isSuperAdmin) {
          return (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Shield size={12} />
              super_admin
            </Badge>
          );
        }
        
        // Special case for thinkia user - add promote button if not super admin
        if (isThinkia && !isSuperAdmin) {
          return (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{user.role}</Badge>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => promoteSuperAdmin(user.id)}
              >
                Promover a Super Admin
              </Button>
            </div>
          );
        }
        
        // Show badge for current user or if user can't modify roles
        if (isCurrentUser || !canModifyRoles) {
          return <Badge variant="outline">{user.role}</Badge>;
        }
        
        // For other users, show a select dropdown to change role
        return (
          <Select
            defaultValue={user.role}
            onValueChange={(value: "super_admin" | "admin" | "usuario") => {
              updateUserRole(user.id, value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={user.role} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usuario">Usuario</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        );
      }
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
