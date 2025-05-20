
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuthLayout } from "./AuthLayout";

export const TokenVerification = () => {
  return (
    <AuthLayout>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verificando invitación</CardTitle>
          <CardDescription>
            Por favor espera mientras verificamos tu enlace de invitación...
          </CardDescription>
        </CardHeader>
      </Card>
    </AuthLayout>
  );
};
