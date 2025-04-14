import React, { useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart } from "@/components/ui/line-chart";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

interface Conversation {
  id: string;
  title: string;
  user: string;
  channel: "Web" | "Whatsapp";
  messages: number;
  date: Date;
  status?: 'done' | 'in-progress';
}

const recentConversations: Conversation[] = [
  {
    id: "1",
    title: "Estado del pedido #45672 - Entrega retrasada",
    user: "maria@gmail.com",
    channel: "Web",
    messages: 8,
    date: new Date("2024-04-14T10:30:00"),
    status: "in-progress"
  },
  {
    id: "2",
    title: "Problema con talla incorrecta en pedido #34567",
    user: "+34611223344",
    channel: "Whatsapp",
    messages: 12,
    date: new Date("2024-04-14T09:15:00"),
    status: "done"
  },
  {
    id: "3",
    title: "Consulta disponibilidad producto en otras tiendas",
    user: "carlos@empresa.com",
    channel: "Web",
    messages: 5,
    date: new Date("2024-04-13T15:45:00")
  },
  {
    id: "4",
    title: "Devolución producto dañado pedido #89012",
    user: "laura@tienda.com",
    channel: "Web",
    messages: 15,
    date: new Date("2024-04-13T14:20:00"),
    status: "in-progress"
  },
  {
    id: "5",
    title: "Información envío express pedido #67890",
    user: "+34655443322",
    channel: "Whatsapp",
    messages: 7,
    date: new Date("2024-04-13T11:10:00")
  }
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
            <Input placeholder="Filtrar conversaciones..." className="pl-10 bg-card border-input" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-[auto_2fr_1fr_auto_auto_auto] p-4 border-b border-border">
            <div className="w-8"></div>
            <div className="flex items-center">
              <span className="font-medium">Conversación</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-1">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-right font-medium">Usuario</div>
            <div className="text-right font-medium">Canal</div>
            <div className="text-right font-medium">Mensajes</div>
            <div className="text-right font-medium">Fecha</div>
          </div>

          {recentConversations.map((conversation) => (
            <div 
              key={conversation.id} 
              className="grid grid-cols-[auto_2fr_1fr_auto_auto_auto] p-4 border-b last:border-b-0 border-border hover:bg-muted/50 cursor-pointer"
            >
              <div className="mr-4">
                <span 
                  className={`flex h-5 w-5 rounded-full border ${
                    conversation.status === 'done' 
                      ? 'border-success bg-success' 
                      : conversation.status === 'in-progress' 
                        ? 'border-warning bg-warning'
                        : 'border-muted bg-muted'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-medium">{conversation.title}</span>
              </div>

              <div className="text-right">
                <span className="text-sm font-medium">{conversation.user}</span>
              </div>

              <div className="flex justify-end">
                <Badge variant="secondary">{conversation.channel}</Badge>
              </div>

              <div className="text-right">
                <span className="text-sm">{conversation.messages}</span>
              </div>

              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  {format(conversation.date, "dd MMM HH:mm", { locale: es })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
