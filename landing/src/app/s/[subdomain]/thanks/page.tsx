import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function ThanksPage() {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <p className="text-2xl text-black mb-4">
            thanks, you&apos;re on the waitlist for amber
          </p>
          <p className="text-lg text-black font-bold mb-6">
            live without fomo - be omniscient
          </p>
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
