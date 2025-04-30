
import { useParams } from "react-router-dom";
import { ConversationDetail as ConversationDetailContent } from "@/components/conversations/ConversationDetail";
import Layout from "@/components/layout/Layout";
import { useConversationDetails } from "@/hooks/useConversationDetails";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2 } from "lucide-react";

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

  return (
    <Layout>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg">Cargando conversación...</p>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">{data.conversation.title}</h1>
          <ConversationDetailContent 
            title={data.conversation.title}
            date={format(data.conversation.date, "EEE., d 'de' MMM. 'de' yyyy HH:mm", { locale: es })}
            messages={data.messages}
            conversation={data.conversation}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-xl font-medium mb-2">Conversación no encontrada</h1>
          <p className="text-muted-foreground">La conversación que estás buscando no existe o ha sido eliminada.</p>
        </div>
      )}
    </Layout>
  );
}
