
import { ConversationsList } from "@/components/conversations/ConversationsList";
import Layout from "@/components/layout/Layout";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useDifySync } from "@/hooks/useDifySync";

export default function ConversationsPage() {
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);
  
  const [startDate, setStartDate] = useState<Date>(oneMonthAgo);
  const [endDate, setEndDate] = useState<Date>(now);
  const { isLoading, syncConversationsFromDify } = useDifySync();
  
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleUpdateConversations = async () => {
    try {
      await syncConversationsFromDify();
      // Opcional: recargar la lista de conversaciones
      window.location.reload();
    } catch (error) {
      // Error ya manejado en el hook
    }
  };
  
  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-full">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <h2 className="text-xl font-medium">Listado de conversaciones</h2>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleUpdateConversations}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Actualizando...' : 'Actualizar conversaciones'}
              </Button>
              <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateRangeChange} />
            </div>
          </CardContent>
        </Card>
        <ConversationsList startDate={startDate} endDate={endDate} />
      </div>
    </Layout>
  );
}
