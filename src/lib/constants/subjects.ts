// src/lib/constants/subjects.ts
export const SUBJECTS = [
  'Mathematics',
  'Physics', 
  'Chemistry',
  'Biology',
  'Computer Science'
] as const;

export const SUBJECT_QUESTIONS = {
  'Mathematics': 'MATH_QUESTIONS',
  'Physics': 'PHYSICS_QUESTIONS',
  'Chemistry': 'CHEMISTRY_QUESTIONS',
  'Biology': 'BIOLOGY_QUESTIONS'
} as const;