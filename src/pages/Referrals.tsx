
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { ReferralStats } from "@/components/referrals/ReferralStats";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Card } from "@/components/ui/card";

export default function ReferralsPage() {
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Derivaciones</h1>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateRangeChange}
          />
        </div>
        
        <Card className="p-6">
          <ReferralStats startDate={startDate} endDate={endDate} />
        </Card>
      </div>
    </Layout>
  );
}
