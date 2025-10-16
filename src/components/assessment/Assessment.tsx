// components/assessment/Assessment.tsx
import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { QuestionCard } from './QuestionCard';
import { ResultsView } from './ResultsView';
import { HintSystem } from './HintSystem';
import { AssessmentService } from '@/lib/services/assessmentService';
import { csvExportService } from '@/lib/services/csvExportService';
import type { AssessmentQuestion, UserResponse, AssessmentResult } from '@/types/assessment.types';

interface AssessmentProps {
  questions: AssessmentQuestion[];
  subject: string;
  onComplete?: (result: AssessmentResult) => void;
}

export function Assessment({ questions, subject, onComplete }: AssessmentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  // Инициализация таймера
  useEffect(() => {
    setStartTime(Date.now());
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Функция для автоматического сохранения в CSV
  const saveResultsToCSV = useCallback(async (result: AssessmentResult) => {
    try {
      const csvData = {
        userId: `user-${Date.now()}`,
        subject: result.subject,
        topic: 'Входное тестирование',
        totalQuestions: result.totalQuestions,
        correctAnswers: result.totalCorrect,
        incorrectAnswers: result.totalQuestions - result.totalCorrect
      };

      // Сохраняем в файл на сервере
      await csvExportService.autoSaveResult(csvData);
      console.log('✅ Результаты автоматически сохранены в CSV файл');
    } catch (error) {
      console.error('❌ Ошибка при сохранении в CSV:', error);
    }
  }, []);

  const calculateResults = useCallback((): AssessmentResult => {
    const totalQuestions = questions.length;
    const correctAnswers = userResponses.filter(response => {
      const question = questions.find(q => q.id === response.questionId);
      return question && response.selectedAnswer === question.correctAnswer;
    }).length;

    const totalPoints = userResponses.reduce((sum, response) => {
      const question = questions.find(q => q.id === response.questionId);
      return sum + (question && response.selectedAnswer === question.correctAnswer ? question.points : 0);
    }, 0);

    const maxPossiblePoints = questions.reduce((sum, question) => sum + question.points, 0);
    const estimatedScore = (correctAnswers / totalQuestions) * 100;

    // Анализ по темам
    const themeStats: Record<string, { correct: number; total: number; points: number }> = {};
    
    userResponses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (question) {
        if (!themeStats[question.theme]) {
          themeStats[question.theme] = { correct: 0, total: 0, points: 0 };
        }
        themeStats[question.theme].total++;
        if (response.selectedAnswer === question.correctAnswer) {
          themeStats[question.theme].correct++;
          themeStats[question.theme].points += question.points;
        }
      }
    });

    const themeBreakdown = Object.entries(themeStats).map(([theme, stats]) => ({
      theme,
      correct: stats.correct,
      total: stats.total,
      percentage: (stats.correct / stats.total) * 100,
      points: stats.points
    }));

    // Определение уровня подготовки
    let preparationLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (estimatedScore >= 80) preparationLevel = 'advanced';
    else if (estimatedScore >= 60) preparationLevel = 'intermediate';

    // Рекомендуемые темы для изучения (слабые темы)
    const recommendedFocus = themeBreakdown
      .filter(theme => theme.percentage < 60)
      .sort((a, b) => a.percentage - b.percentage)
      .map(theme => theme.theme);

    // Слабые области
    const weakAreas = themeBreakdown
      .filter(theme => theme.percentage < 50)
      .map(theme => theme.theme);

    const result: AssessmentResult = {
      id: `temp_${Date.now()}`,
      subject,
      estimatedScore,
      totalCorrect: correctAnswers,
      totalQuestions,
      themeBreakdown,
      recommendedFocus,
      preparationLevel,
      totalPoints,
      maxPossiblePoints,
      weakAreas,
      timestamp: Date.now(),
      timeSpent,
      userResponses
    };

    return result;
  }, [userResponses, questions, subject, timeSpent]);

  const handleAnswer = useCallback(async (selectedAnswer: string, answerTimeSpent: number) => {
    const currentQuestion = questions[currentIndex];
    
    const response: UserResponse = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect: selectedAnswer === currentQuestion.correctAnswer,
      timeSpent: answerTimeSpent,
      theme: currentQuestion.theme,
      difficulty: currentQuestion.difficulty,
      points: selectedAnswer === currentQuestion.correctAnswer ? currentQuestion.points : 0
    };

    const newResponses = [...userResponses, response];
    setUserResponses(newResponses);

    // Переход к следующему вопросу или завершение теста
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const result = calculateResults();
      setAssessmentResult(result);
      setShowResults(true);
      
      // Сохраняем результаты
      AssessmentService.saveTestResult(result);
      
      // 🔥 АВТОМАТИЧЕСКОЕ СОХРАНЕНИЕ В CSV ФАЙЛ
      await saveResultsToCSV(result);
      
      // Вызываем callback если есть
      if (onComplete) {
        onComplete(result);
      }
    }
  }, [currentIndex, questions, userResponses, calculateResults, onComplete, saveResultsToCSV]);

  const handleSkip = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const progress = ((currentIndex + 1) / questions.length) * 100;

  if (showResults && assessmentResult) {
    return (
      <ResultsView
        estimatedScore={assessmentResult.estimatedScore}
        totalCorrect={assessmentResult.totalCorrect}
        totalQuestions={assessmentResult.totalQuestions}
        themeBreakdown={assessmentResult.themeBreakdown}
        recommendedFocus={assessmentResult.recommendedFocus}
        preparationLevel={assessmentResult.preparationLevel}
        totalPoints={assessmentResult.totalPoints}
        maxPossiblePoints={assessmentResult.maxPossiblePoints}
        weakAreas={assessmentResult.weakAreas}
        userResponses={assessmentResult.userResponses}
        subject={assessmentResult.subject}
        timeSpent={assessmentResult.timeSpent}
        onRetry={() => {
          setCurrentIndex(0);
          setUserResponses([]);
          setShowResults(false);
          setTimeSpent(0);
          setStartTime(Date.now());
          setAssessmentResult(null);
        }}
      />
    );
  }

  if (questions.length === 0) {
    return <div className="p-8 text-center">Загрузка вопросов...</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Вопрос {currentIndex + 1} из {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              Время: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <ProgressBar value={progress} className="mb-4" />
        </div>

        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          onAnswer={handleAnswer}
          onSkip={handleSkip}
        />

        <div className="mt-6">
          <HintSystem 
            question={currentQuestion}
            usedHints={[]}
            onUseHint={() => {}}
          />
        </div>
      </Card>
    </div>
  );
}