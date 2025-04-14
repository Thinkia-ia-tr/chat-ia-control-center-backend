
import * as React from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (startDate: Date, endDate: Date) => void;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  className,
}: DateRangePickerProps) {
  const formattedStartDate = format(startDate, "d LLL yyyy", { locale: es });
  const formattedEndDate = format(endDate, "d LLL yyyy", { locale: es });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between bg-card border-input text-left font-normal"
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {formattedStartDate} - {formattedEndDate}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
          <div className="p-3">
            <div className="text-sm font-medium">Seleccionar intervalo</div>
            <div className="grid gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(start.getDate() - 7);
                  onChange(start, end);
                }}
              >
                Última semana
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(start.getDate() - 30);
                  onChange(start, end);
                }}
              >
                Último mes
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(start.getDate() - 90);
                  onChange(start, end);
                }}
              >
                Últimos 3 meses
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
