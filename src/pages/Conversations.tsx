import { ConversationsList } from "@/components/conversations/ConversationsList";
import Layout from "@/components/layout/Layout";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bot, Download } from "lucide-react";
import { DifyAPIDialog } from "@/components/conversations/DifyAPIDialog";
import { DifyConversationsDialog } from "@/components/conversations/DifyConversationsDialog";

export default function ConversationsPage() {
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1); // Un mes por defecto
  
  const [startDate, setStartDate] = useState<Date>(oneMonthAgo);
  const [endDate, setEndDate] = useState<Date>(now);
  const [isDifyDialogOpen, setIsDifyDialogOpen] = useState(false);
  const [isDifyConversationsDialogOpen, setIsDifyConversationsDialogOpen] = useState(false);
  
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
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDifyConversationsDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Cargar de Dify
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDifyDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Bot className="h-4 w-4" />
                Dify API
              </Button>
              <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateRangeChange} />
            </div>
          </CardContent>
        </Card>
        <ConversationsList startDate={startDate} endDate={endDate} />
        
        <DifyAPIDialog 
          open={isDifyDialogOpen} 
          onOpenChange={setIsDifyDialogOpen} 
        />
        
        <DifyConversationsDialog 
          open={isDifyConversationsDialogOpen} 
          onOpenChange={setIsDifyConversationsDialogOpen}
        />
      </div>
    </Layout>
  );
}
