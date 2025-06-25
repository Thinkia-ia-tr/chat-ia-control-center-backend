import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, UserSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { Message, Conversation } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useConversationDetails } from "@/hooks/useConversationDetails";

interface ConversationDetailProps {
  title?: string;
  date?: string;
  messages?: Message[];
  conversation?: Conversation;
}

// Function to shorten UUID for display while keeping full value in tooltip
const shortenUUID = (uuid: string): string => {
  if (!uuid || uuid.length < 36) return uuid;
  
  // For full UUID format (75bbf54a-110d-4b59-86f6-5f41baa0f17d)
  // Display first 8 chars and last 4 chars with ellipsis in between
  return `${uuid.substring(0, 8)}...${uuid.substring(32)}`;
};

// Function to generate contextual agent responses
const generateContextualResponse = (clientMessage: string, productName: string): string => {
  if (!clientMessage) return `¡Claro! Puedo darte información sobre ${productName}.`;
  
  const clientMessageLower = clientMessage.toLowerCase();
  
  if (clientMessageLower.includes("precio") || clientMessageLower.includes("costo") || clientMessageLower.includes("cuánto")) {
    return `Los precios de ${productName} varían según el modelo específico que estés buscando. ¿Tienes algún modelo en mente?`;
  }
  
  if (clientMessageLower.includes("característica") || clientMessageLower.includes("especificación") || clientMessageLower.includes("cómo es")) {
    return `${productName} cuenta con características avanzadas que lo hacen destacar en el mercado. ¿Hay alguna característica específica que te interese conocer?`;
  }
  
  if (clientMessageLower.includes("disponibilidad") || clientMessageLower.includes("stock") || clientMessageLower.includes("cuando")) {
    return `Actualmente tenemos ${productName} disponible en nuestras tiendas principales. ¿Te gustaría verificar la disponibilidad en alguna ubicación específica?`;
  }
  
  // Default contextual response
  return `Gracias por tu interés en ${productName}. Estoy aquí para resolver cualquier duda que tengas. ¿Qué información específica necesitas?`;
};

export function ConversationDetail({
  title: propTitle,
  date: propDate,
  messages: propMessages = [],
  conversation: propConversation
}: ConversationDetailProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [productsList, setProductsList] = useState<{id: string, name: string}[]>([]);
  const [processedMessages, setProcessedMessages] = useState<Message[]>(propMessages);
  const [updatedTitle, setUpdatedTitle] = useState<string>(propTitle || '');

  // Use the hook to fetch conversation details if not provided as props
  const { data: conversationData, isLoading, error } = useConversationDetails(id || '');

  // Determine which data to use - props take precedence, then fetched data
  const conversation = propConversation || conversationData?.conversation;
  const messages = propMessages.length > 0 ? propMessages : conversationData?.messages || [];
  const title = propTitle || conversationData?.conversation?.title || 'Conversación';
  const date = propDate || (conversationData?.conversation?.created_at ? 
    new Date(conversationData.conversation.created_at).toLocaleDateString() : '');

  useEffect(() => {
    if (!id) {
      console.error('No conversation ID provided');
      navigate('/conversaciones');
      return;
    }

    // Cargar productos desde la base de datos
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('product_types')
          .select('id, name')
          .order('name');

        if (error) {
          console.error("Error fetching products:", error);
          throw error;
        }

        if (data) {
          setProductsList(data);
          
          // Procesar los mensajes con los productos obtenidos
          processMessages(data);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive"
        });
      }
    };

    fetchProducts();
  }, [id, messages, title, navigate, toast]);

  // Procesar mensajes para incluir menciones a productos
  const processMessages = (products: {id: string, name: string}[]) => {
    if (!products.length || !messages.length) return;

    // Seleccionar un producto aleatorio para usar en los mensajes
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    
    // Crear una copia de los mensajes originales
    let updatedMessages = [...messages];
    
    // Reemplazar respuestas del agente con respuestas contextuales
    for (let i = 1; i < updatedMessages.length; i++) {
      const currentMsg = updatedMessages[i];
      const prevMsg = updatedMessages[i - 1];
      
      // Si es un mensaje del agente que comienza con "Hola, me interesa saber sobre"
      if (currentMsg.sender === "agent" && 
          (currentMsg.content.includes("Hola, me interesa saber sobre") || 
           currentMsg.content.includes("Behumax"))) {
        
        // Solo cambiar la respuesta si hay un mensaje previo del cliente
        if (prevMsg && prevMsg.sender === "client") {
          updatedMessages[i] = {
            ...currentMsg,
            content: generateContextualResponse(prevMsg.content, randomProduct.name)
          };
        }
      }
    }

    setProcessedMessages(updatedMessages);
    
    // Actualizar el título si es necesario
    const clientMessage = updatedMessages.find(m => m.sender === "client" && m.content.includes("me interesa saber sobre"));
    if (clientMessage) {
      const newTitle = `Consulta sobre ${randomProduct.name}`;
      setUpdatedTitle(newTitle);
    }
  };

  const handleBackButton = () => {
    // Go back to the previous page in history
    navigate(-1);
  };

  // Function to get the appropriate sender name
  const getSenderName = (message: Message) => {
    if (message.sender === "client") {
      // If sender is client, use client value from conversation if available
      if (conversation?.client?.value) {
        const clientValue = conversation.client.value.toString();
        return clientValue;
      }
      return "Cliente";
    }
    // For agent or system messages
    return message.sender === "agent" ? "Agente" : "Sistema";
  };

  // Function to render a client identifier with the appropriate icon
  const renderClientIdentifier = () => {
    const clientType = conversation?.client?.type || "";
    const clientValue = conversation?.client?.value || "Anonymous";
    
    return (
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">Cliente</span>
        <div className="flex items-center gap-2 mt-1">
          {clientType === "phone" ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="px-2 py-1 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{clientValue.toString()}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cliente identificado por teléfono</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="px-2 py-1 flex items-center gap-1">
                    <UserSquare className="h-3 w-3" />
                    <span>{clientValue.toString()}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cliente identificado por ID</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">Cargando conversación...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 h-64 justify-center">
        <div className="text-destructive">Error al cargar la conversación</div>
        <Button onClick={() => navigate('/conversaciones')}>
          Volver a conversaciones
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleBackButton}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>

      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold mb-1">{updatedTitle || title}</h2>
          <div className="text-sm text-muted-foreground">{date}</div>
        </div>
        <div className="flex gap-4">
          {renderClientIdentifier()}
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">Mensajes</span>
            <Badge variant="outline" className="mt-1">{processedMessages.length}</Badge>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">Canal</span>
            <Badge variant="outline" className="mt-1">{conversation?.channel || "Web"}</Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {processedMessages.map((message) => (
          <div
            key={message.id}
            className={cn("flex gap-4", 
              message.sender === "agent" && "flex-row-reverse"
            )}
          >
            <Avatar className="rounded-full h-8 w-8">
              <AvatarFallback>
                {message.sender === "client" ? "C" : "A"}
              </AvatarFallback>
            </Avatar>
            <Card className={cn("max-w-[85%]", 
              message.sender === "agent" && "bg-muted",
              message.sender === "client" && "bg-card"
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
          variant="default" 
          size="sm" 
          onClick={handleBackButton}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>
    </div>
  );
}

export default ConversationDetail;
