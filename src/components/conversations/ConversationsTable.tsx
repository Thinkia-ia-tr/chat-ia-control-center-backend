import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Conversation } from "./types";

const SURNAMES = ['garcia', 'rodriguez', 'lopez', 'martinez', 'sanchez', 'fernandez'];
const NAMES = ['maria', 'juan', 'ana', 'carlos', 'sofia', 'miguel', 'laura', 'pedro'];

const generateRandomName = (): string => {
  const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
  const randomSurname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
  return `${randomName}.${randomSurname}`;
};

const extractNameFromMessages = (title: string, messages: number): string => {
  // Common name patterns in Spanish conversations
  const namePatterns = [
    /(?:soy|me llamo|nombre es)\s+([A-Za-zÀ-ÿ\s]+?)(?:[\.,]|\s+(?:y|e|pero|con|sobre)|\s*$)/i,
    /(?:señor|señora|sr\.|sra\.)\s+([A-Za-zÀ-ÿ\s]+?)(?:\s+[a-z]|\s*$)/i,
    /([A-Za-zÀ-ÿ]{2,}\s+[A-Za-zÀ-ÿ]{2,})(?:\s+(?:solicita|pregunta|dice|responde)|\s*$)/i
  ];

  // TODO: In the future, when we have access to message content, 
  // we'll search through actual messages. For now, generate random name
  return generateRandomName();
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
          `${extractNameFromMessages(row.original.title, row.original.messages)}@ejemplo.com` :
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
