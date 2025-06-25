
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';

interface DifySuggestedQuestionsProps {
  questions: string[];
  conversationId?: string;
  onQuestionClick?: (question: string) => void;
}

export function DifySuggestedQuestions({ 
  questions, 
  conversationId,
  onQuestionClick 
}: DifySuggestedQuestionsProps) {
  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Preguntas Sugeridas de Dify
          </CardTitle>
          <CardDescription>
            No hay preguntas sugeridas disponibles
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Preguntas Sugeridas de Dify
        </CardTitle>
        <CardDescription>
          {conversationId && (
            <span className="text-xs text-muted-foreground">
              Basado en la conversación: {conversationId}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {questions.map((question, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors ${
                onQuestionClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onQuestionClick?.(question)}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm flex-1">{question}</p>
                <Badge variant="secondary" className="text-xs">
                  #{index + 1}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
