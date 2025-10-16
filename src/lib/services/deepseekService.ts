export interface StudyPlanRequest {
  userId: string;
  currentScore: number;
  targetScore: number;
  examDate: string; // YYYY-MM-DD
  weakAreas: string[];
  strongAreas: string[];
  availableHoursPerWeek: number;
  subject: string;
}

export interface StudyPlanResponse {
  success: boolean;
  plan?: {
    overview: string;
    weeklySchedule: WeekPlan[];
    focusAreas: FocusArea[];
    recommendations: string[];
    estimatedCompletion: string;
  };
  error?: string;
}

export interface WeekPlan {
  weekNumber: number;
  topics: string[];
  goals: string[];
  hoursRequired: number;
  resources?: string[];
}

export interface FocusArea {
  topic: string;
  priority: 'high' | 'medium' | 'low';
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  estimatedHours: number;
}

class DeepSeekService {
  private apiKey: string;
  private baseUrl = 'https://api.deepseek.com/v1';

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
  }

  async generateStudyPlan(request: StudyPlanRequest): Promise<StudyPlanResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('DeepSeek API key not configured');
      }

      const prompt = this.buildPrompt(request);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'Ты - опытный репетитор по подготовке к ЕГЭ. Твоя задача - создавать подробные, персонализированные учебные планы для учеников. Отвечай строго в формате JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Парсим JSON ответ
      const planData = JSON.parse(content);
      
      return {
        success: true,
        plan: planData
      };

    } catch (error) {
      console.error('❌ Ошибка при генерации плана через DeepSeek:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildPrompt(request: StudyPlanRequest): string {
    const daysUntilExam = Math.ceil(
      (new Date(request.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    const weeksUntilExam = Math.ceil(daysUntilExam / 7);

    return `
Создай детальный учебный план подготовки к ЕГЭ по математике.

ИСХОДНЫЕ ДАННЫЕ:
- Текущий уровень: ${request.currentScore}%
- Целевой балл: ${request.targetScore}%
- До экзамена: ${weeksUntilExam} недель (${request.examDate})
- Доступное время: ${request.availableHoursPerWeek} часов в неделю
- Слабые темы: ${request.weakAreas.join(', ')}
- Сильные темы: ${request.strongAreas.join(', ')}

ТРЕБОВАНИЯ К ФОРМАТУ ОТВЕТА:
Верни ответ в формате JSON со следующей структурой:

{
  "overview": "Общее описание плана подготовки",
  "weeklySchedule": [
    {
      "weekNumber": 1,
      "topics": ["тема1", "тема2"],
      "goals": ["цель1", "цель2"],
      "hoursRequired": 10,
      "resources": ["рекомендация1", "рекомендация2"]
    }
  ],
  "focusAreas": [
    {
      "topic": "название темы",
      "priority": "high",
      "currentLevel": 50,
      "targetLevel": 85,
      "estimatedHours": 15
    }
  ],
  "recommendations": ["рекомендация1", "рекомендация2"],
  "estimatedCompletion": "дата завершения подготовки"
}

ОСОБЫЕ УКАЗАНИЯ:
- План должен быть реалистичным и учитывать доступное время
- Сначала удели внимание самым слабым темам
- Включи повторение сильных тем для поддержания уровня
- Предложи конкретные ресурсы и методы обучения
- Учти необходимость практики и решения задач
    `;
  }

  // Функция для быстрой проверки подключения
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const deepseekService = new DeepSeekService();