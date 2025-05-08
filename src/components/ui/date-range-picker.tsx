
import * as React from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [leftMonth, setLeftMonth] = React.useState<Date>(new Date(tempStartDate));
  const [rightMonth, setRightMonth] = React.useState<Date>(addMonths(new Date(tempStartDate), 1));
  
  const formattedStartDate = format(startDate, "d LLL yyyy", { locale: es });
  const formattedEndDate = format(endDate, "d LLL yyyy", { locale: es });

  const handleCalendarApply = () => {
    onChange(tempStartDate, tempEndDate);
    setIsCalendarOpen(false);
  };

  const handleCalendarOpen = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setLeftMonth(new Date(startDate));
    setRightMonth(addMonths(new Date(startDate), 1));
  };

  const handlePreviousMonths = () => {
    setLeftMonth(prevMonth => {
      const newLeftMonth = addMonths(prevMonth, -1);
      setRightMonth(addMonths(newLeftMonth, 1));
      return newLeftMonth;
    });
  };

  const handleNextMonths = () => {
    setLeftMonth(prevMonth => {
      const newLeftMonth = addMonths(prevMonth, 1);
      setRightMonth(addMonths(newLeftMonth, 1));
      return newLeftMonth;
    });
  };

  // Helper function to set presets for date ranges
  const setLastMonthRange = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    onChange(start, end);
    setIsCalendarOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
        <PopoverContent className="w-auto p-3" align="end">
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium">Seleccionar intervalo</div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const end = new Date();
                    const start = new Date();
                    start.setDate(start.getDate() - 7);
                    onChange(start, end);
                    setIsCalendarOpen(false);
                  }}
                >
                  Última semana
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={setLastMonthRange}
                  className="bg-primary/10"
                >
                  Último mes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="col-span-2"
                >
                  Personalizado
                </Button>
              </div>
            </div>
            
            {/* Calendar Section */}
            <div className="pt-4 border-t">
              {/* Calendar Navigation */}
              <div className="flex items-center justify-between mb-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handlePreviousMonths}
                  className="hover:text-primary"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1 text-center">
                  <div className="font-medium text-sm">
                    {format(leftMonth, "MMMM yyyy", { locale: es })} - {format(rightMonth, "MMMM yyyy", { locale: es })}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleNextMonths}
                  className="hover:text-primary"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Two calendars side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Calendar
                    mode="range"
                    selected={{
                      from: tempStartDate,
                      to: tempEndDate
                    }}
                    onSelect={(range) => {
                      if (!range) return;
                      if (range.from) setTempStartDate(range.from);
                      if (range.to) setTempEndDate(range.to);
                    }}
                    month={leftMonth}
                    onMonthChange={setLeftMonth}
                    numberOfMonths={1}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="border rounded-md pointer-events-auto"
                  />
                </div>
                <div className="space-y-2 hidden md:block">
                  <Calendar
                    mode="range"
                    selected={{
                      from: tempStartDate,
                      to: tempEndDate
                    }}
                    onSelect={(range) => {
                      if (!range) return;
                      if (range.from) setTempStartDate(range.from);
                      if (range.to) setTempEndDate(range.to);
                    }}
                    month={rightMonth}
                    onMonthChange={setRightMonth}
                    numberOfMonths={1}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="border rounded-md pointer-events-auto"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm">
                  {tempStartDate && tempEndDate ? (
                    <span>
                      {format(tempStartDate, "d MMM yyyy", { locale: es })} - {format(tempEndDate, "d MMM yyyy", { locale: es })}
                    </span>
                  ) : tempStartDate ? (
                    <span>{format(tempStartDate, "d MMM yyyy", { locale: es })}</span>
                  ) : (
                    <span>Selecciona un rango de fechas</span>
                  )}
                </div>
              </div>
              
              <Button onClick={handleCalendarApply} className="w-full mt-2">
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
