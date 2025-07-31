export interface Questao {
  id?: number;
  enunciado: string;
  alternativas: string[];
  resposta_correta: number;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  assuntos: string[];
  ano_questao: number;
}

export interface FiltroQuestoes {
  enunciado?: string;
  dificuldade?: 'Fácil' | 'Médio' | 'Difícil';
  ano_questao?: number;
  assuntos?: string[];
}

export interface NovaQuestao {
  enunciado: string;
  alternativas: string[];
  resposta_correta: number;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  assuntos: string[];
  ano_questao: number;
}