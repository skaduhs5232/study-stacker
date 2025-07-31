import { Questao, FiltroQuestoes, NovaQuestao } from '@/types/questao';

const API_BASE_URL = 'https://api-golang-banco-de-questoes.onrender.com';

export class QuestaoService {
  static async buscarQuestoes(filtros: FiltroQuestoes = {}): Promise<Questao[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/questoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtros),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar questões: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar questões:', error);
      throw error;
    }
  }

  static async adicionarQuestao(questao: NovaQuestao): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/add-questao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questao),
      });

      if (!response.ok) {
        throw new Error(`Erro ao adicionar questão: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao adicionar questão:', error);
      throw error;
    }
  }
}