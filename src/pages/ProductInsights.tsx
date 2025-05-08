
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { ProductStats } from "@/components/products/ProductStats";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductList } from "@/components/products/ProductList";

export default function ProductInsightsPage() {
  // Default date range: last 30 days
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Insights de Productos</h1>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateRangeChange}
            className="w-auto"
          />
        </div>
        
        <Tabs defaultValue="summary">
          <TabsList>
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Menciones de Productos</CardTitle>
                <CardDescription>
                  Menciones detectadas en las conversaciones durante el periodo seleccionado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductStats 
                  startDate={startDate} 
                  endDate={endDate} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Menciones Detalladas</CardTitle>
                <CardDescription>
                  Listado completo de menciones de productos con contexto.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductList 
                  startDate={startDate} 
                  endDate={endDate} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
