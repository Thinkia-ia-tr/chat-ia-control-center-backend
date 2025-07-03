
import React from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { DataTable } from "@/components/ui/data-table";
import { Link, useNavigate } from "react-router-dom";
import { useConversations } from "@/hooks/useConversations";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RecentConversationsProps {
  startDate: Date;
  endDate: Date;
}

// Función para obtener nombres de canal amigables para el usuario
const getChannelDisplayName = (channel: string): string => {
  // Solo tenemos dos canales posibles ahora
  if (channel === 'Whatsapp') return 'Whatsapp';
  return 'Web';
};

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

export function RecentConversations({ startDate, endDate }: RecentConversationsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: conversations = [], isLoading, isError } = useConversations(startDate, endDate);
  
  if (isError) {
    toast({
      title: "Error",
      description: "No se pudieron cargar las conversaciones recientes",
      variant: "destructive"
    });
  }

  const columns = [
    {
      header: "Conversación",
      accessorKey: "title",
      cell: ({ row }: any) => (
        <div className="w-full">
          <span className="block">{row.original.title}</span>
        </div>
      )
    },
    {
      header: "Cliente",
      accessorKey: "client",
      cell: ({ row }: any) => {
        const client = row.original.client;
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
      header: "Canal",
      accessorKey: "channel",
      cell: ({ row }: any) => (
        <div className="w-full">
          <Badge variant="default" className="bg-primary/70 hover:bg-primary/90">
            {getChannelDisplayName(row.original.channel || "Web")}
          </Badge>
        </div>
      ),
    },
    {
      header: "Mensajes",
      accessorKey: "messages",
      cell: ({ row }: any) => (
        <div className="w-full flex items-center justify-center text-center">
          {row.original.messages}
        </div>
      ),
    },
    {
      header: "Fecha",
      accessorKey: "date",
      cell: ({ row }: any) => {
        // Check if date is valid before formatting
        const date = row.original.date;
        const isValidDate = date instanceof Date && !isNaN(date.getTime()) && isValid(date);
        
        return (
          <div className="w-full">
            <span className="block text-right">
              {isValidDate 
                ? format(date, "dd MMM yyyy HH:mm", { locale: es })
                : "Fecha inválida"}
            </span>
          </div>
        );
      },
    }
  ];

  const handleRowClick = (rowData: any) => {
    navigate(`/conversaciones/${rowData.row.original.id}`);
  };
  
  // Ensure we're working with valid data before sorting
  const validConversations = Array.isArray(conversations) 
    ? conversations.filter(conv => conv && conv.date instanceof Date && !isNaN(conv.date.getTime()))
    : [];
  
  const sortedConversations = [...validConversations].sort((a, b) => {
    // Ensure both dates are valid before comparing
    if (!(a.date instanceof Date) || isNaN(a.date.getTime())) return 1;
    if (!(b.date instanceof Date) || isNaN(b.date.getTime())) return -1;
    
    return b.date.getTime() - a.date.getTime();
  });
  
  // Mostrar las 10 más recientes del rango seleccionado (antes mostraba solo 5)
  const recentConversations = sortedConversations.slice(0, 10);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Últimas conversaciones</h2>
        <Button variant="outline" asChild className="ml-auto">
          <Link to="/conversaciones" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Ver todas las conversaciones
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2">Cargando conversaciones...</span>
        </div>
      ) : recentConversations.length > 0 ? (
        <DataTable
          columns={columns}
          data={recentConversations}
          getRowId={(row) => row.id}
          onRowClick={handleRowClick}
        />
      ) : (
        <div className="text-center p-4 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No hay conversaciones recientes en el periodo seleccionado.</p>
        </div>
      )}
    </div>
  );
}

export default RecentConversations;
