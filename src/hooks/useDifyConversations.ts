
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface DifyConversation {
  id: string;
  name: string;
  status: string;
  created_at: number;
  updated_at: number;
  introduction?: string;
}

interface DifyConversationsResponse {
  data: DifyConversation[];
  has_more: boolean;
  limit: number;
  page: number;
}

export function useDifyConversations() {
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<DifyConversation[]>([]);
  const { toast } = useToast();

  const fetchDifyConversations = async (apiKey: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://api.dify.ai/v1/conversations',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: DifyConversationsResponse = await response.json();
      setConversations(data.data || []);
      
      toast({
        title: "Éxito",
        description: `Se encontraron ${data.data?.length || 0} conversaciones de Dify`,
      });

      return data.data;
    } catch (error) {
      console.error('Error fetching Dify conversations:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al obtener las conversaciones de Dify",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversations = () => {
    setConversations([]);
  };

  return {
    isLoading,
    conversations,
    fetchDifyConversations,
    clearConversations
  };
}
