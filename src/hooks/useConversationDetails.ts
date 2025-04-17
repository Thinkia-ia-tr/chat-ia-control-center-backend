
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation, Message } from "@/components/conversations/types";

export function useConversationDetails(conversationId: string) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      // Fetch the conversation details
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      
      if (conversationError) throw conversationError;
      
      // Fetch the messages for this conversation
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });
      
      if (messagesError) throw messagesError;
      
      return {
        conversation: {
          ...conversation,
          date: new Date(conversation.date)
        } as Conversation,
        messages: messages as Message[]
      };
    },
    enabled: !!conversationId
  });
}
