import React, { useState } from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

const faqs = [
    // Account & Profile
    {
      category: 'Account & Profile',
      question: 'How do I change my username or email?',
      answer: 'You can change your username and email from the Settings panel. Navigate to Settings > Account > Profile Information to update your details.',
      tags: ['username', 'email', 'account']
    },
    {
      category: 'Account & Profile',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by using the "Forgot Password" link on the login screen. An email will be sent to your registered address with instructions.',
      tags: ['password', 'reset', 'account']
    },
    // Gameplay & Controls
    {
      category: 'Gameplay & Controls',
      question: 'How do I change my key bindings?',
      answer: 'You can change your key bindings in the Settings menu under the "Controls" tab. Click on the action you want to change and press the desired key.',
      tags: ['controls', 'key bindings', 'keyboard']
    },
    {
      category: 'Gameplay & Controls',
      question: 'What is ELO and how is it calculated?',
      answer: 'ELO is a rating system that measures your skill level. It is calculated based on the outcome of your ranked matches and the ELO of your opponents. Winning against a higher-ranked player will grant you more ELO points.',
      tags: ['elo', 'ranking', 'competitive']
    },
    // Technical & Support
    {
      category: 'Technical & Support',
      question: 'I am experiencing lag or performance issues.',
      answer: 'Please try lowering your graphics settings in the Performance tab of the Settings menu. Ensure you have a stable internet connection and that no other demanding applications are running in the background.',
      tags: ['lag', 'performance', 'graphics']
    },
    {
      category: 'Technical & Support',
      question: 'How do I report a player?',
      answer: 'You can report a player from their profile page. Click the "..." button and select "Report". Please provide as much detail as possible, including the reason for the report and any relevant evidence.',
      tags: ['report', 'player', 'cheating', 'harassment']
    }
];

export const HelpCentre: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Account & Profile', 'Gameplay & Controls', 'Technical & Support'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <CenteredContainer maxWidth="lg" className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">Help Center</h1>
        <p className="text-xl text-gray-400">How can we help you today?</p>
      </div>

      <div className="mb-8 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search for answers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-4 bg-slate-800 border-2 border-slate-700 rounded-lg text-white text-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex justify-center gap-4 mb-10">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => (
          <details key={index} className="bg-slate-800/50 p-6 rounded-lg group" open={index < 2}>
            <summary className="font-semibold text-lg text-white cursor-pointer list-none flex justify-between items-center">
              {faq.question}
              <span className="text-blue-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="text-gray-300 mt-4 leading-relaxed">{faq.answer}</p>
          </details>
        ))}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No results found for "{searchTerm}"</p>
            <p className="text-sm mt-2">Try searching for a different keyword.</p>
          </div>
        )}
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
        <p className="text-gray-400 mb-6">Our support team is ready to assist you with any issue.</p>
        <a href="/support" className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-colors">
          Contact Support
        </a>
      </div>
    </CenteredContainer>
  );
};

export default HelpCentre;