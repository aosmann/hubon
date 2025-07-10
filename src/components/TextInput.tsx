import React from 'react';
import { Type } from 'lucide-react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Type className="w-5 h-5 text-gray-500" />
        <label className="text-sm font-medium text-gray-700">
          Describe your image
        </label>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "A beautiful sunset over mountains..."}
        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-gray-900 placeholder-gray-500"
        rows={4}
      />
    </div>
  );
};

export default TextInput;