'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      // Automatically sign in after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created, but auto-login failed. Please sign in manually.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-24 flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-3xl shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join MOSAIC to start shopping</p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
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
          <Button type="submit" size="lg" className="w-full rounded-xl mt-6" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
