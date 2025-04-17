
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface ReferralStat {
  referral_type: string;
  count: number;
}

export function useReferralStats(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ['referral-stats', startDate, endDate],
    queryFn: async () => {
      // Asegurar que hay fechas válidas para la consulta
      if (!startDate || !endDate) {
        const end = new Date();
        const start = new Date(end);
        start.setMonth(start.getMonth() - 1); // Un mes por defecto
        
        startDate = start;
        endDate = end;
      }

      // Ajustar la fecha de fin para incluir todo el día
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      
      // Llamar a la función de base de datos
      const { data, error } = await supabase
        .rpc('get_referral_stats', {
          start_date: startDate.toISOString(),
          end_date: adjustedEndDate.toISOString()
        });
      
      if (error) throw error;
      
      // Generar datos para todos los tipos de derivación, incluso los que no tienen datos
      const referralTypes = [
        'Asesor Comercial', 
        'Atención al Cliente', 
        'Soporte Técnico', 
        'Presupuestos', 
        'Colaboraciones'
      ];
      
      // Crear un mapa de los resultados
      const statsMap = new Map<string, number>();
      data.forEach((stat: ReferralStat) => {
        statsMap.set(stat.referral_type, stat.count);
      });
      
      // Asegurar que todos los tipos tienen datos (incluso cero si no hay derivaciones)
      const completeStats = referralTypes.map(type => ({
        referral_type: type,
        count: statsMap.get(type) || 0
      }));
      
      return {
        stats: completeStats,
        period: {
          start: format(startDate, 'dd/MM/yyyy'),
          end: format(endDate, 'dd/MM/yyyy')
        }
      };
    }
  });
}
