// src/components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled, 
  className = '',
  variant = 'primary' 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors
        ${variant === 'primary' 
          ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};