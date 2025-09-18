"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page2() {
  const [showFirstText, setShowFirstText] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [showThirdText, setShowThirdText] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // First text appears immediately
    setShowFirstText(true);
    
    // Second text appears after 1 second
    const timer1 = setTimeout(() => {
      setShowSecondText(true);
    }, 1000);
    
    // Third text appears after 2 seconds
    const timer2 = setTimeout(() => {
      setShowThirdText(true);
    }, 2000);
    
    // Arrow appears after 3 seconds
    const timer3 = setTimeout(() => {
      setShowArrow(true);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleNext = () => {
    router.push("/3");
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(/sunset.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* First text - positioned randomly but readable */}
      <div 
        className={`text-7xl md:text-9xl font-black text-black transition-opacity duration-1000 ${
          showFirstText ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          position: 'absolute',
          top: '15%',
          right: '20%',
          transform: 'rotate(3deg)'
        }}
      >
        do you?
      </div>

      {/* Second text - positioned randomly but readable */}
      <div 
        className={`text-4xl md:text-6xl font-black text-black transition-opacity duration-1000 ${
          showSecondText ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          position: 'absolute',
          top: '40%',
          left: '5%',
          transform: 'rotate(-1deg)'
        }}
      >
        how many times have you said
      </div>

      {/* Third text - positioned randomly but readable */}
      <div 
        className={`text-5xl md:text-7xl font-black text-black transition-opacity duration-1000 ${
          showThirdText ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          position: 'absolute',
          top: '65%',
          right: '10%',
          transform: 'rotate(5deg)'
        }}
      >
        &quot;i wish i&apos;d known about that&quot;
      </div>

      {/* Arrow button */}
      <div 
        className={`fixed bottom-8 right-8 transition-opacity duration-1000 ${
          showArrow ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={handleNext}
          className="bg-black text-white p-4 rounded-full hover:bg-gray-800 transition-colors duration-200 shadow-lg"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
}
