import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Conversation } from "./types";
import { Phone, User, Hash, Mail, MessageSquare } from "lucide-react";

interface ConversationsTableProps {
  data: Conversation[];
  onRowClick: (row: { row: { original: Conversation } }) => void;
}

// Function to get user-friendly channel names
const getChannelDisplayName = (channel: string): string => {
  const channelMap: Record<string, string> = {
    'web': 'Web',
    'email': 'Email',
    'sms': 'SMS',
    'chat': 'Chat',
    'call': 'Llamada',
    'whatsapp_api': 'WhatsApp'
  };
  
  return channelMap[channel.toLowerCase()] || channel;
};

// Function to get the appropriate icon based on client type and channel
const getClientTypeIcon = (clientType: string, channel: string) => {
  // For web channel, always use Hash icon (case-insensitive check)
  if (channel.toLowerCase() === 'web') {
    return <Hash className="h-4 w-4 text-muted-foreground" />;
  }
  
  // For other channels, use icon based on client type
  switch (clientType) {
    case 'phone':
      return <Phone className="h-4 w-4 text-muted-foreground" />;
    case 'email':
      return <Mail className="h-4 w-4 text-muted-foreground" />;
    case 'id':
      return <Hash className="h-4 w-4 text-muted-foreground" />;
    default:
      // Default icon based on channel
      if (channel === 'chat' || channel === 'whatsapp_api') {
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
      }
      return <User className="h-4 w-4 text-muted-foreground" />;
  }
};

// Function to format client display value based on channel and client type
const getFormattedClientValue = (client: any, channel: string): string => {
  if (!client) return "Sin cliente";
  
  // For web channel, always format as ID (case-insensitive check)
  if (channel.toLowerCase() === 'web') {
    if (typeof client === 'object' && client.value) {
      // Mostrar el UUID completo en lugar de solo una parte
      return `ID: ${client.value.toString()}`;
    }
    return "ID: Sin valor";
  }
  
  // For other channels
  if (typeof client === 'string') {
    return client;
  } else if (typeof client === 'object' && client !== null) {
    const clientType = client.type || 'unknown';
    const value = client.value ? client.value.toString() : "Sin valor";
    
    // Para tipo 'id', mostrar el valor completo
    if (clientType === 'id') {
      return `ID: ${value}`;
    }
    
    return value;
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
        
        // Get client icon based on channel and client type
        let clientType = 'unknown';
        if (typeof client === 'object' && client !== null && client.type) {
          clientType = client.type;
        }
        
        const icon = getClientTypeIcon(clientType, channel);
        const displayValue = getFormattedClientValue(client, channel);
        
        return (
          <div className="w-full flex items-center gap-2">
            {icon}
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
