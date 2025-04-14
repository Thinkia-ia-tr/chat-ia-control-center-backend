
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Tipos para las conversaciones
interface Conversation {
  id: string;
  title: string;
  user: string;
  channel: string;
  messages: number;
  date: string;
  status?: 'done' | 'in-progress';
}

// Datos de ejemplo para la tabla
const exampleData: Conversation[] = [
  {
    id: "1",
    title: "Cover page",
    user: "Cover page",
    channel: "M Process",
    messages: 18,
    date: "Eddie Lake",
    status: "in-progress"
  },
  {
    id: "2",
    title: "Table of contents",
    user: "Table of contents",
    channel: "Done",
    messages: 29,
    date: "Eddie Lake"
  },
  {
    id: "3",
    title: "Executive summary",
    user: "Narrative",
    channel: "Done",
    messages: 10,
    date: "Eddie Lake"
  },
  {
    id: "4",
    title: "Technical approach",
    user: "Narrative",
    channel: "Done",
    messages: 27,
    date: "Jamie Tashulatov"
  },
  {
    id: "5",
    title: "Design",
    user: "Narrative",
    channel: "In Process",
    messages: 2,
    date: "Jamie Tashulatov",
    status: "in-progress"
  },
  {
    id: "6",
    title: "Capabilities",
    user: "Narrative",
    channel: "In Process",
    messages: 20,
    date: "Jamie Tashulatov",
    status: "in-progress"
  },
  {
    id: "7",
    title: "Integration with existing systems",
    user: "Narrative",
    channel: "In Process",
    messages: 19,
    date: "Jamie Tashulatov",
    status: "in-progress"
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
    cell: (conversation: Conversation) => (
      <Badge variant="secondary">{conversation.channel}</Badge>
    )
  },
  {
    header: "Mensajes",
    accessorKey: "messages"
  },
  {
    header: "Fecha",
    accessorKey: "date"
  }
];

export function ConversationsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Conversation[]>([]);
  
  const handleRowSelect = (row: Conversation) => {
    if (selectedRows.some(r => r.id === row.id)) {
      setSelectedRows(selectedRows.filter(r => r.id !== row.id));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
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
              placeholder="Filter emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-card border-input"
            />
          </div>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <span>Columns</span>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {selectedRows.length} of {exampleData.length} row(s) selected.
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={filteredData}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        getRowId={(row) => row.id}
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
