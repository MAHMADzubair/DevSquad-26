"use client";

import { useFilterStore } from "@/store/useFilterStore";
import { Job } from "@/types";
import { MapPin, Clock, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const { addFilter } = useFilterStore();
  const [imgError, setImgError] = useState(false);

  const tags = [job.role, job.level, ...job.languages, ...job.tools];

  const companyColors: Record<string, string> = {
    Photosnap: "bg-slate-900",
    Manage: "bg-orange-400",
    Account: "bg-teal-500",
    MyHome: "bg-amber-400",
    "Loop Studios": "bg-slate-800",
    FaceIt: "bg-orange-600",
    Shortly: "bg-violet-600",
    Insure: "bg-blue-700",
    "Eyecam Co.": "bg-rose-500",
    "The Air Filter Company": "bg-yellow-500",
  };

  const bgColor = companyColors[job.company] ?? "bg-teal-500";

  return (
    <article
      className={`relative bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 px-6 pb-6 pt-12 sm:pt-6 flex flex-col sm:flex-row sm:items-center gap-4 ${
        job.featured ? "border-l-4 border-teal-500" : ""
      }`}
    >
      {/* Logo — overlaps top on mobile, inline on sm+ */}
      <div
        className={`absolute top-[-1.75rem] left-6 sm:static sm:flex-shrink-0 w-14 h-14 rounded-full ${bgColor} flex items-center justify-center text-white font-bold text-xl`}
      >
        {imgError ? (
          <span>{job.company[0]}</span>
        ) : (
          <Image
            src={job.logo}
            alt={`${job.company} logo`}
            width={48}
            height={48}
            className="rounded-full object-contain p-1"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Company + badges */}
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-teal-500 font-bold text-sm">{job.company}</span>
          {job.new && (
            <span className="px-2 py-0.5 rounded-full bg-teal-500 text-white text-xs font-semibold uppercase tracking-wide">
              New!
            </span>
          )}
          {job.featured && (
            <span className="px-2 py-0.5 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-xs font-semibold uppercase tracking-wide">
              Featured
            </span>
          )}
        </div>

        {/* Position */}
        <Link href={`/jobs/${job.id}`}>
          <h2 className="text-slate-800 dark:text-white font-bold text-base hover:text-teal-500 dark:hover:text-teal-400 transition-colors cursor-pointer mb-2 leading-snug">
            {job.position}
          </h2>
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-sm">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {job.postedAt}
          </span>
          <span className="text-slate-200 dark:text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <Briefcase size={13} />
            {job.contract}
          </span>
          <span className="text-slate-200 dark:text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {job.location}
          </span>
        </div>
      </div>

      {/* Divider (mobile only) */}
      <hr className="sm:hidden border-slate-100 dark:border-slate-700" />

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => addFilter(tag)}
            className="px-3 py-1.5 rounded bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-semibold text-sm hover:bg-teal-500 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white transition-colors duration-200 active:scale-95"
          >
            {tag}
          </button>
        ))}
      </div>
    </article>
  );
}
