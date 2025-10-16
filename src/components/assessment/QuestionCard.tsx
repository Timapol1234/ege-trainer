// src/components/assessment/QuestionCard.tsx
'use client';

import { AssessmentQuestion } from '@/types/assessment.types';
import { LatexRenderer } from '@/components/ui/LatexRenderer';

interface QuestionCardProps {
  question: AssessmentQuestion;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions
}) => {
  const handleClick = (answer: string) => {
    console.log('QuestionCard: Clicked answer:', answer);
    onAnswerSelect(answer);
  };

  const renderTextWithLatex = (text: string) => {
    // Простая функция для рендеринга текста с LaTeX
    const parts = text.split(/(\\\(.*?\\\))/g);
    return parts.map((part, index) => {
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        const latex = part.slice(2, -2);
        return <LatexRenderer key={index} latex={latex} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-sm font-medium text-blue-600">
            Вопрос {questionNumber} из {totalQuestions}
          </span>
          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
            question.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {question.difficulty === 'easy' ? 'Легкий' : 
             question.difficulty === 'medium' ? 'Средний' : 'Сложный'}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-500">
          {question.theme}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {renderTextWithLatex(question.question)}
      </h3>

      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <div
            key={index}
            onClick={() => handleClick(option)}
            className={`w-full text-left p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedAnswer === option
                ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md'
                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 bg-white'
              }`}>
                {selectedAnswer === option && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="font-medium">{renderTextWithLatex(option)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};