
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { ReferralStats } from "@/components/referrals/ReferralStats";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReferralList } from "@/components/referrals/ReferralList";
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
        
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            <TabsTrigger value="list">Listado</TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
            <Card className="p-6">
              <ReferralStats startDate={startDate} endDate={endDate} />
            </Card>
          </TabsContent>
          <TabsContent value="list">
            <Card className="p-6">
              <ReferralList startDate={startDate} endDate={endDate} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
