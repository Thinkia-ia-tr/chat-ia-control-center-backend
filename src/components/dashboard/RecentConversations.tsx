import React from "react";
import { Search, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DataTable } from "@/components/ui/data-table";
import { Link } from "react-router-dom";

interface Conversation {
  id: string;
  title: string;
  user: string;
  channel: "Web" | "Whatsapp";
  messages: number;
  date: Date;
  status?: 'done' | 'in-progress';
}

const recentConversations: Conversation[] = [
  {
    id: "1",
    title: "Estado del pedido #45672 - Entrega retrasada",
    user: "maria@gmail.com",
    channel: "Web",
    messages: 8,
    date: new Date("2024-04-14T10:30:00"),
    status: "in-progress"
  },
  {
    id: "2",
    title: "Problema con talla incorrecta en pedido #34567",
    user: "+34611223344",
    channel: "Whatsapp",
    messages: 12,
    date: new Date("2024-04-14T09:15:00"),
    status: "done"
  },
  {
    id: "3",
    title: "Consulta disponibilidad producto en otras tiendas",
    user: "carlos@empresa.com",
    channel: "Web",
    messages: 5,
    date: new Date("2024-04-13T15:45:00"),
    status: "in-progress"
  },
  {
    id: "4",
    title: "Devolución producto dañado pedido #89012",
    user: "laura@tienda.com",
    channel: "Web",
    messages: 15,
    date: new Date("2024-04-13T14:20:00"),
    status: "done"
  },
  {
    id: "5",
    title: "Información envío express pedido #67890",
    user: "+34655443322",
    channel: "Whatsapp",
    messages: 7,
    date: new Date("2024-04-13T11:10:00"),
    status: "in-progress"
  }
];

const columns = [
  {
    header: "Conversación",
    accessorKey: "title",
    cell: ({ original }: { original: Conversation }) => (
      <div className="w-[35%]">
        <span className="block truncate">{original.title}</span>
      </div>
    ),
  },
  {
    header: "Usuario",
    accessorKey: "user",
    cell: ({ original }: { original: Conversation }) => (
      <div className="w-[35%]">
        <span className="block">{original.user}</span>
      </div>
    ),
  },
  {
    header: "Canal",
    accessorKey: "channel",
    cell: ({ original }: { original: Conversation }) => (
      <div className="w-[10%]">
        <Badge variant="secondary">{original.channel}</Badge>
      </div>
    ),
  },
  {
    header: "Mensajes",
    accessorKey: "messages",
    cell: ({ original }: { original: Conversation }) => (
      <span className="text-center block w-[5%]">{original.messages}</span>
    ),
  },
  {
    header: "Fecha",
    accessorKey: "date",
    cell: ({ original }: { original: Conversation }) => (
      <div className="w-[20%]">
        <span className="block text-right whitespace-nowrap">
          {format(original.date, "dd MMM yyyy HH:mm", { locale: es })}
        </span>
      </div>
    ),
  }
];

export function RecentConversations() {
  const latestConversations = recentConversations
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Últimas conversaciones</h2>
      
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversaciones"
            className="pl-10 bg-card border-input"
          />
        </div>
        <Button variant="outline" asChild className="ml-auto">
          <Link to="/conversaciones" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Ver todas las conversaciones
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={latestConversations.map(item => ({ original: item }))}
        selectedRows={[]}
        getRowId={(rowData) => rowData.original.id}
      />
    </div>
  );
}
