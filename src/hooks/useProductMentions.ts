
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductMention {
  id: string;
  product_id: string;
  product_name: string;
  conversation_id: string;
  conversation_title: string;
  context: string;
  created_at: Date;
}

export function useProductMentions(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ['product-mentions', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      // Default to last 30 days if dates are not provided
      const start = startDate || new Date(new Date().setDate(new Date().getDate() - 30));
      const end = endDate || new Date();

      console.log("Fetching product mentions with date range:", 
        start.toISOString(), 
        end.toISOString()
      );

      const { data, error } = await supabase
        .from('product_mentions')
        .select(`
          id,
          product_id,
          context,
          created_at,
          conversation_id,
          product_types(name),
          conversations(title, date)
        `)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching product mentions:", error);
        throw error;
      }

      console.log("Received product mentions:", data);
      
      // Transform the data to match the ProductMention interface
      const mentions: ProductMention[] = data.map(item => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_types?.name || 'Desconocido',
        conversation_id: item.conversation_id,
        conversation_title: item.conversations?.title || 'Sin título',
        context: item.context || '',
        created_at: new Date(item.created_at)
      }));

      return mentions;
    },
    refetchOnWindowFocus: false,
  });
}
