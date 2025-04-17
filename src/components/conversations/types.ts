
export type Conversation = {
  id: string;
  client: { type: string; value: string };
  messages: number;
  date: Date;
  channel: string;
  title: string;
}
