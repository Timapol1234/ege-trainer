// src/app/page.tsx
'use client';

export default function Home() {
  const handleTestPlan = async () => {
    try {
      // Тестовые данные
      const testData = {
        userId: 'test-user-' + Date.now(),
        currentScore: 45,
        targetScore: 85,
        examDate: '2024-06-15',
        availableHoursPerWeek: 10,
        weakAreas: ['Тригонометрия', 'Производная', 'Стереометрия'],
        strongAreas: ['Алгебра', 'Линейные уравнения'],
        subject: 'Математика'
      };

      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const result = await response.json();
      
      if (result.success) {
        // Сохраняем тестовый план
        const fullPlan = {
          id: `plan-${Date.now()}`,
          userId: testData.userId,
          ...result.plan,
          currentScore: testData.currentScore,
          targetScore: testData.targetScore,
          examDate: testData.examDate,
          availableHoursPerWeek: testData.availableHoursPerWeek,
          createdAt: new Date().toISOString(),
          progress: 0
        };
        
        localStorage.setItem('studyPlan', JSON.stringify(fullPlan));
        alert('✅ Тестовый план создан! Переходим к просмотру...');
        window.location.href = '/learning/plan';
      } else {
        alert(`❌ Ошибка: ${result.error}`);
      }
    } catch (error) {
      alert('❌ Ошибка при создании тестового плана');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl mx-auto">
        {/* Логотип */}
        <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-3xl text-white font-bold">📚</span>
        </div>
        
        {/* Заголовок */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          EGE Trainer
        </h1>
        
        {/* Описание */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Интеллектуальная система подготовки к ЕГЭ по математике. 
          Персональные планы обучения, адаптивное тестирование и подробная аналитика.
        </p>
        
        {/* Кнопка начала */}
        <div className="space-y-4">
          <a 
            href="/register" 
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Начать подготовку
          </a>
          
          {/* Тестовая кнопка для разработки */}
          <div className="pt-4 border-t border-gray-200 mt-6">
            <button 
              onClick={handleTestPlan}
              className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium text-sm hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              🚀 Тест: Создать учебный план
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Для тестирования генератора планов (разработка)
            </p>
          </div>
          
          {/* Дополнительная информация */}
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500 mt-6">
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Адаптивное обучение
            </div>
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Подробная аналитика
            </div>
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Персональный план
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}