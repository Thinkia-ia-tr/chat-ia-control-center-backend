
import React from "react";
import { useReferrals } from "@/hooks/useReferrals";
import { DataTable } from "@/components/ui/data-table";
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

  const columns = [
    {
      header: "Conversación",
      accessorKey: "conversation_title",
      cell: ({ row }: any) => (
        <div className="w-full">
          <span className="block">{row.original.conversation_title}</span>
        </div>
      )
    },
    {
      header: "Cliente",
      accessorKey: "client_value",
      cell: ({ row }: any) => (
        <div className="w-full">
          <span className="block">
            {row.original.client_value || "Cliente anónimo"}
          </span>
        </div>
      )
    },
    {
      header: "Tipo de Derivación",
      accessorKey: "referral_type",
      cell: ({ row }: any) => (
        <div className="w-full">
          <Badge variant="default" className="bg-primary/70 hover:bg-primary/90">
            {row.original.referral_type}
          </Badge>
        </div>
      )
    },
    {
      header: "Fecha",
      accessorKey: "created_at",
      cell: ({ row }: any) => (
        <div className="w-full">
          <span className="block text-right">
            {format(new Date(row.original.created_at), "dd MMM yyyy HH:mm", {
              locale: es,
            })}
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={referrals?.map(item => ({ row: { original: item } })) || []}
        getRowId={(rowData) => rowData.row.original.id}
      />
      {(!referrals || referrals.length === 0) && (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron derivaciones en el período seleccionado
        </div>
      )}
    </div>
  );
}
