import React from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

const PrivacyPolicy: React.FC = () => (
    <CenteredContainer maxWidth="lg" className="py-12 prose prose-invert">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Introduction</h2>
        <p>Welcome to KeyJam. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>

        <h2>2. Information We Collect</h2>
        <p>We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and services, when you participate in activities on the Website or otherwise when you contact us.</p>
        
        {/* Add more sections as needed */}
    </CenteredContainer>
);

export default PrivacyPolicy;