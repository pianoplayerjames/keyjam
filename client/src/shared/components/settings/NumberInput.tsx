// client/src/shared/components/settings/NumberInput.tsx
import React from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  label,
  description,
  min,
  max,
  step = 1,
  unit = '',
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <div className="text-white font-medium">{label}</div>
          {description && (
            <div className="text-sm text-gray-400">{description}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={`w-20 px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm text-center ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          {unit && <span className="text-sm text-gray-400">{unit}</span>}
        </div>
      </div>
    </div>
  );
};