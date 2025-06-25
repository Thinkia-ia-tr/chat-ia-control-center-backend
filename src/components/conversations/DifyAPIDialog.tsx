
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, MessageSquare } from 'lucide-react';
import { useDifyAPI } from '@/hooks/useDifyAPI';
import { DifyConversationMessages } from './DifyConversationMessages';

interface DifyAPIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DifyAPIDialog({ open, onOpenChange }: DifyAPIDialogProps) {
  const [apiKey, setApiKey] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [userId, setUserId] = useState('');
  const { isLoading, conversationMessages, fetchConversationMessages, clearConversationMessages } = useDifyAPI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim() || !conversationId.trim() || !userId.trim()) {
      return;
    }

    try {
      await fetchConversationMessages(conversationId.trim(), userId.trim(), apiKey.trim());
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleClose = () => {
    clearConversationMessages();
    setApiKey('');
    setConversationId('');
    setUserId('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recuperar Historial de Conversación de Dify
          </DialogTitle>
          <DialogDescription>
            Ingresa tu API Key de Dify, el ID de la conversación y el ID del usuario para obtener el historial completo de mensajes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key de Dify</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Bearer token..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conversationId">ID de la Conversación</Label>
            <Input
              id="conversationId"
              type="text"
              placeholder="convo_abc123..."
              value={conversationId}
              onChange={(e) => setConversationId(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">ID del Usuario</Label>
            <Input
              id="userId"
              type="text"
              placeholder="usuario-test..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Proporciona el ID del usuario para filtrar los mensajes de la conversación.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !apiKey.trim() || !conversationId.trim() || !userId.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Obteniendo...
                </>
              ) : (
                'Obtener Historial'
              )}
            </Button>
          </DialogFooter>
        </form>

        {conversationMessages.length > 0 && (
          <div className="mt-6">
            <DifyConversationMessages 
              messages={conversationMessages}
              conversationId={conversationId}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
