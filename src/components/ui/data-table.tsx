
import React from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps<T> {
  columns: {
    header: string;
    accessorKey: string;
    cell?: (item: { row: { original: T } }) => React.ReactNode;
  }[];
  data: T[];
  onRowClick?: (row: { row: { original: T } }) => void;
  getRowId?: (row: T) => string | number;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  onRowClick,
  getRowId = () => Math.random(),
  className,
}: DataTableProps<T>) {
  console.log("DataTable rendering with data:", data);

  // Ensure data is always an array and items are valid
  const safeData = Array.isArray(data) ? data : [];
  
  return (
    <div className={cn("rounded-md bg-card text-card-foreground", className)}>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey} className="text-left">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeData.length > 0 ? (
              safeData.map((row) => {
                // Skip rendering if row is null or undefined
                if (!row) return null;
                
                const rowId = getRowId(row);
                return (
                  <TableRow 
                    key={rowId} 
                    className={cn(
                      onRowClick && "cursor-pointer hover:bg-muted/50"
                    )}
                    onClick={() => onRowClick?.({ row: { original: row } })}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.accessorKey}>
                        {column.cell
                          ? column.cell({ row: { original: row } })
                          // @ts-ignore - This is a simplification, in practice we'd want to create a proper type
                          : row[column.accessorKey]
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
