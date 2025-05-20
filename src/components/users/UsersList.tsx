
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      
      // Obtener todos los usuarios desde profiles
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, username');
        
      if (usersError) throw usersError;
      
      // Obtener los roles de cada usuario
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;
      
      // Obtener emails
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        // Solo registramos el error pero continuamos con los datos que tenemos
        console.error("Error fetching auth users:", authError);
      }
      
      // Combinar datos
      const combinedUsers = usersData.map(profile => {
        const roleInfo = userRoles.find(r => r.user_id === profile.id);
        const emailInfo = authData?.users?.find(u => u.id === profile.id);
        
        return {
          id: profile.id,
          email: emailInfo?.email || "Sin acceso", // Si no tenemos permisos para ver emails
          username: profile.username,
          role: roleInfo?.role || "usuario",
        };
      });
      
      setUsers(combinedUsers);
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
      // Primero verificamos si el usuario tiene un rol asignado
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingRole) {
        // Actualizar rol existente
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);
          
        if (updateError) throw updateError;
      } else {
        // Insertar nuevo rol
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole });
          
        if (insertError) throw insertError;
      }
      
      // Actualizar la lista local
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
  
  const columns = [
    {
      header: "Usuario",
      accessorKey: "username",
      cell: ({ row }: { row: { original: UserWithRole } }) => (
        <div>
          <p className="font-medium">{row.original.username || "Sin nombre de usuario"}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
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
        
        // Mostrar solo el badge para super_admin o si es el usuario actual
        if (isSuperAdmin || isCurrentUser) {
          return (
            <Badge variant={isSuperAdmin ? "destructive" : "outline"}>
              {user.role}
            </Badge>
          );
        }
        
        // Para otros usuarios, mostrar un select para cambiar el rol
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
              {/* No permitimos cambiar a super_admin desde la interfaz */}
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
