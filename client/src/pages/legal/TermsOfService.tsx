import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const TermsOfService: React.FC = () => (
  <LegalPageLayout title="Terms of Service" lastUpdated={new Date().toLocaleDateString()}>
      <h2>1. Agreement to Terms</h2>
      <p>By using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.</p>

      <h2>2. Accounts</h2>
      <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

      <h2>3. Intellectual Property</h2>
      <p>The Service and its original content, features and functionality are and will remain the exclusive property of Nixi Studio and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Nixi Studio.</p>
  </LegalPageLayout>
);

export default TermsOfService;