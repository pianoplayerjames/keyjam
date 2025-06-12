import React from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

export const HelpCentre: React.FC = () => {
  const faqs = [
    {
      question: 'How do I change my key bindings?',
      answer: 'You can change your key bindings in the Settings menu under the "Controls" tab. Click on the action you want to change and press the desired key.',
    },
    {
      question: 'What is ELO and how is it calculated?',
      answer: 'ELO is a rating system that measures your skill level. It is calculated based on the outcome of your ranked matches and the ELO of your opponents.',
    },
    {
      question: 'How do I report a player?',
      answer: 'You can report a player from their profile page. Click the "..." button and select "Report". Please provide as much detail as possible.',
    },
  ];

  return (
    <CenteredContainer maxWidth="lg" className="py-12">
      <h1 className="text-4xl font-bold text-white mb-4">Help Centre</h1>
      <p className="text-gray-400 mb-8">
        Find answers to common questions and get help with KeyJam.
      </p>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for help..."
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
        />
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="bg-slate-800/50 p-4 rounded-lg">
            <summary className="font-semibold text-white cursor-pointer">
              {faq.question}
            </summary>
            <p className="text-gray-300 mt-2">{faq.answer}</p>
          </details>
        ))}
      </div>
    </CenteredContainer>
  );
};

export default HelpCentre;