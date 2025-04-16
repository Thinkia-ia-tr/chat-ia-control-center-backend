
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Conversation } from "@/components/conversations/types";

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender: "user" | "agent" | "system";
  sender_name?: string | null;
  timestamp: string;
}

export function useConversationDetails(conversationId: string) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      // Fetch conversation details
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (conversationError) throw conversationError;

      // Fetch messages
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
    }
  });
}
