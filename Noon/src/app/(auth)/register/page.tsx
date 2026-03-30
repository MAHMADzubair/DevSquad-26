"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to register");
        setLoading(false);
        return;
      }

      // Automatically log in
      const signRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signRes?.error) {
         router.push("/login");
      } else {
         router.push("/");
         router.refresh();
      }

    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-noon-black">Create an account</h2>
        <p className="text-sm text-gray-500 mt-1">Start shopping at noon today.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center font-medium border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 block">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              name="name"
              type="text"
              required
              className="w-full h-12 pl-10 pr-4 rounded bg-gray-50 border border-gray-200 focus:bg-white focus:border-noon-blue focus:ring-1 focus:ring-noon-blue outline-none transition"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              name="email"
              type="email"
              required
              className="w-full h-12 pl-10 pr-4 rounded bg-gray-50 border border-gray-200 focus:bg-white focus:border-noon-blue focus:ring-1 focus:ring-noon-blue outline-none transition"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div className="relative">
           <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              name="password"
              type="password"
              minLength={6}
              required
              className="w-full h-12 pl-10 pr-4 rounded bg-gray-50 border border-gray-200 focus:bg-white focus:border-noon-blue focus:ring-1 focus:ring-noon-blue outline-none transition"
              placeholder="At least 6 characters"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-noon-blue hover:bg-blue-700 text-white font-bold rounded flex items-center justify-center transition disabled:opacity-70 mt-4"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
        </button>
      </form>

      <div className="flex items-center justify-center gap-1 text-sm mt-2">
        <span className="text-gray-500">Already have an account?</span>
        <Link href="/login" className="font-bold text-noon-blue hover:underline cursor-pointer">Sign in</Link>
      </div>
    </div>
  );
}
