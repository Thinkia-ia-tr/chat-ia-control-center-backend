import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { ConversationsPagination } from "@/components/conversations/ConversationsPagination";
import { useNavigate } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ProductListProps {
  startDate?: Date;
  endDate?: Date;
}

export function ProductList({ startDate, endDate }: ProductListProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { data: productMentions, isLoading } = useQuery({
    queryKey: ['product-mentions', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      // Default to last 30 days if dates are not provided
      const start = startDate || new Date(new Date().setDate(new Date().getDate() - 30));
      const end = endDate || new Date();
      
      const { data, error } = await supabase
        .from('product_mentions')
        .select(`
          id,
          context,
          created_at,
          conversation_id,
          product_types (id, name),
          messages (content, timestamp),
          conversations (title, date, client)
        `)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching product mentions:", error);
        throw error;
      }
      
      return data.map(item => ({
        id: item.id,
        conversation_id: item.conversation_id,
        conversation_title: item.conversations?.title || 'Sin título',
        conversation_date: item.conversations?.date || item.created_at,
        product_name: item.product_types?.name || 'Producto desconocido',
        context: item.context || item.messages?.content || '',
        client: item.conversations?.client || {}
      }));
    }
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  const handleRowClick = (rowData: any) => {
    navigate(`/conversaciones/${rowData.row.original.conversation_id}`);
  };

  const columns = [
    {
      header: "Producto",
      accessorKey: "product_name",
      cell: ({ row }: any) => (
        <div className="w-full">
          <Badge variant="default" className="bg-primary/70 hover:bg-primary/90">
            {row.original.product_name}
          </Badge>
        </div>
      )
    },
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
      header: "Contexto",
      accessorKey: "context",
      cell: ({ row }: any) => {
        const context = row.original.context;
        // Display only first 50 characters with ellipsis if longer
        const displayText = context.length > 50 
          ? `${context.substring(0, 50)}...` 
          : context;
        
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full cursor-help">
                  <span className="block">{displayText}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p>{context}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    },
    {
      header: "Fecha",
      accessorKey: "conversation_date",
      cell: ({ row }: any) => {
        // Validate date before formatting
        const dateValue = row.original.conversation_date;
        let formattedDate = "Fecha no disponible";
        
        if (dateValue) {
          const date = new Date(dateValue);
          if (isValid(date)) {
            formattedDate = format(date, "dd MMM yyyy HH:mm", { locale: es });
          }
        }
        
        return (
          <div className="w-full">
            <span className="block text-right">{formattedDate}</span>
          </div>
        );
      }
    }
  ];

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil((productMentions?.length || 0) / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = productMentions ? productMentions.slice(startIndex, endIndex) : [];

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
        onRowClick={handleRowClick}
      />
      
      {(!productMentions || productMentions.length === 0) ? (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron menciones de productos en el período seleccionado
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
