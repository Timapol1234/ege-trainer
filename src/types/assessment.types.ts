// src/types/assessment.types.ts
export interface AssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'text-input';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface ThemeBreakdown {
  theme: string;
  correct: number;
  total: number;
  percentage: number;
  points: number;
}

export interface AssessmentResult {
  id: string;
  userId?: string;
  subject: string;
  estimatedScore: number;
  totalCorrect: number;
  totalQuestions: number;
  themeBreakdown: ThemeBreakdown[];
  recommendedFocus: string[];
  preparationLevel: 'beginner' | 'intermediate' | 'advanced';
  totalPoints: number;
  maxPossiblePoints: number;
  weakAreas: string[];
  timestamp: number;
  timeSpent: number;
  userResponses: UserResponse[];
}

export interface UserResponse {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface TemporaryAssessmentStorage {
  result: AssessmentResult;
  userGoals?: {
    targetScore: number;
    intensity: 'low' | 'medium' | 'high';
    currentScore: number;
  };
}

export interface AssessmentSession {
  id: string;
  userId?: string;
  subject: string;
  startTime: number;
  endTime?: number;
  currentQuestionIndex: number;
  userResponses: UserResponse[];
  timeLimit?: number;
  completed: boolean;
}

export interface UserStats {
  totalTests: number;
  averageScore: number;
  bestScore: number;
  improvement: number;
  lastTestDate: number;
  totalTimeSpent: number;
  favoriteSubject?: string;
}

export interface ThemeProgress {
  theme: string;
  accuracy: number;
  totalQuestions: number;
  averageTime: number;
  lastAttempt: number;
}