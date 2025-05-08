
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductStat {
  product_id: string;
  product_name: string;
  mention_count: number;
}

export function useProductStats(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ['product-stats', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      // Default to last 30 days if dates are not provided
      const start = startDate || new Date(new Date().setDate(new Date().getDate() - 30));
      const end = endDate || new Date();

      console.log("Fetching product stats with date range:", 
        start.toISOString(), 
        end.toISOString()
      );

      const { data, error } = await supabase.rpc(
        'get_product_stats', 
        { 
          start_date: start.toISOString(),
          end_date: end.toISOString()
        }
      );

      if (error) {
        console.error("Error fetching product stats:", error);
        throw error;
      }

      console.log("Received product stats:", data);
      return data as ProductStat[];
    },
    refetchOnWindowFocus: false,
  });
}
