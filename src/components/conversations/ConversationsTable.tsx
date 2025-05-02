
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
  
  return channelMap[channel] || channel;
};

// Function to get the appropriate icon based on client type
const getClientTypeIcon = (clientType: string, channel: string) => {
  switch (clientType) {
    case 'phone':
      return <Phone className="h-4 w-4 text-muted-foreground" />;
    case 'email':
      return <Mail className="h-4 w-4 text-muted-foreground" />;
    case 'id':
      return <Hash className="h-4 w-4 text-muted-foreground" />;
    default:
      // Default icon based on channel
      if (channel === 'web') {
        return <User className="h-4 w-4 text-muted-foreground" />;
      } else if (channel === 'chat' || channel === 'whatsapp_api') {
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
      }
      return null;
  }
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
        
        // Handle all possible client data scenarios
        let displayValue = "Sin cliente";
        let clientType = 'unknown';
        
        if (client) {
          if (typeof client === 'string') {
            displayValue = client;
          } else if (typeof client === 'object' && client !== null) {
            clientType = client.type || 'unknown';
            displayValue = client.value ? client.value.toString() : "Sin valor";
            
            // For ID type clients, show only the last 8 characters if it's a UUID
            if (clientType === 'id' && displayValue.includes('-')) {
              const parts = displayValue.split('-');
              if (parts.length === 5) {
                displayValue = `ID: ${parts[parts.length - 1]}`;
              }
            }
          }
        }
        
        const icon = getClientTypeIcon(clientType, channel);
        
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
