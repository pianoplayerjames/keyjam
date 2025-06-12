import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const DMCA: React.FC = () => (
  <LegalPageLayout title="DMCA Takedown Policy" lastUpdated={new Date().toLocaleDateString()}>
      <h2>Notification of Copyright Infringement</h2>
      <p>Nixi Studio respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, the text of which may be found on the U.S. Copyright Office website at http://www.copyright.gov/legislation/dmca.pdf, we will respond expeditiously to claims of copyright infringement committed using our service that are reported to our Designated Copyright Agent.</p>
      
      <h2>Counter-Notification</h2>
      <p>If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the material in your content, you may send a counter-notice containing the following information to the Copyright Agent...</p>
  </LegalPageLayout>
);

export default DMCA;