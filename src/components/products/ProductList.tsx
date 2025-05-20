
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { ConversationsPagination } from "@/components/conversations/ConversationsPagination";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ProductListProps {
  startDate?: Date;
  endDate?: Date;
}

export function ProductList({ startDate, endDate }: ProductListProps) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      // If start and end date are provided, we could filter by date range
      // For now, we're just fetching all products
      const { data, error } = await supabase
        .from('product_types')
        .select('id, name, created_at')
        .order('name');
      
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      return data;
    }
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  const columns = [
    {
      header: "Producto",
      accessorKey: "name"
    },
    {
      header: "Fecha de creación",
      accessorKey: "created_at",
      cell: ({ row }: any) => {
        const dateValue = row.original.created_at;
        let formattedDate = "Fecha no disponible";
        
        if (dateValue) {
          const date = new Date(dateValue);
          if (isValid(date)) {
            formattedDate = format(date, "dd MMM yyyy", { locale: es });
          }
        }
        
        return (
          <div className="text-right">
            <span>{formattedDate}</span>
          </div>
        );
      }
    }
  ];

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil((products?.length || 0) / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = products ? products.slice(startIndex, endIndex) : [];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value));
    setPage(1);
  };

  return (
    <div className="w-full space-y-4">
      <DataTable
        columns={columns}
        data={paginatedData || []}
        getRowId={(rowData) => rowData.id}
      />
      
      {(!products || products.length === 0) ? (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron productos en el sistema
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-sm text-muted-foreground">Mostrar</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={handleRowsPerPageChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={rowsPerPage} />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50].map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">por página</span>
          </div>
          
          <ConversationsPagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}
    </div>
  );
}
