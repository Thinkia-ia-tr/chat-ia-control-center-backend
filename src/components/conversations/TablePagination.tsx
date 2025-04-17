
import React from "react";
import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  onPreviousPage: () => void;
  onNextPage: () => void;
  onRowsPerPageChange: (value: number) => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
  currentPage?: number;
  totalPages?: number;
}

export function TablePagination({ 
  onPreviousPage, 
  onNextPage, 
  onRowsPerPageChange,
  disablePrevious = false,
  disableNext = false,
  currentPage,
  totalPages
}: TablePaginationProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        {currentPage && totalPages && (
          <span>Página {currentPage} de {totalPages}</span>
        )}
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousPage}
          disabled={disablePrevious}
        >
          Anterior
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextPage}
          disabled={disableNext}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
