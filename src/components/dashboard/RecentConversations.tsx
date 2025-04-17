
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
        // Format client as AAMM-XXXXXX
        // AA: first two letters of the current year
        // MM: current month
        // XXXXXX: random 6-digit number based on client id
        
        const client = row.original.client;
        const date = new Date();
        const yearPrefix = date.getFullYear().toString().slice(2); // Last 2 digits of the year
        const monthPrefix = (date.getMonth() + 1).toString().padStart(2, '0'); // Month padded with zero
        
        // Generate a consistent 6-digit number from the client data
        let sixDigitNumber = '000000';
        
        if (client && typeof client === 'object' && client.value) {
          // Use client value to create a consistent 6-digit number
          const valueString = client.value.toString();
          // Take the last 6 chars of the string, or pad with zeros
          sixDigitNumber = valueString.length >= 6 
            ? valueString.slice(-6) 
            : valueString.padStart(6, '0');
            
          // Ensure it's 6 digits by replacing non-digits with '0'
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
