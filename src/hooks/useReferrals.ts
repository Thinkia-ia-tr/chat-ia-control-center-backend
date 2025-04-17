
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Referral {
  id: string;
  conversation_id: string;
  conversation_title: string;
  client_type: string;
  client_value: string;
  referral_type: string;
  created_at: string;
  notes?: string;
}

export function useReferrals(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ['referrals', startDate, endDate],
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
      
      // Obtener las derivaciones con información de conversaciones y tipos
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          id,
          created_at,
          notes,
          conversation_id,
          referral_types (name),
          conversations (title, client)
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', adjustedEndDate.toISOString())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transformar los datos para tener una estructura más fácil de usar
      const referrals: Referral[] = data.map((item: any) => {
        const client = item.conversations?.client || {};
        
        return {
          id: item.id,
          conversation_id: item.conversation_id,
          conversation_title: item.conversations?.title || 'Sin título',
          client_type: client.type || '',
          client_value: client.value || '',
          referral_type: item.referral_types?.name || 'Desconocido',
          created_at: item.created_at,
          notes: item.notes
        };
      });
      
      return referrals;
    }
  });
}
