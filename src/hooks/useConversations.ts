
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation } from "@/components/conversations/types";

export function useConversations(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ['conversations', startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('conversations')
        .select('*');
      
      if (startDate && endDate) {
        query = query.gte('date', startDate.toISOString())
                    .lte('date', endDate.toISOString());
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) throw error;
      
      // Convert string dates to Date objects and ensure client is in new format
      return data.map(item => ({
        ...item,
        date: new Date(item.date),
        client: typeof item.client === 'string' 
          ? { type: 'email', value: item.client } 
          : item.client
      })) as Conversation[];
    }
  });
}
