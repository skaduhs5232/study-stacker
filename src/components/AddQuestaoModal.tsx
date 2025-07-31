import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { NovaQuestao } from '@/types/questao';
import { QuestaoService } from '@/services/questaoService';

interface AddQuestaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuestaoAdicionada: () => void;
}

export const AddQuestaoModal = ({ open, onOpenChange, onQuestaoAdicionada }: AddQuestaoModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [questao, setQuestao] = useState<NovaQuestao>({
    enunciado: '',
    alternativas: ['', '', '', '', ''],
    resposta_correta: 1,
    dificuldade: 'Médio',
    assuntos: [],
    ano_questao: new Date().getFullYear(),
  });
  const [assuntosText, setAssuntosText] = useState('');

  const handleAlternativaChange = (index: number, value: string) => {
    const novasAlternativas = [...questao.alternativas];
    novasAlternativas[index] = value;
    setQuestao({ ...questao, alternativas: novasAlternativas });
  };

  const validarFormulario = (): string | null => {
    if (!questao.enunciado.trim()) {
      return 'O enunciado é obrigatório';
    }

    const alternativasPreenchidas = questao.alternativas.filter(alt => alt.trim());
    if (alternativasPreenchidas.length < 2) {
      return 'Pelo menos 2 alternativas devem ser preenchidas';
    }

    if (!questao.alternativas[questao.resposta_correta - 1]?.trim()) {
      return 'A resposta correta selecionada deve ter conteúdo';
    }

    if (!assuntosText.trim()) {
      return 'Pelo menos um assunto deve ser informado';
    }

    if (questao.ano_questao < 1900 || questao.ano_questao > 2100) {
      return 'Ano deve estar entre 1900 e 2100';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const erro = validarFormulario();
    if (erro) {
      toast({
        title: 'Erro de validação',
        description: erro,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const questaoFinal = {
        ...questao,
        assuntos: assuntosText.split(',').map(s => s.trim()).filter(s => s),
      };

      await QuestaoService.adicionarQuestao(questaoFinal);
      
      toast({
        title: 'Sucesso!',
        description: 'Questão adicionada com sucesso.',
      });

      // Reset form
      setQuestao({
        enunciado: '',
        alternativas: ['', '', '', '', ''],
        resposta_correta: 1,
        dificuldade: 'Médio',
        assuntos: [],
        ano_questao: new Date().getFullYear(),
      });
      setAssuntosText('');
      
      onQuestaoAdicionada();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar questão. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Questão</DialogTitle>
          <DialogDescription>
            Preencha todos os campos para criar uma nova questão de múltipla escolha.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="enunciado">Enunciado *</Label>
            <Textarea
              id="enunciado"
              placeholder="Digite o enunciado da questão..."
              value={questao.enunciado}
              onChange={(e) => setQuestao({ ...questao, enunciado: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Alternativas *</Label>
            {questao.alternativas.map((alternativa, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="font-medium w-6">
                  {String.fromCharCode(65 + index)}.
                </span>
                <Input
                  placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                  value={alternativa}
                  onChange={(e) => handleAlternativaChange(index, e.target.value)}
                  className="flex-1"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resposta-correta">Resposta Correta *</Label>
              <Select
                value={questao.resposta_correta.toString()}
                onValueChange={(value) => 
                  setQuestao({ ...questao, resposta_correta: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questao.alternativas.map((_, index) => (
                    <SelectItem 
                      key={index} 
                      value={(index + 1).toString()}
                      disabled={!questao.alternativas[index]?.trim()}
                    >
                      {String.fromCharCode(65 + index)} - {questao.alternativas[index] || 'Vazia'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dificuldade">Dificuldade *</Label>
              <Select
                value={questao.dificuldade}
                onValueChange={(value) => 
                  setQuestao({ ...questao, dificuldade: value as 'Fácil' | 'Médio' | 'Difícil' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fácil">Fácil</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Difícil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ano">Ano *</Label>
              <Input
                id="ano"
                type="number"
                value={questao.ano_questao}
                onChange={(e) => 
                  setQuestao({ ...questao, ano_questao: parseInt(e.target.value) || new Date().getFullYear() })
                }
                min="1900"
                max="2100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assuntos">Assuntos *</Label>
            <Input
              id="assuntos"
              placeholder="Ex: Matemática, Álgebra, Equações"
              value={assuntosText}
              onChange={(e) => setAssuntosText(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Separe múltiplos assuntos com vírgula
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Questão'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};