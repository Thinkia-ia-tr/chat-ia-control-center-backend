
import React from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DataTable } from "@/components/ui/data-table";
import { Link, useNavigate } from "react-router-dom";
import { useConversations } from "@/hooks/useConversations";
import { useToast } from "@/components/ui/use-toast";

interface RecentConversationsProps {
  startDate: Date;
  endDate: Date;
}

export function RecentConversations({ startDate, endDate }: RecentConversationsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: conversations = [], isLoading, isError } = useConversations(startDate, endDate);
  
  if (isError) {
    toast({
      title: "Error",
      description: "No se pudieron cargar las conversaciones recientes",
      variant: "destructive"
    });
  }

  const columns = [
    {
      header: "Conversación",
      accessorKey: "title",
      cell: ({ row }: any) => (
        <div className="w-full">
          <span className="block">{row.original.title}</span>
        </div>
      )
    },
    {
      header: "Cliente",
      accessorKey: "client",
      cell: ({ row }: any) => {
        const client = row.original.client;
        
        return (
          <div className="w-full">
            <span className="block">
              {client && typeof client === 'object' && client.value 
                ? client.value.toString() 
                : "Sin cliente"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Canal",
      accessorKey: "channel",
      cell: ({ row }: any) => (
        <div className="w-full">
          <Badge variant="default" className="bg-primary/70 hover:bg-primary/90">{row.original.channel}</Badge>
        </div>
      ),
    },
    {
      header: "Mensajes",
      accessorKey: "messages",
      cell: ({ row }: any) => (
        <div className="w-full flex items-center justify-center text-center">
          {row.original.messages}
        </div>
      ),
    },
    {
      header: "Fecha",
      accessorKey: "date",
      cell: ({ row }: any) => (
        <div className="w-full">
          <span className="block text-right">
            {format(row.original.date, "dd MMM yyyy HH:mm", { locale: es })}
          </span>
        </div>
      ),
    }
  ];

  const handleRowClick = (rowData: any) => {
    navigate(`/conversaciones/${rowData.row.original.id}`);
  };
  
  const sortedConversations = [...conversations].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Mostrar solo las 5 más recientes del rango seleccionado
  const recentConversations = sortedConversations.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Últimas conversaciones</h2>
        <Button variant="outline" asChild className="ml-auto">
          <Link to="/conversaciones" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Ver todas las conversaciones
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2">Cargando conversaciones...</span>
        </div>
      ) : recentConversations.length > 0 ? (
        <DataTable
          columns={columns}
          data={recentConversations.map(item => ({ row: { original: item } }))}
          getRowId={(rowData) => rowData.row.original.id}
          onRowClick={handleRowClick}
        />
      ) : (
        <div className="text-center p-4 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No hay conversaciones recientes en el periodo seleccionado.</p>
        </div>
      )}
    </div>
  );
}

export default RecentConversations;
