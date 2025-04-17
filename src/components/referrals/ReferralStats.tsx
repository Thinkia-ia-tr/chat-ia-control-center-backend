
import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart } from "@/components/ui/line-chart";
import { useReferralStats } from "@/hooks/useReferralStats";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { BriefcaseIcon, HeadphonesIcon, WrenchIcon, CalculatorIcon, UsersIcon } from "lucide-react";

interface ReferralStatsProps {
  startDate?: Date;
  endDate?: Date;
}

export function ReferralStats({ startDate, endDate }: ReferralStatsProps) {
  const { toast } = useToast();
  const { data, isLoading, error } = useReferralStats(startDate, endDate);

  if (error) {
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

  // Generar datos simulados para los gráficos
  const generateMonthData = (count: number) => {
    const data = [];
    const baseValue = Math.max(1, count / 30); // Valor base proporcional al count total
    for (let i = 30; i >= 0; i--) {
      data.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.max(0, Math.floor(baseValue + Math.random() * baseValue * 2)) // Valores basados en count
      });
    }
    return data;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.stats.map((stat) => {
        const typeInfo = referralTypeIcons[stat.referral_type as keyof typeof referralTypeIcons];
        const Icon = typeInfo?.icon || BriefcaseIcon;
        const color = typeInfo?.color || "hsl(var(--primary))";
        
        // Calcular cambio porcentual (simulado)
        const changePercent = Math.floor(Math.random() * 20) - 5;
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
              data={generateMonthData(stat.count)}
              color={color}
              className="h-full w-full"
            />
          </StatCard>
        );
      })}
    </div>
  );
}
