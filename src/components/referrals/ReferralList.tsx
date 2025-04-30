
import React, { useState } from "react";
import { useReferrals } from "@/hooks/useReferrals";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ConversationsPagination } from "@/components/conversations/ConversationsPagination";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ReferralListProps {
  startDate?: Date;
  endDate?: Date;
}

export function ReferralList({ startDate, endDate }: ReferralListProps) {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
      accessorKey: "conversation_date",
      cell: ({ row }: any) => {
        // Validamos que la fecha sea válida antes de intentar formatearla
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
  const totalPages = Math.max(1, Math.ceil((referrals?.length || 0) / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = referrals ? referrals.slice(startIndex, endIndex) : [];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value));
    setPage(1); // Reset to first page when changing rows per page
  };

  return (
    <div className="w-full space-y-4">
      <DataTable
        columns={columns}
        data={paginatedData || []}
        getRowId={(rowData) => rowData.id}
      />
      
      {(!referrals || referrals.length === 0) ? (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron derivaciones en el período seleccionado
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
