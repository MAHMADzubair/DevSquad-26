"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { Sun, Moon, Briefcase } from "lucide-react";
import { useEffect } from "react";

export default function Header() {
  const { isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="relative h-40 sm:h-44 bg-teal-500 dark:bg-teal-800 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-teal-400/30 dark:bg-teal-700/30" />
        <div className="absolute -bottom-16 -left-10 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-teal-600/30 dark:bg-teal-900/30" />
        <div className="absolute top-6 left-1/3 w-20 h-20 rounded-full bg-white/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between h-full max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Briefcase size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight">
              Job Listings
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm opacity-80">
              Find your dream developer role
            </p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
