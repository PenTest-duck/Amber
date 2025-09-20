'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NewPage() {
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
      <div className="max-w-2xl w-full">
        {/* Glassmorphic Overlay Container */}
        <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-8 space-y-8">
          {/* Tagline */}
          <h1 className="text-2xl font-bold text-white text-left drop-shadow-2xl">
            i signed up to every Harvard mailing list so you don&apos;t have to
          </h1>
          
          {/* Manifesto Letter */}
          <div className="space-y-6 text-left">
            {/* <p className="text-lg text-black">that&apos;s right - every club, newsletter, calendar etc</p> */}
            <p className="text-lg text-white drop-shadow-lg">hi i&apos;m chris</p>
            <p className="text-lg text-white drop-shadow-lg">i have big fomo</p>
            <p className="text-lg text-white drop-shadow-lg">do you? when was the last time you said: &quot;i wish i&apos;d known about that&quot;</p>
            <p className="text-lg text-white drop-shadow-lg">never let another opportunity slip past you again</p>
            <p className="text-lg text-white font-bold drop-shadow-2xl">meet amber, your personal opportunity scout</p>
          </div>
          
          {/* Email Signup Form */}
          <form onSubmit={handleSubmit} className="flex items-center justify-center space-x-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="harvard email address"
              className="flex-1 max-w-md px-4 py-3 border border-white/30 rounded-lg text-white placeholder-white/70 bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
              required
            />
            <button 
              type="submit"
              className="bg-white/20 text-white p-3 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30"
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
              href="/how" 
              className="text-white hover:text-white/80 underline transition-colors drop-shadow-lg"
            >
              how it works
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
