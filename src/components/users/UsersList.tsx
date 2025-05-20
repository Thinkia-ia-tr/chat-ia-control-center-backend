
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { demoUsers, UserWithRole } from "./demoUsers";
import { fetchUsersData, updateUserRole, checkAndUpdateThinkiaUser } from "@/services/usersService";
import { UserRow } from "./UserRow";

export function UsersList() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser, userRole: currentUserRole } = useAuth();
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { users: fetchedUsers, error: fetchError } = await fetchUsersData();
      
      if (fetchError) {
        setError(`Error al cargar usuarios: ${fetchError}`);
        return;
      }
      
      // Check if 'thinkia' user exists and update to super_admin if needed
      // This should happen BEFORE adding demo users
      const updated = await checkAndUpdateThinkiaUser(fetchedUsers);
      
      // If thinkia user was updated to super_admin, refresh the user list
      if (updated) {
        const { users: refreshedUsers } = await fetchUsersData();
        // Add the demo users to the refreshed list
        const allUsers = [...refreshedUsers, ...demoUsers];
        setUsers(allUsers);
      } else {
        // Add the demo users to the original list
        const allUsers = [...fetchedUsers, ...demoUsers];
        setUsers(allUsers);
      }
      
    } catch (error: any) {
      setError(`Error al cargar usuarios: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleRoleUpdate = async (userId: string, newRole: "super_admin" | "admin" | "usuario") => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      // Update local list
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
    }
  };
  
  const columns = [
    {
      header: "Usuario",
      accessorKey: "username",
      cell: ({ row }: { row: { original: UserWithRole } }) => {
        const user = row.original;
        return UserRow({ 
          user, 
          currentUserId: currentUser?.id, 
          currentUserRole, 
          onRoleUpdate: handleRoleUpdate 
        }).username;
      }
    },
    {
      header: "Correo electrónico",
      accessorKey: "email",
      cell: ({ row }: { row: { original: UserWithRole } }) => {
        const user = row.original;
        return UserRow({ 
          user, 
          currentUserId: currentUser?.id, 
          currentUserRole, 
          onRoleUpdate: handleRoleUpdate 
        }).email;
      }
    },
    {
      header: "Rol",
      accessorKey: "role",
      cell: ({ row }: { row: { original: UserWithRole } }) => {
        const user = row.original;
        return UserRow({ 
          user, 
          currentUserId: currentUser?.id, 
          currentUserRole, 
          onRoleUpdate: handleRoleUpdate 
        }).role;
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
