// src/lib/utils/studyPlanUtils.ts
export class StudyPlanUtils {
  static getPlanGenerationData(): PlanGenerationData | null {
    try {
      // Получаем данные пользователя из регистрации
      const userData = localStorage.getItem('user-profile');
      // Получаем результаты тестирования
      const testData = localStorage.getItem('assessment-results');
      
      console.log('🔍 DEBUG - User data from localStorage:', userData);
      console.log('🔍 DEBUG - Test data from localStorage:', testData);
      
      if (!userData) {
        console.warn('❌ No user profile found in localStorage');
        return null;
      }

      if (!testData) {
        console.warn('❌ No assessment results found in localStorage');
        return null;
      }

      const userProfile = JSON.parse(userData);
      const testResults = JSON.parse(testData);

      console.log('🔍 DEBUG - Parsed user profile:', userProfile);
      console.log('🔍 DEBUG - Parsed test results:', testResults);

      // Проверяем наличие обязательных полей
      if (userProfile.initialScore === undefined || userProfile.targetScore === undefined) {
        console.warn('❌ Missing required fields in user profile');
        return null;
      }

      if (!testResults.weakAreas || !testResults.score) {
        console.warn('❌ Missing required fields in test results');
        return null;
      }

      // Определяем уровень пользователя на основе текущего балла и результатов теста
      const userLevel = this.calculateUserLevel(
        userProfile.initialScore, 
        testResults.score
      );

      const planData = {
        // Данные из регистрации
        initialScore: userProfile.initialScore,
        targetScore: userProfile.targetScore,
        
        // Данные из тестирования
        weakThemes: testResults.weakAreas || [],
        strongThemes: testResults.strongAreas || [],
        testScore: testResults.score,
        
        // Дополнительные параметры
        availableHoursPerWeek: userProfile.availableHours || 10,
        examDate: userProfile.examDate ? new Date(userProfile.examDate) : this.getDefaultExamDate(),
        userLevel,
        subjects: userProfile.subjects || ['Математика']
      };

      console.log('🔍 DEBUG - Generated plan data:', planData);
      return planData;

    } catch (error) {
      console.error('❌ Error getting plan generation data:', error);
      return null;
    }
  }

  private static calculateUserLevel(initialScore: number, testScore: number): string {
    const averageScore = (initialScore + testScore) / 2;
    
    if (averageScore < 40) return 'beginner';
    if (averageScore < 65) return 'intermediate';
    if (averageScore < 85) return 'advanced';
    return 'expert';
  }

  private static getDefaultExamDate(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date;
  }

  // ✅ ДОБАВЛЕНО: Сохраняем данные пользователя при регистрации
  static saveUserProfile(profile: {
    initialScore: number;
    targetScore: number;
    availableHours: number;
    examDate?: string;
    subjects: string[];
  }): void {
    try {
      localStorage.setItem('user-profile', JSON.stringify(profile));
      console.log('User profile saved:', profile);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  // ✅ ДОБАВЛЕНО: Сохраняем результаты тестирования
  static saveAssessmentResults(results: {
    score: number;
    weakAreas: string[];
    strongAreas: string[];
  }): void {
    try {
      localStorage.setItem('assessment-results', JSON.stringify(results));
      console.log('Assessment results saved:', results);
    } catch (error) {
      console.error('Error saving assessment results:', error);
    }
  }

  // ✅ ДОБАВЛЕНО: Получаем данные пользователя
  static getUserProfile() {
    try {
      const userData = localStorage.getItem('user-profile');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // ✅ ДОБАВЛЕНО: Получаем результаты тестирования
  static getAssessmentResults() {
    try {
      const testData = localStorage.getItem('assessment-results');
      return testData ? JSON.parse(testData) : null;
    } catch (error) {
      console.error('Error getting assessment results:', error);
      return null;
    }
  }

  // ✅ ДОБАВЛЕНО: Очищаем все данные
  static clearAllData(): void {
    try {
      localStorage.removeItem('user-profile');
      localStorage.removeItem('assessment-results');
      localStorage.removeItem('user-study-plan');
      console.log('All study plan data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  // ✅ ДОБАВЛЕНО: Сохраняем принятый план обучения
  static saveAcceptedPlan(plan: any): void {
    try {
      localStorage.setItem('user-study-plan', JSON.stringify(plan));
      console.log('Study plan saved:', plan);
    } catch (error) {
      console.error('Error saving study plan:', error);
    }
  }

  // ✅ ДОБАВЛЕНО: Получаем сохраненный план обучения
  static getSavedPlan() {
    try {
      const planData = localStorage.getItem('user-study-plan');
      return planData ? JSON.parse(planData) : null;
    } catch (error) {
      console.error('Error getting saved plan:', error);
      return null;
    }
  }
}