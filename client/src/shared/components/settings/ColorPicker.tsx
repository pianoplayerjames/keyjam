import React, { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  description?: string;
  presetColors?: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  description,
  presetColors = [
    '#ff6b9d', '#ff9f43', '#f0932b', '#eb4d4b', '#6c5ce7',
    '#a29bfe', '#74b9ff', '#0984e3', '#00b894', '#00cec9',
    '#fdcb6e', '#e17055', '#fd79a8', '#e84393', '#636e72'
  ],
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <div className="text-white font-medium">{label}</div>
          {description && (
            <div className="text-sm text-gray-400">{description}</div>
          )}
        </div>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-8 h-8 rounded-lg border-2 border-slate-600 hover:border-slate-500 transition-colors"
          style={{ backgroundColor: value }}
        />
      </div>
      
      {showPicker && (
        <div className="mt-3 p-4 bg-slate-700 rounded-lg">
          <div className="grid grid-cols-5 gap-2 mb-3">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => onChange(color)}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                  value === color 
                    ? 'border-white scale-110' 
                    : 'border-slate-500 hover:border-slate-400'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-3 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm"
              placeholder="#ff6b9d"
            />
          </div>
        </div>
      )}
    </div>
  );
};