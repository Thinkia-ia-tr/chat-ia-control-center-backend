
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { DIFY_CONFIG } from '@/config/dify';
import { supabase } from '@/integrations/supabase/client';

interface DifyConversation {
  id: string;
  name: string;
  status: string;
  created_at: number;
  updated_at: number;
  introduction?: string;
}

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

export function useDifySync() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const syncConversationsFromDify = async () => {
    setIsLoading(true);
    try {
      console.log('Iniciando sincronización con Dify...');
      
      // Obtener conversaciones de Dify
      const conversationsResponse = await fetch(
        `${DIFY_CONFIG.BASE_URL}/conversations`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${DIFY_CONFIG.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!conversationsResponse.ok) {
        throw new Error(`Error al obtener conversaciones: ${conversationsResponse.status}`);
      }

      const conversationsData = await conversationsResponse.json();
      const difyConversations: DifyConversation[] = conversationsData.data || [];

      console.log(`Encontradas ${difyConversations.length} conversaciones en Dify`);

      let conversationsUpdated = 0;
      let messagesUpdated = 0;

      // Procesar cada conversación
      for (const difyConv of difyConversations) {
        // Insertar o actualizar conversación en Supabase
        const { error: convError } = await supabase
          .from('conversations')
          .upsert({
            id: difyConv.id,
            title: difyConv.name || `Conversación ${difyConv.id.substring(0, 8)}`,
            channel: 'Web',
            client: { type: 'id', value: 'dify-user' },
            date: new Date(difyConv.created_at * 1000).toISOString(),
            messages: 0 // Se actualizará después
          }, {
            onConflict: 'id'
          });

        if (convError) {
          console.error(`Error al insertar conversación ${difyConv.id}:`, convError);
          continue;
        }

        conversationsUpdated++;

        // Obtener mensajes de esta conversación desde Dify
        try {
          const messagesResponse = await fetch(
            `${DIFY_CONFIG.BASE_URL}/messages?conversation_id=${difyConv.id}&user=dify-user`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${DIFY_CONFIG.API_KEY}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            const difyMessages: DifyMessage[] = messagesData.data || [];

            // Insertar mensajes en Supabase
            for (const difyMsg of difyMessages) {
              // Insertar pregunta del usuario
              if (difyMsg.query) {
                const { error: queryError } = await supabase
                  .from('messages')
                  .upsert({
                    id: `${difyMsg.id}-query`,
                    conversation_id: difyConv.id,
                    content: difyMsg.query,
                    sender: 'user',
                    timestamp: new Date(difyMsg.created_at * 1000).toISOString()
                  }, {
                    onConflict: 'id'
                  });

                if (!queryError) messagesUpdated++;
              }

              // Insertar respuesta del asistente
              if (difyMsg.answer) {
                const { error: answerError } = await supabase
                  .from('messages')
                  .upsert({
                    id: `${difyMsg.id}-answer`,
                    conversation_id: difyConv.id,
                    content: difyMsg.answer,
                    sender: 'assistant',
                    timestamp: new Date(difyMsg.created_at * 1000 + 1000).toISOString() // +1 segundo para mantener orden
                  }, {
                    onConflict: 'id'
                  });

                if (!answerError) messagesUpdated++;
              }
            }

            // Actualizar contador de mensajes en la conversación
            const { error: updateError } = await supabase
              .from('conversations')
              .update({ messages: difyMessages.length * 2 }) // query + answer
              .eq('id', difyConv.id);

            if (updateError) {
              console.error(`Error al actualizar contador de mensajes para ${difyConv.id}:`, updateError);
            }
          }
        } catch (msgError) {
          console.error(`Error al obtener mensajes para conversación ${difyConv.id}:`, msgError);
        }
      }

      toast({
        title: "Sincronización completada",
        description: `Se actualizaron ${conversationsUpdated} conversaciones y ${messagesUpdated} mensajes`,
      });

      console.log(`Sincronización completada: ${conversationsUpdated} conversaciones, ${messagesUpdated} mensajes`);
      
      return { conversationsUpdated, messagesUpdated };
    } catch (error) {
      console.error('Error en la sincronización:', error);
      toast({
        title: "Error en la sincronización",
        description: error instanceof Error ? error.message : "Error desconocido al sincronizar con Dify",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    syncConversationsFromDify
  };
}
