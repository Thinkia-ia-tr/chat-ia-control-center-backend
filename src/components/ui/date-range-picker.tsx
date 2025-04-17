
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
    setIsCalendarOpen(true);
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

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;

    // If no start date selected yet or if selecting a date before current start date
    if (!tempStartDate || (tempStartDate && tempEndDate && date < tempStartDate)) {
      setTempStartDate(date);
      setTempEndDate(undefined);
    }
    // If start date is selected but no end date, or selecting a new range
    else if (tempStartDate && (!tempEndDate || date < tempStartDate)) {
      setTempEndDate(tempStartDate);
      setTempStartDate(date);
    }
    // If start date is selected and selecting end date
    else if (tempStartDate && date >= tempStartDate) {
      setTempEndDate(date);
    }
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
        <SheetContent className="sm:max-w-3xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Seleccionar rango de fechas</SheetTitle>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between">
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
                  className={cn("border rounded-md")}
                />
              </div>
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
                  month={rightMonth}
                  onMonthChange={setRightMonth}
                  numberOfMonths={1}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className={cn("border rounded-md")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
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
            
            <Button onClick={handleCalendarApply} className="w-full">
              Aplicar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
