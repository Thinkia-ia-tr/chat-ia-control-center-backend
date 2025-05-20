
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";

interface InvitationFormValues {
  email: string;
}

export default function CreateInvitation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<InvitationFormValues>({
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data: InvitationFormValues) => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('send-invitation', {
        body: { email: data.email }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Error al generar la invitación');
      }

      toast.success('Invitación generada correctamente');
      
      // Set the invitation link
      if (response.data?.debug?.registrationLink) {
        setInvitationLink(response.data.debug.registrationLink);
      }

      form.reset();
    } catch (error: any) {
      toast.error('Error al generar la invitación', {
        description: error.message
      });
      console.error('Error generating invitation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      toast.info('Enlace copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Invitar Usuario</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invitar nuevo usuario</DialogTitle>
          <DialogDescription>
            Genera un enlace de invitación para que un nuevo usuario pueda registrarse.
          </DialogDescription>
        </DialogHeader>

        {!invitationLink ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="correo@ejemplo.com" type="email" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Generando..." : "Generar enlace"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="mt-2 space-y-4">
            <div className="p-4 rounded-md border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <p className="text-sm font-medium mb-2">Instrucciones:</p>
              <p className="text-sm">
                Comparte este enlace con el usuario invitado. 
                El enlace es válido por 48 horas y sólo puede ser utilizado una vez.
              </p>
            </div>
            
            <div className="flex flex-col">
              <p className="text-sm font-medium mb-1">Enlace de invitación:</p>
              <div className="flex">
                <Input 
                  value={invitationLink} 
                  readOnly 
                  className="pr-10 text-sm font-mono" 
                />
                <Button 
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="ml-2"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setInvitationLink(null);
                  form.reset();
                }}
              >
                Generar nueva invitación
              </Button>
              <Button 
                onClick={() => {
                  handleCopyLink();
                  setIsOpen(false);
                }}
              >
                Copiar y cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
