"use client";

import { useFilterStore } from "@/store/useFilterStore";
import { Job } from "@/types";
import JobCard from "./JobCard";

interface JobListingsProps {
  jobs: Job[];
}

export default function JobListings({ jobs }: JobListingsProps) {
  const { filters } = useFilterStore();

  const filteredJobs =
    filters.length === 0
      ? jobs
      : jobs.filter((job) => {
          const tags = [job.role, job.level, ...job.languages, ...job.tools];
          return filters.every((filter) => tags.includes(filter));
        });

  if (filteredJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-1">
          No jobs match your filters
        </h3>
        <p className="text-slate-400 dark:text-slate-500 text-sm">
          Try removing some filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 sm:gap-6">
      {filteredJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
