
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Conversation } from "./types";

const generateRandomName = (): string => {
  const names = ['maria', 'juan', 'ana', 'carlos', 'sofia', 'miguel', 'laura', 'pedro'];
  const surnames = ['garcia', 'rodriguez', 'lopez', 'martinez', 'sanchez', 'fernandez'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
  return `${randomName}.${randomSurname}`;
};

const generateEmailFromTitle = (title: string): string => {
  // Extract potential name from conversation title with improved pattern matching
  const namePatterns = [
    /(?:con|para|de)\s+([A-Za-zÀ-ÿ\s]+?)(?:\s+sobre|\s*$)/i,
    /(?:cliente|usuario|señor|señora|sr\.|sra\.)\s+([A-Za-zÀ-ÿ\s]+?)(?:\s+[a-z]|\s*$)/i,
    /([A-Za-zÀ-ÿ]{2,}\s+[A-Za-zÀ-ÿ]{2,})(?:\s+sobre|\s+solicita|\s+pregunta|\s*$)/i
  ];

  for (const pattern of namePatterns) {
    const nameMatch = title.match(pattern);
    if (nameMatch && nameMatch[1]) {
      const fullName = nameMatch[1].trim().toLowerCase();
      // Remove accents and special characters
      const normalizedName = fullName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      // Split into name parts and take first two parts if available
      const nameParts = normalizedName.split(/\s+/);
      if (nameParts.length >= 2) {
        // Use first name and first surname
        return `${nameParts[0]}.${nameParts[1]}@ejemplo.com`;
      } else if (nameParts.length === 1) {
        // If only one word, use random surname
        const surname = surnames[Math.floor(Math.random() * surnames.length)];
        return `${nameParts[0]}.${surname}@ejemplo.com`;
      }
    }
  }
  
  // If no name found, generate random name
  return `${generateRandomName()}@ejemplo.com`;
};

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
        <div className="w-[45%]">
          <span className="block whitespace-nowrap">{row.original.title}</span>
        </div>
      )
    },
    {
      header: "Cliente",
      accessorKey: "client",
      cell: ({ row }: { row: { original: Conversation } }) => {
        const client = row.original.client;
        const value = client.type === 'email' ? 
          generateEmailFromTitle(row.original.title) :
          client.value;
        
        return (
          <div className="w-[35%]">
            <span className="block">{value}</span>
          </div>
        );
      }
    },
    {
      header: "Canal",
      accessorKey: "channel",
      cell: ({ row }: { row: { original: Conversation } }) => (
        <div className="w-[10%]">
          <Badge variant="secondary">{row.original.channel}</Badge>
        </div>
      )
    },
    {
      header: "Mensajes",
      accessorKey: "messages",
      cell: ({ row }: { row: { original: Conversation } }) => (
        <div className="w-[5%] flex items-center justify-center text-center">
          {row.original.messages}
        </div>
      )
    },
    {
      header: "Fecha",
      accessorKey: "date",
      cell: ({ row }: { row: { original: Conversation } }) => (
        <div className="w-[20%]">
          <span className="block text-right whitespace-nowrap">
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
