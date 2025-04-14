
import React from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps<T> {
  columns: {
    header: string;
    accessorKey: string;
    cell?: (item: { row: { original: T } }) => React.ReactNode;
  }[];
  data: { row: { original: T } }[];
  selectedRows?: { row: { original: T } }[];
  onRowSelect?: (row: { row: { original: T } }) => void;
  onRowClick?: (row: { row: { original: T } }) => void;
  getRowId?: (row: { row: { original: T } }) => string | number;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  selectedRows = [],
  onRowSelect,
  onRowClick,
  getRowId = () => Math.random(),
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("rounded-md bg-card text-card-foreground", className)}>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              {onRowSelect && <TableHead className="w-10"></TableHead>}
              {columns.map((column) => (
                <TableHead key={column.accessorKey} className="text-left">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => {
              const rowId = getRowId(row);
              const isSelected = selectedRows.some((selectedRow) => getRowId(selectedRow) === rowId);
              return (
                <TableRow 
                  key={rowId} 
                  className={cn(
                    isSelected ? "bg-muted" : "",
                    onRowClick && "cursor-pointer hover:bg-muted/50"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {onRowSelect && (
                    <TableCell className="p-3" onClick={(e) => e.stopPropagation()}>
                      <span
                        className={cn(
                          "flex h-5 w-5 rounded-full border items-center justify-center",
                          isSelected ? "border-primary bg-primary" : ""
                        )}
                        onClick={() => onRowSelect(row)}
                      ></span>
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.cell
                        ? column.cell(row)
                        // @ts-ignore - This is a simplification, in practice we'd want to create a proper type
                        : row.row.original[column.accessorKey]
                      }
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
