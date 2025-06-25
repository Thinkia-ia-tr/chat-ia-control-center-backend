
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

interface DifyConversationsResponse {
  data: DifyConversation[];
  has_more: boolean;
  limit: number;
}

interface DifyMessagesResponse {
  data: DifyMessage[];
  has_more: boolean;
  limit: number;
}

export function useDifySync() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const syncConversationsFromDify = async () => {
    setIsLoading(true);
    try {
      console.log('Iniciando sincronización con Dify...');
      console.log('URL de API:', `${DIFY_CONFIG.BASE_URL}/conversations`);
      console.log('API Key (últimos 4 caracteres):', DIFY_CONFIG.API_KEY.slice(-4));
      
      // Obtener conversaciones de Dify
      const conversationsResponse = await fetch(
        `${DIFY_CONFIG.BASE_URL}/conversations?limit=100`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${DIFY_CONFIG.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Status de respuesta de conversaciones:', conversationsResponse.status);
      
      if (!conversationsResponse.ok) {
        const errorText = await conversationsResponse.text();
        console.error('Error response:', errorText);
        throw new Error(`Error al obtener conversaciones: ${conversationsResponse.status} - ${errorText}`);
      }

      const conversationsData: DifyConversationsResponse = await conversationsResponse.json();
      const difyConversations = conversationsData.data || [];

      console.log('Respuesta completa de Dify:', conversationsData);
      console.log(`Encontradas ${difyConversations.length} conversaciones en Dify`);

      if (difyConversations.length === 0) {
        toast({
          title: "Sin conversaciones",
          description: "No se encontraron conversaciones en Dify. Verifica que existan conversaciones en tu instancia de Dify y que la API key tenga los permisos correctos.",
          variant: "destructive"
        });
        return { conversationsUpdated: 0, messagesUpdated: 0 };
      }

      let conversationsUpdated = 0;
      let messagesUpdated = 0;

      // Procesar cada conversación
      for (const difyConv of difyConversations) {
        console.log(`Procesando conversación: ${difyConv.id} - ${difyConv.name}`);
        
        // Insertar o actualizar conversación en Supabase
        const { error: convError } = await supabase
          .from('conversations')
          .upsert({
            id: difyConv.id,
            title: difyConv.name || `Conversación ${difyConv.id.substring(0, 8)}`,
            channel: 'Dify',
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
          console.log(`Obteniendo mensajes para conversación ${difyConv.id}`);
          
          const messagesResponse = await fetch(
            `${DIFY_CONFIG.BASE_URL}/messages?conversation_id=${difyConv.id}&limit=100`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${DIFY_CONFIG.API_KEY}`,
                'Content-Type': 'application/json',
              },
            }
          );

          console.log(`Status de mensajes para ${difyConv.id}:`, messagesResponse.status);

          if (messagesResponse.ok) {
            const messagesData: DifyMessagesResponse = await messagesResponse.json();
            const difyMessages = messagesData.data || [];

            console.log(`Encontrados ${difyMessages.length} mensajes para conversación ${difyConv.id}`);

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
                else console.error(`Error al insertar query ${difyMsg.id}:`, queryError);
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
                else console.error(`Error al insertar answer ${difyMsg.id}:`, answerError);
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
          } else {
            const errorText = await messagesResponse.text();
            console.error(`Error al obtener mensajes para conversación ${difyConv.id}:`, messagesResponse.status, errorText);
          }
        } catch (msgError) {
          console.error(`Error al procesar mensajes para conversación ${difyConv.id}:`, msgError);
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
