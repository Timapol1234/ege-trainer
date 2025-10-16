import { NextRequest, NextResponse } from 'next/server';
import { saveTestResult } from '@/lib/services/testResultsService';

export async function POST(request: NextRequest) {
  try {
    const { userId, subject, score, totalQuestions, correctAnswers, timeSpent, testData } = await request.json();
    
    if (!userId || !subject || score === undefined) {
      return NextResponse.json(
        { error: 'Обязательные поля: userId, subject, score' },
        { status: 400 }
      );
    }
    
    console.log(`Сохранение результата теста для пользователя ${userId}`);
    
    const resultId = await saveTestResult({
      userId,
      subject,
      score,
      totalQuestions: totalQuestions || 0,
      correctAnswers: correctAnswers || 0,
      timeSpent: timeSpent || 0,
      testData: testData || {}
    });
    
    return NextResponse.json({ 
      success: true,
      resultId,
      message: 'Результат теста сохранен'
    });
    
  } catch (error) {
    console.error('Save test result error:', error);
    return NextResponse.json(
      { error: 'Ошибка при сохранении результата теста' },
      { status: 500 }
    );
  }
}