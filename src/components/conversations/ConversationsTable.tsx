import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Conversation } from "./types";
import { Phone, User, Hash, MessageSquare } from "lucide-react";

interface ConversationsTableProps {
  data: Conversation[];
  onRowClick: (row: { row: { original: Conversation } }) => void;
}

// Function to get user-friendly channel names
const getChannelDisplayName = (channel: string): string => {
  const channelMap: Record<string, string> = {
    'web': 'Web',
    'Web': 'Web',
    'email': 'Email',
    'sms': 'SMS',
    'chat': 'Chat',
    'call': 'Llamada',
    'whatsapp_api': 'Whatsapp'
  };
  
  return channelMap[channel] || channel;
};

// Function to get the appropriate icon based on client type and channel
const getClientTypeIcon = (clientType: string, channel: string) => {
  // For all channels, use Hash icon as default
  return <Hash className="h-4 w-4 text-muted-foreground" />;
  
  // The following code is removed as we only use 'id' type now
  // But we keep the function for future extensibility
};

// Function to format client display value based on channel and client type
const getFormattedClientValue = (client: any, channel: string): string => {
  if (!client) return "Sin cliente";
  
  // Para todos los canales, mostrar el valor completo tal como está en la base de datos
  if (typeof client === 'string') {
    return client;
  } else if (typeof client === 'object' && client !== null) {
    // Mostrar el valor completo sin abreviar
    if (client.value) {
      return client.value.toString();
    }
    return "Sin valor";
  }
  
  return "Sin cliente";
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
        const channel = row.original.channel;
        const displayValue = getFormattedClientValue(client, channel);
        
        return (
          <div className="w-full">
            <span className="block">{displayValue}</span>
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
            {getChannelDisplayName(row.original.channel || "Desconocido")}
          </Badge>
        </div>
      )
    },
    {
      header: "Mensajes",
      accessorKey: "messages",
      cell: ({ row }: { row: { original: Conversation } }) => (
        <div className="w-full flex items-center justify-center text-center">
          {row.original.messages || 0}
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
