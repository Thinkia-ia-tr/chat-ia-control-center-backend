
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User, Bot } from 'lucide-react';

interface DifyMessage {
  id: string;
  conversation_id: string;
  inputs: Record<string, any>;
  query: string;
  answer: string;
  message_files: any[];
  feedback: any;
  retriever_resources: any[];
  created_at: number;
}

interface DifyConversationMessagesProps {
  messages: DifyMessage[];
  conversationId?: string;
}

export function DifyConversationMessages({ 
  messages, 
  conversationId
}: DifyConversationMessagesProps) {
  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Mensajes de la Conversación
          </CardTitle>
          <CardDescription>
            No hay mensajes disponibles en esta conversación
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Mensajes de la Conversación
        </CardTitle>
        <CardDescription>
          {conversationId && (
            <span className="text-xs text-muted-foreground">
              Conversación: {conversationId}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={message.id} className="space-y-3">
              {/* Mensaje del usuario */}
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Usuario
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 border">
                    <p className="text-sm">{message.query}</p>
                  </div>
                </div>
              </div>

              {/* Respuesta del bot */}
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                  <Bot className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Dify Bot
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border">
                    <p className="text-sm whitespace-pre-wrap">{message.answer}</p>
                  </div>
                </div>
              </div>

              {index < messages.length - 1 && (
                <div className="border-b border-gray-200 my-4" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
