
import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart } from "@/components/ui/line-chart";
import { useReferralStats } from "@/hooks/useReferralStats";
import { useReferralTimeSeries } from "@/hooks/useReferralTimeSeries";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { BriefcaseIcon, HeadphonesIcon, WrenchIcon, CalculatorIcon, UsersIcon } from "lucide-react";

interface ReferralStatsProps {
  startDate?: Date;
  endDate?: Date;
}

export function ReferralStats({ startDate, endDate }: ReferralStatsProps) {
  const { toast } = useToast();
  const { data: statsData, isLoading: isLoadingStats, error: statsError } = useReferralStats(startDate, endDate);
  const { data: timeSeriesData, isLoading: isLoadingTimeSeries, error: timeSeriesError } = useReferralTimeSeries(startDate, endDate);

  if (statsError || timeSeriesError) {
    toast({
      title: "Error",
      description: "No se pudieron cargar las estadísticas de derivaciones",
      variant: "destructive"
    });
  }

  const referralTypeIcons = {
    "Asesor Comercial": { icon: BriefcaseIcon, color: "hsl(var(--primary))" },
    "Atención al Cliente": { icon: HeadphonesIcon, color: "#0EA5E9" },
    "Soporte Técnico": { icon: WrenchIcon, color: "#8B5CF6" },
    "Presupuestos": { icon: CalculatorIcon, color: "#F97316" },
    "Colaboraciones": { icon: UsersIcon, color: "#6E59A5" }
  };

  if (isLoadingStats || isLoadingTimeSeries) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData?.stats.map((stat) => {
          const typeInfo = referralTypeIcons[stat.referral_type as keyof typeof referralTypeIcons];
          const Icon = typeInfo?.icon || BriefcaseIcon;
          const color = typeInfo?.color || "hsl(var(--primary))";
          
          // Obtener los datos de serie de tiempo para este tipo de derivación
          const typeSeries = timeSeriesData && 'timeSeriesByType' in timeSeriesData 
            ? timeSeriesData.timeSeriesByType[stat.referral_type] || []
            : [];
          
          // Calcular el cambio porcentual (comparando la segunda mitad con la primera mitad del período)
          let changePercent = 0;
          if (typeSeries.length > 0) {
            const midPoint = Math.floor(typeSeries.length / 2);
            const firstHalfSum = typeSeries.slice(0, midPoint).reduce((sum, item) => sum + item.value, 0);
            const secondHalfSum = typeSeries.slice(midPoint).reduce((sum, item) => sum + item.value, 0);
            
            if (firstHalfSum > 0) {
              changePercent = Math.round(((secondHalfSum - firstHalfSum) / firstHalfSum) * 100);
            } else if (secondHalfSum > 0) {
              changePercent = 100; // Si no hay datos en la primera mitad pero sí en la segunda
            }
          }
          
          const change = `${changePercent > 0 ? '+' : ''}${changePercent}%`;
          
          return (
            <StatCard 
              key={stat.referral_type}
              title={stat.referral_type}
              value={stat.count.toString()}
              change={change}
              className="relative"
            >
              <Icon className="absolute top-4 right-4 text-muted-foreground/20 h-6 w-6" />
              <LineChart 
                data={typeSeries}
                color={color}
                className="h-full w-full"
              />
            </StatCard>
          );
        })}
      </div>
    </div>
  );
}
