import React from 'react';
import { Sparkles } from 'lucide-react';

interface SubmitButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, disabled, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
        disabled || loading
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95'
      }`}
    >
      <Sparkles className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
      <span>{loading ? 'Generating...' : 'Generate Image'}</span>
    </button>
  );
};

export default SubmitButton;