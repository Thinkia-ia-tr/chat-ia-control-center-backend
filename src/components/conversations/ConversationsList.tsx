
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilter } from "./SearchFilter";
import { ConversationsTable } from "./ConversationsTable";
import { ConversationsPagination } from "./ConversationsPagination";
import type { Conversation } from "./types";
import { useConversations } from "@/hooks/useConversations";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConversationsListProps {
  startDate?: Date;
  endDate?: Date;
}

export function ConversationsList({ startDate, endDate }: ConversationsListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { data: conversations = [], isLoading, isError, error } = useConversations(startDate, endDate);

  console.log("ConversationsList render - data:", conversations, "isLoading:", isLoading, "isError:", isError);
  
  if (error) {
    console.error("Error from useConversations:", error);
  }

  // Reset pagination when search query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  if (isError) {
    toast({
      title: "Error",
      description: "No se pudieron cargar las conversaciones",
      variant: "destructive"
    });
  }

  const handleRowClick = (rowData: { row: { original: Conversation } }) => {
    navigate(`/conversaciones/${rowData.row.original.id}`);
  };
  
  // Apply search filter to data
  const filteredData = conversations.filter(conversation => {
    if (!debouncedSearchQuery) return true;
    
    const searchLower = debouncedSearchQuery.toLowerCase();
    
    // Buscar en el título de la conversación
    if (conversation.title && conversation.title.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // Buscar en el cliente (ID o teléfono)
    if (conversation.client) {
      // Si client es un objeto con una propiedad value
      if (typeof conversation.client === 'object' && conversation.client.value) {
        const clientValue = conversation.client.value.toString().toLowerCase();
        if (clientValue.includes(searchLower)) {
          return true;
        }
      } 
      // Si client es un string directamente
      else if (typeof conversation.client === 'string') {
        const clientValue = conversation.client.toLowerCase();
        if (clientValue.includes(searchLower)) {
          return true;
        }
      }
    }
    
    // Buscar en el canal
    if (conversation.channel && conversation.channel.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    return false;
  });
  
  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value));
    setPage(1); // Reset to first page when changing rows per page
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Cargando conversaciones...</span>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total: {filteredData.length} conversaciones</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalRows={filteredData.length}
        />
        
        {filteredData.length > 0 ? (
          <ConversationsTable
            data={paginatedData}
            onRowClick={handleRowClick}
          />
        ) : (
          <div className="text-center p-8 border rounded-md bg-muted/20">
            <p className="text-lg text-muted-foreground">No se encontraron conversaciones que coincidan con tu búsqueda.</p>
          </div>
        )}
        
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-sm text-muted-foreground">Mostrar</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={handleRowsPerPageChange}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder={rowsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 25, 50].map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">por página</span>
            </div>
            
            <ConversationsPagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ConversationsList;
