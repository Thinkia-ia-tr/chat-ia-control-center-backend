
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function CreateInvitation() {
  return (
    <Button variant="default">
      <UserPlus className="mr-2 h-4 w-4" />
      Invitar Usuario
    </Button>
  );
}
