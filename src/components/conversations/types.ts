
export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender: "client" | "agent" | "system";
  timestamp: string;
}
