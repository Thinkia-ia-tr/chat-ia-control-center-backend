import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Tipos para las conversaciones
interface Conversation {
  id: string;
  title: string; // 10 word summary
  user: string; // phone, email or "Anónimo"
  channel: "Web" | "Whatsapp";
  messages: number;
  date: Date;
  status?: 'done' | 'in-progress';
}

// Datos de ejemplo para la tabla
const exampleData: Conversation[] = [
  {
    id: "1",
    title: "Cliente consulta estado de pedido #45672 realizado ayer",
    user: "maria@gmail.com",
    channel: "Web",
    messages: 8,
    date: new Date("2024-04-14T10:30:00"),
    status: "in-progress"
  },
  {
    id: "2",
    title: "Problema con entrega en dirección incorrecta pedido",
    user: "+34611223344",
    channel: "Whatsapp",
    messages: 12,
    date: new Date("2024-04-14T09:15:00"),
    status: "done"
  },
  {
    id: "3",
    title: "Consulta sobre disponibilidad tallas producto deportivo",
    user: "Anónimo",
    channel: "Web",
    messages: 5,
    date: new Date("2024-04-13T15:45:00")
  },
  {
    id: "4",
    title: "Seguimiento envío retrasado pedido #89012 urgente",
    user: "carlos@empresa.com",
    channel: "Web",
    messages: 15,
    date: new Date("2024-04-13T14:20:00"),
    status: "in-progress"
  },
  {
    id: "5",
    title: "Duda sobre características producto nuevo modelo",
    user: "+34655443322",
    channel: "Whatsapp",
    messages: 7,
    date: new Date("2024-04-13T11:10:00")
  },
  {
    id: "6",
    title: "Pedido #34567 dañado durante transporte reclamo",
    user: "laura@tienda.com",
    channel: "Web",
    messages: 18,
    date: new Date("2024-04-12T16:40:00"),
    status: "done"
  },
  {
    id: "7",
    title: "Información sobre devolución producto defectuoso",
    user: "Anónimo",
    channel: "Web",
    messages: 9,
    date: new Date("2024-04-12T13:25:00")
  },
  {
    id: "8",
    title: "Consulta disponibilidad envío express pedido #67890",
    user: "+34699887766",
    channel: "Whatsapp",
    messages: 6,
    date: new Date("2024-04-12T10:55:00"),
    status: "in-progress"
  },
  {
    id: "9",
    title: "Pregunta sobre diferencias entre modelos productos",
    user: "pedro@outlook.com",
    channel: "Web",
    messages: 11,
    date: new Date("2024-04-11T17:30:00")
  },
  {
    id: "10",
    title: "Reclamo pedido incompleto #56789 seguimiento",
    user: "+34677889900",
    channel: "Whatsapp",
    messages: 14,
    date: new Date("2024-04-11T09:45:00"),
    status: "done"
  }
];

// Columnas para la tabla
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
    header: "Usuario",
    accessorKey: "user",
    cell: ({ row }: { row: { original: Conversation } }) => (
      <div className="w-[35%]">
        <span className="block">{row.original.user}</span>
      </div>
    )
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
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversaciones"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[384px] bg-card border-input"
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {selectedRows.length} of {exampleData.length} row(s) selected.
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={filteredData.map(item => ({ row: { original: item } }))}
        selectedRows={selectedRows.map(item => ({ row: { original: item } }))}
        onRowSelect={handleRowSelect}
        onRowClick={handleRowClick}
        getRowId={(rowData) => rowData.row.original.id}
      />
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Rows per page: 
          <select className="ml-2 bg-transparent border-none text-sm text-muted-foreground">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Anterior</Button>
          <Button variant="outline" size="sm">Siguiente</Button>
        </div>
      </div>
    </div>
  );
}

export default ConversationsList;
