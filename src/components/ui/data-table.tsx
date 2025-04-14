
import React from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<T> {
  columns: {
    header: string;
    accessorKey: string;
    cell?: (item: T) => React.ReactNode;
  }[];
  data: T[];
  selectedRows?: T[];
  onRowSelect?: (row: T) => void;
  getRowId?: (row: T) => string | number;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  selectedRows = [],
  onRowSelect,
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
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => {
              const rowId = getRowId(row);
              const isSelected = selectedRows.some((selectedRow) => getRowId(selectedRow) === rowId);
              return (
                <TableRow key={rowId} className={isSelected ? "bg-muted" : ""}>
                  {onRowSelect && (
                    <TableCell className="p-3">
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
                        : row[column.accessorKey]
                      }
                    </TableCell>
                  ))}
                  <TableCell className="p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted">
                        <MoreHorizontal size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
