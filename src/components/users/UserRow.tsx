
import React from "react";
import { UserWithRole } from "./demoUsers";
import { UserRoleCell } from "./UserRoleCell";

interface UserRowProps {
  user: UserWithRole;
  currentUserId: string | undefined;
  currentUserRole: string | null;
  onRoleUpdate: (userId: string, newRole: "super_admin" | "admin" | "usuario") => Promise<void>;
}

export function UserRow({ user, currentUserId, currentUserRole, onRoleUpdate }: UserRowProps) {
  return {
    username: (
      <div>
        <p className="font-medium">
          {user.username || "Sin nombre de usuario"}
          {user.isDemo && <span className="ml-2 text-xs text-gray-500">(Demo)</span>}
        </p>
      </div>
    ),
    email: (
      <div>
        <p className="text-sm">{user.email}</p>
      </div>
    ),
    role: (
      <UserRoleCell 
        user={user}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        onRoleUpdate={onRoleUpdate}
      />
    )
  };
}
