'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
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
          <p className="text-lg text-white font-bold">meet amber, your personal opportunity scout</p>
        </div>
        
        {/* Email Signup Form */}
        <form onSubmit={handleSubmit} className="flex items-center justify-center space-x-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="harvard email address"
            className="flex-1 max-w-md px-4 py-3 border-2 border-white/30 rounded-lg text-white placeholder-white/70 bg-black/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
            required
          />
          <Button
            type="submit"
            className="bg-white/20 text-white p-3 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30"
          >
            <ChevronRight />
          </Button>
        </form>
        
        {/* How It Works Link */}
        <div className="flex justify-center">
          <Link 
            href="/how-it-works" 
            className="text-white hover:text-white/80 underline transition-colors"
          >
            how it works
          </Link>
        </div>
      </div>
    </div>
  );
}
