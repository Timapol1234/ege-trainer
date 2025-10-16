// lib/services/assessmentService.ts
import { 
  AssessmentResult, 
  AssessmentSession, 
  UserResponse, 
  UserStats, 
  ThemeProgress,
  TemporaryAssessmentStorage 
} from '@/types/assessment.types';

export class AssessmentService {
  private static readonly RESULTS_KEY = 'assessment_results';
  private static readonly SESSION_KEY = 'assessment_session';
  private static readonly TEMP_STORAGE_KEY = 'temp_assessment_data';
  private static readonly USER_STATS_KEY = 'user_stats';

  // Сохранение результатов теста
  static saveTestResult(resultData: Omit<AssessmentResult, 'id'>): AssessmentResult {
    const results = this.getAllResults();
    const newResult: AssessmentResult = {
      ...resultData,
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    results.push(newResult);
    localStorage.setItem(this.RESULTS_KEY, JSON.stringify(results));
    
    // Обновляем статистику пользователя
    this.updateUserStats(newResult);
    
    // Сохраняем данные для генерации плана обучения
    this.savePlanGenerationData(newResult);
    
    return newResult;
  }

  // Получение всех результатов
  static getAllResults(): AssessmentResult[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.RESULTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Получение последнего результата по предмету
  static getLatestResult(subject: string): AssessmentResult | null {
    const results = this.getAllResults()
      .filter(result => result.subject === subject)
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return results.length > 0 ? results[0] : null;
  }

  // Сохранение временных данных оценки
  static saveTemporaryAssessment(data: TemporaryAssessmentStorage): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TEMP_STORAGE_KEY, JSON.stringify(data));
  }

  // Получение временных данных оценки
  static getTemporaryAssessment(): TemporaryAssessmentStorage | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(this.TEMP_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Очистка временных данных
  static clearTemporaryAssessment(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TEMP_STORAGE_KEY);
  }

  // Сохранение сессии тестирования
  static saveSession(session: AssessmentSession): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  }

  // Получение текущей сессии
  static getCurrentSession(): AssessmentSession | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(this.SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Удаление сессии
  static clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.SESSION_KEY);
  }

  // Сохранение данных для генерации плана обучения
  private static savePlanGenerationData(result: AssessmentResult): void {
    const weakThemes = result.themeBreakdown
      .filter(theme => theme.percentage < 60)
      .map(theme => theme.theme);

    const strongThemes = result.themeBreakdown
      .filter(theme => theme.percentage >= 80)
      .map(theme => theme.theme);

    const planData = {
      initialScore: Math.round(result.estimatedScore),
      targetScore: 85, // Целевой балл по умолчанию
      weakThemes: weakThemes.length > 0 ? weakThemes : result.recommendedFocus,
      strongThemes,
      testScore: result.estimatedScore,
      subjects: [result.subject],
      availableHoursPerWeek: 10,
      examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      userLevel: result.preparationLevel
    };

    localStorage.setItem('planGenerationData', JSON.stringify(planData));
  }

  // Обновление статистики пользователя
  private static updateUserStats(result: AssessmentResult): void {
    const stats = this.getUserStats(result.subject) || {
      totalTests: 0,
      averageScore: 0,
      bestScore: 0,
      improvement: 0,
      lastTestDate: 0,
      totalTimeSpent: 0
    };

    const newStats: UserStats = {
      totalTests: stats.totalTests + 1,
      averageScore: Math.round((stats.averageScore * stats.totalTests + result.estimatedScore) / (stats.totalTests + 1)),
      bestScore: Math.max(stats.bestScore, result.estimatedScore),
      improvement: stats.totalTests > 0 ? result.estimatedScore - (stats.averageScore * stats.totalTests - stats.averageScore) / stats.totalTests : 0,
      lastTestDate: result.timestamp,
      totalTimeSpent: stats.totalTimeSpent + result.timeSpent,
      favoriteSubject: result.subject
    };

    const allStats = this.getAllUserStats();
    allStats[result.subject] = newStats;
    localStorage.setItem(this.USER_STATS_KEY, JSON.stringify(allStats));
  }

  // Получение статистики пользователя по предмету
  static getUserStats(subject: string): UserStats | null {
    const allStats = this.getAllUserStats();
    return allStats[subject] || null;
  }

  // Получение всей статистики
  static getAllUserStats(): Record<string, UserStats> {
    if (typeof window === 'undefined') return {};
    
    const stored = localStorage.getItem(this.USER_STATS_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  // Получение прогресса по темам
  static getThemeProgress(subject: string): ThemeProgress[] {
    const results = this.getAllResults().filter(r => r.subject === subject);
    const themeStats: Record<string, { correct: number; total: number; totalTime: number; lastAttempt: number }> = {};

    results.forEach(result => {
      result.userResponses.forEach(response => {
        if (!themeStats[response.theme]) {
          themeStats[response.theme] = { correct: 0, total: 0, totalTime: 0, lastAttempt: 0 };
        }
        themeStats[response.theme].total++;
        themeStats[response.theme].totalTime += response.timeSpent;
        themeStats[response.theme].lastAttempt = Math.max(themeStats[response.theme].lastAttempt, result.timestamp);
        
        if (response.isCorrect) {
          themeStats[response.theme].correct++;
        }
      });
    });

    return Object.entries(themeStats).map(([theme, stats]) => ({
      theme,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      totalQuestions: stats.total,
      averageTime: Math.round(stats.totalTime / stats.total),
      lastAttempt: stats.lastAttempt
    }));
  }

  // Получение истории тестирования
  static getTestHistory(subject: string, limit: number = 10): AssessmentResult[] {
    return this.getAllResults()
      .filter(result => result.subject === subject)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Расчет улучшения по теме
  static getThemeImprovement(subject: string, theme: string): number {
    const results = this.getAllResults()
      .filter(r => r.subject === subject)
      .sort((a, b) => a.timestamp - b.timestamp);

    if (results.length < 2) return 0;

    const firstResult = results[0];
    const lastResult = results[results.length - 1];

    const firstTheme = firstResult.themeBreakdown.find(t => t.theme === theme);
    const lastTheme = lastResult.themeBreakdown.find(t => t.theme === theme);

    if (!firstTheme || !lastTheme) return 0;

    return lastTheme.percentage - firstTheme.percentage;
  }

  // Получение рекомендуемых тем для изучения
  static getRecommendedThemes(subject: string, limit: number = 3): string[] {
    const progress = this.getThemeProgress(subject)
      .filter(theme => theme.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, limit);

    return progress.map(theme => theme.theme);
  }
}