import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';

export default function HowPage() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8 relative"
    >
      <div className="max-w-4xl w-full space-y-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-black text-center">
          how it works
        </h1>
        
        {/* Description */}
        <div className="text-lg text-center space-y-2">
          <p>3 events, 1 email, once a week</p>
          <p>only events that matter to you - no spam, no bs</p>
        </div>
        
        {/* Example Image */}
        <div className="flex justify-center">
          <Image 
            src="/example.png" 
            alt="How it works illustration" 
            width={800}
            height={600}
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        
        {/* Back Link */}
        <div className="flex justify-center">
          <Link 
            href="/" 
            className="flex flex-row items-center text-white hover:text-gray-300 underline transition-colors"
          >
            <ChevronLeft /> back
          </Link>
        </div>
      </div>
    </div>
  );
}
