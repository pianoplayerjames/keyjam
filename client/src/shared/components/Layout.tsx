// client/src/shared/components/Layout.tsx
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl', 
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-8xl',
  full: 'max-w-full'
};

const paddingClasses = {
  none: '',
  sm: 'px-2 sm:px-4',
  md: 'px-4 sm:px-6 lg:px-8',
  lg: 'px-6 sm:px-8 lg:px-12'
};

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  maxWidth = 'xl', 
  className = '',
  padding = 'md'
}) => {
  return (
    <div className={`mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

export const CenteredContainer: React.FC<LayoutProps> = ({ 
  children, 
  maxWidth = 'xl', 
  className = '',
  padding = 'md'
}) => {
  return (
    <Layout maxWidth={maxWidth} className={className} padding={padding}>
      {children}
    </Layout>
  );
};

// Page wrapper for consistent page layouts
export const PageWrapper: React.FC<{
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}> = ({ children, maxWidth = 'xl', className = '' }) => {
  return (
    <div className={`min-h-screen ${className}`}>
      <CenteredContainer maxWidth={maxWidth} className="h-full">
        {children}
      </CenteredContainer>
    </div>
  );
};