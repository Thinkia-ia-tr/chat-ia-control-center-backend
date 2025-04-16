
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalRows: number;
  selectedCount: number;
}

export function SearchFilter({ searchQuery, onSearchChange, totalRows, selectedCount }: SearchFilterProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversaciones"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-[384px] bg-card border-input"
          />
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {selectedCount} of {totalRows} row(s) selected.
      </div>
    </div>
  );
}

