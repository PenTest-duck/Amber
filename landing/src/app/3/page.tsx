"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

export default function Page3() {
  const [showFirstText, setShowFirstText] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    // First text appears immediately
    setShowFirstText(true);
    
    // Second text appears after 1.5 seconds
    const timer1 = setTimeout(() => {
      setShowSecondText(true);
    }, 1500);
    
    // Arrow appears after 3 seconds
    const timer2 = setTimeout(() => {
      setShowArrow(true);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleNext = () => {
    // Redirect to Google Forms
    window.location.href = "https://forms.gle/uctzwusKnfg2ZJiH8";
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
        className={`text-4xl md:text-6xl font-black text-black transition-opacity duration-1000 ${
          showFirstText ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          position: 'absolute',
          top: '25%',
          left: '8%',
          transform: 'rotate(-1deg)'
        }}
      >
        never let an opportunity slip again
      </div>

      {/* Second text - positioned randomly but readable */}
      <div 
        className={`text-6xl md:text-8xl font-black text-black transition-opacity duration-1000 ${
          showSecondText ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          transform: 'rotate(2deg)'
        }}
      >
        meet amber
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
