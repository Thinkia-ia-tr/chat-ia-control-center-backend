
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface TablePaginationProps {
  onPreviousPage: () => void;
  onNextPage: () => void;
  onRowsPerPageChange: (value: number) => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
  currentPage?: number;
  totalPages?: number;
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  showRowsPerPageSelect?: boolean;
}

export function TablePagination({ 
  onPreviousPage, 
  onNextPage, 
  onRowsPerPageChange,
  disablePrevious = false,
  disableNext = false,
  currentPage,
  totalPages,
  rowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  showRowsPerPageSelect = true
}: TablePaginationProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        {showRowsPerPageSelect && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mostrar</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => onRowsPerPageChange(parseInt(value))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={rowsPerPage} />
              </SelectTrigger>
              <SelectContent>
                {rowsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">por página</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {currentPage && totalPages && (
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
        )}
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
    </div>
  );
}
