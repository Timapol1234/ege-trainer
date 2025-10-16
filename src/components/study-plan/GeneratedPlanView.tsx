import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { StudyPlan } from '@/types/plan';

interface GeneratedPlanViewProps {
  plan: StudyPlan;
  onBack?: () => void;
  onStartLearning?: () => void;
}

export function GeneratedPlanView({ plan, onBack, onStartLearning }: GeneratedPlanViewProps) {
  const totalWeeks = plan.weeklySchedule.length;
  const completedWeeks = plan.weeklySchedule.filter(week => week.completed).length;
  const progressPercentage = Math.round((completedWeeks / totalWeeks) * 100);

  const totalHours = plan.weeklySchedule.reduce((sum, week) => sum + week.hoursRequired, 0);
  const completedHours = plan.weeklySchedule
    .filter(week => week.completed)
    .reduce((sum, week) => sum + week.hoursRequired, 0);

  const daysUntilExam = Math.ceil(
    (new Date(plan.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Шапка плана */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Ваш учебный план
            </h1>
            <p className="text-xl text-gray-600">
              Персонализированная программа подготовки к ЕГЭ по математике
            </p>
          </div>
          <div className="text-right space-y-2">
            <div>
              <div className="text-sm text-gray-500">Текущий балл</div>
              <div className="text-2xl font-bold text-blue-600">{plan.currentScore}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Целевой балл</div>
              <div className="text-2xl font-bold text-green-600">{plan.targetScore}%</div>
            </div>
          </div>
        </div>

        {/* Общая статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{totalWeeks}</div>
            <div className="text-sm text-gray-600">Недель обучения</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{totalHours}</div>
            <div className="text-sm text-gray-600">Часов подготовки</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{daysUntilExam}</div>
            <div className="text-sm text-gray-600">Дней до экзамена</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">Прогресс</div>
          </div>
        </div>

        <ProgressBar value={progressPercentage} className="mb-4" />

        <div className="flex gap-4">
          {onBack && (
            <Button onClick={onBack} variant="outline">
              ← Назад к настройкам
            </Button>
          )}
          <Button onClick={onStartLearning} className="bg-green-600 hover:bg-green-700">
            🚀 Начать обучение
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Левая колонка - Обзор плана */}
        <div className="xl:col-span-2 space-y-6">
          {/* Общее описание */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Обзор плана</h2>
            <p className="text-gray-700 leading-relaxed">{plan.overview}</p>
          </Card>

          {/* Еженедельное расписание */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Еженедельное расписание</h2>
            <div className="space-y-4">
              {plan.weeklySchedule.map((week) => (
                <div key={week.weekNumber} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">Неделя {week.weekNumber}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{week.hoursRequired} ч/нед</span>
                      {week.completed && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Завершено
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Темы:</h4>
                    <div className="flex flex-wrap gap-2">
                      {week.topics.map((topic, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Цели:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {week.goals.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>

                  {week.resources && week.resources.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Ресурсы:</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {week.resources.map((resource, index) => (
                          <li key={index}>{resource}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Правая колонка - Фокусные области и рекомендации */}
        <div className="space-y-6">
          {/* Фокусные области */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Фокусные области</h2>
            <div className="space-y-3">
              {plan.focusAreas.map((area, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{area.topic}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(area.priority)}`}>
                      {area.priority === 'high' ? 'Высокий' : 
                       area.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Текущий уровень: {area.currentLevel}%</span>
                      <span>Цель: {area.targetLevel}%</span>
                    </div>
                    <ProgressBar value={area.currentLevel} className="h-2" />
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Оцененное время: {area.estimatedHours} часов
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Рекомендации */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Рекомендации</h2>
            <ul className="space-y-2">
              {plan.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Информация об экзамене */}
          <Card className="p-6 bg-orange-50 border-orange-200">
            <h2 className="text-xl font-bold mb-3 text-orange-900">Информация об экзамене</h2>
            <div className="space-y-2 text-orange-800">
              <div className="flex justify-between">
                <span>Дата экзамена:</span>
                <span className="font-medium">{new Date(plan.examDate).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex justify-between">
                <span>До экзамена:</span>
                <span className="font-medium">{daysUntilExam} дней</span>
              </div>
              <div className="flex justify-between">
                <span>Время в неделю:</span>
                <span className="font-medium">{plan.availableHoursPerWeek} часов</span>
              </div>
              <div className="flex justify-between">
                <span>Завершение подготовки:</span>
                <span className="font-medium">{new Date(plan.estimatedCompletion).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}