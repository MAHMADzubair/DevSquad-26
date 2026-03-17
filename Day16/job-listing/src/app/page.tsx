import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import JobListings from "@/components/JobListings";
import { Job } from "@/types";
import jobsData from "@/data/jobs.json";

function getJobs(): Job[] {
  return jobsData as Job[];
}

export default function HomePage() {
  const jobs = getJobs();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <FilterBar />
        {/* mt accounts for card logo overflow on mobile + FilterBar */}
        <div className="mt-14 sm:mt-16 flex flex-col gap-10 sm:gap-6">
          <JobListings jobs={jobs} />
        </div>
      </main>
    </div>
  );
}
