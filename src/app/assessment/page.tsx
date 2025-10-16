// src/app/assessment/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { QuestionCard } from '@/components/assessment/QuestionCard';
import { ResultsView } from '@/components/assessment/ResultsView';
import { getAssessmentQuestions } from '@/lib/constants/questions';
import { useTimer } from '@/lib/hooks/useTimer';
import type { AssessmentQuestion, UserResponse, AssessmentResult } from '@/types/assessment.types';

// Функции для расчета результатов
const calculateScore = (responses: UserResponse[], questions: AssessmentQuestion[]): number => {
  return responses.filter(response => {
    const question = questions.find(q => q.id === response.questionId);
    return question?.correctAnswer === response.selectedAnswer;
  }).length;
};

const calculateThemeBreakdown = (responses: UserResponse[], questions: AssessmentQuestion[]) => {
  const themeStats: { [theme: string]: { correct: number, total: number, points: number } } = {};

  responses.forEach(response => {
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

  return Object.entries(themeStats).map(([theme, stats]) => ({
    theme,
    correct: stats.correct,
    total: stats.total,
    percentage: Math.round((stats.correct / stats.total) * 100),
    points: stats.points
  }));
};

export default function Assessment() {
  const router = useRouter();
  const { user, setUser } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSavingResults, setIsSavingResults] = useState(false);
  const { time, start, stop, reset } = useTimer();

  // Загружаем вопросы при монтировании компонента
  useEffect(() => {
    const loadedQuestions = getAssessmentQuestions();
    setQuestions(loadedQuestions);
  }, []);

  // Запускаем таймер при смене вопроса
  useEffect(() => {
    if (assessmentStarted && questions.length > 0) {
      reset();
      start();
      setQuestionStartTime(Date.now());
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, assessmentStarted, questions.length]);

  const startAssessment = () => {
    setAssessmentStarted(true);
    reset();
    start();
    setQuestionStartTime(Date.now());
  };

  // Функция для сохранения результатов в базу данных
  const saveResultsToDatabase = async (result: AssessmentResult, responses: UserResponse[]) => {
  if (!user) {
    console.log('❌ Пользователь не авторизован, сохранение невозможно');
    return;
  }

  try {
    setIsSavingResults(true);
    
    console.log('💾 Подготовка к сохранению результатов:', {
      estimatedScore: result.estimatedScore,
      totalCorrect: result.totalCorrect,
      totalQuestions: result.totalQuestions,
      timeSpent: time
    });
    
    // Получаем ID пользователя из базы данных
    let numericUserId: number;
    
    try {
      const response = await fetch('/api/auth/get-user-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      
      if (response.ok) {
        const data = await response.json();
        numericUserId = data.userId;
        console.log('✅ Найден ID пользователя в базе:', numericUserId);
      } else {
        // Если пользователь не найден, создаем временный ID на основе email
        numericUserId = Math.abs(user.email.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0));
        console.log('⚠️ Пользователь не найден в базе, используем временный ID:', numericUserId);
      }
    } catch (error) {
      console.error('❌ Ошибка получения ID пользователя:', error);
      numericUserId = Math.abs(user.email.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0));
    }
    
    // Определяем основной предмет тестирования
    const mainSubject = 'Математика';
    
    // Подготавливаем данные для сохранения
    const saveData = {
      userId: numericUserId,
      subject: mainSubject,
      score: result.estimatedScore, // Это обязательное поле!
      totalQuestions: result.totalQuestions,
      correctAnswers: result.totalCorrect,
      timeSpent: time, // общее время теста в секундах
      testData: {
        questions: questions.map(q => ({
          id: q.id,
          theme: q.theme,
          points: q.points,
          correctAnswer: q.correctAnswer
        })),
        responses: responses,
        themeBreakdown: result.themeBreakdown,
        preparationLevel: result.preparationLevel,
        weakAreas: result.weakAreas,
        recommendedFocus: result.recommendedFocus,
        userEmail: user.email,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('📤 Отправка данных для сохранения:', saveData);

    const saveResponse = await fetch('/api/test-results/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saveData)
    });

    if (saveResponse.ok) {
      const data = await saveResponse.json();
      console.log('✅ Результаты теста успешно сохранены в базу данных, ID:', data.resultId);
    } else {
      const errorData = await saveResponse.json();
      console.error('❌ Ошибка сохранения результатов:', errorData);
      
      // Показываем сообщение об ошибке пользователю
      if (errorData.error) {
        console.error('Детали ошибки:', errorData.error);
      }
    }
  } catch (error) {
    console.error('❌ Ошибка при сохранении результатов:', error);
  } finally {
    setIsSavingResults(false);
  }
};

  const handleAnswerSelect = (answer: string) => {
    if (!questions[currentQuestionIndex]) return;

    console.log('Answer selected:', answer);
    setSelectedAnswer(answer);

    // Рассчитываем время, затраченное на вопрос
    const timeSpentOnQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
    
    const response: UserResponse = {
      questionId: questions[currentQuestionIndex].id,
      selectedAnswer: answer,
      timeSpent: timeSpentOnQuestion,
      theme: questions[currentQuestionIndex].theme
    };

    const newResponses = [...userResponses, response];
    setUserResponses(newResponses);

    // Автоматический переход к следующему вопросу
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        stop();
        const result = completeAssessment(newResponses);
        setAssessmentResult(result);
        setShowResults(true);
        
        // Сохраняем результаты в базу данных
        saveResultsToDatabase(result, newResponses);
      }
    }, 500);
  };

  const completeAssessment = (responses: UserResponse[]): AssessmentResult => {
    const score = calculateScore(responses, questions);
    const themeBreakdown = calculateThemeBreakdown(responses, questions);
    
    const weakAreas = themeBreakdown
      .filter(theme => theme.percentage < 60)
      .map(theme => theme.theme);
    
    const totalPoints = themeBreakdown.reduce((sum, theme) => sum + theme.points, 0);
    const maxPossiblePoints = questions.reduce((sum, q) => sum + q.points, 0);

    const estimatedScore = Math.round((score / questions.length) * 100);

    let preparationLevel: 'beginner' | 'intermediate' | 'advanced';
    if (estimatedScore < 40) {
      preparationLevel = 'beginner';
    } else if (estimatedScore < 70) {
      preparationLevel = 'intermediate';
    } else {
      preparationLevel = 'advanced';
    }

    const result: AssessmentResult = {
      estimatedScore,
      totalCorrect: score,
      totalQuestions: questions.length,
      themeBreakdown,
      recommendedFocus: weakAreas.slice(0, 3),
      preparationLevel,
      totalPoints,
      maxPossiblePoints,
      weakAreas,
      timeSpent: time // добавляем общее время теста
    };

    console.log('Assessment completed:', result);
    
    // Обновляем данные пользователя
    if (user) {
      const themeScores: { [theme: string]: number } = {};
      themeBreakdown.forEach(theme => {
        themeScores[theme.theme] = theme.percentage / 100;
      });

      const strongThemes = themeBreakdown
        .filter(theme => theme.percentage >= 80)
        .map(theme => theme.theme);

      const updatedUser = {
        ...user,
        knowledgeMap: {
          themeScores,
          weakThemes: weakAreas,
          strongThemes,
          estimatedScore: result.estimatedScore,
          lastAssessmentDate: new Date().toISOString()
        }
      };
      setUser(updatedUser);
    }

    return result;
  };

  const handleContinue = () => {
    if (isSavingResults) {
      // Если еще сохраняем результаты, ждем немного
      setTimeout(handleContinue, 500);
      return;
    }
    router.push('/dashboard'); // Перенаправляем в личный кабинет вместо плана обучения
  };

  // Загрузка вопросов
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Загрузка вопросов...</p>
        </div>
      </div>
    );
  }

  // Экран начала тестирования
  if (!assessmentStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Диагностический тест
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Пройдите тестирование, чтобы мы могли создать персональный план подготовки к ЕГЭ
            </p>
          </div>

          {/* Основной контент в две колонки */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Левая колонка - информация о тесте */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-2 h-8 bg-blue-600 rounded-full mr-4"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Информация о тесте</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-blue-600 font-bold text-xl">📊</span>
                      </div>
                      <div>
                        <div className="text-gray-600 text-sm">Количество вопросов</div>
                        <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-green-600 font-bold text-xl">⏱️</span>
                      </div>
                      <div>
                        <div className="text-gray-600 text-sm">Примерное время</div>
                        <div className="text-xl font-bold text-green-600">15-20 минут</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-purple-600 font-bold text-xl">📚</span>
                      </div>
                      <div>
                        <div className="text-gray-600 text-sm">Предметы</div>
                        <div className="text-lg font-bold text-purple-600">
                          Математика
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка - призыв к действию */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center h-full flex flex-col justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">🎯</span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Готовы начать?
                </h2>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Тест поможет определить ваш текущий уровень знаний и создать оптимальную программу подготовки к экзаменам
                </p>

                <button
                  onClick={startAssessment}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-6"
                >
                  Начать тестирование
                </button>

                <div className="flex items-center justify-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Результаты будут сохранены в вашем профиле
                </div>
              </div>
            </div>
          </div>

          {/* Сноска с советами */}
          <div className="bg-yellow-50 rounded-xl shadow-lg p-6 border-l-4 border-yellow-400">
            <h3 className="font-bold text-yellow-800 text-lg mb-4 flex items-center justify-center">
              <span className="text-xl mr-2">💡</span>
              Советы по прохождению теста
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 text-lg">👀</span>
                </div>
                <h4 className="font-semibold text-yellow-800 text-sm mb-1">Внимательно читайте</h4>
                <p className="text-yellow-700 text-xs">Изучайте каждый вопрос</p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 text-lg">✅</span>
                </div>
                <h4 className="font-semibold text-yellow-800 text-sm mb-1">Выбирайте точно</h4>
                <p className="text-yellow-700 text-xs">Правильный вариант ответа</p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 text-lg">🕒</span>
                </div>
                <h4 className="font-semibold text-yellow-800 text-sm mb-1">Не торопитесь</h4>
                <p className="text-yellow-700 text-xs">Время не ограничено</p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 text-lg">🎯</span>
                </div>
                <h4 className="font-semibold text-yellow-800 text-sm mb-1">Отвечайте честно</h4>
                <p className="text-yellow-700 text-xs">Для точного плана подготовки</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Экран результатов
  if (showResults && assessmentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <ResultsView result={assessmentResult} onContinue={handleContinue} />
          {isSavingResults && (
            <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Сохранение результатов...
            </div>
          )}
        </div>
      </div>
    );
  }

  // Основной экран тестирования
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Прогресс-бар */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600">
              Вопрос {currentQuestionIndex + 1} из {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                transition: 'width 0.5s ease-out'
              }}
            />
          </div>
        </div>

        {/* Карточка вопроса */}
        <div className="transform transition-all duration-300 hover:shadow-xl">
          <QuestionCard
            question={questions[currentQuestionIndex]}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        </div>

        {/* Подсказка */}
        {!selectedAnswer && (
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm animate-pulse">
              Выберите ответ, чтобы продолжить...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}