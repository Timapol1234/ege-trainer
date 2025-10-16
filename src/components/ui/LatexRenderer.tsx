// Универсальный LatexRenderer с поддержкой разных пропсов
// src/components/ui/LatexRenderer.tsx
'use client';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface LatexRendererProps {
  children?: string;
  math?: string;
  latex?: string;  // Добавляем поддержку пропса latex
  block?: boolean;
  className?: string;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ 
  children, 
  math, 
  latex,
  block = false, 
  className = '' 
}) => {
  const latexContent = math || latex || children || '';
  
  if (block) {
    return <BlockMath math={latexContent} className={className} />;
  }
  
  return <InlineMath math={latexContent} className={className} />;
};