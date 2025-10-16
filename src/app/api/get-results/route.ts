import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/services/databaseService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let results;
    if (userId) {
      results = databaseService.getUserResults(userId);
    } else {
      results = databaseService.getAllResults();
    }

    return NextResponse.json({ 
      success: true, 
      results 
    });
    
  } catch (error) {
    console.error('💥 Ошибка при получении результатов:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении результатов' },
      { status: 500 }
    );
  }
}