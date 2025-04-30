
export type Conversation = {
  id: string;
  client: { type: string; value: string };
  messages: number;
  date: Date;
  channel: string;
  title: string;
}

export type Message = {
  id: string;
  conversation_id: string;
  content: string;
  sender: "client" | "agent" | "system";
  timestamp: string;
}
