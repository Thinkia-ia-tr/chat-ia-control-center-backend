
import React, { useState, useMemo } from "react";
import { useReferrals } from "@/hooks/useReferrals";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ConversationsPagination } from "@/components/conversations/ConversationsPagination";
import { useNavigate } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ReferralListProps {
  startDate?: Date;
  endDate?: Date;
  referralTypeFilter?: string | null;
}

// Función para acortar UUIDs para visualización
const shortenUUID = (uuid: string): string => {
  if (!uuid || uuid.length < 36) return uuid;
  
  // For full UUID format (75bbf54a-110d-4b59-86f6-5f41baa0f17d)
  // Display first 8 chars and last 4 chars with ellipsis in between
  return `${uuid.substring(0, 8)}...${uuid.substring(32)}`;
};

// Función para formatear correctamente valores de cliente
const formatClientValue = (client: any): string => {
  if (!client) return "Sin cliente";
  
  // El cliente ahora es un string directo después de la migración
  let clientValue = '';
  if (typeof client === 'string') {
    clientValue = client;
  } else if (typeof client === 'object' && client.value) {
    clientValue = client.value.toString();
  } else {
    clientValue = client.toString();
  }
  
  // Si es un número de teléfono (solo dígitos, posiblemente empezando con 34)
  if (/^\d+$/.test(clientValue) && clientValue.length >= 9) {
    // Formatear como +XX XXX XXX XXX
    if (clientValue.startsWith('34') && clientValue.length === 11) {
      // Formato español: +34 XXX XXX XXX
      return `+${clientValue.substring(0, 2)} ${clientValue.substring(2, 5)} ${clientValue.substring(5, 8)} ${clientValue.substring(8)}`;
    } else if (clientValue.length === 9) {
      // Solo 9 dígitos, asumir español y agregar +34
      return `+34 ${clientValue.substring(0, 3)} ${clientValue.substring(3, 6)} ${clientValue.substring(6)}`;
    } else {
      // Otros formatos de números
      return `+${clientValue.substring(0, 2)} ${clientValue.substring(2, 5)} ${clientValue.substring(5, 8)} ${clientValue.substring(8)}`;
    }
  }
  
  // Para IDs o otros valores
  return clientValue;
};

export function ReferralList({ startDate, endDate, referralTypeFilter }: ReferralListProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: referrals, isLoading, error } = useReferrals(startDate, endDate);

  // Filtrar las derivaciones por tipo si se ha seleccionado un filtro
  const filteredReferrals = useMemo(() => {
    if (!referrals) return [];
    if (!referralTypeFilter) return referrals;
    
    return referrals.filter(referral => 
      referral.referral_type === referralTypeFilter
    );
  }, [referrals, referralTypeFilter]);

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

  const handleRowClick = (rowData: any) => {
    // Navigate to conversation detail when a row is clicked
    navigate(`/conversaciones/${rowData.row.original.conversation_id}`);
  };

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
      cell: ({ row }: any) => {
        const client = row.original.client_value;
        const formattedValue = formatClientValue(client);
        
        return (
          <div className="w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="block cursor-help">
                    {/^\+\d+/.test(formattedValue) ? formattedValue : shortenUUID(formattedValue)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs break-all">{formattedValue}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
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
  const totalPages = Math.max(1, Math.ceil((filteredReferrals?.length || 0) / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredReferrals ? filteredReferrals.slice(startIndex, endIndex) : [];

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
        onRowClick={handleRowClick}
      />
      
      {(!filteredReferrals || filteredReferrals.length === 0) ? (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron derivaciones {referralTypeFilter ? `del tipo "${referralTypeFilter}"` : ""} en el período seleccionado
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
