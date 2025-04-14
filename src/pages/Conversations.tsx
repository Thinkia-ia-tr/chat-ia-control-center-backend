
import { ConversationsList } from "@/components/conversations/ConversationsList";
import Layout from "@/components/layout/Layout";

export default function ConversationsPage() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Historial de conversaciones</h1>
        <ConversationsList />
      </div>
    </Layout>
  );
}
