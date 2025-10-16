import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/services/databaseService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const stats = databaseService.getUserStats(userId);

    return NextResponse.json({ 
      success: true, 
      stats 
    });
    
  } catch (error) {
    console.error('💥 Ошибка при получении статистики:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении статистики' },
      { status: 500 }
    );
  }
}