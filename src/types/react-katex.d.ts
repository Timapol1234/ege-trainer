// types/react-katex.d.ts
declare module 'react-katex' {
  import { ComponentType } from 'react';

  interface MathProps {
    math: string;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
    settings?: any;
  }

  export const InlineMath: ComponentType<MathProps>;
  export const BlockMath: ComponentType<MathProps>;
  export const KatexProvider: ComponentType<{ children: React.ReactNode }>;
}