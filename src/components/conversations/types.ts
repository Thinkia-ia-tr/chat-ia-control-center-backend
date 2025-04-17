
export interface Conversation {
  id: string;
  title: string;
  client: { 
    type: 'phone' | 'email' | 'id', 
    value: string 
  };
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
  timestamp: string;
}
