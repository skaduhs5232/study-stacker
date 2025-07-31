import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface HeaderProps {
  onAddQuestao: () => void;
}

export const Header = ({ onAddQuestao }: HeaderProps) => {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Banco de Questões</h1>
            <p className="text-primary-foreground/80 mt-1">
              Pratique e adicione questões de múltipla escolha
            </p>
          </div>
          <Button
            onClick={onAddQuestao}
            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
          >
            <Plus size={20} />
            Adicionar Questão
          </Button>
        </div>
      </div>
    </header>
  );
};