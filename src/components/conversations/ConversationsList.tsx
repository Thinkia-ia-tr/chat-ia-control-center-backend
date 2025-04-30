
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
  
  const { data: conversations = [], isLoading, isError } = useConversations(startDate, endDate);

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
    
    // Case-insensitive search on title
    if (conversation.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
      return true;
    }
    
    // Search on client ID if available
    if (conversation.client && typeof conversation.client === 'object' && conversation.client.value) {
      const clientValue = conversation.client.value.toString().toLowerCase();
      if (clientValue.includes(debouncedSearchQuery.toLowerCase())) {
        return true;
      }
    }
    
    // Search on channel
    if (conversation.channel.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
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
    <div className="flex flex-col gap-6">
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
          <div className="flex items-center gap-2 scale-120 whitespace-nowrap">
            <span className="text-sm text-muted-foreground">Mostrar</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={handleRowsPerPageChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={rowsPerPage} />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50].map((option) => (
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
    </div>
  );
}

export default ConversationsList;
