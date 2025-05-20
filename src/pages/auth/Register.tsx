
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";

interface RegisterFormValues {
  email: string;
  password: string;
  username: string;
}

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValidation, setTokenValidation] = useState<{
    isValid: boolean;
    isChecking: boolean;
    email: string | null;
    error: string | null;
  }>({
    isValid: false,
    isChecking: true,
    email: null,
    error: null
  });

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      password: "",
      username: ""
    }
  });

  // Validar el token al cargar la página
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValidation({
          isValid: false,
          isChecking: false,
          email: null,
          error: "Se requiere un token de invitación para registrarse"
        });
        return;
      }

      try {
        // Buscar la invitación con el token proporcionado
        const { data, error } = await supabase
          .from('registration_invitations')
          .select('*')
          .eq('token', token)
          .eq('used', false)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (error) {
          throw new Error('Token de invitación no válido o expirado');
        }

        if (!data) {
          throw new Error('No se encontró la invitación');
        }

        // Token válido, establecer el email
        setTokenValidation({
          isValid: true,
          isChecking: false,
          email: data.email,
          error: null
        });

        // Prellenar el formulario con el email de la invitación
        form.setValue('email', data.email);
      } catch (error: any) {
        setTokenValidation({
          isValid: false,
          isChecking: false,
          email: null,
          error: error.message || 'Error al validar el token'
        });
      }
    };

    validateToken();
  }, [token, form]);

  const onSubmit = async (data: RegisterFormValues) => {
    if (!tokenValidation.isValid) {
      toast.error('Token de invitación no válido');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(data.email, data.password, data.username);
      if (error) {
        toast.error(`Error al registrarse: ${error.message}`);
      } else {
        // Marcar la invitación como utilizada
        await supabase
          .from('registration_invitations')
          .update({ used: true })
          .eq('token', token!);

        toast.success("Registro exitoso. Por favor verifica tu correo electrónico.");
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error("Error inesperado al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar mensaje de error si el token no es válido
  if (!tokenValidation.isValid && !tokenValidation.isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Registro no disponible</CardTitle>
            <CardDescription className="text-destructive flex items-center justify-center gap-2">
              <AlertCircle size={16} />
              {tokenValidation.error || "Se requiere un enlace de invitación válido para registrarse"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Para registrarte en el sistema, necesitas recibir una invitación por correo electrónico.</p>
            <p>Si crees que esto es un error, contacta con un administrador del sistema.</p>
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
    );
  }

  // Mostrar spinner mientras se valida el token
  if (tokenValidation.isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Validando invitación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>
            Completa el formulario para registrarte
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
                        disabled={!!tokenValidation.email}
                        {...field} 
                      />
                    </FormControl>
                    {tokenValidation.email && (
                      <p className="text-xs text-muted-foreground">
                        Este correo está asociado a tu invitación y no puede ser modificado
                      </p>
                    )}
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
  );
}
