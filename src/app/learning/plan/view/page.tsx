'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudyPlanView } from '@/components/study-plan/StudyPlanView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PlanViewPage() {
  const router = useRouter();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlan = () => {
      try {
        const savedPlan = localStorage.getItem('studyPlan');
        if (savedPlan) {
          setPlan(JSON.parse(savedPlan));
        }
      } catch (error) {
        console.error('Error loading plan:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, []);

  const handleAcceptPlan = () => {
    // Логика принятия плана
    console.log('Plan accepted');
    router.push('/dashboard');
  };

  const handleRegeneratePlan = () => {
    router.push('/assessment');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка плана...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full mx-auto p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl text-blue-600">📋</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">План не найден</h2>
          <p className="text-gray-600 mb-6">Пожалуйста, сначала создайте план обучения</p>
          <Button onClick={() => router.push('/learning/plan')} className="w-full">
            Создать план
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <StudyPlanView 
        plan={plan}
        onAccept={handleAcceptPlan}
        onRegenerate={handleRegeneratePlan}
      />
    </div>
  );
}