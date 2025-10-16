import { clientDatabaseService } from './clientDatabaseService';

export class CSVExportService {
  
  // Автоматическое сохранение в базу данных
  async autoSaveResult(result: any): Promise<void> {
    try {
      console.log('💾 Сохранение в базу данных...');
      
      const success = await clientDatabaseService.saveResult({
        userId: result.userId,
        subject: result.subject,
        topic: result.topic,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        incorrectAnswers: result.incorrectAnswers,
        timestamp: new Date().toISOString()
      });
      
      if (success) {
        console.log('✅ Результаты автоматически сохранены в базу данных SQLite');
      } else {
        console.error('❌ Не удалось сохранить результаты в базу данных');
      }
    } catch (error) {
      console.error('❌ Ошибка при сохранении в базу данных:', error);
    }
  }
}

export const csvExportService = new CSVExportService();