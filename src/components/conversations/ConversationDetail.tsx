
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
  title = "Tema de la conversación",
  date = "lun., 2 de sep. de 2024 10:15",
  messages = [
    {
      id: "1",
      sender: "user",
      content: `{
  "@vite/client": "^4.0.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.2",
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.1",
    "@eslint-plugin-react-hooks": "^4.6.2",
    "@eslint-plugin-react-refresh": "^3.5.0",
    "vite": "^5.3.4"
  }
}`,
      timestamp: "lun., 2 de sep. de 2024 10:16",
      senderName: "Anonymous"
    },
    {
      id: "2",
      sender: "agent",
      content: "¡Todo parece estar correctamente configurado en tu archivo package.json! ¿Hay algo más en lo que pueda ayudarte con tu proyecto de red social frontend?",
      timestamp: "lun., 2 de sep. de 2024 10:15"
    },
    {
      id: "3",
      sender: "user",
      content: `me sale este error $ npm run dev
npm error Missing script: "dev"
npm error 
npm error To see a list of scripts, run:
npm error   npm run
npm error   npm run To see a list of scripts, run:
npm error   npm error  A complete log of this run can be found in: C:\\Users\\tatio\\AppData\\Local\\npm-cache_logs\\2024-09-02T08_07.06-debug-0.log`,
      timestamp: "lun., 2 de sep. de 2024 10:17",
      senderName: "Anonymous"
    },
    {
      id: "4",
      sender: "agent",
      content: "Parece que el script \"dev\" no se está reconociendo. ¿Podrías verificar que estás en el directorio correcto donde se encuentra tu archivo package.json y que no haya errores de escritura en el nombre del script en el archivo package.json?",
      timestamp: "lun., 2 de sep. de 2024 10:17"
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
