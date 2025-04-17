
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Conversation } from "./types";

interface ConversationsTableProps {
  data: Conversation[];
  selectedRows: Conversation[];
  onRowSelect: (row: { row: { original: Conversation } }) => void;
  onRowClick: (row: { row: { original: Conversation } }) => void;
}

export function ConversationsTable({ data, selectedRows, onRowSelect, onRowClick }: ConversationsTableProps) {
  const columns = [
    {
      header: "Conversación",
      accessorKey: "title",
      cell: ({ row }: { row: { original: Conversation } }) => (
        <div className="w-full">
          <span className="block">{row.original.title}</span>
        </div>
      )
    },
    {
      header: "Cliente",
      accessorKey: "client",
      cell: ({ row }: { row: { original: Conversation } }) => {
        // Format client as AAMM-XXXXXX
        const client = row.original.client;
        const date = new Date();
        const yearPrefix = date.getFullYear().toString().slice(2); // Last 2 digits of the year
        const monthPrefix = (date.getMonth() + 1).toString().padStart(2, '0'); // Month padded with zero
        
        // Generate a consistent 6-digit number from the client data
        let sixDigitNumber = '000000';
        
        if (client && typeof client === 'object' && client.value) {
          // Use client value to create a consistent 6-digit number
          const valueString = client.value.toString();
          // Take the last 6 chars of the string, or pad with zeros
          sixDigitNumber = valueString.length >= 6 
            ? valueString.slice(-6) 
            : valueString.padStart(6, '0');
            
          // Ensure it's 6 digits by replacing non-digits with '0'
          sixDigitNumber = sixDigitNumber.replace(/\D/g, '0').slice(0, 6);
        }
        
        const formattedId = `${yearPrefix}${monthPrefix}-${sixDigitNumber}`;
        
        return (
          <div className="w-full">
            <span className="block">{formattedId}</span>
          </div>
        );
      }
    },
    {
      header: "Canal",
      accessorKey: "channel",
      cell: ({ row }: { row: { original: Conversation } }) => (
        <div className="w-full">
          <Badge variant="secondary">{row.original.channel}</Badge>
        </div>
      )
    },
    {
      header: "Mensajes",
      accessorKey: "messages",
      cell: ({ row }: { row: { original: Conversation } }) => (
        <div className="w-full flex items-center justify-center text-center">
          {row.original.messages}
        </div>
      )
    },
    {
      header: "Fecha",
      accessorKey: "date",
      cell: ({ row }: { row: { original: Conversation } }) => (
        <div className="w-full">
          <span className="block text-right">
            {format(row.original.date, "dd MMM yyyy HH:mm", { locale: es })}
          </span>
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={data.map(item => ({ row: { original: item } }))}
      selectedRows={selectedRows.map(item => ({ row: { original: item } }))}
      onRowSelect={onRowSelect}
      onRowClick={onRowClick}
      getRowId={(rowData) => rowData.row.original.id}
    />
  );
}

export default ConversationsTable;
