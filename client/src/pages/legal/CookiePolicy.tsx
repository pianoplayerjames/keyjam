import React from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

const CookiePolicy: React.FC = () => (
    <CenteredContainer maxWidth="lg" className="py-12 prose prose-invert">
        <h1>Cookie Policy</h1>
        <p>This is the Cookie Policy for KeyJam, accessible from your-website.com</p>

        <h2>What Are Cookies</h2>
        <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.</p>

        {/* Add more sections as needed */}
    </CenteredContainer>
);

export default CookiePolicy;