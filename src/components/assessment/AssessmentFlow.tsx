// src/components/assessment/AssessmentFlow.tsx
import { useState } from 'react';
import { Assessment } from './Assessment';
import { ResultsView } from './ResultsView';
import { StudyPlanView } from '../study-plan/StudyPlanView';
import { useStudyPlan } from '@/lib/hooks/useStudyPlan';
import { AssessmentResult } from '@/types';

type FlowState = 'assessment' | 'results' | 'plan';

export const AssessmentFlow: React.FC = () => {
  const [currentState, setCurrentState] = useState<FlowState>('assessment');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const { generateStudyPlan, isGenerating } = useStudyPlan();

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setAssessmentResult(result);
    setCurrentState('results');
  };

  const handleContinueFromResults = async () => {
    if (!assessmentResult) return;

    // Генерируем план на основе результатов
    const weakThemes = assessmentResult.themeBreakdown
      .filter(theme => theme.percentage < 60)
      .map(theme => theme.theme);
    
    const strongThemes = assessmentResult.themeBreakdown
      .filter(theme => theme.percentage >= 80)
      .map(theme => theme.theme);

    const plan = await generateStudyPlan({
      weakThemes,
      strongThemes,
      totalScore: assessmentResult.estimatedScore,
      availableHoursPerWeek: 10, // Можно добавить выбор пользователя
      targetScore: 80,
      examDate: new Date('2024-06-01') // Дата ЕГЭ
    });

    setStudyPlan(plan);
    setCurrentState('plan');
  };

  const handleAcceptPlan = () => {
    // Сохраняем план и переходим в кабинет
    console.log('Plan accepted:', studyPlan);
    // Здесь будет навигация в кабинет
  };

  const handleRegeneratePlan = async () => {
    if (!assessmentResult) return;
    
    // Перегенерируем план с другими параметрами
    const weakThemes = assessmentResult.themeBreakdown
      .filter(theme => theme.percentage < 60)
      .map(theme => theme.theme);
    
    const strongThemes = assessmentResult.themeBreakdown
      .filter(theme => theme.percentage >= 80)
      .map(theme => theme.theme);

    const plan = await generateStudyPlan({
      weakThemes,
      strongThemes,
      totalScore: assessmentResult.estimatedScore,
      availableHoursPerWeek: 15, // Увеличиваем количество часов
      targetScore: 85,
      examDate: new Date('2024-06-01')
    });

    setStudyPlan(plan);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {currentState === 'assessment' && (
        <Assessment onComplete={handleAssessmentComplete} />
      )}
      
      {currentState === 'results' && assessmentResult && (
        <ResultsView 
          result={assessmentResult} 
          onContinue={handleContinueFromResults}
        />
      )}
      
      {currentState === 'plan' && studyPlan && (
        <StudyPlanView 
          plan={studyPlan}
          onAccept={handleAcceptPlan}
          onRegenerate={handleRegeneratePlan}
        />
      )}
    </div>
  );
};