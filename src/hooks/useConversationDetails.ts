
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation, Message } from "@/components/conversations/types";
import { useToast } from "@/components/ui/use-toast";

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
        
        return {
          conversation: {
            ...conversation,
            date: new Date(conversation.date)
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
