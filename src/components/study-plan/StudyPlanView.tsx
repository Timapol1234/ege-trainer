import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { StudyPlan } from '@/types/plan';

interface StudyPlanViewProps {
  plan: StudyPlan;
  onAccept: () => void;
  onRegenerate: () => void;
}

export function StudyPlanView({ plan, onAccept, onRegenerate }: StudyPlanViewProps) {
  const totalWeeks = plan.weeklySchedule?.length || 0;
  const completedWeeks = plan.weeklySchedule?.filter(week => week.completed).length || 0;
  const progressPercentage = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;

  const totalHours = plan.weeklySchedule?.reduce((sum, week) => sum + (week.hoursRequired || 0), 0) || 0;

  const daysUntilExam = Math.ceil(
    (new Date(plan.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Шапка плана */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {plan.overview || 'Персонализированный план подготовки'}
            </h1>
            <p className="text-lg text-gray-600">
              Сгенерирован с помощью AI на основе ваших целей
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

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xl font-bold text-blue-600">{totalWeeks}</div>
            <div className="text-sm text-gray-600">Недель</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xl font-bold text-purple-600">{totalHours}</div>
            <div className="text-sm text-gray-600">Часов</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xl font-bold text-orange-600">{daysUntilExam}</div>
            <div className="text-sm text-gray-600">Дней до экзамена</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-xl font-bold text-green-600">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">Прогресс</div>
          </div>
        </div>

        <ProgressBar value={progressPercentage} className="mb-6" />

        <div className="flex gap-4">
          <Button 
            onClick={onAccept}
            className="bg-green-600 hover:bg-green-700 px-8 py-3"
          >
            ✅ Принять план
          </Button>
          <Button 
            onClick={onRegenerate}
            variant="outline"
            className="px-8 py-3"
          >
            🔄 Сгенерировать заново
          </Button>
        </div>
      </Card>

      {/* Детали плана */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Еженедельное расписание */}
        <div className="xl:col-span-2">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">📅 Еженедельное расписание</h2>
            <div className="space-y-4">
              {plan.weeklySchedule?.map((week, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">Неделя {week.weekNumber}</h3>
                    <span className="text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded">
                      {week.hoursRequired} ч/нед
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Темы:</h4>
                    <div className="flex flex-wrap gap-2">
                      {week.topics?.map((topic, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Цели недели:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {week.goals?.map((goal, idx) => (
                        <li key={idx}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          {/* Рекомендации */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">💡 Рекомендации</h2>
            <ul className="space-y-2">
              {plan.recommendations?.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Информация об экзамене */}
          <Card className="p-6 bg-orange-50 border-orange-200">
            <h2 className="text-xl font-bold mb-3 text-orange-900">🎯 Информация об экзамене</h2>
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}