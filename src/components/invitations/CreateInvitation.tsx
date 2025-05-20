
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function CreateInvitation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invitationLink, setInvitationLink] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const { user } = useAuth();

  const handleCreateInvitation = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear invitaciones",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate a random token using the database function
      const { data: tokenData, error: tokenError } = await supabase.rpc("gen_random_token");
      
      if (tokenError) throw tokenError;
      
      const token = tokenData;
      
      // Set expiry date to 7 days from now
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      
      // Insert the invitation
      const { error } = await supabase.from("registration_invitations").insert({
        token,
        created_by: user.id,
        expires_at: expiryDate.toISOString(),
      });
      
      if (error) throw error;
      
      // Format the expiry date for display
      const formattedDate = expiryDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Create the invitation link
      const baseUrl = window.location.origin;
      const fullLink = `${baseUrl}/auth/register?token=${token}`;
      
      setInvitationLink(fullLink);
      setExpiryDate(formattedDate);
      setIsOpen(true);
    } catch (error) {
      console.error("Error creating invitation:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la invitación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(invitationLink);
    toast({
      title: "Enlace copiado",
      description: "El enlace de invitación ha sido copiado al portapapeles",
    });
  };

  return (
    <>
      <Button onClick={handleCreateInvitation} disabled={isLoading}>
        <UserPlus className="mr-2 h-4 w-4" />
        {isLoading ? "Creando..." : "Invitar Usuario"}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enlace de invitación creado</DialogTitle>
            <DialogDescription>
              Comparte este enlace con el usuario que deseas invitar. El enlace será válido hasta el {expiryDate}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <div className="bg-muted p-3 rounded-md overflow-x-auto">
                <code className="text-sm">{invitationLink}</code>
              </div>
            </div>
            <Button size="icon" variant="outline" onClick={copyLinkToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Recuerda que debes proporcionar este enlace al usuario que deseas invitar y advertirle sobre el tiempo de validez.
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
