import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Calendar, BookOpen } from 'lucide-react';
import { Questao } from '@/types/questao';
import { cn } from '@/lib/utils';

interface QuestaoCardProps {
  questao: Questao;
}

export const QuestaoCard = ({ questao }: QuestaoCardProps) => {
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [respondido, setRespondido] = useState(false);
  const [acertou, setAcertou] = useState<boolean | null>(null);

  const confirmarResposta = () => {
    if (respostaSelecionada === null) return;
    
    setRespondido(true);
    const correto = respostaSelecionada === questao.resposta_correta - 1; // -1 porque API usa 1-5, array usa 0-4
    setAcertou(correto);
  };

  const resetarQuestao = () => {
    setRespostaSelecionada(null);
    setRespondido(false);
    setAcertou(null);
  };

  const getDificuldadeCor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'Fácil':
        return 'bg-success text-success-foreground';
      case 'Médio':
        return 'bg-warning text-warning-foreground';
      case 'Difícil':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAlternativaEstilo = (index: number) => {
    if (!respondido) {
      return respostaSelecionada === index 
        ? 'border-primary bg-primary/5 text-primary' 
        : 'border-border hover:border-primary/50';
    }

    const isCorreta = index === questao.resposta_correta - 1;
    const isSelecionada = index === respostaSelecionada;

    if (isCorreta) {
      return 'border-success bg-success/10 text-success';
    }

    if (isSelecionada && !isCorreta) {
      return 'border-error bg-error/10 text-error';
    }

    return 'border-muted bg-muted/20 text-muted-foreground opacity-60';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg leading-relaxed flex-1">
            {questao.enunciado}
          </CardTitle>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={getDificuldadeCor(questao.dificuldade)}>
              {questao.dificuldade}
            </Badge>
            {respondido && (
              <div className="flex items-center gap-1">
                {acertou ? (
                  <CheckCircle className="text-success" size={20} />
                ) : (
                  <XCircle className="text-error" size={20} />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  acertou ? "text-success" : "text-error"
                )}>
                  {acertou ? 'Correto!' : 'Incorreto'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            {questao.ano_questao}
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={16} />
            {questao.assuntos.join(', ')}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {questao.alternativas.map((alternativa, index) => (
            <button
              key={index}
              onClick={() => !respondido && setRespostaSelecionada(index)}
              disabled={respondido}
              className={cn(
                "w-full p-4 text-left border-2 rounded-lg transition-all cursor-pointer",
                "disabled:cursor-not-allowed",
                getAlternativaEstilo(index)
              )}
            >
              <div className="flex items-start gap-3">
                <span className="font-semibold text-lg">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="flex-1">{alternativa}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          {!respondido ? (
            <Button
              onClick={confirmarResposta}
              disabled={respostaSelecionada === null}
              className="flex-1"
            >
              Confirmar Resposta
            </Button>
          ) : (
            <Button
              onClick={resetarQuestao}
              variant="outline"
              className="flex-1"
            >
              Tentar Novamente
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};