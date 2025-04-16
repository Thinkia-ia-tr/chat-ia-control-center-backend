
export interface Conversation {
  id: string;
  title: string;
  client: string;
  channel: "Web" | "Whatsapp";
  messages: number;
  date: Date;
  status?: 'done' | 'in-progress';
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender: "user" | "agent" | "system";
  sender_name?: string | null;
  timestamp: string;
}
