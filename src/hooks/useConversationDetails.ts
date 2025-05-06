
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation, Message } from "@/components/conversations/types";
import { useToast } from "@/components/ui/use-toast";

// Función para validar y formatear datos de cliente
const validateClientData = (client: any): { type: string; value: string } => {
  let clientData = { type: 'id', value: 'Sin cliente' };
  
  if (!client) return clientData;
  
  // Convertir string a objeto si es necesario
  if (typeof client === 'string') {
    try {
      clientData = JSON.parse(client);
    } catch (e) {
      clientData = { type: 'id', value: client };
    }
  } 
  // Si ya es un objeto
  else if (typeof client === 'object') {
    const clientObj = client as any;
    
    if (clientObj.value) {
      clientData = { 
        type: clientObj.type || 'id',
        value: clientObj.value.toString() 
      };
    } else if (typeof clientObj === 'object' && Object.keys(clientObj).length > 0) {
      // Intentar obtener cualquier valor del objeto
      const firstKey = Object.keys(clientObj)[0];
      clientData = { 
        type: 'id', 
        value: clientObj[firstKey]?.toString() || 'Sin cliente'
      };
    }
  }
  
  // Validación básica según el tipo, pero el formato ya lo maneja el backend
  if (clientData.type === 'id') {
    // Validar formato UUID para tipo 'id'
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidPattern.test(clientData.value)) {
      console.warn(`Client ID with invalid UUID format: ${clientData.value}`);
    }
  } 
  else if (clientData.type === 'phone') {
    // Solo verificar que tenga el formato esperado pero no modificarlo
    // ya que el backend se encarga de esto mediante la función validate_client_format
    if (!clientData.value.startsWith('+34 ')) {
      console.warn(`Phone number without expected format: ${clientData.value}`);
    }
  }
  
  return clientData;
};

export function useConversationDetails(conversationId: string) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      try {
        // Fetch the conversation details
        const { data: conversation, error: conversationError } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single();
        
        if (conversationError) {
          console.error("Error fetching conversation:", conversationError);
          toast({
            title: "Error",
            description: "No se pudo cargar la conversación",
            variant: "destructive"
          });
          throw conversationError;
        }
        
        // Fetch the messages for this conversation
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('timestamp', { ascending: true });
        
        if (messagesError) {
          console.error("Error fetching messages:", messagesError);
          toast({
            title: "Error",
            description: "No se pudieron cargar los mensajes",
            variant: "destructive"
          });
          throw messagesError;
        }

        // Validar y formatear los datos del cliente
        const validatedClient = validateClientData(conversation.client);
        
        return {
          conversation: {
            ...conversation,
            date: new Date(conversation.date),
            client: validatedClient
          } as Conversation,
          messages: messages as Message[]
        };
      } catch (error) {
        console.error("Error in useConversationDetails:", error);
        throw error;
      }
    },
    enabled: !!conversationId
  });
}
