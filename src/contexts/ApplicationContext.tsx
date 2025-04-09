
import React, { createContext, useContext, useState, useEffect } from "react";
import { Application, Resume, ShortlistedCandidate } from "@/types";
import { useAuth } from "./AuthContext";

interface ApplicationContextType {
  applications: Application[];
  resumes: Resume[];
  shortlistedCandidates: ShortlistedCandidate[];
  loading: boolean;
  error: string | null;
  uploadResume: (file: File) => Promise<Resume>;
  applyToJob: (jobId: string, resumeId: string) => Promise<Application>;
  getResumesByUser: (userId: string) => Resume[];
  getApplicationsByUser: (userId: string) => Application[];
  getApplicationsByJob: (jobId: string) => Application[];
  getShortlistedByJob: (jobId: string) => ShortlistedCandidate[];
  simulateSendEmails: (candidates: ShortlistedCandidate[], template: string) => Promise<void>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// Mock data for local development
const mockResumes: Resume[] = [
  {
    id: "1",
    fileName: "john_resume.pdf",
    fileUrl: "/mock/resumes/john_resume.pdf",
    text: "Frontend Developer with 3 years of experience in React, TypeScript, and modern web development. Proficient in HTML, CSS, JavaScript, and responsive design. Experience with RESTful APIs and state management libraries like Redux.",
    userId: "2", // Student user ID
    uploadedAt: new Date(),
  },
];

const mockApplications: Application[] = [
  {
    id: "1",
    jobId: "1",
    userId: "2", // Student user ID
    resumeId: "1",
    status: "applied",
    appliedAt: new Date(),
  },
];

const mockShortlisted: ShortlistedCandidate[] = [
  {
    id: "1",
    applicationId: "1",
    name: "John Student",
    email: "student@example.com",
    resumeUrl: "/mock/resumes/john_resume.pdf",
    similarityScore: 0.82,
    jobId: "1",
    shortlistedAt: new Date(),
  },
];

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState<ShortlistedCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load data from localStorage or use mock data
    const storedApplications = localStorage.getItem("applications");
    const storedResumes = localStorage.getItem("resumes");
    const storedShortlisted = localStorage.getItem("shortlisted");

    setApplications(storedApplications ? JSON.parse(storedApplications) : mockApplications);
    setResumes(storedResumes ? JSON.parse(storedResumes) : mockResumes);
    setShortlistedCandidates(storedShortlisted ? JSON.parse(storedShortlisted) : mockShortlisted);
    
    setLoading(false);
  }, []);

  const saveToLocalStorage = () => {
    localStorage.setItem("applications", JSON.stringify(applications));
    localStorage.setItem("resumes", JSON.stringify(resumes));
    localStorage.setItem("shortlisted", JSON.stringify(shortlistedCandidates));
  };

  // Function to extract text from a file (mock implementation)
  const extractTextFromFile = async (file: File): Promise<string> => {
    // In a real implementation, this would extract text from PDF/DOCX
    // For now, we're just returning a mock text based on the file name
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
    
    if (file.name.includes("developer") || file.name.includes("frontend")) {
      return "Frontend Developer with 3 years of experience in React, TypeScript, and modern web development. Proficient in HTML, CSS, JavaScript, and responsive design. Experience with RESTful APIs and state management libraries like Redux.";
    } else if (file.name.includes("backend") || file.name.includes("python")) {
      return "Backend Engineer with 4 years of experience in Python, Django, and PostgreSQL. Strong understanding of RESTful API design and implementation. Experienced in cloud platforms like AWS.";
    } else {
      return "Experienced professional with skills in web development, programming, and software engineering. Proficient in multiple languages and frameworks. Strong problem-solving abilities and team collaboration.";
    }
  };

  // Function to compute similarity score between resume and job description (mock implementation)
  const computeSimilarityScore = async (resumeText: string, jobDescription: string): Promise<number> => {
    // In a real implementation, this would use TF-IDF or embeddings + cosine similarity
    // For now, we're just returning a mock score based on keyword matching
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing time
    
    const resumeWords = resumeText.toLowerCase().split(/\W+/);
    const jobWords = jobDescription.toLowerCase().split(/\W+/);
    
    let matchCount = 0;
    for (const word of resumeWords) {
      if (word.length > 3 && jobWords.includes(word)) { // Only count words longer than 3 chars
        matchCount++;
      }
    }
    
    // Generate a score between 0.5 and 0.95
    const baseScore = 0.5;
    const maxAdditionalScore = 0.45;
    const matchRatio = Math.min(matchCount / 20, 1); // Cap at 20 matches for max score
    
    return baseScore + (matchRatio * maxAdditionalScore);
  };

  const uploadResume = async (file: File): Promise<Resume> => {
    if (!currentUser) {
      throw new Error("User must be logged in to upload a resume");
    }

    try {
      setLoading(true);
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Extract text from file
      const extractedText = await extractTextFromFile(file);
      
      const newResume: Resume = {
        id: `resume_${Date.now()}`,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file), // In a real app, this would be a server URL
        text: extractedText,
        userId: currentUser.id,
        uploadedAt: new Date(),
      };
      
      const updatedResumes = [...resumes, newResume];
      setResumes(updatedResumes);
      
      // Save to localStorage
      localStorage.setItem("resumes", JSON.stringify(updatedResumes));
      
      return newResume;
    } catch (err: any) {
      setError(err.message || "Failed to upload resume");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (jobId: string, resumeId: string): Promise<Application> => {
    if (!currentUser) {
      throw new Error("User must be logged in to apply");
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if already applied
      const existingApplication = applications.find(
        app => app.jobId === jobId && app.userId === currentUser.id
      );
      
      if (existingApplication) {
        throw new Error("You have already applied to this job");
      }
      
      const resume = resumes.find(r => r.id === resumeId);
      if (!resume) {
        throw new Error("Resume not found");
      }
      
      // Create new application
      const newApplication: Application = {
        id: `app_${Date.now()}`,
        jobId,
        userId: currentUser.id,
        resumeId,
        status: "applied",
        appliedAt: new Date(),
      };
      
      // Find the job from localStorage to get description
      const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      const job = jobs.find((j: any) => j.id === jobId);
      
      if (!job) {
        throw new Error("Job not found");
      }
      
      // Compute similarity score
      const similarityScore = await computeSimilarityScore(resume.text, job.description);
      newApplication.similarityScore = similarityScore;
      
      // Update application status based on score
      if (similarityScore >= 0.7) {
        newApplication.status = "shortlisted";
        
        // Add to shortlisted candidates
        const newShortlisted: ShortlistedCandidate = {
          id: `shortlisted_${Date.now()}`,
          applicationId: newApplication.id,
          name: currentUser.name,
          email: currentUser.email,
          resumeUrl: resume.fileUrl,
          similarityScore,
          jobId,
          shortlistedAt: new Date(),
        };
        
        setShortlistedCandidates([...shortlistedCandidates, newShortlisted]);
      }
      
      const updatedApplications = [...applications, newApplication];
      setApplications(updatedApplications);
      
      // Save to localStorage
      localStorage.setItem("applications", JSON.stringify(updatedApplications));
      localStorage.setItem("shortlisted", JSON.stringify(shortlistedCandidates));
      
      return newApplication;
    } catch (err: any) {
      setError(err.message || "Failed to apply for job");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getResumesByUser = (userId: string) => {
    return resumes.filter(resume => resume.userId === userId);
  };

  const getApplicationsByUser = (userId: string) => {
    return applications.filter(app => app.userId === userId);
  };

  const getApplicationsByJob = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const getShortlistedByJob = (jobId: string) => {
    return shortlistedCandidates.filter(candidate => candidate.jobId === jobId);
  };

  const simulateSendEmails = async (candidates: ShortlistedCandidate[], template: string) => {
    try {
      setLoading(true);
      // Simulate API call for sending emails
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log the emails that would be sent (for demonstration)
      console.log("Emails would be sent to:", candidates.map(c => c.email));
      console.log("Email template:", template);
      
      return Promise.resolve();
    } catch (err: any) {
      setError(err.message || "Failed to send emails");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        resumes,
        shortlistedCandidates,
        loading,
        error,
        uploadResume,
        applyToJob,
        getResumesByUser,
        getApplicationsByUser,
        getApplicationsByJob,
        getShortlistedByJob,
        simulateSendEmails,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error("useApplications must be used within an ApplicationProvider");
  }
  return context;
};
