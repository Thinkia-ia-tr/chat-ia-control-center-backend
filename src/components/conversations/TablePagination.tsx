
import React from "react";
import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  onPreviousPage: () => void;
  onNextPage: () => void;
  onRowsPerPageChange: (value: number) => void;
}

export function TablePagination({ onPreviousPage, onNextPage, onRowsPerPageChange }: TablePaginationProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        Rows per page: 
        <select 
          className="ml-2 bg-transparent border-none text-sm text-muted-foreground"
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        >
          <option>10</option>
          <option>20</option>
          <option>50</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onPreviousPage}>Anterior</Button>
        <Button variant="outline" size="sm" onClick={onNextPage}>Siguiente</Button>
      </div>
    </div>
  );
}

