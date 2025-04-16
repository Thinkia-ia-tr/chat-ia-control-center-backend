
import React from "react";
import { Search, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DataTable } from "@/components/ui/data-table";
import { Link, useNavigate } from "react-router-dom";
import { useConversations } from "@/hooks/useConversations";
import { useToast } from "@/components/ui/use-toast";

// Function to format phone numbers
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
        <div className="w-[45%]">
          <span className="block truncate whitespace-nowrap overflow-hidden text-ellipsis">{row.original.title}</span>
        </div>
      )
    },
    {
      header: "Cliente",
      accessorKey: "client",
      cell: ({ row }: any) => {
        const client = row.original.client;
        const value = client.type === 'email' ? 
          client.value.includes('@') ? client.value : 'usuario@ejemplo.com' : 
          formatPhoneNumber(client.value);
        
        return (
          <div className="w-[35%]">
            <span className="block truncate whitespace-nowrap overflow-hidden text-ellipsis">{value}</span>
          </div>
        );
      },
    },
    {
      header: "Canal",
      accessorKey: "channel",
      cell: ({ row }: any) => (
        <div className="w-[10%]">
          <Badge variant="secondary">{row.original.channel}</Badge>
        </div>
      ),
    },
    {
      header: "Mensajes",
      accessorKey: "messages",
      cell: ({ row }: any) => (
        <div className="w-[5%] flex items-center justify-center text-center">
          {row.original.messages}
        </div>
      ),
    },
    {
      header: "Fecha",
      accessorKey: "date",
      cell: ({ row }: any) => (
        <div className="w-[20%]">
          <span className="block text-right whitespace-nowrap overflow-hidden text-ellipsis">
            {format(row.original.date, "dd MMM yyyy HH:mm", { locale: es })}
          </span>
        </div>
      ),
    }
  ];

  const handleRowClick = (rowData: any) => {
    navigate(`/conversaciones/${rowData.row.original.id}`);
  };

  const latestConversations = conversations
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
        data={latestConversations.map(item => ({ row: { original: item } }))}
        selectedRows={[]}
        getRowId={(rowData) => rowData.row.original.id}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
