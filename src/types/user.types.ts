// src/types/user.types.ts
import { StudyPlan } from './plan';

export interface User {
  id: string;
  email: string;
  profile: UserProfile;
  knowledgeMap?: KnowledgeMap;
  studyPlan?: StudyPlan; // Добавляем поле studyPlan
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  subjects: string[];
  grade: number;
}

export interface KnowledgeMap {
  themeScores: { [theme: string]: number };
  weakThemes: string[];
  strongThemes: string[];
  estimatedScore: number;
}
