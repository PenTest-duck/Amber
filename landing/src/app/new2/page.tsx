'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function New2Page() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email ends with .harvard.edu or @harvard.edu
    const isValidHarvardEmail = email.endsWith('.harvard.edu') || email.endsWith('@harvard.edu');
    
    if (!isValidHarvardEmail) {
      toast.error('only harvard students allowed - use your harvard email address');
      return;
    }
    
    // If valid, show success message
    toast.success('Email submitted successfully!');
    setEmail(''); // Clear the form
  };
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8 relative"
      style={{
        backgroundImage: 'url(/sunset2.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-2xl w-full space-y-8">
        {/* Tagline */}
        <h1 className="text-2xl font-bold text-black text-left">
          i signed up to every Harvard mailing list so you don&apos;t have to
        </h1>
        
        {/* Manifesto Letter */}
        <div className="space-y-6 text-left">
          {/* <p className="text-lg text-black">that&apos;s right - every club, newsletter, calendar etc</p> */}
          <p className="text-lg text-black">hi i&apos;m chris</p>
          <p className="text-lg text-black">i have big fomo</p>
          <p className="text-lg text-black">do you? when was the last time you said: &quot;i wish i&apos;d known about that&quot;</p>
          <p className="text-lg text-black">never let another opportunity slip past you again</p>
          <p className="text-lg text-black font-bold">meet amber, your personal opportunity scout</p>
        </div>
        
        {/* Email Signup Form */}
        <form onSubmit={handleSubmit} className="flex items-center justify-center space-x-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="harvard email address"
            className="flex-1 max-w-md px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
          <button 
            type="submit"
            className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        </form>
        
        {/* How It Works Link */}
        <div className="flex justify-center">
          <Link 
            href="/how-it-works" 
            className="text-black hover:text-gray-600 underline transition-colors"
          >
            how it works
          </Link>
        </div>
      </div>
    </div>
  );
}
