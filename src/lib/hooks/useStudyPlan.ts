// lib/hooks/useStudyPlan.ts
import { useState, useEffect } from 'react';
import { StudyPlan, UserLevel } from '@/types/plan';
import { StudyPlanGenerator } from '@/services/studyPlanGenerator';

export const useStudyPlan = (userLevel: UserLevel | null) => {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLevel) {
      generatePlan(userLevel);
    }
  }, [userLevel]);

  const generatePlan = async (userData: UserLevel) => {
    setLoading(true);
    setError(null);
    
    try {
      // Имитация асинхронной генерации
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newPlan = StudyPlanGenerator.generatePlan(userData);
      setPlan(newPlan);
    } catch (err) {
      setError('Ошибка при генерации плана обучения');
      console.error('Plan generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const regeneratePlan = () => {
    if (userLevel) {
      generatePlan(userLevel);
    }
  };

  return {
    plan,
    loading,
    error,
    regeneratePlan
  };
};