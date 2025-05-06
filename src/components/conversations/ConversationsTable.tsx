
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Conversation } from "./types";

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

// Function to format client display value
const getFormattedClientValue = (client: any): string => {
  if (!client) return "Sin cliente";
  
  if (typeof client === 'string') {
    return client;
  } else if (typeof client === 'object' && client !== null) {
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
        const displayValue = getFormattedClientValue(client);
        
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
            {getChannelDisplayName(row.original.channel || "Web")}
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
