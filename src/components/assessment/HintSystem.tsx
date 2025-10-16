// src/components/assessment/HintSystem.tsx
import { useState } from 'react';

interface HintSystemProps {
  hints: string[];
}

export const HintSystem: React.FC<HintSystemProps> = ({ hints }) => {
  const [showHints, setShowHints] = useState(false);
  const [usedHints, setUsedHints] = useState<number[]>([]);

  const useHint = (index: number) => {
    if (!usedHints.includes(index)) {
      setUsedHints([...usedHints, index]);
    }
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <button
        onClick={() => setShowHints(!showHints)}
        className="flex items-center space-x-2 text-blue-600 font-medium"
      >
        <span>💡 Need help?</span>
        <span className="text-sm">{showHints ? 'Hide hints' : 'Show hints'}</span>
      </button>

      {showHints && (
        <div className="mt-3 space-y-2">
          {hints.map((hint, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-blue-500 text-sm mt-1">•</span>
              <span className={`text-sm ${
                usedHints.includes(index) ? 'text-gray-700' : 'text-gray-500'
              }`}>
                {usedHints.includes(index) ? hint : 'Click to reveal hint'}
              </span>
              {!usedHints.includes(index) && (
                <button
                  onClick={() => useHint(index)}
                  className="text-blue-500 text-sm underline"
                >
                  Reveal
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};