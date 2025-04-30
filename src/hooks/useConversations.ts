
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation } from "@/components/conversations/types";
import { useToast } from "@/components/ui/use-toast";

export function useConversations(startDate?: Date, endDate?: Date) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['conversations', startDate, endDate],
    queryFn: async () => {
      try {
        let query = supabase
          .from('conversations')
          .select('*');
        
        if (startDate && endDate) {
          // Aseguramos que las fechas de fin incluyan todo el día
          const adjustedEndDate = new Date(endDate);
          adjustedEndDate.setHours(23, 59, 59, 999);
          
          query = query.gte('date', startDate.toISOString())
                      .lte('date', adjustedEndDate.toISOString());
        }
        
        const { data, error } = await query.order('date', { ascending: false });
        
        if (error) {
          console.error("Error fetching conversations:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar las conversaciones",
            variant: "destructive"
          });
          throw error;
        }
        
        if (!data) return [];
        
        // Transformar la fecha string a objeto Date
        return data.map(item => ({
          ...item,
          date: new Date(item.date)
        })) as Conversation[];
      } catch (error) {
        console.error("Error in useConversations:", error);
        toast({
          title: "Error",
          description: "Ocurrió un error al cargar las conversaciones",
          variant: "destructive"
        });
        throw error;
      }
    }
  });
}
