"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, User, Briefcase, Globe } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    avatar_url: "",
  });

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);
    
    // Check if onboarding is already completed
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();
    
    if (profile?.onboarding_completed) {
      router.push("/dashboard");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    
    const { error } = await supabase
      .from('profiles')
      .update({
        username: formData.username,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        onboarding_completed: true,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  const steps = [
    {
      title: "Welcome to forlarge",
      description: "Let's set up your creator profile",
      icon: User,
    },
    {
      title: "Tell us about yourself",
      description: "Help buyers get to know you",
      icon: Briefcase,
    },
    {
      title: "You're all set!",
      description: "Ready to start selling",
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-sky-500/10 via-background to-background">
      <div className="w-full max-w-2xl space-y-8">
        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    i + 1 <= step
                      ? "bg-sky-500 text-white"
                      : "bg-accent text-muted-foreground"
                  }`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-24 h-1 mx-2 transition-colors ${
                      i + 1 < step ? "bg-sky-500" : "bg-accent"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">{steps[step - 1].title}</h1>
            <p className="text-muted-foreground">{steps[step - 1].description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be your unique identifier on forlarge
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.username}
                  className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell buyers about yourself and what you create..."
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL (optional)</Label>
                  <Input
                    id="avatar"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatar_url}
                    onChange={(e) =>
                      setFormData({ ...formData, avatar_url: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    {loading ? "Setting up..." : "Complete Setup"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Step {step} of {steps.length}
        </div>
      </div>
    </div>
  );
}
