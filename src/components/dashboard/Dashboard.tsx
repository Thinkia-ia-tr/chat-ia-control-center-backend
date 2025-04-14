
import React, { useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Stats } from "./Stats";
import { RecentConversations } from "./RecentConversations";

export function Dashboard() {
  const [startDate, setStartDate] = useState<Date>(new Date('2023-01-20'));
  const [endDate, setEndDate] = useState<Date>(new Date('2023-02-09'));

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel de Control</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateRangeChange}
        />
      </div>

      <Stats />
      <RecentConversations />
    </div>
  );
}

export default Dashboard;

