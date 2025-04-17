
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatISO, eachDayOfInterval, format } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type ReferralType = Database['public']['Enums']['referral_type'];

export function useReferralTimeSeries(startDate?: Date, endDate?: Date, referralType?: ReferralType) {
  return useQuery({
    queryKey: ['referral-timeseries', startDate, endDate, referralType],
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
      
      // Preparar query base
      let query = supabase
        .from('referrals')
        .select(`
          created_at,
          referral_types (name)
        `)
        .gte('created_at', formatISO(startDate))
        .lte('created_at', formatISO(adjustedEndDate));
      
      // Filtrar por tipo de derivación si se proporciona
      if (referralType) {
        query = query.eq('referral_types.name', referralType);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Generar array con todos los días del intervalo
      const allDays = eachDayOfInterval({ 
        start: startDate,
        end: endDate
      });
      
      // Inicializar mapa para contar derivaciones por día y tipo
      const dailyCounts: Record<string, Record<string, number>> = {};
      
      // Preparar el mapa con todos los días
      allDays.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        dailyCounts[dateStr] = {};
      });
      
      // Contar derivaciones por día y tipo
      data?.forEach((referral: any) => {
        const date = new Date(referral.created_at);
        const dateStr = format(date, 'yyyy-MM-dd');
        const typeName = referral.referral_types?.name || 'Unknown';
        
        if (!dailyCounts[dateStr]) {
          dailyCounts[dateStr] = {};
        }
        
        if (!dailyCounts[dateStr][typeName]) {
          dailyCounts[dateStr][typeName] = 0;
        }
        
        dailyCounts[dateStr][typeName]++;
      });

      // Si se solicita un tipo específico, devolver solo ese tipo
      if (referralType) {
        return Object.entries(dailyCounts).map(([date, types]) => ({
          date,
          value: types[referralType] || 0
        })).sort((a, b) => a.date.localeCompare(b.date));
      }
      
      // Construir series temporales por tipo de derivación
      const referralTypes: ReferralType[] = ['Asesor Comercial', 'Atención al Cliente', 'Soporte Técnico', 'Presupuestos', 'Colaboraciones'];
      const timeSeriesByType: Record<string, {date: string, value: number}[]> = {};
      
      referralTypes.forEach(type => {
        timeSeriesByType[type] = Object.entries(dailyCounts).map(([date, types]) => ({
          date,
          value: types[type] || 0
        })).sort((a, b) => a.date.localeCompare(b.date));
      });
      
      return { timeSeriesByType };
    }
  });
}
