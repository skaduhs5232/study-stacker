export interface Questao {
  ID?: number;
  Enunciado: string;
  Alternativas: string[];
  RespostaCorreta: number;
  Dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  Assuntos: string[];
  Ano_questao: number;
}

export interface FiltroQuestoes {
  Enunciado?: string;
  Dificuldade?: 'Fácil' | 'Médio' | 'Difícil';
  Ano_questao?: number;
  Assuntos?: string[];
}

export interface NovaQuestao {
  Enunciado: string;
  Alternativas: string[];
  RespostaCorreta: number;
  Dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  Assuntos: string[];
  Ano_questao: number;
}