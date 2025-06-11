// client/src/shared/components/settings/SettingsContainer.tsx
import React from 'react';

interface SettingsContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const SettingsContainer: React.FC<SettingsContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`p-6 max-h-full overflow-y-auto leftnav-scrollbar ${className}`}>
      {children}
    </div>
  );
};