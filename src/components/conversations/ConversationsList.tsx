
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilter } from "./SearchFilter";
import { ConversationsTable } from "./ConversationsTable";
import { TablePagination } from "./TablePagination";
import type { Conversation } from "./types";
import { useConversations } from "@/hooks/useConversations";
import { useToast } from "@/components/ui/use-toast";

export function ConversationsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Conversation[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { data: conversations = [], isError } = useConversations();

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
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPage(prev => {
      if ((prev + 1) * rowsPerPage < filteredData.length) {
        return prev + 1;
      }
      return prev;
    });
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setPage(0); // Reset to first page when changing rows per page
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
      
      <TablePagination
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        disablePrevious={page === 0}
        disableNext={(page + 1) * rowsPerPage >= filteredData.length}
        currentPage={page + 1}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
      />
    </div>
  );
}

export default ConversationsList;
