
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { ReferralStats } from "@/components/referrals/ReferralStats";
import { ReferralList } from "@/components/referrals/ReferralList";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Card } from "@/components/ui/card";
import { useReferralEmails } from "@/hooks/useReferralEmails";

export default function ReferralsPage() {
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1); // Un mes por defecto
  
  const [startDate, setStartDate] = useState<Date>(oneMonthAgo);
  const [endDate, setEndDate] = useState<Date>(now);

  // Use the hook to listen for automatic referral creations
  useReferralEmails();

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

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Listado de derivaciones</h2>
          <ReferralList startDate={startDate} endDate={endDate} />
        </Card>
      </div>
    </Layout>
  );
}
