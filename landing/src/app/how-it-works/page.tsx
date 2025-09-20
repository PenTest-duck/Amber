import Link from 'next/link';
import Image from 'next/image';

export default function HowPage() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8 relative"
      style={{
        backgroundImage: 'url(/sunset.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-4xl w-full space-y-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-black text-center">
          How It Works
        </h1>
        
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
            href="/new" 
            className="text-black hover:text-gray-600 underline transition-colors"
          >
            ← Back to signup
          </Link>
        </div>
      </div>
    </div>
  );
}
