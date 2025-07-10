import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  id: string;
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  icon?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, label, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        {icon}
        <label className="text-sm font-medium text-gray-700">{label}</label>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
        >
          <span className="text-gray-900">{selectedOption?.label}</span>
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150 text-left"
              >
                <span className="text-gray-900">{option.label}</span>
                {value === option.value && <Check className="w-5 h-5 text-blue-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;