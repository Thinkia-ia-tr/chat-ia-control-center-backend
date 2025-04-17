
import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart } from "@/components/ui/line-chart";
import { useStats } from "@/hooks/useStats";
import { useToast } from "@/components/ui/use-toast";

interface StatsProps {
  startDate?: Date;
  endDate?: Date;
}

export function Stats({ startDate, endDate }: StatsProps) {
  const { toast } = useToast();
  const { data: statsData, isLoading, isError } = useStats(startDate, endDate);

  // Manejar errores
  React.useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  // Calcular el cambio porcentual (ejemplo simplificado)
  const calculateChange = (data: Array<{ date: string; value: number }> = []) => {
    if (data.length < 2) return "0%";
    
    // Dividir los datos en dos mitades para comparar
    const halfIndex = Math.floor(data.length / 2);
    
    // Suma de la primera mitad
    const firstHalfSum = data.slice(0, halfIndex).reduce((sum, item) => sum + item.value, 0);
    
    // Suma de la segunda mitad
    const secondHalfSum = data.slice(halfIndex).reduce((sum, item) => sum + item.value, 0);
    
    // Calcular el cambio porcentual
    if (firstHalfSum === 0) return secondHalfSum > 0 ? "+100%" : "0%";
    
    const percentChange = ((secondHalfSum - firstHalfSum) / firstHalfSum) * 100;
    
    return `${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(1)}% desde el período anterior`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard 
        title="Conversaciones Totales" 
        value={isLoading ? "Cargando..." : formatNumber(statsData?.totalConversations || 0)} 
        change={!isLoading && statsData ? calculateChange(statsData.conversationsData) : undefined}
      >
        {!isLoading && statsData?.conversationsData && (
          <LineChart 
            data={statsData.conversationsData}
            className="h-full w-full"
          />
        )}
      </StatCard>

      <StatCard 
        title="Mensajes Totales" 
        value={isLoading ? "Cargando..." : formatNumber(statsData?.totalMessages || 0)}
        change={!isLoading && statsData ? calculateChange(statsData.messagesData) : undefined}
      >
        {!isLoading && statsData?.messagesData && (
          <LineChart 
            data={statsData.messagesData}
            className="h-full w-full"
          />
        )}
      </StatCard>
    </div>
  );
}
