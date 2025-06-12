import React from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

export const ContactSupport: React.FC = () => {
  return (
    <CenteredContainer maxWidth="md" className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">Contact Support</h1>
        <p className="text-xl text-gray-400">We're here to help. Fill out the form below to open a support ticket.</p>
      </div>

      <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input type="text" id="name" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input type="email" id="email" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
              Subject
            </label>
            <input type="text" id="subject" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              How can we help?
            </label>
            <textarea
              id="message"
              rows={8}
              placeholder="Please describe your issue in detail..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors">
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </CenteredContainer>
  );
};

export default ContactSupport;