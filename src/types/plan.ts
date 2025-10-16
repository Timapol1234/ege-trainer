export interface StudyPlan {
  id: string;
  userId: string;
  overview: string;
  weeklySchedule: WeekPlan[];
  focusAreas: FocusArea[];
  recommendations: string[];
  estimatedCompletion: string;
  createdAt: string;
  targetScore: number;
  currentScore: number;
  examDate: string;
  availableHoursPerWeek: number;
  progress?: number;
}

export interface WeekPlan {
  weekNumber: number;
  topics: string[];
  goals: string[];
  hoursRequired: number;
  resources?: string[];
  completed?: boolean;
  progress?: number;
}

export interface FocusArea {
  topic: string;
  priority: 'high' | 'medium' | 'low';
  currentLevel: number;
  targetLevel: number;
  estimatedHours: number;
  completed?: boolean;
}