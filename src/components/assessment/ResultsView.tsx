// src/components/assessment/ResultsView.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GoalSetting } from './GoalSetting';
import { AssessmentResult } from '@/types/assessment.types';
import { clientDatabaseService } from '@/lib/services/clientDatabaseService';

interface ResultsViewProps {
  result: AssessmentResult;
  onContinue: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onContinue }) => {
  const router = useRouter();
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAssessmentId, setSavedAssessmentId] = useState<string | null>(null);

  // 🔥 СОХРАНЕНИЕ РЕЗУЛЬТАТОВ В БАЗУ ДАННЫХ SQLite
  useEffect(() => {
    const saveResultsToDB = async () => {
      try {
        setIsSaving(true);
        
        // Вычисляем общую статистику
        const totalQuestions = result.themeBreakdown.reduce((total, theme) => total + theme.total, 0);
        const correctAnswers = result.themeBreakdown.reduce((total, theme) => total + theme.correct, 0);
        const incorrectAnswers = totalQuestions - correctAnswers;

        // Подготавливаем данные для сохранения в БД (соответствует вашей схеме)
        const assessmentData = {
          userId: 'user-' + Date.now(),
          subject: 'Математика',
          topic: 'Входное тестирование',
          totalQuestions: totalQuestions,
          correctAnswers: correctAnswers,
          incorrectAnswers: incorrectAnswers,
          timestamp: new Date().toISOString()
        };

        console.log('💾 Saving assessment data to SQLite:', assessmentData);

        // Сохраняем в БД через ваш клиентский сервис
        const success = await clientDatabaseService.saveResult(assessmentData);
        
        if (success) {
          console.log('✅ Результаты успешно сохранены в SQLite базу данных');
          
          // Получаем последние результаты для получения ID
          const userResults = await clientDatabaseService.getUserResults(assessmentData.userId);
          if (userResults.length > 0) {
            const latestResult = userResults[0];
            setSavedAssessmentId(latestResult.id?.toString() || null);
            localStorage.setItem('lastAssessmentId', latestResult.id?.toString() || '');
            localStorage.setItem('currentUserId', assessmentData.userId);
          }
        } else {
          console.error('❌ Ошибка сохранения в SQLite базу данных');
        }
      } catch (error) {
        console.error('❌ Ошибка при сохранении результатов в SQLite:', error);
      } finally {
        setIsSaving(false);
      }
    };

    saveResultsToDB();
  }, [result]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Отлично! У вас прочные знания.';
    if (score >= 60) return 'Хорошо! Есть куда расти.';
    return 'Требуется работа. Сосредоточьтесь на рекомендуемых темах.';
  };

  // Обработчик для кнопки "Создать план обучения"
  const handleCreatePlan = () => {
    // Сохраняем результаты в localStorage для GoalSetting
    const testResults = {
      score: result.estimatedScore,
      weakAreas: result.recommendedFocus,
      strongAreas: result.themeBreakdown
        .filter(theme => theme.percentage >= 70)
        .map(theme => theme.theme),
      assessmentId: savedAssessmentId || localStorage.getItem('lastAssessmentId'),
      userId: localStorage.getItem('currentUserId') || 'user-' + Date.now(),
      totalQuestions: result.themeBreakdown.reduce((total, theme) => total + theme.total, 0),
      correctAnswers: result.themeBreakdown.reduce((total, theme) => total + theme.correct, 0)
    };
    
    localStorage.setItem('assessmentResults', JSON.stringify(testResults));
    console.log('💾 Assessment results saved to localStorage:', testResults);
    
    setShowGoalSetting(true);
  };

  // Обработчик когда цели установлены
  const handleGoalsSet = () => {
    router.push('/learning/plan');
  };

  // Если показываем настройку целей
  if (showGoalSetting) {
    return (
      <GoalSetting 
        currentScore={result.estimatedScore}
        onGoalsSet={handleGoalsSet}
      />
    );
  }

  // Разделяем темы на сильные и слабые
  const strongThemes = result.themeBreakdown.filter(theme => theme.percentage >= 70);
  const weakThemes = result.themeBreakdown.filter(theme => theme.percentage < 60);

  // Вычисляем общую статистику
  const totalQuestions = result.themeBreakdown.reduce((total, theme) => total + theme.total, 0);
  const correctAnswers = result.themeBreakdown.reduce((total, theme) => total + theme.correct, 0);

  return (
    <Card className="max-w-6xl w-full mx-auto border-0 shadow-2xl rounded-3xl overflow-hidden">
      {/* Светлый хедер */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 px-8 py-12 border-b border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Результаты тестирования</h1>
          <p className="text-gray-600 text-xl">
            Вот как вы справились с заданиями
            {isSaving && (
              <span className="text-green-600 ml-2">⏳ Сохраняем в базу данных...</span>
            )}
            {savedAssessmentId && (
              <span className="text-green-600 ml-2">✅ Сохранено (ID: {savedAssessmentId})</span>
            )}
          </p>
        </div>

        {/* Основной счет */}
        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-lg border border-gray-200">
          <div className="text-center mb-4">
            <span className="text-2xl font-bold text-gray-700 block mb-2">
              ОБЩИЙ РЕЗУЛЬТАТ
            </span>
            <div className="flex items-center justify-center space-x-4">
              <div className={`text-7xl font-bold ${getScoreColor(result.estimatedScore)}`}>
                {result.estimatedScore}%
              </div>
            </div>
            <p className={`text-xl font-semibold mt-4 ${getScoreColor(result.estimatedScore)}`}>
              {getScoreMessage(result.estimatedScore)}
            </p>
            
            {/* Детальная статистика */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
                <div className="text-gray-600">всего вопросов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-gray-600">правильно</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
                <div className="text-gray-600">ошибок</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="px-8 py-8 bg-white">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Левая колонка - Результаты по темам */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-xl">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Результаты по темам</h2>
                <p className="text-gray-600">Детальная статистика по каждой теме</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 flex-1">
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {result.themeBreakdown.map(theme => (
                  <div key={theme.theme} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {theme.theme}
                      </h3>
                      <div className={`text-xl font-bold ${
                        theme.percentage >= 80 ? 'text-green-600' : 
                        theme.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {theme.percentage}%
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{theme.correct} из {theme.total} правильных</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          theme.percentage >= 80 ? 'bg-green-500' : 
                          theme.percentage >= 60 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${theme.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Правая колонка - Рекомендации */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-xl">
                <span className="text-purple-600 text-xl">🎯</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Рекомендации</h2>
                <p className="text-gray-600">Персонализированные советы по подготовке</p>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              {/* Сильные стороны */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200 h-fit">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-green-600 text-lg">💪</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800 text-lg">Сильные стороны</h3>
                    <p className="text-green-600 text-sm">Темы, которые вы хорошо знаете</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {strongThemes.length > 0 ? (
                    strongThemes.map(theme => (
                      <span 
                        key={theme.theme} 
                        className="bg-white text-green-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm border border-green-200 flex items-center space-x-2"
                      >
                        <span className="text-green-500">✓</span>
                        <span>{theme.theme}</span>
                      </span>
                    ))
                  ) : (
                    <div className="text-center w-full py-4">
                      <span className="text-green-600 text-lg">📈</span>
                      <p className="text-green-700 text-sm mt-2">Продолжайте практиковаться для развития сильных сторон</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Над чем поработать */}
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200 h-fit">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <span className="text-orange-600 text-lg">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-orange-800 text-lg">Над чем поработать</h3>
                    <p className="text-orange-600 text-sm">Темы для улучшения результатов</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {result.recommendedFocus.slice(0, 5).map((theme, index) => (
                    <div 
                      key={theme}
                      className="bg-white text-orange-700 p-4 rounded-xl shadow-sm border border-orange-200 flex items-center space-x-3"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-red-500' :
                        index === 1 ? 'bg-orange-500' :
                        index === 2 ? 'bg-yellow-500' : 
                        'bg-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium flex-1">{theme}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">{result.themeBreakdown.length}</div>
                  <div className="text-xs text-gray-600 mt-1">Всего тем</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">{strongThemes.length}</div>
                  <div className="text-xs text-gray-600 mt-1">Освоено тем</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-orange-600">{result.recommendedFocus.length}</div>
                  <div className="text-xs text-gray-600 mt-1">Для улучшения</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Button 
            onClick={handleCreatePlan}
            disabled={isSaving}
            className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Сохранение...' : 'Создать план обучения'}
          </Button>
        </div>

        {/* Призыв к действию */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Готовы улучшить свои результаты?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg">
            На основе ваших результатов мы создадим персонализированный план подготовки, 
            который поможет вам сосредоточиться на самых важных темах и эффективно подготовиться к ЕГЭ
          </p>
          <div className="text-sm text-green-600 font-medium flex items-center justify-center space-x-2">
            <span>✅</span>
            <span>
              {isSaving ? 'Сохранение в SQLite базу данных...' : 
               savedAssessmentId ? `Результаты сохранены в БД (ID: ${savedAssessmentId})` : 
               'Результаты теста будут сохранены автоматически'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultsView;