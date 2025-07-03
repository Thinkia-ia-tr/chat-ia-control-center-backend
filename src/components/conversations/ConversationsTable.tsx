import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Conversation } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConversationsTableProps {
  data: Conversation[];
  onRowClick: (row: { row: { original: Conversation } }) => void;
}

// Function to get user-friendly channel names
const getChannelDisplayName = (channel: string): string => {
  // Solo tenemos dos canales posibles: 'Web' y 'Whatsapp'
  if (channel === 'Whatsapp') return 'Whatsapp';
  return 'Web';
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

// Function to shorten UUID for display while keeping full value in tooltip
const shortenUUID = (uuid: string): string => {
  if (!uuid || uuid.length < 36) return uuid;
  
  // For full UUID format (75bbf54a-110d-4b59-86f6-5f41baa0f17d)
  // Display first 8 chars and last 4 chars with ellipsis in between
  return `${uuid.substring(0, 8)}...${uuid.substring(32)}`;
};

export function ConversationsTable({ data, onRowClick }: ConversationsTableProps) {
  console.log("ConversationsTable render with data:", data);

  const columns = [
    {
      header: "Conversación",
      accessorKey: "title",
      cell: ({ row }: { row: { original: Conversation } }) => (
        <div className="w-full">
          <span className="block">{row.original.title || "Sin título"}</span>
        </div>
      )
    },
    {
      header: "Cliente",
      accessorKey: "client",
      cell: ({ row }: { row: { original: Conversation } }) => {
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
      }
    },
    {
      header: "Canal",
      accessorKey: "channel",
      cell: ({ row }: { row: { original: Conversation } }) => (
        <div className="w-full">
          <Badge variant="default" className="bg-primary/70 hover:bg-primary/90">
            {getChannelDisplayName(row.original.channel || "Web")}
          </Badge>
        </div>
      )
    },
    {
      header: "Mensajes",
      accessorKey: "messages",
      cell: ({ row }: { row: { original: Conversation } }) => (
        <div className="w-full text-center">
          <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 bg-muted rounded-md text-sm font-medium">
            {row.original.messages || 0}
          </span>
        </div>
      )
    },
    {
      header: "Fecha",
      accessorKey: "date",
      cell: ({ row }: { row: { original: Conversation } }) => {
        const date = row.original.date;
        let formattedDate = "Fecha desconocida";
        
        if (date) {
          try {
            formattedDate = format(new Date(date), "dd MMM yyyy HH:mm", { locale: es });
          } catch (error) {
            console.error("Error formatting date:", date, error);
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

  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={onRowClick}
      getRowId={(row) => row.id || Math.random().toString()}
    />
  );
}

export default ConversationsTable;
