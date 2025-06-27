
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
      console.log('=== INICIANDO SINCRONIZACIÓN CON DIFY ===');
      console.log('URL de API:', `${DIFY_CONFIG.BASE_URL}/conversations`);
      console.log('API Key configurada:', DIFY_CONFIG.API_KEY ? 'Sí' : 'No');
      console.log('Primeros caracteres de API Key:', DIFY_CONFIG.API_KEY.substring(0, 8));
      
      // Verificar configuración
      if (!DIFY_CONFIG.API_KEY || !DIFY_CONFIG.BASE_URL) {
        throw new Error('Configuración de Dify incompleta. Verifica API_KEY y BASE_URL en la configuración.');
      }

      // Obtener conversaciones de Dify con más detalles de debug
      console.log('Realizando petición a Dify...');
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

      console.log('Status de respuesta:', conversationsResponse.status);
      console.log('Headers de respuesta:', Object.fromEntries(conversationsResponse.headers.entries()));
      
      if (!conversationsResponse.ok) {
        const errorText = await conversationsResponse.text();
        console.error('Respuesta de error completa:', errorText);
        
        let errorMessage = `Error ${conversationsResponse.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage += `: ${errorJson.message || errorJson.error || errorText}`;
        } catch {
          errorMessage += `: ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }

      const conversationsData: DifyConversationsResponse = await conversationsResponse.json();
      console.log('Respuesta completa de Dify:', JSON.stringify(conversationsData, null, 2));
      
      const difyConversations = conversationsData.data || [];
      console.log(`Conversaciones encontradas: ${difyConversations.length}`);

      if (difyConversations.length === 0) {
        console.warn('No se encontraron conversaciones en Dify');
        toast({
          title: "Sin conversaciones",
          description: "No se encontraron conversaciones en tu instancia de Dify. Asegúrate de que existan conversaciones y que tu API key tenga los permisos correctos.",
          variant: "destructive"
        });
        return { conversationsUpdated: 0, messagesUpdated: 0 };
      }

      let conversationsUpdated = 0;
      let messagesUpdated = 0;

      // Procesar cada conversación
      for (const difyConv of difyConversations) {
        console.log(`\n--- Procesando conversación ${difyConv.id} ---`);
        console.log('Nombre:', difyConv.name);
        console.log('Estado:', difyConv.status);
        console.log('Creada:', new Date(difyConv.created_at * 1000).toISOString());
        
        try {
          // Insertar o actualizar conversación en Supabase
          const conversationData = {
            id: difyConv.id, // Ahora es TEXT, no UUID
            title: difyConv.name || `Conversación ${difyConv.id.substring(0, 8)}`,
            channel: 'Dify',
            client: { type: 'id', value: 'dify-user' },
            date: new Date(difyConv.created_at * 1000).toISOString(),
            messages: 0 // Se actualizará después
          };

          console.log('Insertando conversación en Supabase:', conversationData);
          
          const { error: convError } = await supabase
            .from('conversations')
            .upsert(conversationData, {
              onConflict: 'id'
            });

          if (convError) {
            console.error(`Error al insertar conversación ${difyConv.id}:`, convError);
            continue;
          }

          conversationsUpdated++;
          console.log(`✓ Conversación ${difyConv.id} insertada correctamente`);

          // Obtener mensajes de esta conversación desde Dify
          console.log(`Obteniendo mensajes para conversación ${difyConv.id}...`);
          
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

            console.log(`Mensajes encontrados: ${difyMessages.length}`);

            let conversationMessageCount = 0;

            // Insertar mensajes en Supabase
            for (const difyMsg of difyMessages) {
              console.log(`  Procesando mensaje ${difyMsg.id}`);
              
              // Insertar pregunta del usuario si existe
              if (difyMsg.query && difyMsg.query.trim()) {
                const queryMessage = {
                  id: `${difyMsg.id}-query`, // Ahora es TEXT, no UUID
                  conversation_id: difyConv.id, // Ahora es TEXT, no UUID
                  content: difyMsg.query.trim(),
                  sender: 'user',
                  timestamp: new Date(difyMsg.created_at * 1000).toISOString()
                };

                const { error: queryError } = await supabase
                  .from('messages')
                  .upsert(queryMessage, {
                    onConflict: 'id'
                  });

                if (!queryError) {
                  messagesUpdated++;
                  conversationMessageCount++;
                  console.log(`    ✓ Query insertada: ${difyMsg.query.substring(0, 50)}...`);
                } else {
                  console.error(`    ✗ Error al insertar query:`, queryError);
                }
              }

              // Insertar respuesta del asistente si existe
              if (difyMsg.answer && difyMsg.answer.trim()) {
                const answerMessage = {
                  id: `${difyMsg.id}-answer`, // Ahora es TEXT, no UUID
                  conversation_id: difyConv.id, // Ahora es TEXT, no UUID
                  content: difyMsg.answer.trim(),
                  sender: 'assistant',
                  timestamp: new Date(difyMsg.created_at * 1000 + 1000).toISOString() // +1 segundo
                };

                const { error: answerError } = await supabase
                  .from('messages')
                  .upsert(answerMessage, {
                    onConflict: 'id'
                  });

                if (!answerError) {
                  messagesUpdated++;
                  conversationMessageCount++;
                  console.log(`    ✓ Respuesta insertada: ${difyMsg.answer.substring(0, 50)}...`);
                } else {
                  console.error(`    ✗ Error al insertar respuesta:`, answerError);
                }
              }
            }

            // Actualizar contador de mensajes en la conversación
            const { error: updateError } = await supabase
              .from('conversations')
              .update({ messages: conversationMessageCount })
              .eq('id', difyConv.id);

            if (updateError) {
              console.error(`Error al actualizar contador de mensajes:`, updateError);
            } else {
              console.log(`✓ Contador de mensajes actualizado: ${conversationMessageCount}`);
            }
          } else {
            const errorText = await messagesResponse.text();
            console.error(`Error al obtener mensajes para ${difyConv.id}:`, messagesResponse.status, errorText);
          }
        } catch (error) {
          console.error(`Error procesando conversación ${difyConv.id}:`, error);
        }
      }

      console.log('\n=== SINCRONIZACIÓN COMPLETADA ===');
      console.log(`Conversaciones procesadas: ${conversationsUpdated}`);
      console.log(`Mensajes procesados: ${messagesUpdated}`);

      toast({
        title: "Sincronización completada",
        description: `Se procesaron ${conversationsUpdated} conversaciones y ${messagesUpdated} mensajes desde Dify`,
      });

      return { conversationsUpdated, messagesUpdated };
    } catch (error) {
      console.error('=== ERROR EN LA SINCRONIZACIÓN ===');
      console.error('Tipo de error:', error?.constructor?.name);
      console.error('Mensaje de error:', error instanceof Error ? error.message : String(error));
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No disponible');
      
      let errorMessage = 'Error desconocido al sincronizar con Dify';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error en la sincronización",
        description: errorMessage,
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
