'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/authContext';

export default function Auth() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, formData);
      login(response.data.user, response.data.access_token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-background) py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_60%)]">
      <div className="max-w-md w-full space-y-8 glass rounded-[40px] p-10 shadow-2xl pink-glow border border-whiteShadow animate-spring">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold tracking-tighter text-foreground">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-foreground/50">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 font-bold text-primary hover:text-primary/80 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-medium border border-red-100 italic">
              {error}
            </div>
          )}
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-white/30 border border-whiteShadow rounded-2xl px-5 py-4 focus:ring-[12px] focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:opacity-20 font-semibold"
                  placeholder="Choose an alias"
                />
              </div>
            )}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/30 border border-whiteShadow rounded-2xl px-5 py-4 focus:ring-[12px] focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:opacity-20 font-semibold"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/30 border border-whiteShadow rounded-2xl px-5 py-4 focus:ring-[12px] focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:opacity-20 font-semibold"
                placeholder="••••••••"
              />
            </div>
            {!isLogin && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Bio (Optional)</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-white/30 border border-whiteShadow rounded-2xl px-5 py-4 focus:ring-[12px] focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:opacity-20 font-medium resize-none"
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-5 px-4 border border-transparent font-extrabold rounded-[28px] text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-2xl shadow-primary/40 transition-all transform active:scale-[0.95] hover:scale-[1.02]"
            >
              {isLoading ? 'Processing...' : isLogin ? 'Launch Session' : 'Create Identity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
