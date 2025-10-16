// src/app/learning/plan/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface StudyPlan {
  id: string;
  durationWeeks: number;
  weeklySchedule: any[];
  studyFocus: any;
  resources: any[];
  milestones: any[];
  currentScore: number;
  targetScore: number;
  examDate: string;
  availableHoursPerWeek: number;
  createdAt: string;
  progress: number;
  analytics?: any;
  studyFocus?: {
    studentLevel?: string;
    planType?: string;
  };
}

interface ResourceItem {
  category?: string;
  items?: string[];
  name?: string;
}

export default function StudyPlanPage() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const savedPlan = localStorage.getItem('studyPlan');
    if (savedPlan) {
      setPlan(JSON.parse(savedPlan));
    }
    setIsLoading(false);

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-xl font-light">Создаем ваш персональный план...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-12 max-w-md border border-gray-200 shadow-lg">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-100">
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">План не найден</h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Начните свой путь к успеху на ЕГЭ с персонального плана подготовки
          </p>
          <a 
            href="/assessment" 
            className="inline-flex items-center px-10 py-5 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Создать план обучения
          </a>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round((plan.currentScore / plan.targetScore) * 100);
  const daysUntilExam = Math.ceil((new Date(plan.examDate).getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24));
  const studentLevel = plan.studyFocus?.studentLevel || 'средний';

  const getWeekTasks = (week: any) => {
    if (week.tasks && Array.isArray(week.tasks)) return week.tasks;
    if (week.learningActivities && Array.isArray(week.learningActivities)) {
      return week.learningActivities.map((activity: any) => {
        if (typeof activity === 'string') return activity;
        return `${activity.type}: ${activity.description || activity.exercises || 'Активность'} (${activity.duration}ч)`;
      });
    }
    if (week.focusTopics && Array.isArray(week.focusTopics)) {
      return week.focusTopics.map((topic: any) => {
        if (typeof topic === 'string') return `Изучение темы: ${topic}`;
        return `Изучение темы: ${topic.name} (${topic.hours}ч)`;
      });
    }
    return ['Изучение материалов', 'Практические задания', 'Повторение пройденного'];
  };

  const getWeekTopicNames = (week: any) => {
    if (week.focusTopics && Array.isArray(week.focusTopics)) {
      return week.focusTopics.map((topic: any) => {
        if (typeof topic === 'string') return topic;
        return topic.name || topic;
      });
    }
    return ['Темы не указаны'];
  };

  const getNormalizedResources = () => {
    if (!plan.resources || !Array.isArray(plan.resources)) return [];
    const normalizedResources: string[] = [];
    plan.resources.forEach((resource: ResourceItem | string) => {
      if (typeof resource === 'string') {
        normalizedResources.push(resource);
      } else if (resource && typeof resource === 'object') {
        if (resource.items && Array.isArray(resource.items)) {
          normalizedResources.push(...resource.items);
        } else if (resource.name) {
          normalizedResources.push(resource.name);
        }
      }
    });
    return [...new Set(normalizedResources.filter(Boolean))];
  };

  const normalizedResources = getNormalizedResources();

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800">
      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Хедер */}
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-600">АКТИВНЫЙ ПЛАН</span>
                </div>
                <div className="bg-purple-50 px-4 py-2 rounded-2xl border border-purple-100">
                  <span className="text-sm font-medium text-purple-600 capitalize">{studentLevel} уровень</span>
                </div>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-4">
                Путь к {plan.targetScore} баллам
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Персональная траектория подготовки к ЕГЭ по математике
              </p>
            </div>
            
            {/* Статистика в хедере */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center min-w-[120px] shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{daysUntilExam}</div>
                <div className="text-sm text-gray-600">дней до ЕГЭ</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center min-w-[120px] shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{plan.durationWeeks}</div>
                <div className="text-sm text-gray-600">недель</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center min-w-[120px] shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{plan.availableHoursPerWeek}ч</div>
                <div className="text-sm text-gray-600">в неделю</div>
              </div>
            </div>
          </div>

          {/* Прогресс-бар */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Прогресс подготовки</h2>
                <p className="text-gray-600">От {plan.currentScore} до {plan.targetScore} баллов</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {progressPercentage}%
                </div>
                <div className="text-sm text-gray-600">завершено</div>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-2000 ease-out shadow-sm relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-blue-600">Старт: {plan.currentScore}б</span>
              <span className="text-green-600">Цель: {plan.targetScore}б</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Левая панель - Обзор */}
          <div className="xl:col-span-1 space-y-8">
            {/* Фокус обучения */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mr-4 border border-blue-100">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Фокус обучения</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-blue-600 mb-3 text-lg flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                    Приоритетные темы
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.studyFocus?.priorityTopics?.map((topic: string, index: number) => (
                      <span key={index} className="px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-300">
                        {topic}
                      </span>
                    )) || <span className="text-gray-500 text-sm bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">Не указаны</span>}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-600 mb-3 text-lg flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    Сильные стороны
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.studyFocus?.strongAreas?.map((area: string, index: number) => (
                      <span key={index} className="px-3 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-xl border border-green-100 hover:border-green-300 transition-all duration-300">
                        {area}
                      </span>
                    )) || <span className="text-gray-500 text-sm bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">Не указаны</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Ресурсы */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mr-4 border border-purple-100">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Ресурсы</h2>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {normalizedResources.length > 0 ? (
                  normalizedResources.map((resource, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 group">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300 font-medium">{resource}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    Ресурсы не указаны
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Основная панель - Расписание и вехи */}
          <div className="xl:col-span-3 space-y-8">
            {/* Навигация по неделям */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-6">
                <h2 className="text-3xl font-bold text-gray-900">План по неделям</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveWeek(Math.max(1, activeWeek - 1))}
                      className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="text-center min-w-[120px]">
                      <div className="text-2xl font-bold text-blue-600">
                        Неделя {activeWeek}
                      </div>
                      <div className="text-sm text-gray-600">из {plan.durationWeeks}</div>
                    </div>
                    
                    <button 
                      onClick={() => setActiveWeek(Math.min(plan.durationWeeks, activeWeek + 1))}
                      className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {[1, Math.ceil(plan.durationWeeks/2), plan.durationWeeks].map(weekNum => (
                      <button
                        key={weekNum}
                        onClick={() => setActiveWeek(weekNum)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          weekNum === activeWeek
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Н{weekNum}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Быстрая навигация по неделям */}
              <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
                {Array.from({ length: plan.durationWeeks }, (_, i) => i + 1).map(weekNum => (
                  <button
                    key={weekNum}
                    onClick={() => setActiveWeek(weekNum)}
                    className={`flex-shrink-0 w-12 h-12 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-110 ${
                      weekNum === activeWeek
                        ? 'bg-blue-500 text-white shadow-lg scale-110'
                        : weekNum < activeWeek
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {weekNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Контент активной недели */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Карточка недели */}
              <div className="lg:col-span-2">
                {plan.weeklySchedule
                  ?.filter(week => week.weekNumber === activeWeek)
                  .map((week) => (
                    <div key={week.weekNumber} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                        <div>
                          <h3 className="text-4xl font-bold text-gray-900 mb-2">Неделя {week.weekNumber}</h3>
                          <p className="text-xl text-gray-600 font-light">
                            {typeof week.goals === 'string' ? week.goals : week.goals?.join(' • ') || 'Определите цели недели'}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <span className="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-2xl shadow-sm">
                            {week.totalHours || '?'} часов
                          </span>
                          <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-2xl shadow-sm">
                            Активная
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center text-xl">
                            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center mr-4 border border-blue-100">
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            Основные темы
                          </h4>
                          <div className="space-y-3">
                            {getWeekTopicNames(week).map((topic: string, index: number) => (
                              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 group">
                                <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center mr-4 text-white font-bold text-sm">
                                  {index + 1}
                                </div>
                                <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center text-xl">
                            <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center mr-4 border border-green-100">
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                            Задачи недели
                          </h4>
                          <div className="space-y-3">
                            {getWeekTasks(week).map((task: string, index: number) => (
                              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:border-green-300 transition-all duration-300 group">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 shadow-sm">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-gray-600 font-medium leading-relaxed group-hover:text-gray-800 transition-colors duration-300">{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Вехи прогресса */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg h-full">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mr-4 border border-green-100">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Вехи прогресса</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {plan.milestones?.map((milestone, index) => (
                      <div key={index} className={`p-4 rounded-2xl border transition-all duration-300 ${
                        milestone.week <= activeWeek 
                          ? 'bg-green-50 border-green-200 shadow-sm' 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                              milestone.week <= activeWeek 
                                ? 'bg-green-500 shadow-sm' 
                                : 'bg-gray-400'
                            }`}>
                              {milestone.week}
                            </div>
                            <span className="font-semibold text-gray-900">Неделя {milestone.week}</span>
                          </div>
                          <span className={`text-lg font-bold ${
                            milestone.week <= activeWeek ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {milestone.targetScore}б
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{milestone.description}</p>
                      </div>
                    )) || (
                      <div className="text-center text-gray-500 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                        Вехи не указаны
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fcfcfcff;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}