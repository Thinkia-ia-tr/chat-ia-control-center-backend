
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

// These should match the allowed channel values in the database
const VALID_CHANNELS = ['web', 'Web', 'email', 'sms', 'chat', 'call', 'whatsapp_api'];

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
          let clientData: ClientData = { type: 'id', value: 'Sin cliente' };
          
          // Parse client data based on its type
          if (item.client) {
            // If client is a string, try to parse it as JSON
            if (typeof item.client === 'string') {
              try {
                clientData = JSON.parse(item.client) as ClientData;
                // Always set type to 'id' regardless of what it was before
                clientData.type = 'id';
              } catch (e) {
                clientData = { type: 'id', value: item.client };
              }
            } 
            // If client is already an object
            else if (typeof item.client === 'object') {
              const clientObj = item.client as any;
              
              if (clientObj.value) {
                clientData = { 
                  type: 'id',
                  value: clientObj.value.toString() 
                };
              } else if (typeof clientObj === 'object' && Object.keys(clientObj).length > 0) {
                // Try to get any value from the object
                const firstKey = Object.keys(clientObj)[0];
                clientData = { 
                  type: 'id', 
                  value: clientObj[firstKey]?.toString() || 'Sin cliente'
                };
              }
            }
          }

          // Normalize channel value - ensure it's properly handled
          let normalizedChannel = item.channel;
          
          // Handle special cases for channel normalization
          if (normalizedChannel && normalizedChannel.toLowerCase() === 'whatsapp') {
            normalizedChannel = 'whatsapp_api'; // Map 'whatsapp' to 'whatsapp_api'
          }
          
          // Always set client type to 'id'
          clientData.type = 'id';
          
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
            channel: normalizedChannel, // Use the normalized channel value
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
