
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
        console.log("Fetching conversations with date range:", startDate, endDate);
        
        let query = supabase
          .from('conversations')
          .select('*');
        
        if (startDate && endDate) {
          // Make sure end dates include the full day
          const adjustedEndDate = new Date(endDate);
          adjustedEndDate.setHours(23, 59, 59, 999);
          
          console.log("Using date filters:", startDate.toISOString(), adjustedEndDate.toISOString());
          
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
        
        console.log("Conversations raw data:", data);
        
        // Return empty array if no data found
        if (!data || data.length === 0) {
          console.log("No conversations found");
          return [];
        }
        
        // Transform and normalize the data
        const processedData = data.map(item => {
          let clientData = item.client;
          
          // Ensure client is in the correct format
          if (typeof clientData === 'string') {
            try {
              clientData = JSON.parse(clientData);
            } catch (e) {
              clientData = { type: 'email', value: clientData };
            }
          } else if (!clientData) {
            clientData = { type: 'unknown', value: 'Sin cliente' };
          }
          
          return {
            ...item,
            client: clientData,
            date: new Date(item.date)
          };
        }) as Conversation[];
        
        console.log("Processed conversations:", processedData);
        return processedData;
      } catch (error) {
        console.error("Error in useConversations:", error);
        toast({
          title: "Error",
          description: "Ocurrió un error al cargar las conversaciones",
          variant: "destructive"
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false
  });
}
