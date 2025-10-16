import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'lib/database/users.db');

// Функция для получения соединения с базой данных
const getDB = () => {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err);
      throw err;
    }
  });
};

export interface TestResult {
  id?: number;
  userId: number;
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // в секундах
  testData: any; // JSON с деталями теста
  createdAt?: Date;
}

// Сохранение результата тестирования
export const saveTestResult = async (result: TestResult): Promise<number> => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    console.log('📝 Сохранение результата теста в users.db:', {
      userId: result.userId,
      subject: result.subject,
      score: result.score,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      timeSpent: result.timeSpent
    });
    
    const testDataJson = JSON.stringify(result.testData);
    
    db.run(
      `INSERT INTO test_results 
       (user_id, subject, score, total_questions, correct_answers, time_spent, test_data) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        result.userId,
        result.subject,
        result.score,
        result.totalQuestions,
        result.correctAnswers,
        result.timeSpent,
        testDataJson
      ],
      function(err) {
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database:', closeErr);
        });
        
        if (err) {
          console.error('❌ Ошибка сохранения результата теста:', err);
          reject(err);
          return;
        }
        
        console.log(`✅ Результат теста сохранен в users.db, ID: ${this.lastID}`);
        resolve(this.lastID);
      }
    );
  });
};

// Получение результатов пользователя
export const getUserTestResults = async (userId: number, limit: number = 10): Promise<TestResult[]> => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.all(
      `SELECT * FROM test_results 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [userId, limit],
      (err, rows: any[]) => {
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database:', closeErr);
        });
        
        if (err) {
          console.error('Error getting user test results:', err);
          reject(err);
          return;
        }
        
        const results: TestResult[] = rows.map(row => ({
          id: row.id,
          userId: row.user_id,
          subject: row.subject,
          score: row.score,
          totalQuestions: row.total_questions,
          correctAnswers: row.correct_answers,
          timeSpent: row.time_spent,
          testData: JSON.parse(row.test_data),
          createdAt: new Date(row.created_at)
        }));
        
        resolve(results);
      }
    );
  });
};

// Получение статистики по предметам
export const getUserSubjectStats = async (userId: number): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.all(
      `SELECT 
        subject,
        COUNT(*) as test_count,
        AVG(score) as avg_score,
        MAX(score) as best_score,
        MIN(score) as worst_score,
        SUM(time_spent) as total_time
       FROM test_results 
       WHERE user_id = ?
       GROUP BY subject
       ORDER BY avg_score DESC`,
      [userId],
      (err, rows: any[]) => {
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database:', closeErr);
        });
        
        if (err) {
          console.error('Error getting user subject stats:', err);
          reject(err);
          return;
        }
        
        resolve(rows);
      }
    );
  });
};

// Получение последних результатов
export const getRecentTestResults = async (userId: number, days: number = 7): Promise<TestResult[]> => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.all(
      `SELECT * FROM test_results 
       WHERE user_id = ? AND created_at >= datetime('now', '-${days} days')
       ORDER BY created_at DESC`,
      [userId],
      (err, rows: any[]) => {
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database:', closeErr);
        });
        
        if (err) {
          console.error('Error getting recent test results:', err);
          reject(err);
          return;
        }
        
        const results: TestResult[] = rows.map(row => ({
          id: row.id,
          userId: row.user_id,
          subject: row.subject,
          score: row.score,
          totalQuestions: row.total_questions,
          correctAnswers: row.correct_answers,
          timeSpent: row.time_spent,
          testData: JSON.parse(row.test_data),
          createdAt: new Date(row.created_at)
        }));
        
        resolve(results);
      }
    );
  });
};

// Удаление результата теста
export const deleteTestResult = async (resultId: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.run(
      'DELETE FROM test_results WHERE id = ?',
      [resultId],
      function(err) {
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database:', closeErr);
        });
        
        if (err) {
          console.error('Error deleting test result:', err);
          reject(err);
          return;
        }
        
        resolve(this.changes > 0);
      }
    );
  });
};