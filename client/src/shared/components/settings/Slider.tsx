import React from 'react';

interface SliderProps {
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

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  disabled = false,
}) => {
  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-white font-medium">{label}</div>
          {description && (
            <div className="text-sm text-gray-400">{description}</div>
          )}
        </div>
        <div className="text-blue-400 font-semibold">
          {value}{unit}
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={`w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer ${
            disabled ? 'opacity-50' : ''
          } slider`}
        />
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid #1e293b;
          }
          .slider::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid #1e293b;
          }
        `}</style>
      </div>
    </div>
  );
};