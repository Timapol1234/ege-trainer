// src/lib/utils/storage.ts
import { AssessmentResult } from '@/types/assessment.types';

export interface TemporaryAssessmentStorage {
  result: AssessmentResult;
  userGoals?: {
    targetScore: number;
    intensity: 'low' | 'medium' | 'high';
    currentScore: number;
    timestamp?: number;
  };
}

export const StorageUtils = {
  // Сохранить результаты теста
  saveAssessmentResult: (result: AssessmentResult): void => {
    if (typeof window !== 'undefined') {
      const storageData: TemporaryAssessmentStorage = {
        result: {
          ...result,
          timestamp: Date.now()
        }
      };
      localStorage.setItem('assessment_result', JSON.stringify(storageData));
    }
  },

  // Получить сохраненные результаты
  getAssessmentResult: (): TemporaryAssessmentStorage | null => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('assessment_result');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  },

  // Сохранить цели пользователя
  saveUserGoals: (goals: { targetScore: number; intensity: 'low' | 'medium' | 'high'; currentScore: number }): void => {
    if (typeof window !== 'undefined') {
      const existing = StorageUtils.getAssessmentResult();
      const storageData: TemporaryAssessmentStorage = {
        ...existing,
        userGoals: {
          ...goals,
          timestamp: Date.now()
        }
      };
      localStorage.setItem('assessment_result', JSON.stringify(storageData));
    }
  },

  // Очистить сохраненные результаты
  clearAssessmentResult: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('assessment_result');
    }
  },

  // Проверить, есть ли сохраненные результаты (не старше 24 часов)
  hasValidAssessmentResult: (): boolean => {
    const stored = StorageUtils.getAssessmentResult();
    if (!stored || !stored.result.timestamp) return false;
    
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return Date.now() - stored.result.timestamp < twentyFourHours;
  }
};