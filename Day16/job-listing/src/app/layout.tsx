import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Listings | Find Your Dream Dev Role",
  description:
    "Browse and filter software development job listings. Filter by role, level, languages, and tools. Built with Next.js and Zustand.",
  keywords: ["jobs", "developer", "frontend", "backend", "fullstack", "remote"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
