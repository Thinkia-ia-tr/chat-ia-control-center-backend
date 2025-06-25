
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Download, MessageSquare } from 'lucide-react';
import { useDifyConversations } from '@/hooks/useDifyConversations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DifyConversationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: string;
}

export function DifyConversationsDialog({ open, onOpenChange, apiKey }: DifyConversationsDialogProps) {
  const { isLoading, conversations, fetchDifyConversations, clearConversations } = useDifyConversations();

  useEffect(() => {
    if (open && apiKey) {
      fetchDifyConversations(apiKey);
    }
  }, [open, apiKey]);

  const handleClose = () => {
    clearConversations();
    onOpenChange(false);
  };

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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Conversaciones de Dify
          </DialogTitle>
          <DialogDescription>
            Conversaciones cargadas desde Dify con el API Key configurado.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span>Cargando conversaciones de Dify...</span>
          </div>
        ) : conversations.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {conversations.length} conversaciones encontradas
              </h3>
            </div>
            
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {conversations.map((conversation) => (
                <Card key={conversation.id} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {conversation.name || `Conversación ${conversation.id.substring(0, 8)}...`}
                      </CardTitle>
                      <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
                        {conversation.status}
                      </Badge>
                    </div>
                    {conversation.introduction && (
                      <CardDescription className="text-sm">
                        {conversation.introduction}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>ID: {conversation.id}</span>
                      <div className="flex flex-col items-end gap-1">
                        <span>Creado: {formatDate(conversation.created_at)}</span>
                        <span>Actualizado: {formatDate(conversation.updated_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron conversaciones</p>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
