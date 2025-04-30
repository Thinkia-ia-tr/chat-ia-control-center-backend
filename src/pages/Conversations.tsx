
import { ConversationsList } from "@/components/conversations/ConversationsList";
import Layout from "@/components/layout/Layout";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConversationsPage() {
  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);
  
  const [startDate, setStartDate] = useState<Date>(oneWeekAgo);
  const [endDate, setEndDate] = useState<Date>(now);
  
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
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
            <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateRangeChange} />
          </CardContent>
        </Card>
        <ConversationsList startDate={startDate} endDate={endDate} />
      </div>
    </Layout>
  );
}
