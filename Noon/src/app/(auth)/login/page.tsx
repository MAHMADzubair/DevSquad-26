"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("Login result:", res);

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-noon-black">Welcome back</h2>
        <p className="text-sm text-gray-500 mt-1">Please enter your details to sign in.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center font-medium border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
           <div className="flex justify-between items-center mb-1">
             <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Password</label>
             <Link href="#" className="text-xs text-noon-blue font-semibold hover:underline cursor-pointer">Forgot password?</Link>
           </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              name="password"
              type="password"
              required
              className="w-full h-12 pl-10 pr-4 rounded bg-gray-50 border border-gray-200 focus:bg-white focus:border-noon-blue focus:ring-1 focus:ring-noon-blue outline-none transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-noon-blue hover:bg-blue-700 text-white font-bold rounded flex items-center justify-center transition disabled:opacity-70 mt-4"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
        </button>
      </form>

      <div className="flex items-center justify-center gap-1 text-sm mt-2">
        <span className="text-gray-500">New to noon?</span>
        <Link href="/register" className="font-bold text-noon-blue hover:underline cursor-pointer">Create an account</Link>
      </div>
      
      <div className="bg-blue-50/50 p-4 border border-blue-100 rounded text-center text-xs mt-2">
         <p className="font-bold text-blue-800 mb-1">Demo Credentials:</p>
         <p className="text-gray-600">user@noon.com / user123</p>
         <p className="text-gray-600">ahmad@gmail.com / 1234</p>
      </div>
    </div>
  );
}
