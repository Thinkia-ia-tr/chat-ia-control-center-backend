
import React, { useState } from "react";
import { useReferrals } from "@/hooks/useReferrals";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface ReferralListProps {
  startDate?: Date;
  endDate?: Date;
}

export function ReferralList({ startDate, endDate }: ReferralListProps) {
  const { toast } = useToast();
  const { data: referrals, isLoading, error } = useReferrals(startDate, endDate);

  if (error) {
    toast({
      title: "Error",
      description: "No se pudieron cargar las derivaciones",
      variant: "destructive",
    });
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Conversación</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo de Derivación</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals?.length ? (
            referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>{referral.conversation_title}</TableCell>
                <TableCell>
                  {referral.client_value || "Cliente anónimo"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-medium">
                    {referral.referral_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(referral.created_at), "dd MMM yyyy HH:mm", {
                    locale: es,
                  })}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No se encontraron derivaciones en el período seleccionado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
