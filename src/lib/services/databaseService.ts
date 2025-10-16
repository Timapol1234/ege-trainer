import Database from 'better-sqlite3';
import path from 'path';

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

// Singleton класс для работы с базой данных
class DatabaseService {
  private static instance: DatabaseService;
  private db: Database.Database | null = null;

  private constructor() {
    // Инициализация происходит только на сервере
    if (typeof window === 'undefined') {
      this.initDatabase();
    }
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initDatabase() {
    try {
      const dbPath = path.join(process.cwd(), 'database', 'results.db');
      
      // Создаем папку если ее нет
      const fs = require('fs');
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      this.db = new Database(dbPath);
      
      // Создаем таблицу если ее нет
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS assessment_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          subject TEXT NOT NULL,
          topic TEXT NOT NULL,
          totalQuestions INTEGER NOT NULL,
          correctAnswers INTEGER NOT NULL,
          incorrectAnswers INTEGER NOT NULL,
          timestamp TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Создаем индекс для быстрого поиска по пользователю
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_user_id ON assessment_results(userId)
      `);

      console.log('✅ База данных инициализирована:', dbPath);
    } catch (error) {
      console.error('❌ Ошибка инициализации базы данных:', error);
    }
  }

  // Сохранение результата
  saveResult(result: Omit<AssessmentResultDB, 'id'>): boolean {
    if (!this.db) {
      console.error('❌ База данных не инициализирована');
      return false;
    }

    try {
      const stmt = this.db.prepare(`
        INSERT INTO assessment_results (userId, subject, topic, totalQuestions, correctAnswers, incorrectAnswers, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        result.userId,
        result.subject,
        result.topic,
        result.totalQuestions,
        result.correctAnswers,
        result.incorrectAnswers,
        result.timestamp
      );

      console.log('✅ Результат сохранен в базу данных, ID:', info.lastInsertRowid);
      return true;
    } catch (error) {
      console.error('❌ Ошибка при сохранении в базу данных:', error);
      return false;
    }
  }

  // Получение всех результатов
  getAllResults(): AssessmentResultDB[] {
    if (!this.db) {
      console.error('❌ База данных не инициализирована');
      return [];
    }

    try {
      const stmt = this.db.prepare(`
        SELECT * FROM assessment_results 
        ORDER BY timestamp DESC
      `);
      return stmt.all() as AssessmentResultDB[];
    } catch (error) {
      console.error('❌ Ошибка при чтении из базы данных:', error);
      return [];
    }
  }

  // Получение результатов пользователя
  getUserResults(userId: string): AssessmentResultDB[] {
    if (!this.db) {
      console.error('❌ База данных не инициализирована');
      return [];
    }

    try {
      const stmt = this.db.prepare(`
        SELECT * FROM assessment_results 
        WHERE userId = ? 
        ORDER BY timestamp DESC
      `);
      return stmt.all(userId) as AssessmentResultDB[];
    } catch (error) {
      console.error('❌ Ошибка при чтении результатов пользователя:', error);
      return [];
    }
  }

  // Статистика по пользователю
  getUserStats(userId: string) {
    if (!this.db) {
      console.error('❌ База данных не инициализирована');
      return null;
    }

    try {
      const stmt = this.db.prepare(`
        SELECT 
          COUNT(*) as totalTests,
          AVG(correctAnswers * 100.0 / totalQuestions) as averageScore,
          MAX(correctAnswers * 100.0 / totalQuestions) as bestScore,
          MIN(correctAnswers * 100.0 / totalQuestions) as worstScore,
          SUM(correctAnswers) as totalCorrect,
          SUM(totalQuestions) as totalQuestions
        FROM assessment_results 
        WHERE userId = ?
      `);
      return stmt.get(userId);
    } catch (error) {
      console.error('❌ Ошибка при получении статистики:', error);
      return null;
    }
  }

  // Закрытие соединения
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Экспортируем синглтон
export const databaseService = DatabaseService.getInstance();