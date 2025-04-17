
import React, { useState } from "react";
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
import { TablePagination } from "@/components/conversations/TablePagination";

export function RecentConversations() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: conversations = [], isError } = useConversations();
  
  // We're no longer using pagination for the dashboard view
  // as we'll only show the 5 most recent conversations

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
        let value = '';
        
        if (client && typeof client === 'object') {
          if (client.type === 'email') {
            value = client.value || 'usuario@ejemplo.com';
          } else if (client.type === 'phone') {
            // Format phone if needed
            const cleaned = (client.value || '').replace(/\D/g, '');
            if (cleaned.length >= 9) {
              const countryCode = cleaned.slice(0, 2);
              const firstPart = cleaned.slice(2, 5);
              const secondPart = cleaned.slice(5, 8);
              const lastPart = cleaned.slice(8, 11);
              value = `+${countryCode} ${firstPart} ${secondPart} ${lastPart}`;
            } else {
              value = client.value || '';
            }
          } else if (client.type === 'id') {
            value = client.value || '';
          }
        } else {
          value = 'Cliente sin información';
        }
        
        return (
          <div className="w-full">
            <span className="block">{value}</span>
          </div>
        );
      },
    },
    {
      header: "Canal",
      accessorKey: "channel",
      cell: ({ row }: any) => (
        <div className="w-full">
          <Badge variant="secondary">{row.original.channel}</Badge>
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
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => 
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort all conversations by date (newest first)
  const sortedConversations = [...filteredConversations].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Only show the 5 most recent conversations
  const recentConversations = sortedConversations.slice(0, 5);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Últimas conversaciones</h2>
      
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversaciones"
            className="pl-10 bg-card border-input"
            value={searchQuery}
            onChange={handleSearchChange}
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
        data={recentConversations.map(item => ({ row: { original: item } }))}
        selectedRows={[]}
        getRowId={(rowData) => rowData.row.original.id}
        onRowClick={handleRowClick}
      />

      {/* Removed pagination since we're only showing 5 conversations */}
    </div>
  );
}
