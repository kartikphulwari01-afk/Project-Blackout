'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. For demo use: user@mosaic.com / password123");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="container py-24 flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-3xl shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your MOSAIC account</p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@mosaic.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" size="lg" className="w-full rounded-xl mt-6">
            Sign In
          </Button>
        </form>
        
        
        <div className="mt-8 text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <Link href="/register" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground opacity-50">
          <p>Demo Admin: admin@mosaic.com / password123</p>
          <p>Demo User: user@mosaic.com / password123</p>
        </div>
      </div>
    </div>
  );
}
