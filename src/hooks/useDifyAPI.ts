
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface DifySuggestedQuestionsResponse {
  data: string[];
}

export function useDifyAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchSuggestedQuestions = async (messageId: string, apiKey: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.dify.ai/v1/chat-messages/suggested-questions?message_id=${messageId}`,
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

      const data: DifySuggestedQuestionsResponse = await response.json();
      setSuggestedQuestions(data.data || []);
      
      toast({
        title: "Éxito",
        description: `Se encontraron ${data.data?.length || 0} preguntas sugeridas`,
      });

      return data.data;
    } catch (error) {
      console.error('Error fetching suggested questions:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al obtener las preguntas sugeridas",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSuggestedQuestions = () => {
    setSuggestedQuestions([]);
  };

  return {
    isLoading,
    suggestedQuestions,
    fetchSuggestedQuestions,
    clearSuggestedQuestions
  };
}
