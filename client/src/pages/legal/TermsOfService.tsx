import React from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

const TermsOfService: React.FC = () => (
    <CenteredContainer maxWidth="lg" className="py-12 prose prose-invert">
        <h1>Terms of Service</h1>
        <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the KeyJam website (the "Service") operated by Nixi Studio ("us", "we", or "our").</p>
        
        <h2>1. Agreement to Terms</h2>
        <p>By using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

        {/* Add more sections as needed */}
    </CenteredContainer>
);

export default TermsOfService;