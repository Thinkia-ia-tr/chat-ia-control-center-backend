
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface InvitationFormValues {
  email: string;
}

export default function CreateInvitation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invitationLink, setInvitationLink] = useState<string | null>(null);

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
        throw new Error(response.error.message || 'Error al enviar la invitación');
      }

      toast.success('Invitación enviada correctamente', {
        description: `Se ha enviado un enlace de registro a ${data.email}.`
      });

      // En desarrollo, mostramos el enlace para facilitar pruebas
      if (response.data?.debug?.registrationLink) {
        setInvitationLink(response.data.debug.registrationLink);
      }

      form.reset();
    } catch (error: any) {
      toast.error('Error al enviar la invitación', {
        description: error.message
      });
      console.error('Error sending invitation:', error);
    } finally {
      setIsLoading(false);
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
            Envía una invitación por correo electrónico para que un nuevo usuario pueda registrarse.
          </DialogDescription>
        </DialogHeader>
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
                {isLoading ? "Enviando..." : "Enviar invitación"}
              </Button>
            </div>
          </form>
        </Form>
        
        {invitationLink && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Enlace de registro (visible solo en desarrollo):</p>
            <div className="text-xs break-all">{invitationLink}</div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => {
                navigator.clipboard.writeText(invitationLink);
                toast.info('Enlace copiado al portapapeles');
              }}
            >
              Copiar enlace
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
