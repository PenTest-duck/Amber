"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showFirstText, setShowFirstText] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // First text appears immediately
    setShowFirstText(true);
    
    // Second text appears after 1 second
    const timer1 = setTimeout(() => {
      setShowSecondText(true);
    }, 1000);
    
    // Arrow appears after 2 seconds
    const timer2 = setTimeout(() => {
      setShowArrow(true);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleNext = () => {
    router.push("/2");
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
        className={`text-6xl md:text-8xl font-black text-black transition-opacity duration-1000 ${
          showFirstText ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          transform: 'rotate(-2deg)'
        }}
      >
        hi i&apos;m chris
      </div>

      {/* Second text - positioned randomly but readable */}
      <div 
        className={`text-5xl md:text-7xl font-black text-black transition-opacity duration-1000 ${
          showSecondText ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          transform: 'rotate(1deg)'
        }}
      >
        i have big fomo
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
