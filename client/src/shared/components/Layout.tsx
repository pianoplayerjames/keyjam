// client/src/shared/components/Layout.tsx
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  accountForLeftNav?: boolean;
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
  padding = 'md',
  accountForLeftNav = false
}) => {
  const containerStyle = accountForLeftNav ? {
    marginLeft: '4.5rem', // 72px for left nav
    width: 'calc(100% - 4.5rem)', // Reduce available width
    maxWidth: 'none' // Override max-width constraint
  } : {};

  const innerStyle = accountForLeftNav ? {
    maxWidth: maxWidthClasses[maxWidth].replace('max-w-', ''),
    margin: '0 auto'
  } : {};

  if (accountForLeftNav) {
    return (
      <div style={containerStyle} className={className}>
        <div 
          className={`mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses[padding]}`}
        >
          {children}
        </div>
      </div>
    );
  }

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
  padding = 'md',
  accountForLeftNav = false
}) => {
  return (
    <Layout 
      maxWidth={maxWidth} 
      className={className} 
      padding={padding}
      accountForLeftNav={accountForLeftNav}
    >
      {children}
    </Layout>
  );
};

// Page wrapper for consistent page layouts
export const PageWrapper: React.FC<{
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  accountForLeftNav?: boolean;
}> = ({ children, maxWidth = 'xl', className = '', accountForLeftNav = false }) => {
  return (
    <div className={`min-h-screen ${className}`}>
      <CenteredContainer 
        maxWidth={maxWidth} 
        className="h-full"
        accountForLeftNav={accountForLeftNav}
      >
        {children}
      </CenteredContainer>
    </div>
  );
};