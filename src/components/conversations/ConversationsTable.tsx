
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Conversation } from "./types";

const SURNAMES = ['garcia', 'rodriguez', 'lopez', 'martinez', 'sanchez', 'fernandez'];
const NAMES = ['maria', 'juan', 'ana', 'carlos', 'sofia', 'miguel', 'laura', 'pedro'];

let lastIdNumber = 573; // Starting from 573 so next one will be 574

const generateClientId = (): string => {
  lastIdNumber++;
  const paddedNumber = String(lastIdNumber).padStart(7, '0');
  return `2025-${paddedNumber}`;
};

const generateRandomName = (): string => {
  const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
  const randomSurname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
  return `${randomName}.${randomSurname}`;
};

const extractNameFromMessages = (title: string, messages: number): string => {
  const namePatterns = [
    /(?:soy|me llamo|nombre es)\s+([A-Za-zÀ-ÿ\s]+?)(?:[\.,]|\s+(?:y|e|pero|con|sobre)|\s*$)/i,
    /(?:señor|señora|sr\.|sra\.)\s+([A-Za-zÀ-ÿ\s]+?)(?:\s+[a-z]|\s*$)/i,
    /([A-Za-zÀ-ÿ]{2,}\s+[A-Za-zÀ-ÿ]{2,})(?:\s+(?:solicita|pregunta|dice|responde)|\s*$)/i
  ];

  return generateRandomName();
};

const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +XX XXX XXX XXX
  if (cleaned.length >= 9) {
    const countryCode = cleaned.slice(0, 2);
    const firstPart = cleaned.slice(2, 5);
    const secondPart = cleaned.slice(5, 8);
    const lastPart = cleaned.slice(8, 11);
    return `+${countryCode} ${firstPart} ${secondPart} ${lastPart}`;
  }
  return phone;
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
        <div className="w-full">
          <span className="block">{row.original.title}</span>
        </div>
      )
    },
    {
      header: "Cliente",
      accessorKey: "client",
      cell: ({ row }: { row: { original: Conversation } }) => {
        const client = row.original.client;
        const value = client.type === 'email' 
          ? `${extractNameFromMessages(row.original.title, row.original.messages)}@ejemplo.com` 
          : client.type === 'id' 
            ? generateClientId()
            : formatPhoneNumber(client.value);
        
        return (
          <div className="w-full">
            <span className="block">{value}</span>
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
