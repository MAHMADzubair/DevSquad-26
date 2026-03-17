import { Job } from "@/types";
import {
  MapPin,
  Clock,
  Briefcase,
  ArrowLeft,
  Tag,
  Globe,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import jobsData from "@/data/jobs.json";

interface Props {
  params: Promise<{ id: string }>;
}

function getJob(id: string): Job | null {
  const job = (jobsData as Job[]).find((j) => j.id === parseInt(id));
  return job || null;
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = getJob(id);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">
            Job Not Found
          </h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-teal-500 hover:text-teal-600 font-semibold"
          >
            <ArrowLeft size={16} />
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const tags = [job.role, job.level, ...job.languages, ...job.tools];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Hero gradient */}
      <div className="h-36 sm:h-44 bg-gradient-to-r from-teal-600 to-teal-400 dark:from-teal-900 dark:to-teal-700" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 -mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-5 text-sm font-semibold text-slate-500 hover:text-teal-500 dark:text-slate-400 dark:hover:text-teal-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to all jobs
        </Link>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-teal-400 to-teal-600" />

          <div className="p-5 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6 sm:mb-8">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                {job.company[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-1">
                  <span className="text-teal-500 font-bold">{job.company}</span>
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
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                  {job.position}
                </h1>
              </div>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 sm:mb-8 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                <Clock size={14} className="text-teal-500 shrink-0" />
                <span>{job.postedAt}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                <Briefcase size={14} className="text-teal-500 shrink-0" />
                <span>{job.contract}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                <MapPin size={14} className="text-teal-500 shrink-0" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                <Globe size={14} className="text-teal-500 shrink-0" />
                <span>{job.role}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm col-span-2 sm:col-span-1">
                <Tag size={14} className="text-teal-500 shrink-0" />
                <span>{job.level}</span>
              </div>
            </div>

            {/* About */}
            {job.description && (
              <div className="mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  About This Role
                </h2>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                  {job.description}
                </p>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className="mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Requirements
                </h2>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                  {job.requirements}
                </p>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
                  What You&apos;ll Do
                </h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
                      <CheckCircle2 size={16} className="text-teal-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills & Tags */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
                Required Skills &amp; Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-semibold text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Apply CTA */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-5 sm:pt-6">
              <p className="text-slate-400 dark:text-slate-500 text-sm text-center sm:text-left">
                Interested? Apply now to join the team at{" "}
                <span className="text-teal-500 font-semibold">{job.company}</span>!
              </p>
              <button className="w-full sm:w-auto px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transform active:scale-95">
                Apply for this Role
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
