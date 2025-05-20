
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface RegisterFormValues {
  email: string;
  password: string;
  username: string;
}

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      password: "",
      username: ""
    }
  });

  // Extract token from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      setInvitationToken(token);
      verifyInvitationToken(token);
    } else {
      setIsVerifyingToken(false);
      setIsTokenValid(false);
    }
  }, [location]);

  // Verify if the token is valid and not expired
  const verifyInvitationToken = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('registration_invitations')
        .select('*')
        .eq('token', token)
        .eq('is_used', false)
        .single();

      if (error) throw error;

      // Check if the invitation has expired
      const now = new Date();
      const expiresAt = new Date(data.expires_at);

      if (expiresAt < now) {
        setIsTokenValid(false);
        toast.error("El enlace de invitación ha expirado");
      } else {
        setIsTokenValid(true);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      setIsTokenValid(false);
      toast.error("El enlace de invitación no es válido");
    } finally {
      setIsVerifyingToken(false);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    if (!isTokenValid || !invitationToken) {
      toast.error("Se requiere un enlace de invitación válido para registrarse");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(data.email, data.password, data.username);
      if (error) {
        toast.error(`Error al registrarse: ${error.message}`);
      } else {
        // Mark invitation as used if registration is successful and we have a valid token
        await supabase
          .from('registration_invitations')
          .update({ is_used: true })
          .eq('token', invitationToken);
        
        toast.success("Registro exitoso. Por favor verifica tu correo electrónico.");
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error("Error inesperado al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  // If there's no token, redirect to login
  if (!invitationToken && !isVerifyingToken) {
    toast.error("Se requiere una invitación para registrarse");
    return <Navigate to="/auth/login" />;
  }

  if (isVerifyingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center mb-4">
          <img src="/lovable-uploads/56fdf621-46ac-43d0-873e-c2676b134d9b.png" alt="Behumax Logo" className="mx-auto mb-4 max-w-[250px]" />
          <h1 className="font-bold mt-6 mb-6 text-primary text-xl">Panel de inteligencia de<br />Att al Cliente</h1>
          
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Verificando invitación</CardTitle>
              <CardDescription>
                Por favor espera mientras verificamos tu enlace de invitación...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center mb-4">
          <img src="/lovable-uploads/56fdf621-46ac-43d0-873e-c2676b134d9b.png" alt="Behumax Logo" className="mx-auto mb-4 max-w-[250px]" />
          <h1 className="font-bold mt-6 mb-6 text-primary text-xl">Panel de inteligencia de<br />Att al Cliente</h1>
          
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Enlace no válido</CardTitle>
              <CardDescription>
                El enlace de invitación que estás usando no es válido o ha expirado.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm text-muted-foreground">
                <Link to="/auth/login" className="text-primary hover:underline">
                  Volver al inicio de sesión
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center mb-4">
        <img src="/lovable-uploads/56fdf621-46ac-43d0-873e-c2676b134d9b.png" alt="Behumax Logo" className="mx-auto mb-4 max-w-[250px]" />
        <h1 className="font-bold mt-6 mb-6 text-primary text-xl">Panel de inteligencia de<br />Att al Cliente</h1>
        
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Crear cuenta</CardTitle>
            <CardDescription>
              Completa el formulario para registrarte con tu invitación
            </CardDescription>
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
                        <Input 
                          placeholder="correo@ejemplo.com" 
                          type="email" 
                          required 
                          {...field} 
                        />
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
                        <Input placeholder="usuario123" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input placeholder="********" type="password" required minLength={8} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Registrarse"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/auth/login" className="text-primary hover:underline">
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
