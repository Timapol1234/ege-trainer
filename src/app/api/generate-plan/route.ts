// src/app/api/generate-plan/route.ts
import { NextRequest, NextResponse } from 'next/server';

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    // Валидация данных
    if (!userData.currentScore || !userData.targetScore || !userData.examDate) {
      return NextResponse.json(
        { success: false, error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      );
    }

    console.log('🚀 Отправка данных в ML систему:', {
      userId: userData.userId,
      currentScore: userData.currentScore,
      targetScore: userData.targetScore,
      examDate: userData.examDate,
      availableHours: userData.availableHoursPerWeek,
      weakAreasCount: userData.weakAreas?.length,
      strongAreasCount: userData.strongAreas?.length
    });

    // Пытаемся получить план от ML системы
    try {
      const response = await fetch(`${ML_API_URL}/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const mlResult = await response.json();
        
        console.log('✅ Получен ML-план с уверенностью:', mlResult.confidence);
        
        return NextResponse.json({
          success: true,
          plan: mlResult.plan,
          recommendations: mlResult.recommendations,
          confidence: mlResult.confidence,
          generatedBy: 'ml_system'
        });
      }
    } catch (mlError) {
      console.log('🔄 ML система недоступна, используем локальный генератор:', mlError);
    }

    // Fallback на локальный генератор
    const localPlan = await generateLocalPlan(userData);
    
    return NextResponse.json({
      success: true,
      plan: localPlan,
      recommendations: [],
      confidence: 0.6,
      generatedBy: 'local_fallback',
      note: 'ML система временно недоступна'
    });
    
  } catch (error) {
    console.error('💥 Критическая ошибка:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Внутренняя ошибка сервера',
        generatedBy: 'error'
      },
      { status: 500 }
    );
  }
}

// Локальный генератор как fallback
async function generateLocalPlan(userData: any) {
  const { localPlanGenerator } = await import('@/lib/services/localPlanGenerator');
  return localPlanGenerator.generateStudyPlan(userData);
}