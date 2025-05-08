
import React from "react";
import { useProductStats } from "@/hooks/useProductStats";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface ProductStatsProps {
  startDate?: Date;
  endDate?: Date;
}

export function ProductStats({ startDate, endDate }: ProductStatsProps) {
  const { toast } = useToast();
  const { data: productStats, isLoading, error } = useProductStats(startDate, endDate);

  // Mostrar errores con un toast
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas de productos",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Columnas para la tabla
  const columns = [
    {
      header: "Producto",
      accessorKey: "product_name",
    },
    {
      header: "Menciones",
      accessorKey: "mention_count",
    }
  ];

  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  // Filtrar productos con menciones > 0
  const productsWithMentions = productStats?.filter(product => product.mention_count > 0) || [];

  if (productsWithMentions.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-40 text-center">
          <p className="text-muted-foreground">No hay menciones de productos en el período seleccionado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={productsWithMentions}
        getRowId={(row) => row.product_id}
      />
    </div>
  );
}
