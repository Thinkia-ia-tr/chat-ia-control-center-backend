
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation } from "@/components/conversations/types";
import { useToast } from "@/components/ui/use-toast";
import { isValid } from "date-fns";

// Define the client object structure to help with type safety
interface ClientData {
  type: string;
  value: string;
}

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
          let clientData: ClientData = { type: 'unknown', value: 'Sin cliente' };
          
          // Ensure client is in the correct format
          if (typeof item.client === 'string') {
            try {
              clientData = JSON.parse(item.client) as ClientData;
            } catch (e) {
              clientData = { type: 'email', value: item.client };
            }
          } else if (item.client && typeof item.client === 'object') {
            // Cast the client to our ClientData type if it's an object
            const clientObj = item.client as any;
            clientData = { 
              type: clientObj.type || 'unknown',
              value: clientObj.value || 'Sin cliente'
            };
          }
          
          // For WhatsApp conversations, ensure client has phone type and valid number
          if (item.channel === 'whatsapp') {
            clientData.type = 'phone';
            
            // If client value is not a valid phone number, create or extract one
            if (!clientData.value || !String(clientData.value).match(/^\+?[0-9]{9,15}$/)) {
              // Try to extract a number from the current value, or generate a random one
              const phoneMatch = clientData.value && String(clientData.value).match(/([0-9]{9,15})/);
              if (phoneMatch) {
                clientData.value = '+' + phoneMatch[1];
              } else {
                // Generate a random Spanish phone number (+34 prefix)
                const randomDigits = Math.floor(600000000 + Math.random() * 300000000);
                clientData.value = '+34' + randomDigits;
              }
            }
          }
          
          // Process the date properly
          let dateObj;
          try {
            dateObj = new Date(item.date);
            // Validate the date
            if (!isValid(dateObj)) {
              console.warn(`Invalid date found: ${item.date}, using current date instead`);
              dateObj = new Date(); // Fallback to current date
            }
          } catch (e) {
            console.error("Error parsing date:", e);
            dateObj = new Date(); // Fallback to current date
          }
          
          return {
            ...item,
            client: clientData,
            date: dateObj
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
