
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export const InvalidToken = () => {
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
};
