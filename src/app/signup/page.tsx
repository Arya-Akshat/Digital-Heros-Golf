// src/app/signup/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create user via API
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        // Sign in automatically after registration
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.ok) {
           router.push("/dashboard");
        }
      } else {
        // Handle error
        console.error("Registration failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[20%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-3xl animate-pulse delay-75"></div>
      </div>

      <Card className="w-full max-w-md glass-panel border-white/10 relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center tracking-tight text-gradient">
            Join the Club
          </CardTitle>
          <CardDescription className="text-center text-blue-100/60">
            Create an account to start your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-black/20 border-white/5 focus:border-cyan-500/50"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/20 border-white/5 focus:border-cyan-500/50"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/20 border-white/5 focus:border-cyan-500/50"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              variant="premium" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
          <div className="text-blue-100/40">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
              Log in
            </Link>
          </div>
          <Link href="/" className="text-xs hover:text-white transition-colors">
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
