
import React, { createContext, useContext, useState, useEffect } from "react";
import { Job } from "@/types";

interface JobContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  createJob: (job: Omit<Job, "id" | "postedAt">) => Promise<Job>;
  updateJob: (id: string, job: Partial<Job>) => Promise<Job>;
  deleteJob: (id: string) => Promise<void>;
  getJob: (id: string) => Job | undefined;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

// Mock job data for local development
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    description: "We are looking for a skilled Frontend Developer to join our team. The ideal candidate should have experience with React, TypeScript, and modern CSS frameworks.",
    skills: ["React", "TypeScript", "CSS", "HTML"],
    location: "Remote",
    salary: "$80,000 - $100,000",
    experience: "2+ years",
    postedBy: "1", // HR user ID
    postedAt: new Date(),
  },
  {
    id: "2",
    title: "Backend Engineer",
    description: "Seeking an experienced Backend Engineer with strong Python skills. Knowledge of Django or Flask is required. Experience with database design and RESTful API development is essential.",
    skills: ["Python", "Django", "API", "PostgreSQL"],
    location: "San Francisco, CA",
    salary: "$90,000 - $120,000",
    experience: "3+ years",
    postedBy: "1", // HR user ID
    postedAt: new Date(),
  },
];

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load jobs from localStorage or use mock data
    const storedJobs = localStorage.getItem("jobs");
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    } else {
      setJobs(mockJobs);
      localStorage.setItem("jobs", JSON.stringify(mockJobs));
    }
    setLoading(false);
  }, []);

  const createJob = async (jobData: Omit<Job, "id" | "postedAt">) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newJob: Job = {
        ...jobData,
        id: `job_${Date.now()}`,
        postedAt: new Date(),
      };
      
      const updatedJobs = [...jobs, newJob];
      setJobs(updatedJobs);
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));
      return newJob;
    } catch (err: any) {
      setError(err.message || "Failed to create job");
      throw err;
    }
  };

  const updateJob = async (id: string, jobData: Partial<Job>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const jobIndex = jobs.findIndex(j => j.id === id);
      
      if (jobIndex === -1) {
        throw new Error("Job not found");
      }
      
      const updatedJob = { ...jobs[jobIndex], ...jobData };
      const updatedJobs = [...jobs];
      updatedJobs[jobIndex] = updatedJob;
      
      setJobs(updatedJobs);
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));
      return updatedJob;
    } catch (err: any) {
      setError(err.message || "Failed to update job");
      throw err;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedJobs = jobs.filter(job => job.id !== id);
      setJobs(updatedJobs);
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    } catch (err: any) {
      setError(err.message || "Failed to delete job");
      throw err;
    }
  };

  const getJob = (id: string) => {
    return jobs.find(job => job.id === id);
  };

  return (
    <JobContext.Provider value={{ jobs, loading, error, createJob, updateJob, deleteJob, getJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};
