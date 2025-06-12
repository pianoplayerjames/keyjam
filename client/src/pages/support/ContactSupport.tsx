import React from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

export const ContactSupport: React.FC = () => {
  return (
    <CenteredContainer maxWidth="md" className="py-12">
      <h1 className="text-4xl font-bold text-white mb-4">Contact Support</h1>
      <p className="text-gray-400 mb-8">
        Have a problem? Fill out the form below and we'll get back to you.
      </p>

      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Your Name
          </label>
          <input type="text" id="name" className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input type="email" id="email" className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
            Subject
          </label>
          <input type="text" id="subject" className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          ></textarea>
        </div>
        <button type="submit" className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold">
          Submit
        </button>
      </form>
    </CenteredContainer>
  );
};

export default ContactSupport;