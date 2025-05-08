
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserProfile() {
  const { user, signOut } = useAuth();
  
  if (!user) return null;

  // Get user initials for the avatar
  const getInitials = () => {
    const firstName = user.user_metadata?.first_name || "";
    const lastName = user.user_metadata?.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      <div className="hidden md:block">
        <p className="text-sm font-medium">
          {user.user_metadata?.first_name || ""} {user.user_metadata?.last_name || ""}
        </p>
      </div>
      <Button variant="ghost" size="sm" onClick={signOut}>
        Salir
      </Button>
    </div>
  );
}
