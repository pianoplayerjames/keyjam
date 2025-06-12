import React from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, lastUpdated, children }) => {
  return (
    <div className="bg-slate-800 py-16 flex-grow flex">
        <CenteredContainer maxWidth="lg" className="flex-grow">
            <div className="bg-white rounded-lg shadow-2xl p-12 h-full">
                <div className="prose prose-slate max-w-none prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-2 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-p:leading-relaxed prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-ul:list-disc prose-ul:pl-6 prose-li:my-2">
                    <h1>{title}</h1>
                    <p className="text-gray-500 text-sm">Last updated: {lastUpdated}</p>
                    <hr className="my-8" />
                    {children}
                </div>
            </div>
      </CenteredContainer>
    </div>
  );
};

export default LegalPageLayout;