
import { ConversationsList } from "@/components/conversations/ConversationsList";
import Layout from "@/components/layout/Layout";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useState } from "react";

export default function ConversationsPage() {
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setDate(now.getDate() - 30);
  
  const [startDate, setStartDate] = useState<Date>(oneMonthAgo);
  const [endDate, setEndDate] = useState<Date>(now);

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Historial de conversaciones</h1>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateRangeChange}
          />
        </div>
        <ConversationsList />
      </div>
    </Layout>
  );
}
