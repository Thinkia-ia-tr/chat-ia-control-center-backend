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
    title: "Consulta sobre configuración inicial del proyecto React",
    user: "usuario@email.com",
    channel: "Web",
    messages: 18,
    date: new Date("2024-04-14T10:30:00"),
    status: "in-progress"
  },
  {
    id: "2",
    title: "Problema con la instalación de dependencias npm",
    user: "+1234567890",
    channel: "Whatsapp",
    messages: 29,
    date: new Date("2024-04-14T09:15:00"),
    status: "done"
  },
  {
    id: "3",
    title: "Error en la compilación del código TypeScript",
    user: "Anónimo",
    channel: "Web",
    messages: 10,
    date: new Date("2024-04-13T15:45:00")
  },
  {
    id: "4",
    title: "Dudas sobre implementación de autenticación OAuth",
    user: "dev@company.com",
    channel: "Web",
    messages: 25,
    date: new Date("2024-04-13T14:20:00"),
    status: "in-progress"
  },
  {
    id: "5",
    title: "Consulta sobre integración de API REST",
    user: "+34600123456",
    channel: "Whatsapp",
    messages: 15,
    date: new Date("2024-04-13T11:10:00")
  },
  {
    id: "6",
    title: "Problema con el despliegue en producción",
    user: "admin@startup.com",
    channel: "Web",
    messages: 32,
    date: new Date("2024-04-12T16:40:00"),
    status: "done"
  },
  {
    id: "7",
    title: "Optimización de rendimiento en React Native",
    user: "Anónimo",
    channel: "Web",
    messages: 21,
    date: new Date("2024-04-12T13:25:00")
  },
  {
    id: "8",
    title: "Configuración de CI/CD en GitHub Actions",
    user: "+44789123456",
    channel: "Whatsapp",
    messages: 27,
    date: new Date("2024-04-12T10:55:00"),
    status: "in-progress"
  },
  {
    id: "9",
    title: "Implementación de tests unitarios Jest",
    user: "tester@qa.com",
    channel: "Web",
    messages: 14,
    date: new Date("2024-04-11T17:30:00")
  },
  {
    id: "10",
    title: "Migración de base de datos MongoDB",
    user: "+52555123456",
    channel: "Whatsapp",
    messages: 23,
    date: new Date("2024-04-11T09:45:00"),
    status: "done"
  }
];

// Columnas para la tabla
const columns = [
  {
    header: "Conversación",
    accessorKey: "title"
  },
  {
    header: "Usuario",
    accessorKey: "user"
  },
  {
    header: "Canal",
    accessorKey: "channel",
    cell: ({ row }: { row: { original: Conversation } }) => (
      <Badge variant="secondary">{row.original.channel}</Badge>
    )
  },
  {
    header: "Mensajes",
    accessorKey: "messages"
  },
  {
    header: "Fecha",
    accessorKey: "date",
    cell: ({ row }: { row: { original: Conversation } }) => (
      <span>
        {format(row.original.date, "dd MMM yyyy HH:mm", { locale: es })}
      </span>
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
