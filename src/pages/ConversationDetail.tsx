
import { useParams } from "react-router-dom";
import { ConversationDetail as ConversationDetailContent } from "@/components/conversations/ConversationDetail";
import Layout from "@/components/layout/Layout";
import { useConversationDetails } from "@/hooks/useConversationDetails";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ConversationDetailPage() {
  const { id = '' } = useParams();
  const { toast } = useToast();
  const { data, isError, isLoading } = useConversationDetails(id);
  
  if (isError) {
    toast({
      title: "Error",
      description: "No se pudo cargar la conversación",
      variant: "destructive"
    });
  }

  if (isLoading || !data) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">{data.conversation.title}</h1>
        <ConversationDetailContent 
          title={data.conversation.title}
          date={format(data.conversation.date, "EEE., d 'de' MMM. 'de' yyyy HH:mm", { locale: es })}
          messages={data.messages}
          conversation={data.conversation}
        />
      </div>
    </Layout>
  );
}
