
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { ReferralStats } from "@/components/referrals/ReferralStats";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export default function ReferralsPage() {
  const [startDate, setStartDate] = useState<Date>(new Date());
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
        
        <ReferralStats />
      </div>
    </Layout>
  );
}
