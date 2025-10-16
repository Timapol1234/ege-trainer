// lib/services/studyPlanGenerator.ts
import { StudyPlan, WeekPlan, UserLevel, Resource } from '@/types/plan';

// База знаний по темам ЕГЭ (пример для информатики)
const EGE_TOPICS = {
  'Информатика': [
    { name: 'Системы счисления', difficulty: 'basic' as const, weight: 0.1 },
    { name: 'Кодирование информации', difficulty: 'basic' as const, weight: 0.08 },
    { name: 'Моделирование', difficulty: 'intermediate' as const, weight: 0.12 },
    { name: 'Алгоритмы и программирование', difficulty: 'advanced' as const, weight: 0.25 },
    { name: 'Базы данных', difficulty: 'intermediate' as const, weight: 0.1 },
    { name: 'Сети и интернет', difficulty: 'basic' as const, weight: 0.08 },
    { name: 'Логика и теория множеств', difficulty: 'intermediate' as const, weight: 0.12 },
    { name: 'Графы и деревья', difficulty: 'advanced' as const, weight: 0.15 }
  ],
  'Математика': [
    { name: 'Алгебра', difficulty: 'basic' as const, weight: 0.2 },
    { name: 'Геометрия', difficulty: 'intermediate' as const, weight: 0.2 },
    { name: 'Теория вероятностей', difficulty: 'intermediate' as const, weight: 0.15 },
    { name: 'Производные', difficulty: 'advanced' as const, weight: 0.25 },
    { name: 'Интегралы', difficulty: 'advanced' as const, weight: 0.2 }
  ]
};

// Ресурсы для каждой темы
const TOPIC_RESOURCES: Record<string, Omit<Resource, 'url' | 'duration' | 'theme'>[]> = {
  'Системы счисления': [
    {
      id: '1',
      title: 'Системы счисления: теория и практика',
      description: 'Полный разбор перевода между системами счисления',
      type: 'textbook',
      difficulty: 'basic'
    },
    {
      id: '2', 
      title: 'Решение задач на системы счисления',
      description: 'Практикум с задачами из ЕГЭ',
      type: 'practice',
      difficulty: 'intermediate'
    }
  ],
  'Алгоритмы и программирование': [
    {
      id: '3',
      title: 'Основы алгоритмизации',
      description: 'Базовые алгоритмы и структуры данных',
      type: 'video',
      difficulty: 'basic'
    },
    {
      id: '4',
      title: 'Сложные алгоритмы ЕГЭ',
      description: 'Разбор продвинутых задач по программированию',
      type: 'practice',
      difficulty: 'advanced'
    }
  ]
  // ... другие ресурсы
};

export class StudyPlanGenerator {
  static generatePlan(userLevel: UserLevel): StudyPlan {
    const scoreDifference = userLevel.targetScore - userLevel.currentScore;
    const intensity = this.calculateIntensity(scoreDifference);
    const durationWeeks = this.calculateDuration(scoreDifference, intensity);
    const focusAreas = this.selectFocusTopics(userLevel);
    
    const weeklySchedule = this.generateWeeklySchedule(
      focusAreas, 
      durationWeeks, 
      userLevel.currentScore,
      intensity
    );

    return {
      id: `plan-${Date.now()}`,
      title: `Интенсивный курс подготовки к ЕГЭ - цель ${userLevel.targetScore} баллов`,
      description: this.generateDescription(userLevel, durationWeeks),
      durationWeeks,
      targetScore: userLevel.targetScore,
      currentScore: userLevel.currentScore,
      focusAreas,
      weeklySchedule,
      resources: this.generateResources(focusAreas),
      goals: this.generateGoals(userLevel, focusAreas),
      intensity
    };
  }

  private static calculateIntensity(scoreDifference: number): 'low' | 'medium' | 'high' {
    if (scoreDifference <= 20) return 'low';
    if (scoreDifference <= 40) return 'medium';
    return 'high';
  }

  private static calculateDuration(scoreDifference: number, intensity: string): number {
    const baseWeeks = Math.ceil(scoreDifference / 10);
    
    switch (intensity) {
      case 'high': return Math.max(4, Math.min(baseWeeks, 12));
      case 'medium': return Math.max(6, Math.min(baseWeeks, 16));
      case 'low': return Math.max(8, Math.min(baseWeeks, 20));
      default: return 8;
    }
  }

  private static selectFocusTopics(userLevel: UserLevel): string[] {
    const subjectTopics = EGE_TOPICS[userLevel.subject as keyof typeof EGE_TOPICS] || EGE_TOPICS.Информатика;
    
    // Исключаем сильные темы и выбираем слабые + дополнительные
    const weakTopics = userLevel.weakTopics || [];
    const availableTopics = subjectTopics
      .filter(topic => !userLevel.strongTopics?.includes(topic.name))
      .sort((a, b) => b.weight - a.weight); // Сначала более важные темы

    // Берем слабые темы + дополняем до 3-5 тем
    const focusCount = Math.min(5, Math.max(3, weakTopics.length || 3));
    const selectedTopics = [...new Set([...weakTopics, ...availableTopics.map(t => t.name)])]
      .slice(0, focusCount);

    return selectedTopics;
  }

  private static generateWeeklySchedule(
    focusAreas: string[], 
    durationWeeks: number,
    currentScore: number,
    intensity: string
  ): WeekPlan[] {
    const weeklySchedule: WeekPlan[] = [];
    const practiceHours = this.getPracticeHours(intensity);

    // Распределяем темы по неделям
    for (let weekNum = 1; weekNum <= durationWeeks; weekNum++) {
      const weekThemes = this.distributeThemes(focusAreas, weekNum, durationWeeks);
      const difficulty = this.calculateWeekDifficulty(weekNum, durationWeeks, currentScore);

      weeklySchedule.push({
        weekNumber: weekNum,
        themes: weekThemes,
        topics: weekThemes,
        tasks: this.generateWeekTasks(weekThemes, difficulty),
        goals: this.generateWeekGoals(weekThemes, weekNum, durationWeeks),
        practiceHours,
        difficulty: difficulty as 'basic' | 'intermediate' | 'advanced', // Приведение типа
        resources: [] // Добавляем пустой массив ресурсов для WeekPlan
      });
    }

    return weeklySchedule;
  }

  private static distributeThemes(themes: string[], weekNum: number, totalWeeks: number): string[] {
    // Первые недели - базовые темы, последние - сложные и повторение
    if (weekNum === 1) {
      return [themes[0], 'Анализ ошибок тестирования'];
    } else if (weekNum === totalWeeks) {
      return ['Повторение всех тем', 'Решения пробного ЕГЭ'];
    } else if (weekNum === totalWeeks - 1) {
      return [themes[themes.length - 1], 'Типичные ошибки ЕГЭ'];
    } else {
      const themeIndex = Math.min(weekNum - 1, themes.length - 1);
      return [themes[themeIndex]];
    }
  }

  private static generateWeekTasks(themes: string[], difficulty: string): string[] {
    const baseTasks = [
      'Изучить теоретический материал по теме',
      'Решить практические задачи базового уровня',
      'Проанализировать типичные ошибки'
    ];

    const advancedTasks = [
      'Решить задачи повышенной сложности',
      'Разобрать задания из прошлых лет ЕГЭ',
      'Выполнить тематический тест'
    ];

    const reviewTasks = [
      'Повторить ключевые концепции',
      'Решить комплексные задачи',
      'Проанализировать timing выполнения'
    ];

    if (themes.includes('Повторение всех тем')) {
      return reviewTasks;
    }

    return difficulty === 'advanced' 
      ? [...baseTasks, ...advancedTasks] 
      : baseTasks;
  }

  private static generateWeekGoals(themes: string[], weekNum: number, totalWeeks: number): string[] {
    if (weekNum === 1) {
      return [
        'Заложить фундамент знаний',
        'Определить слабые места',
        'Освоить базовые концепции'
      ];
    } else if (weekNum === totalWeeks) {
      return [
        'Закрепить все изученные темы',
        'Научиться укладываться в время ЕГЭ',
        'Повысить уверенность в решениях'
      ];
    }

    return [
      `Освоить тему "${themes[0]}"`,
      'Увеличить скорость решения',
      'Снизить количество ошибок'
    ];
  }

  private static generateResources(focusAreas: string[]): Resource[] {
    const resources: Resource[] = [];
    
    for (const topic of focusAreas) {
      const topicResources = TOPIC_RESOURCES[topic];
      if (topicResources) {
        // Приводим типы к Resource
        resources.push(...topicResources.map(resource => ({
          ...resource,
          url: '#', // добавляем обязательные поля
          duration: '60 мин',
          theme: topic
        })));
      }
    }

    // Добавляем общие ресурсы
    resources.push(
      {
        id: 'final-test',
        title: 'Пробный ЕГЭ',
        description: 'Полный пробный экзамен для проверки знаний',
        type: 'test',
        difficulty: 'advanced',
        url: '#',
        duration: '180 мин',
        theme: 'Все темы'
      }
    );

    return resources.slice(0, 10);
  }

  private static generateGoals(userLevel: UserLevel, focusAreas: string[]): string[] {
    return [
      `Увеличить балл с ${userLevel.currentScore} до ${userLevel.targetScore}`,
      `Освоить ${focusAreas.length} сложных тем`,
      'Научиться решать задачи повышенной сложности',
      'Повысить уверенность в решении экзаменационных заданий',
      'Систематизировать знания по всем темам ЕГЭ',
      'Научиться эффективно распределять время на экзамене'
    ];
  }

  private static generateDescription(userLevel: UserLevel, durationWeeks: number): string {
    return `План разработан специально для вас на основе результатов тестирования и включает ${userLevel.weakTopics?.length || 3} основных тем для улучшения. За ${durationWeeks} недель систематической подготовки вы сможете значительно повысить свой уровень знаний и уверенно подойти к экзамену.`;
  }

  private static calculateWeekDifficulty(weekNum: number, totalWeeks: number, currentScore: number): 'basic' | 'intermediate' | 'advanced' {
    if (weekNum === 1) return 'basic';
    if (weekNum <= totalWeeks * 0.6) return 'intermediate';
    return 'advanced';
  }

  private static getPracticeHours(intensity: string): number {
    switch (intensity) {
      case 'high': return 8;
      case 'medium': return 5;
      case 'low': return 3;
      default: return 5;
    }
  }
}