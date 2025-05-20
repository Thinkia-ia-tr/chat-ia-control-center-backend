
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useProductManagement, Product } from "@/hooks/useProductManagement";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductList() {
  const { toast } = useToast();
  const { getProducts } = useProductManagement();
  const { data: products, isLoading, isError } = getProducts;

  if (isError) {
    toast({
      title: "Error",
      description: "No se pudieron cargar los productos",
      variant: "destructive"
    });
  }

  const columns = [
    {
      header: "Nombre",
      accessorKey: "name",
    },
    {
      header: "Fecha de creación",
      accessorKey: "created_at",
      cell: ({ row }: { row: { original: Product } }) => (
        <div>
          {format(new Date(row.original.created_at), "dd/MM/yyyy")}
        </div>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Cargando productos...</span>
        </div>
      ) : products && products.length > 0 ? (
        <DataTable
          columns={columns}
          data={products}
          getRowId={(row) => row.id}
        />
      ) : (
        <div className="text-center py-10 border rounded-md bg-muted/20">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
          <p className="mt-2 text-lg font-medium">No hay productos</p>
          <p className="text-sm text-muted-foreground">
            No hay productos registrados en el sistema.
          </p>
        </div>
      )}
    </div>
  );
}
