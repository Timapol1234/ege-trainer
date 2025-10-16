// src/components/assessment/GoalSetting.tsx
'use client';

import { useState } from 'react';

interface GoalSettingProps {
  currentScore: number;
  onGoalsSet: () => void;
}

export const GoalSetting: React.FC<GoalSettingProps> = ({ 
  currentScore, 
  onGoalsSet 
}) => {
  const [formData, setFormData] = useState({
    targetScore: Math.min(currentScore + 20, 100),
    examDate: '',
    availableHoursPerWeek: 10,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsGenerating(true);

    try {
      // Получаем сохраненные результаты тестирования из localStorage
      const savedResults = localStorage.getItem('assessmentResults');
      const assessmentResults = savedResults ? JSON.parse(savedResults) : {};
      const assessmentId = localStorage.getItem('lastAssessmentId');
      const userId = localStorage.getItem('currentUserId') || 'user-' + Date.now();

      console.log('📊 Using SQLite assessment data:', {
        assessmentId,
        userId,
        savedResults: assessmentResults
      });

      const userData = {
        userId: userId,
        assessmentId: assessmentId, // Привязываем к результатам теста в SQLite БД
        currentScore: currentScore,
        targetScore: formData.targetScore,
        examDate: formData.examDate,
        availableHoursPerWeek: formData.availableHoursPerWeek,
        weakAreas: assessmentResults.weakAreas || [],
        strongAreas: assessmentResults.strongAreas || [],
        subject: 'Математика',
        // Добавляем детальную статистику из результатов теста
        testResults: {
          totalQuestions: assessmentResults.totalQuestions,
          correctAnswers: assessmentResults.correctAnswers,
          estimatedScore: currentScore
        }
      };

      console.log('🚀 Generating plan with SQLite data:', userData);

      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      if (result.success) {
        const fullPlan = {
          id: `plan-${Date.now()}`,
          userId: userData.userId,
          assessmentId: userData.assessmentId, // Сохраняем связь с тестом в SQLite БД
          ...result.plan,
          currentScore: userData.currentScore,
          targetScore: userData.targetScore,
          examDate: userData.examDate,
          availableHoursPerWeek: userData.availableHoursPerWeek,
          createdAt: new Date().toISOString(),
          progress: 0,
          // Сохраняем исходные данные теста
          originalTestResults: {
            totalQuestions: userData.testResults.totalQuestions,
            correctAnswers: userData.testResults.correctAnswers,
            estimatedScore: userData.currentScore
          }
        };
        
        // Сохраняем план в localStorage
        localStorage.setItem('studyPlan', JSON.stringify(fullPlan));
        console.log('✅ Study plan saved to localStorage with SQLite reference:', fullPlan);
        
        onGoalsSet();
      } else {
        alert(`Ошибка при создании плана: ${result.error}`);
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      alert('Произошла ошибка при генерации плана обучения');
    } finally {
      setIsGenerating(false);
    }
  };

  // Вычисляем рекомендуемую дату экзамена (по умолчанию через 3 месяца)
  const getDefaultExamDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Настройка целей обучения</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Целевой балл */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Целевой балл на ЕГЭ
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Текущий: {currentScore}%</span>
            <input
              type="range"
              min={currentScore + 5}
              max={100}
              value={formData.targetScore}
              onChange={(e) => setFormData({...formData, targetScore: parseInt(e.target.value)})}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-blue-600">{formData.targetScore}%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Рекомендуется: {Math.min(currentScore + 20, 100)}% (реалистичная цель)
          </p>
        </div>

        {/* Дата экзамена */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дата экзамена
          </label>
          <input
            type="date"
            required
            value={formData.examDate}
            onChange={(e) => setFormData({...formData, examDate: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-2">
            Рекомендуется установить реальную дату ЕГЭ
          </p>
        </div>

        {/* Доступное время */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Доступное время в неделю (часов)
          </label>
          <select
            value={formData.availableHoursPerWeek}
            onChange={(e) => setFormData({...formData, availableHoursPerWeek: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5 часов (минимум)</option>
            <option value={10}>10 часов (рекомендуется)</option>
            <option value={15}>15 часов (интенсив)</option>
            <option value={20}>20 часов (максимум)</option>
          </select>
          <p className="text-sm text-gray-500 mt-2">
            Учитывайте вашу текущую загруженность
          </p>
        </div>

        {/* Кнопки */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isGenerating}
          >
            Назад к результатам
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Генерация плана...' : 'Сгенерировать персональный план'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalSetting;