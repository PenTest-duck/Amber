"use client";

import { onboard } from "@/api/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function OnboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "";
  if (!userId) {
    return router.push("/");
  }

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    area_of_study: "",
    interests: ["", "", ""],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.area_of_study || formData.interests.some(i => !i || i.trim() === "")) {
      toast.error("fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await onboard({
        userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        area_of_study: formData.area_of_study,
        interests: formData.interests,
      });
      router.push("/thanks");
    } catch (error) {
      toast.error("Failed to submit form :(");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-black">
            tell me about yourself
          </h1>
          <p className="text-lg text-black">
            help amber scout the best opportunities for you
          </p>
        </div>

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="first name"
              className="px-4 py-3 border-2 border-white/30 rounded-lg text-white placeholder:text-white/70 bg-black/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 h-auto selection:bg-white/30 selection:text-white"
              required
            />
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="last name"
              className="px-4 py-3 border-2 border-white/30 rounded-lg text-white placeholder:text-white/70 bg-black/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 h-auto selection:bg-white/30 selection:text-white"
              required
            />
          </div>

          {/* Study Field */}
          <Input
            type="text"
            value={formData.area_of_study}
            onChange={(e) => handleInputChange("area_of_study", e.target.value)}
            placeholder="area of study"
            className="px-4 py-3 border-2 border-white/30 rounded-lg text-white placeholder:text-white/70 bg-black/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 h-auto selection:bg-white/30 selection:text-white"
            required
          />

          {/* Interests Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black">
              3 interests you never want to miss out on
            </h3>
            <div className="space-y-3">
              <Input
                type="text"
                value={formData.interests[0]}
                onChange={(e) => setFormData(prev => ({ ...prev, interests: [e.target.value, prev.interests[1], prev.interests[2]] }))}
                placeholder="interest #1"
                className="px-4 py-3 border-2 border-white/30 rounded-lg text-white placeholder:text-white/70 bg-black/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 h-auto selection:bg-white/30 selection:text-white"
              />
              <Input
                type="text"
                value={formData.interests[1]}
                onChange={(e) => setFormData(prev => ({ ...prev, interests: [prev.interests[0], e.target.value, prev.interests[2]] }))}
                placeholder="interest #2"
                className="px-4 py-3 border-2 border-white/30 rounded-lg text-white placeholder:text-white/70 bg-black/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 h-auto selection:bg-white/30 selection:text-white"
              />
              <Input
                type="text"
                value={formData.interests[2]}
                onChange={(e) => setFormData(prev => ({ ...prev, interests: [prev.interests[0], prev.interests[1], e.target.value] }))}
                placeholder="interest #3"
                className="px-4 py-3 border-2 border-white/30 rounded-lg text-white placeholder:text-white/70 bg-black/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 h-auto selection:bg-white/30 selection:text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white/20 text-white px-8 py-3 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  done
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
