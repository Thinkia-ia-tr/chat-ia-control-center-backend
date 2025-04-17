
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";

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
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [tempStartDate, setTempStartDate] = React.useState<Date>(startDate);
  const [tempEndDate, setTempEndDate] = React.useState<Date>(endDate);
  
  const formattedStartDate = format(startDate, "d LLL yyyy", { locale: es });
  const formattedEndDate = format(endDate, "d LLL yyyy", { locale: es });

  const handleCalendarApply = () => {
    onChange(tempStartDate, tempEndDate);
    setIsCalendarOpen(false);
  };

  const handleCalendarOpen = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsCalendarOpen(true);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between bg-card border-input text-left font-normal"
            )}
            onClick={handleCalendarOpen}
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
              <Button
                size="sm"
                variant="outline"
                onClick={handleCalendarOpen}
              >
                Personalizado
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Sheet open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Seleccionar rango de fechas</SheetTitle>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div className="space-y-2">
                <div className="font-medium text-sm">Fecha de inicio</div>
                <Calendar
                  mode="single"
                  selected={tempStartDate}
                  onSelect={(date) => date && setTempStartDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto border rounded-md")}
                  disabled={(date) => date > tempEndDate || date > new Date()}
                />
              </div>
              <div className="space-y-2">
                <div className="font-medium text-sm">Fecha de fin</div>
                <Calendar
                  mode="single"
                  selected={tempEndDate}
                  onSelect={(date) => date && setTempEndDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto border rounded-md")}
                  disabled={(date) => date < tempStartDate || date > new Date()}
                />
              </div>
            </div>
            <Button onClick={handleCalendarApply} className="w-full">
              Aplicar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
