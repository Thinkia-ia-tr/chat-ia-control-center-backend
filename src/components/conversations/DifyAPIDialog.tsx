
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
import { DifySuggestedQuestions } from './DifySuggestedQuestions';

interface DifyAPIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DifyAPIDialog({ open, onOpenChange }: DifyAPIDialogProps) {
  const [apiKey, setApiKey] = useState('');
  const [conversationId, setConversationId] = useState('');
  const { isLoading, suggestedQuestions, fetchSuggestedQuestions, clearSuggestedQuestions } = useDifyAPI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim() || !conversationId.trim()) {
      return;
    }

    try {
      await fetchSuggestedQuestions(conversationId.trim(), apiKey.trim());
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleClose = () => {
    clearSuggestedQuestions();
    setApiKey('');
    setConversationId('');
    onOpenChange(false);
  };

  const handleQuestionClick = (question: string) => {
    console.log('Pregunta seleccionada:', question);
    // Aquí podrías implementar lógica adicional para manejar la pregunta seleccionada
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recuperar Conversaciones de Dify
          </DialogTitle>
          <DialogDescription>
            Ingresa tu API Key de Dify y el ID de la conversación para obtener las preguntas sugeridas.
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
              placeholder="conversation-id-123..."
              value={conversationId}
              onChange={(e) => setConversationId(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Este debe ser el ID de la conversación en Dify.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !apiKey.trim() || !conversationId.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Obteniendo...
                </>
              ) : (
                'Obtener Preguntas'
              )}
            </Button>
          </DialogFooter>
        </form>

        {suggestedQuestions.length > 0 && (
          <div className="mt-6">
            <DifySuggestedQuestions 
              questions={suggestedQuestions}
              conversationId={conversationId}
              onQuestionClick={handleQuestionClick}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
