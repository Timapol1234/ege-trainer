'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Assessment, StudyPlan } from '@/types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentAssessment: Assessment | null;
  setCurrentAssessment: (assessment: Assessment | null) => void;
  studyPlan: StudyPlan | null;
  setStudyPlan: (plan: StudyPlan | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);

  // Загружаем пользователя из localStorage при инициализации
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Сохраняем пользователя в localStorage при изменении
  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser: handleSetUser,
        currentAssessment,
        setCurrentAssessment,
        studyPlan,
        setStudyPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}