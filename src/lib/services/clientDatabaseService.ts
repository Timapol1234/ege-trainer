export interface AssessmentResultDB {
  id?: number;
  userId: string;
  subject: string;
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timestamp: string;
}

export class ClientDatabaseService {
  
  // Сохранение результата через API
  async saveResult(result: Omit<AssessmentResultDB, 'id'>): Promise<boolean> {
    try {
      const response = await fetch('/api/save-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('❌ Ошибка при сохранении в базу данных:', error);
      return false;
    }
  }

  // Получение всех результатов через API
  async getAllResults(): Promise<AssessmentResultDB[]> {
    try {
      const response = await fetch('/api/get-results');
      const data = await response.json();
      return data.success ? data.results : [];
    } catch (error) {
      console.error('❌ Ошибка при получении результатов:', error);
      return [];
    }
  }

  // Получение результатов пользователя через API
  async getUserResults(userId: string): Promise<AssessmentResultDB[]> {
    try {
      const response = await fetch(`/api/get-results?userId=${userId}`);
      const data = await response.json();
      return data.success ? data.results : [];
    } catch (error) {
      console.error('❌ Ошибка при получении результатов пользователя:', error);
      return [];
    }
  }

  // Получение статистики пользователя
  async getUserStats(userId: string): Promise<any> {
    try {
      const response = await fetch(`/api/stats?userId=${userId}`);
      const data = await response.json();
      return data.success ? data.stats : null;
    } catch (error) {
      console.error('❌ Ошибка при получении статистики:', error);
      return null;
    }
  }
}

export const clientDatabaseService = new ClientDatabaseService();