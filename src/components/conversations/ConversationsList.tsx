
import React, { useState } from "react";
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

interface ConversationsListProps {
  startDate?: Date;
  endDate?: Date;
}

export function ConversationsList({ startDate, endDate }: ConversationsListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Conversation[]>([]);
  const [page, setPage] = useState(1); // Changed from 0 to 1 for 1-based pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { data: conversations = [], isError } = useConversations(startDate, endDate);

  if (isError) {
    toast({
      title: "Error",
      description: "No se pudieron cargar las conversaciones",
      variant: "destructive"
    });
  }
  
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
  
  const filteredData = conversations.filter(conversation => 
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage; // Adjusted for 1-based pagination
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value));
    setPage(1); // Reset to first page when changing rows per page
  };
  
  return (
    <div className="flex flex-col gap-6">
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalRows={conversations.length}
        selectedCount={selectedRows.length}
      />
      
      <ConversationsTable
        data={paginatedData}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        onRowClick={handleRowClick}
      />
      
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
    </div>
  );
}

export default ConversationsList;
