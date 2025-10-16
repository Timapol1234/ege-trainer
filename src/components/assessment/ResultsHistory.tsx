import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';

interface AssessmentResult {
  id: number;
  userId: string;
  subject: string;
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timestamp: string;
}

export function ResultsHistory() {
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/get-results');
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Ошибка при загрузке результатов:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Загрузка истории результатов...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">История результатов</h2>
      
      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{result.subject} - {result.topic}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(result.timestamp).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">
                  {result.correctAnswers}/{result.totalQuestions}
                </p>
                <p className="text-sm text-gray-600">
                  {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}