
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
          
          // Parse client data based on its type
          if (item.client) {
            // If client is a string, try to parse it as JSON
            if (typeof item.client === 'string') {
              try {
                clientData = JSON.parse(item.client) as ClientData;
              } catch (e) {
                clientData = { type: 'email', value: item.client };
              }
            } 
            // If client is already an object
            else if (typeof item.client === 'object') {
              const clientObj = item.client as any;
              
              if (clientObj.type && clientObj.value) {
                clientData = { 
                  type: clientObj.type,
                  value: clientObj.value.toString()
                };
              } else if (clientObj.value) {
                clientData = { 
                  type: 'unknown', 
                  value: clientObj.value.toString() 
                };
              } else if (typeof clientObj === 'object' && Object.keys(clientObj).length > 0) {
                // Try to get any value from the object
                const firstKey = Object.keys(clientObj)[0];
                clientData = { 
                  type: 'unknown', 
                  value: clientObj[firstKey]?.toString() || 'Sin cliente'
                };
              }
            }
          }

          // For WhatsApp conversations, client should always be phone type
          // The database has been updated to ensure this, but we double-check here
          if (item.channel === 'whatsapp') {
            if (clientData.type !== 'phone') {
              clientData.type = 'phone';
            }
              
            // Validate phone number format (should already be fixed in database)
            if (!clientData.value.match(/^\+?[0-9]{9,15}$/)) {
              console.warn(`Invalid phone number format for WhatsApp conversation: ${clientData.value}`);
              
              // This is just a fallback in case our database migration missed something
              const phoneMatch = clientData.value.match(/([0-9]{9,15})/);
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
