
export interface Conversation {
  id: string;
  title: string;
  user: string;
  channel: "Web" | "Whatsapp";
  messages: number;
  date: Date;
  status?: 'done' | 'in-progress';
}

