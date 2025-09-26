"use client";

import { signup } from "@/api/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUBDOMAINS_MAP } from "@/lib/constants";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LandingPage() {
  const params = useParams<{ subdomain: string }>();

  const { schoolId, schoolName, emailSuffix } = SUBDOMAINS_MAP[params.subdomain];
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValidHarvardEmail =
      email.endsWith(`.${emailSuffix}`) || email.endsWith(`@${emailSuffix}`);

    if (!isValidHarvardEmail) {
      toast.error(
        `only ${schoolName} students allowed - use your ${schoolName} email`
      );
      return;
    }

    setIsLoading(true);
    try {
      const { id } = await signup(email, schoolId);
      router.push(`/onboard?userId=${encodeURIComponent(id)}`);
    } catch {
      toast.error("failed to sign up :(");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      {/* <div className="absolute top-4 right-4">
        <Link href="/login" className="text-white hover:text-white/80 transition-colors">login</Link>
      </div> */}
      <div className="max-w-3xl w-full space-y-8">
        {/* Tagline */}
        <h1 className="text-2xl font-bold text-black text-left bg-yellow-200 rounded px-2 py-1 inline-block shadow-md">
          i signed up to every {schoolName.toUpperCase()} mailing list so you
          don&apos;t have to
        </h1>

        {/* Manifesto Letter */}
        <div className="space-y-2 text-left">
          {/* <p className="text-lg text-black">that&apos;s right - every club, newsletter, calendar etc</p> */}
          <div>
            <p className="text-lg text-black bg-yellow-50 rounded px-2 py-1 inline-block shadow-md mb-1">hi i&apos;m chris</p>
          </div>
          <div>
            <p className="text-lg text-black bg-yellow-50 rounded px-2 py-1 inline-block shadow-md mb-1">i have big fomo</p>
          </div>
          <div>
            <p className="text-lg text-black bg-yellow-50 rounded px-2 py-1 inline-block shadow-md mb-1">
              do you? when was the last time you said: &quot;i wish i&apos;d known about that&quot;
            </p>
          </div>
          <div>
            <p className="text-lg text-black bg-yellow-50 rounded px-2 py-1 inline-block shadow-md mb-1">
              never let another opportunity slip past you again
            </p>
          </div>
          <div>
            <p className="text-lg text-white font-bold bg-gradient-to-r from-purple-600 to-red-600 rounded px-2 py-1 inline-block shadow-md">
              meet amber, your personal opportunity scout
            </p>
          </div>
        </div>

        {/* Email Signup Form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center space-x-2"
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`${schoolName} email`}
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
