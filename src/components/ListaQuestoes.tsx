import { QuestaoCard } from './QuestaoCard';
import { Questao } from '@/types/questao';
import { FileQuestion } from 'lucide-react';

interface ListaQuestoesProps {
  questoes: Questao[];
  loading: boolean;
}

export const ListaQuestoes = ({ questoes, loading }: ListaQuestoesProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-96 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (questoes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileQuestion size={64} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Nenhuma questão encontrada</h3>
        <p className="text-muted-foreground">
          Tente ajustar os filtros ou adicione novas questões ao banco.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {questoes.map((questao, index) => (
        <QuestaoCard key={questao.id || index} questao={questao} />
      ))}
    </div>
  );
};