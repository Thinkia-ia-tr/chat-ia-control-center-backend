
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalRows: number;
  selectedCount?: number; // Made this optional
}

export function SearchFilter({ searchQuery, onSearchChange, totalRows, selectedCount = 0 }: SearchFilterProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título o cliente"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 w-[384px] bg-card border-input"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {totalRows} {totalRows === 1 ? "conversación" : "conversaciones"}
      </div>
    </div>
  );
}
