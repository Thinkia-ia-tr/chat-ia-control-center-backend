import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilter } from "./SearchFilter";
import { ConversationsTable } from "./ConversationsTable";
import { TablePagination } from "./TablePagination";
import type { Conversation } from "./types";

// Example data for the table
const exampleData: Conversation[] = [
  {
    id: "1",
    title: "Cliente consulta estado de pedido #45672 realizado ayer",
    client: "maria@gmail.com",
    channel: "Web",
    messages: 8,
    date: new Date("2024-04-14T10:30:00"),
    status: "in-progress"
  },
  {
    id: "2",
    title: "Problema con entrega en dirección incorrecta pedido",
    client: "+34611223344",
    channel: "Whatsapp",
    messages: 12,
    date: new Date("2024-04-14T09:15:00"),
    status: "done"
  },
  {
    id: "3",
    title: "Consulta sobre disponibilidad tallas producto deportivo",
    client: "Anónimo",
    channel: "Web",
    messages: 5,
    date: new Date("2024-04-13T15:45:00")
  },
  {
    id: "4",
    title: "Seguimiento envío retrasado pedido #89012 urgente",
    client: "carlos@empresa.com",
    channel: "Web",
    messages: 15,
    date: new Date("2024-04-13T14:20:00"),
    status: "in-progress"
  },
  {
    id: "5",
    title: "Duda sobre características producto nuevo modelo",
    client: "+34655443322",
    channel: "Whatsapp",
    messages: 7,
    date: new Date("2024-04-13T11:10:00")
  },
  {
    id: "6",
    title: "Pedido #34567 dañado durante transporte reclamo",
    client: "laura@tienda.com",
    channel: "Web",
    messages: 18,
    date: new Date("2024-04-12T16:40:00"),
    status: "done"
  },
  {
    id: "7",
    title: "Información sobre devolución producto defectuoso",
    client: "Anónimo",
    channel: "Web",
    messages: 9,
    date: new Date("2024-04-12T13:25:00")
  },
  {
    id: "8",
    title: "Consulta disponibilidad envío express pedido #67890",
    client: "+34699887766",
    channel: "Whatsapp",
    messages: 6,
    date: new Date("2024-04-12T10:55:00"),
    status: "in-progress"
  },
  {
    id: "9",
    title: "Pregunta sobre diferencias entre modelos productos",
    client: "pedro@outlook.com",
    channel: "Web",
    messages: 11,
    date: new Date("2024-04-11T17:30:00")
  },
  {
    id: "10",
    title: "Reclamo pedido incompleto #56789 seguimiento",
    client: "+34677889900",
    channel: "Whatsapp",
    messages: 14,
    date: new Date("2024-04-11T09:45:00"),
    status: "done"
  }
];

export function ConversationsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Conversation[]>([]);
  
  const handleRowSelect = (rowData: { row: { original: Conversation } }) => {
    const row = rowData.row.original;
    if (selectedRows.some(r => r.id === row.id)) {
      setSelectedRows(selectedRows.filter(r => r.id !== row.id));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  const handleRowClick = (rowData: { row: { original: Conversation } }) => {
    navigate(`/conversaciones/${rowData.row.original.id}`);
  };
  
  const filteredData = exampleData.filter(conversation => 
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePreviousPage = () => {
    console.log('Previous page');
  };

  const handleNextPage = () => {
    console.log('Next page');
  };

  const handleRowsPerPageChange = (value: number) => {
    console.log('Rows per page changed to:', value);
  };
  
  return (
    <div className="flex flex-col gap-6">
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalRows={exampleData.length}
        selectedCount={selectedRows.length}
      />
      
      <ConversationsTable
        data={filteredData}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        onRowClick={handleRowClick}
      />
      
      <TablePagination
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
}

export default ConversationsList;
