
import React, { useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart } from "@/components/ui/line-chart";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Datos de ejemplo para los gráficos
const conversationData = [
  { value: 12 },
  { value: 17 },
  { value: 15 },
  { value: 14 },
  { value: 13 },
  { value: 15 },
  { value: 25 },
];

const messageData = [
  { value: 25 },
  { value: 32 },
  { value: 28 },
  { value: 25 },
  { value: 30 },
  { value: 35 },
  { value: 40 },
];

interface Transaction {
  status: 'Success' | 'Processing' | 'Failed';
  email: string;
  amount: string;
}

const transactionData: Transaction[] = [
  { status: 'Success', email: 'ken99@example.com', amount: '$316.00' },
  { status: 'Success', email: 'abe45@example.com', amount: '$242.00' },
  { status: 'Processing', email: 'monserrat44@example.com', amount: '$837.00' },
  { status: 'Failed', email: 'carmella@example.com', amount: '$721.00' },
];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
          title="Conversaciones Totales" 
          value="$15,231.89" 
          change="+20.1% from last month"
        >
          <LineChart data={conversationData} />
        </StatCard>

        <StatCard 
          title="Mensajes Totales" 
          value="$15,231.89" 
          change="+20.1% from last month"
        >
          <LineChart data={messageData} />
        </StatCard>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Últimas conversaciones</h2>
        
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Filter emails..." className="pl-10 bg-card border-input" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto] p-4 border-b border-border">
            <div className="w-8"></div>
            <div className="flex items-center">
              <span className="font-medium">Email</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-1">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="hidden md:block text-right font-medium">Amount</div>
            <div className="w-8"></div>
          </div>

          {transactionData.map((transaction, index) => (
            <div 
              key={index} 
              className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto] p-4 border-b last:border-b-0 border-border"
            >
              <div className="mr-4">
                <span 
                  className={`flex h-5 w-5 rounded-full border ${
                    transaction.status === 'Success' 
                      ? 'border-success bg-success' 
                      : transaction.status === 'Processing' 
                        ? 'border-warning bg-warning'
                        : 'border-destructive bg-destructive'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline">{transaction.status}</Badge>
                <span>{transaction.email}</span>
              </div>

              <div className="text-right font-medium">{transaction.amount}</div>

              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <svg 
                    width="15" 
                    height="3" 
                    viewBox="0 0 15 3" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current"
                  >
                    <path d="M1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3Z" />
                    <path d="M7.5 3C8.32843 3 9 2.32843 9 1.5C9 0.671573 8.32843 0 7.5 0C6.67157 0 6 0.671573 6 1.5C6 2.32843 6.67157 3 7.5 3Z" />
                    <path d="M13.5 3C14.3284 3 15 2.32843 15 1.5C15 0.671573 14.3284 0 13.5 0C12.6716 0 12 0.671573 12 1.5C12 2.32843 12.6716 3 13.5 3Z" />
                  </svg>
                </Button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-muted-foreground">0 of 4 row(s) selected.</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
