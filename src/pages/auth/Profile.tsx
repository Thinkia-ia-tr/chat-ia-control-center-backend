
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";

interface ProfileFormValues {
  username: string;
  email: string;
}

interface ProfileData {
  id: string;
  username: string;
  avatar_url: string | null;
}

export default function Profile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      email: user?.email || "",
      username: ""
    }
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfileData(data);
          form.reset({
            email: user.email || "",
            username: data.username || ""
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("No se pudo cargar el perfil");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !profileData) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast.success("Perfil actualizado con éxito");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Error al actualizar el perfil: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Layout><div className="flex justify-center p-6">Cargando perfil...</div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Mi perfil</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Información personal</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de usuario</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre de usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              La información de tu cuenta está protegida y no se comparte con terceros.
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
