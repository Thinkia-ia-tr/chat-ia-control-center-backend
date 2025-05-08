
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Product {
  id: string;
  name: string;
  description?: string;
  keywords: string[];
  created_at: string;
}

export function useProductManagement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const getProducts = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_types")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "No se pudieron obtener los productos",
          variant: "destructive",
        });
        throw error;
      }

      return data as Product[];
    }
  });

  const addProduct = useMutation({
    mutationFn: async (product: { name: string; description?: string; keywords?: string[] }) => {
      const { data, error } = await supabase
        .from("product_types")
        .insert({
          name: product.name,
          description: product.description || null,
          keywords: product.keywords ? JSON.stringify(product.keywords) : []
        })
        .select();

      if (error) {
        console.error("Error adding product:", error);
        toast({
          title: "Error",
          description: "No se pudo agregar el producto",
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Producto agregado",
        description: `El producto ${product.name} ha sido agregado con éxito`,
      });

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product-stats"] });
    }
  });

  // Check for duplicates by name
  const checkDuplicateProduct = async (productName: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("product_types")
      .select("id")
      .eq("name", productName)
      .maybeSingle();

    if (error) {
      console.error("Error checking for duplicate product:", error);
      return false;
    }

    return !!data;
  };

  // Bulk add products
  const bulkAddProducts = useMutation({
    mutationFn: async (productNames: string[]) => {
      const results: { name: string; added: boolean; reason?: string }[] = [];
      const successfulAdditions: string[] = [];

      for (const name of productNames) {
        const trimmedName = name.trim();
        
        if (!trimmedName) {
          results.push({ name: trimmedName, added: false, reason: "Nombre vacío" });
          continue;
        }
        
        // Check for duplicates
        const isDuplicate = await checkDuplicateProduct(trimmedName);
        
        if (isDuplicate) {
          results.push({ name: trimmedName, added: false, reason: "Ya existe" });
          continue;
        }
        
        // Add the product
        try {
          const { error } = await supabase
            .from("product_types")
            .insert({
              name: trimmedName,
              keywords: []
            });
          
          if (error) {
            results.push({ name: trimmedName, added: false, reason: "Error en la base de datos" });
          } else {
            results.push({ name: trimmedName, added: true });
            successfulAdditions.push(trimmedName);
          }
        } catch (error) {
          results.push({ name: trimmedName, added: false, reason: "Error en la inserción" });
        }
      }

      if (successfulAdditions.length > 0) {
        toast({
          title: "Productos agregados",
          description: `Se agregaron ${successfulAdditions.length} productos con éxito`,
        });
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product-stats"] });
    }
  });

  return { 
    addProduct, 
    getProducts, 
    checkDuplicateProduct, 
    bulkAddProducts 
  };
}
