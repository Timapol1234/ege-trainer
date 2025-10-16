export interface StudyPlanRequest {
  userId: string;
  currentScore: number;
  targetScore: number;
  examDate: string;
  weakAreas: string[];
  strongAreas: string[];
  availableHoursPerWeek: number;
  subject: string;
}

export interface GeneratedPlan {
  overview: string;
  weeklySchedule: WeekPlan[];
  focusAreas: FocusArea[];
  recommendations: string[];
  estimatedCompletion: string;
}

export interface WeekPlan {
  weekNumber: number;
  topics: string[];
  goals: string[];
  hoursRequired: number;
  resources: string[];
}

export interface FocusArea {
  topic: string;
  priority: 'high' | 'medium' | 'low';
  currentLevel: number;
  targetLevel: number;
  estimatedHours: number;
}

export class LocalPlanGenerator {
  
  // Основные темы для ЕГЭ по математике
  private mathTopics = [
    'Алгебраические выражения',
    'Линейные уравнения',
    'Квадратные уравнения',
    'Системы уравнений',
    'Неравенства',
    'Функции и графики',
    'Производная',
    'Интегралы',
    'Тригонометрия',
    'Стереометрия',
    'Планиметрия',
    'Теория вероятностей',
    'Статистика',
    'Текстовые задачи',
    'Экономические задачи',
    'Параметры'
  ];

  // Ресурсы для обучения
  private learningResources = [
    'Учебник: Алгебра и начала анализа',
    'Сборник задач ЕГЭ',
    'Онлайн-курс подготовки',
    'Видеоуроки по теме',
    'Интерактивные тренажеры',
    'Пробные тесты ЕГЭ',
    'Методические пособия'
  ];

  generateStudyPlan(request: StudyPlanRequest): GeneratedPlan {
    const daysUntilExam = Math.ceil(
      (new Date(request.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    // Рассчитываем количество недель
    const weeksUntilExam = Math.max(4, Math.min(24, Math.ceil(daysUntilExam / 7)));
    const scoreImprovement = request.targetScore - request.currentScore;
    const calculatedWeeks = this.calculateOptimalWeeks(scoreImprovement, request.availableHoursPerWeek);
    const totalWeeks = Math.min(weeksUntilExam, calculatedWeeks);

    // Генерируем компоненты плана
    const weeklySchedule = this.generateWeeklySchedule(totalWeeks, request.weakAreas, request.strongAreas);
    const focusAreas = this.generateFocusAreas(request.weakAreas, request.currentScore, request.targetScore);
    const overview = this.generateOverview(request, totalWeeks);
    const recommendations = this.generateRecommendations(request, totalWeeks);
    const estimatedCompletion = this.calculateCompletionDate(totalWeeks);

    return {
      overview,
      weeklySchedule,
      focusAreas,
      recommendations,
      estimatedCompletion
    };
  }

  private calculateOptimalWeeks(scoreImprovement: number, hoursPerWeek: number): number {
    // Эвристика: для улучшения на 1% нужно ~1.5 часа обучения
    const totalHoursNeeded = Math.max(20, scoreImprovement * 1.5);
    const weeks = Math.ceil(totalHoursNeeded / hoursPerWeek);
    return Math.max(4, Math.min(24, weeks)); // Ограничиваем 4-24 неделями
  }

  private generateWeeklySchedule(totalWeeks: number, weakAreas: string[], strongAreas: string[]): WeekPlan[] {
    const schedule: WeekPlan[] = [];
    const allWeakAreas = weakAreas.length > 0 ? weakAreas : this.getRandomTopics(3);
    const allStrongAreas = strongAreas.length > 0 ? strongAreas : this.getRandomTopics(2);

    for (let week = 1; week <= totalWeeks; week++) {
      const isReviewWeek = week % 4 === 0; // Каждая 4-я неделя - повторение
      const isExamPrepWeek = week > totalWeeks - 2; // Последние 2 недели - подготовка к экзамену
      
      let topics: string[];
      let goals: string[];
      let hoursRequired: number;

      if (isExamPrepWeek) {
        // Финальная подготовка
        topics = ['Пробный экзамен', 'Разбор ошибок', 'Повторение сложных тем'];
        goals = [
          'Пройти полный пробный экзамен',
          'Проанализировать и исправить ошибки',
          'Повторить самые сложные темы'
        ];
        hoursRequired = 12;
      } else if (isReviewWeek) {
        // Неделя повторения
        const previousWeeks = schedule.slice(-3);
        const previousTopics = previousWeeks.flatMap(w => w.topics);
        
        topics = ['Повторение пройденного материала', ...this.getRandomTopics(1)];
        goals = [
          'Закрепить знания за предыдущие 3 недели',
          'Решить комплексные задачи',
          'Пройти промежуточное тестирование'
        ];
        hoursRequired = 10;
      } else {
        // Обычная учебная неделя
        const weakAreaIndex = (week - 1) % allWeakAreas.length;
        const strongAreaIndex = (week - 1) % allStrongAreas.length;
        
        topics = [allWeakAreas[weakAreaIndex]];
        
        // Добавляем сильную тему каждую вторую неделю для поддержания уровня
        if (week % 2 === 0 && allStrongAreas.length > 0) {
          topics.push(`${allStrongAreas[strongAreaIndex]} (углубление)`);
        }

        // Добавляем дополнительную тему если время позволяет
        if (week % 3 === 0 && topics.length < 3) {
          topics.push(this.getRandomNewTopic(topics));
        }

        goals = [
          `Освоить тему "${allWeakAreas[weakAreaIndex]}"`,
          'Решить 15+ практических задач',
          'Пройти тестирование по теме',
          'Составить конспект ключевых моментов'
        ];

        hoursRequired = 8 + (week % 3); // 8-10 часов
      }

      schedule.push({
        weekNumber: week,
        topics,
        goals,
        hoursRequired,
        resources: this.getResourcesForWeek(week, topics)
      });
    }

    return schedule;
  }

  private generateFocusAreas(weakAreas: string[], currentScore: number, targetScore: number): FocusArea[] {
    const areasToFocus = weakAreas.length > 0 ? weakAreas : this.getRandomTopics(4);
    
    return areasToFocus.map((area, index) => {
      const priority = index < 2 ? 'high' : index < 4 ? 'medium' : 'low';
      const improvementNeeded = targetScore - currentScore;
      
      return {
        topic: area,
        priority,
        currentLevel: Math.max(20, currentScore - (index + 1) * 8),
        targetLevel: targetScore - (areasToFocus.length - index - 1) * 5,
        estimatedHours: this.calculateHoursForTopic(priority, improvementNeeded)
      };
    });
  }

  private calculateHoursForTopic(priority: string, improvementNeeded: number): number {
    const baseHours = priority === 'high' ? 20 : priority === 'medium' ? 15 : 10;
    return baseHours + Math.floor(improvementNeeded / 10) * 5;
  }

  private generateOverview(request: StudyPlanRequest, totalWeeks: number): string {
    const improvement = request.targetScore - request.currentScore;
    const intensity = request.availableHoursPerWeek >= 12 ? 'интенсивную' : 
                     request.availableHoursPerWeek >= 8 ? 'сбалансированную' : 'щадящую';
    
    return `Персонализированный ${intensity} программу подготовки к ЕГЭ по ${request.subject} на ${totalWeeks} недель. 
    План разработан для улучшения вашего результата с ${request.currentScore}% до ${request.targetScore}% 
    (улучшение на +${improvement}%). Основное внимание уделено ${request.weakAreas.length > 0 ? 
    `слабым темам: ${request.weakAreas.slice(0, 3).join(', ')}` : 'ключевым разделам экзамена'}. 
    Еженедельная нагрузка составляет ${request.availableHoursPerWeek} часов.`;
  }

  private generateRecommendations(request: StudyPlanRequest, totalWeeks: number): string[] {
    const recommendations = [
      'Соблюдайте регулярность занятий - лучше заниматься понемногу каждый день, чем много раз в неделю',
      'Ведите конспект с ключевыми формулами и методами решения',
      'После каждой темы решайте не менее 10-15 практических задач',
      'Раз в 2 недели проходите пробное тестирование для отслеживания прогресса',
      'Не пропускайте недели повторения - они критически важны для закрепления материала'
    ];

    // Персонализированные рекомендации
    if (request.targetScore - request.currentScore > 30) {
      recommendations.push('Рекомендуем дополнительно заниматься по 1-2 часа в выходные для ускорения прогресса');
    }

    if (request.weakAreas.length > 5) {
      recommendations.push('Сфокусируйтесь на 2-3 самых проблемных темах сначала, затем переходите к остальным');
    }

    if (request.availableHoursPerWeek < 8) {
      recommendations.push('Рассмотрите возможность увеличения времени подготовки до 8+ часов в неделю для лучших результатов');
    }

    if (totalWeeks < 8) {
      recommendations.push('В связи с сжатыми сроками подготовки, максимально используйте каждую учебную сессию');
    }

    recommendations.push('Используйте технику Pomodoro: 25 минут занятий, 5 минут перерыва');
    recommendations.push('Создайте учебное пространство без отвлекающих факторов');

    return recommendations;
  }

  private calculateCompletionDate(weeks: number): string {
    const date = new Date();
    date.setDate(date.getDate() + weeks * 7);
    return date.toISOString().split('T')[0];
  }

  private getRandomTopics(count: number): string[] {
    const shuffled = [...this.mathTopics].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private getRandomNewTopic(existingTopics: string[]): string {
    const availableTopics = this.mathTopics.filter(topic => !existingTopics.includes(topic));
    return availableTopics[Math.floor(Math.random() * availableTopics.length)];
  }

  private getResourcesForWeek(week: number, topics: string[]): string[] {
    const resources = [
      ...this.learningResources,
      `Тематические задания по "${topics[0]}"`,
      'Интерактивные тесты платформы',
      'Дополнительные видео материалы'
    ];

    // Добавляем специализированные ресурсы для определенных недель
    if (week % 4 === 0) {
      resources.push('Сборник комплексных задач для повторения');
    }

    if (week > 8) {
      resources.push('Задачи повышенной сложности');
    }

    return resources.slice(0, 4); // Ограничиваем 4 ресурсами на неделю
  }
}

export const localPlanGenerator = new LocalPlanGenerator();