
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserWithRole } from "./demoUsers";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface UserRoleCellProps {
  user: UserWithRole;
  currentUserId: string | undefined;
  currentUserRole: string | null;
  onRoleUpdate: (userId: string, newRole: "super_admin" | "admin" | "usuario") => Promise<void>;
}

export function UserRoleCell({ user, currentUserId, currentUserRole, onRoleUpdate }: UserRoleCellProps) {
  const isSuperAdmin = user.role === "super_admin";
  const isCurrentUser = currentUserId === user.id;
  const isThinkia = user.username === "thinkia";
  const isDemo = user.isDemo === true;
  const canModifyRoles = currentUserRole === 'admin' || currentUserRole === 'super_admin';
  
  const promoteSuperAdmin = async (userId: string) => {
    await onRoleUpdate(userId, 'super_admin');
  };

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
  
  // Show badge for demo users, current user, or if user can't modify roles
  if (isDemo || isCurrentUser || !canModifyRoles) {
    return <Badge variant="outline">{user.role}</Badge>;
  }
  
  // For other users, show a select dropdown to change role
  return (
    <Select
      defaultValue={user.role}
      onValueChange={(value: "super_admin" | "admin" | "usuario") => {
        onRoleUpdate(user.id, value);
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
