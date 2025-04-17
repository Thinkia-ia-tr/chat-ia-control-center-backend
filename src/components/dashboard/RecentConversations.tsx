import React from "react";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DataTable } from "@/components/ui/data-table";
import { Link, useNavigate } from "react-router-dom";
import { useConversations } from "@/hooks/useConversations";
import { useToast } from "@/components/ui/use-toast";

export function RecentConversations() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: conversations = [], isError } = useConversations();
  
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
        const date = new Date();
        const yearPrefix = date.getFullYear().toString().slice(2);
        const monthPrefix = (date.getMonth() + 1).toString().padStart(2, '0');
        
        let sixDigitNumber = '000000';
        
        if (client && typeof client === 'object' && client.value) {
          const valueString = client.value.toString();
          sixDigitNumber = valueString.length >= 6 
            ? valueString.slice(-6) 
            : valueString.padStart(6, '0');
            
          sixDigitNumber = sixDigitNumber.replace(/\D/g, '0').slice(0, 6);
        }
        
        const formattedId = `${yearPrefix}${monthPrefix}-${sixDigitNumber}`;
        
        return (
          <div className="w-full">
            <span className="block">{formattedId}</span>
          </div>
        );
      },
    },
    {
      header: "Canal",
      accessorKey: "channel",
      cell: ({ row }: any) => (
        <div className="w-full">
          <Badge variant="default" className="bg-primary hover:bg-primary/80">{row.original.channel}</Badge>
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

      <DataTable
        columns={columns}
        data={recentConversations.map(item => ({ row: { original: item } }))}
        selectedRows={[]}
        getRowId={(rowData) => rowData.row.original.id}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

export default RecentConversations;
