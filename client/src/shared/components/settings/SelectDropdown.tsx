import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label: string;
  description?: string;
  disabled?: boolean;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  value,
  onChange,
  options,
  label,
  description,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="py-3">
      <div className="mb-2">
        <div className="text-white font-medium">{label}</div>
        {description && (
          <div className="text-sm text-gray-400">{description}</div>
        )}
      </div>
      
      <div className="relative">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-left text-white hover:bg-slate-600 transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{selectedOption?.label || 'Select option'}</span>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-slate-600 transition-colors ${
                  value === option.value ? 'bg-slate-600 text-blue-400' : 'text-white'
                }`}
              >
                <div>{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-400 mt-1">{option.description}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};