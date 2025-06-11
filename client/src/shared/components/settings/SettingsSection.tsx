import React from 'react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
  icon,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-700">
        {icon && <span className="text-xl">{icon}</span>}
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};