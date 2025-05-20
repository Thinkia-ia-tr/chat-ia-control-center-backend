
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const TokenVerification = () => {
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
};
