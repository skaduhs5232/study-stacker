import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X } from 'lucide-react';
import { FiltroQuestoes as FiltroQuesteosType } from '@/types/questao';

interface FiltroQuestoesProps {
  onFiltroChange: (filtros: FiltroQuesteosType) => void;
  loading: boolean;
}

export const FiltroQuestoes = ({ onFiltroChange, loading }: FiltroQuestoesProps) => {
  const [filtros, setFiltros] = useState<FiltroQuesteosType>({});
  const [assuntosText, setAssuntosText] = useState('');

  const aplicarFiltros = () => {
    const filtrosFormatados = {
      ...filtros,
      assuntos: assuntosText ? assuntosText.split(',').map(s => s.trim()).filter(s => s) : undefined,
    };
    
    // Remove campos vazios
    Object.keys(filtrosFormatados).forEach(key => {
      const value = filtrosFormatados[key as keyof FiltroQuesteosType];
      if (value === '' || value === undefined || (Array.isArray(value) && value.length === 0)) {
        delete filtrosFormatados[key as keyof FiltroQuesteosType];
      }
    });

    onFiltroChange(filtrosFormatados);
  };

  const limparFiltros = () => {
    setFiltros({});
    setAssuntosText('');
    onFiltroChange({});
  };

  // Auto-aplicar filtros quando houver mudanças
  useEffect(() => {
    const timer = setTimeout(() => {
      aplicarFiltros();
    }, 500);

    return () => clearTimeout(timer);
  }, [filtros, assuntosText]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search size={20} />
          Filtrar Questões
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="enunciado">Enunciado</Label>
            <Input
              id="enunciado"
              placeholder="Buscar no enunciado..."
              value={filtros.enunciado || ''}
              onChange={(e) => setFiltros({ ...filtros, enunciado: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dificuldade">Dificuldade</Label>
            <Select
              value={filtros.dificuldade || ''}
              onValueChange={(value) => 
                setFiltros({ ...filtros, dificuldade: value || undefined as any })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as dificuldades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fácil">Fácil</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Difícil">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ano">Ano</Label>
            <Input
              id="ano"
              type="number"
              placeholder="Ex: 2024"
              value={filtros.ano_questao || ''}
              onChange={(e) => 
                setFiltros({ ...filtros, ano_questao: e.target.value ? parseInt(e.target.value) : undefined })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assuntos">Assuntos</Label>
            <Input
              id="assuntos"
              placeholder="Ex: Matemática, Física"
              value={assuntosText}
              onChange={(e) => setAssuntosText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button 
            onClick={aplicarFiltros} 
            disabled={loading}
            className="gap-2"
          >
            <Search size={16} />
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
          <Button 
            variant="outline" 
            onClick={limparFiltros}
            className="gap-2"
          >
            <X size={16} />
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};