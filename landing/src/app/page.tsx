'use client';

import { signup } from '@/api/endpoints';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email ends with .harvard.edu or @harvard.edu
    const isValidHarvardEmail = email.endsWith('.harvard.edu') || email.endsWith('@harvard.edu');
    
    if (!isValidHarvardEmail) {
      toast.error('only harvard students allowed - use your harvard email');
      return;
    }
    
    setIsLoading(true);
    try {
      await signup(email, "harvard");
      router.push('/thanks');
    } catch {
      toast.error('failed to sign up :(');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8 relative"
    >
      <div className="max-w-2xl w-full space-y-8">
        {/* Tagline */}
        <h1 className="text-2xl font-bold text-black text-left">
          i signed up to every HARVARD mailing list so you don&apos;t have to
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
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="harvard email"
            className="flex-1 max-w-md px-4 py-3 border-2 border-white/30 rounded-lg text-white placeholder:text-white bg-black/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 h-auto selection:bg-white/30 selection:text-white"
            required
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-white/20 text-white px-3 py-3 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ChevronRight />
            )}
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
