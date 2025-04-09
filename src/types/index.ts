
export type UserRole = 'hr' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  skills: string[];
  location?: string;
  salary?: string;
  experience?: string;
  postedBy: string;
  postedAt: Date;
}

export interface Resume {
  id: string;
  fileName: string;
  fileUrl: string;
  text: string;
  userId: string;
  uploadedAt: Date;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  resumeId: string;
  status: 'applied' | 'shortlisted' | 'rejected';
  similarityScore?: number;
  appliedAt: Date;
}

export interface ShortlistedCandidate {
  id: string;
  applicationId: string;
  name: string;
  email: string;
  resumeUrl: string;
  similarityScore: number;
  jobId: string;
  shortlistedAt: Date;
}
