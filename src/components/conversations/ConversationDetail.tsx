
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Message, Conversation } from "./types";

interface ConversationDetailProps {
  title: string;
  date: string;
  messages: Message[];
  conversation: Conversation;
}

export function ConversationDetail({
  title,
  date,
  messages = [],
  conversation
}: ConversationDetailProps) {
  const navigate = useNavigate();

  const handleBackToList = () => {
    navigate("/conversaciones");
  };

  // Function to get the appropriate sender name
  const getSenderName = (message: Message) => {
    if (message.sender === "user") {
      // If sender is user, use client value from conversation if available
      if (conversation?.client?.value) {
        return conversation.client.value.toString();
      }
      return message.sender_name || "Usuario";
    }
    // For agent or system messages
    return message.sender === "agent" ? "Agent" : "Sistema";
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
            <Badge variant="outline" className="mt-1">
              {conversation?.client?.value ? conversation.client.value.toString() : "Anonymous"}
            </Badge>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">Mensajes</span>
            <Badge variant="outline" className="mt-1">{messages.length}</Badge>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">Canal</span>
            <Badge variant="outline" className="mt-1">{conversation?.channel || "Web"}</Badge>
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
                    {getSenderName(message)}
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
