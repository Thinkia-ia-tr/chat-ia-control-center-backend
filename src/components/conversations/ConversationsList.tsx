
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

  const handlePreviousPage = () => {
    console.log('Previous page');
  };

  const handleNextPage = () => {
    console.log('Next page');
  };

  const handleRowsPerPageChange = (value: number) => {
    console.log('Rows per page changed to:', value);
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
        data={filteredData}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        onRowClick={handleRowClick}
      />
      
      <TablePagination
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
}

export default ConversationsList;
