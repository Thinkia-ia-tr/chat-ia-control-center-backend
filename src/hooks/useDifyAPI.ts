
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface DifyMessage {
  id: string;
  conversation_id: string;
  inputs: Record<string, any>;
  query: string;
  answer: string;
  message_files: any[];
  feedback: any;
  retriever_resources: any[];
  created_at: number;
}

interface DifyMessagesResponse {
  data: DifyMessage[];
  has_more: boolean;
  limit: number;
}

export function useDifyAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [conversationMessages, setConversationMessages] = useState<DifyMessage[]>([]);
  const { toast } = useToast();

  const fetchConversationMessages = async (conversationId: string, userId: string, apiKey: string) => {
    setIsLoading(true);
    try {
      const url = `https://api.dify.ai/v1/messages?conversation_id=${conversationId}&user=${userId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: DifyMessagesResponse = await response.json();
      setConversationMessages(data.data || []);
      
      toast({
        title: "Éxito",
        description: `Se encontraron ${data.data?.length || 0} mensajes en la conversación`,
      });

      return data.data;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al obtener los mensajes de la conversación",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversationMessages = () => {
    setConversationMessages([]);
  };

  return {
    isLoading,
    conversationMessages,
    fetchConversationMessages,
    clearConversationMessages
  };
}
