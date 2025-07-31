import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { FiltroQuestoes } from '@/components/FiltroQuestoes';
import { ListaQuestoes } from '@/components/ListaQuestoes';
import { AddQuestaoModal } from '@/components/AddQuestaoModal';
import { useToast } from '@/hooks/use-toast';
import { Questao, FiltroQuestoes as FiltroQuestoesType } from '@/types/questao';
import { QuestaoService } from '@/services/questaoService';

const Index = () => {
  const { toast } = useToast();
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filtrosAtivos, setFiltrosAtivos] = useState<FiltroQuestoesType>({});

  const carregarQuestoes = async (filtros: FiltroQuestoesType = {}) => {
    setLoading(true);
    try {
      const questoesBuscadas = await QuestaoService.buscarQuestoes(filtros);
      setQuestoes(questoesBuscadas);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar questões. Verifique sua conexão.',
        variant: 'destructive',
      });
      setQuestoes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (novosFiltros: FiltroQuestoesType) => {
    setFiltrosAtivos(novosFiltros);
    carregarQuestoes(novosFiltros);
  };

  const handleQuestaoAdicionada = () => {
    // Recarrega as questões com os filtros atuais
    carregarQuestoes(filtrosAtivos);
    toast({
      title: 'Sucesso!',
      description: 'Questão adicionada e lista atualizada.',
    });
  };

  // Carregamento inicial
  useEffect(() => {
    carregarQuestoes();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onAddQuestao={() => setModalOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <FiltroQuestoes 
          onFiltroChange={handleFiltroChange}
          loading={loading}
        />
        
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            {questoes.length > 0 
              ? `${questoes.length} questão${questoes.length !== 1 ? 'ões' : ''} encontrada${questoes.length !== 1 ? 's' : ''}`
              : loading 
                ? 'Carregando questões...' 
                : 'Nenhuma questão encontrada'
            }
          </h2>
          {Object.keys(filtrosAtivos).length > 0 && (
            <p className="text-muted-foreground">
              Filtros aplicados: {Object.keys(filtrosAtivos).join(', ')}
            </p>
          )}
        </div>

        <ListaQuestoes questoes={questoes} loading={loading} />
      </main>

      <AddQuestaoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onQuestaoAdicionada={handleQuestaoAdicionada}
      />
    </div>
  );
};

export default Index;
