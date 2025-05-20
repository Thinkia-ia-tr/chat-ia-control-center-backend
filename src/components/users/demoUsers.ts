
// Demo users for development/testing
export interface UserWithRole {
  id: string;
  email: string;
  username: string | null;
  role: "super_admin" | "admin" | "usuario";
  isDemo?: boolean;
}

export const demoUsers: UserWithRole[] = [
  {
    id: "demo-user-1",
    email: "user@demo.local",
    username: "User Demo",
    role: "usuario",
    isDemo: true
  },
  {
    id: "demo-user-2",
    email: "operaciones@behumax.com",
    username: "Nacho Tribiño",
    role: "admin",
    isDemo: true
  },
  {
    id: "demo-user-3",
    email: "marketing@behumax.com",
    username: "Martín Delgado",
    role: "admin",
    isDemo: true
  }
];
