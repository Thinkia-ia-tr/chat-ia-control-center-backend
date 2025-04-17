import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  sender: "user" | "agent" | "system";
  content: string;
  timestamp: string;
  senderName?: string;
}

interface ConversationDetailProps {
  title: string;
  date: string;
  messages: Message[];
}

export function ConversationDetail({
  title = "Consulta sobre banco de pesas",
  date = "lun., 2 de sep. de 2024 10:15",
  messages = [
    {
      id: "1",
      sender: "user",
      content: "Hola, estoy interesado en comprar un banco de pesas ajustable. ¿Qué características debería tener para hacer tanto press de banca como press inclinado?",
      timestamp: "lun., 2 de sep. de 2024 10:16",
      senderName: "Anonymous"
    },
    {
      id: "2",
      sender: "agent",
      content: "¡Hola! Un buen banco de pesas ajustable debería tener múltiples posiciones de inclinación (plano, inclinado y declinado), capacidad de peso de al menos 300kg, acolchado resistente y soportes para barras seguros. ¿Tienes algún espacio o presupuesto específico en mente?",
      timestamp: "lun., 2 de sep. de 2024 10:17"
    },
    {
      id: "3",
      sender: "user",
      content: "Tengo un presupuesto de unos 200€ y un espacio de aproximadamente 1,5m x 2m. ¿Me recomendarías algún modelo específico que sea plegable para ahorrar espacio?",
      timestamp: "lun., 2 de sep. de 2024 10:18",
      senderName: "Anonymous"
    },
    {
      id: "4",
      sender: "agent",
      content: "Para ese presupuesto y espacio, te recomendaría el modelo FitStrength Pro 500 que es plegable y tiene todas las posiciones de inclinación necesarias. Soporta hasta 320kg y viene con soportes para barra incluidos. Además, plegado ocupa solo 0,5m x 1,2m, ideal para espacios reducidos.",
      timestamp: "lun., 2 de sep. de 2024 10:19"
    }
  ]
}: ConversationDetailProps) {
  const navigate = useNavigate();

  const handleBackToList = () => {
    navigate("/conversaciones");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBackToList}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a conversaciones
        </Button>
      </div>

      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold mb-1">{title}</h2>
          <div className="text-sm text-muted-foreground">{date}</div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">Usuario</span>
            <Badge variant="outline" className="mt-1">Anonymous</Badge>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">Mensajes</span>
            <Badge variant="outline" className="mt-1">{messages.length}</Badge>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">Canal</span>
            <Badge variant="outline" className="mt-1">Web</Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex gap-4", 
              message.sender === "agent" && "flex-row-reverse"
            )}
          >
            <Avatar className="rounded-full h-8 w-8">
              <AvatarFallback>
                {message.sender === "user" ? "U" : "A"}
              </AvatarFallback>
            </Avatar>
            <Card className={cn("max-w-[85%]", 
              message.sender === "agent" && "bg-muted",
              message.sender === "user" && "bg-card"
            )}>
              <CardContent className="px-4 py-3">
                <div className="flex items-center mb-2">
                  <span className="font-medium text-sm">
                    {message.sender === "user" ? message.senderName || "Usuario" : "Agent"}
                  </span>
                  <span className="text-xs ml-2 text-muted-foreground">{message.timestamp}</span>
                </div>
                <div className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBackToList}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a conversaciones
        </Button>
      </div>
    </div>
  );
}

export default ConversationDetail;
