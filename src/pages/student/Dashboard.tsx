
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useJobs } from "@/contexts/JobContext";
import { useApplications } from "@/contexts/ApplicationContext";
import JobList from "@/components/job/JobList";
import { Upload } from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { jobs, loading: jobsLoading } = useJobs();
  const { 
    applications, 
    resumes, 
    getApplicationsByUser, 
    getResumesByUser,
    loading: appLoading 
  } = useApplications();

  // Redirect if not logged in or not student
  if (!currentUser || currentUser.role !== "student") {
    navigate("/login");
    return null;
  }

  // Get applications and resumes for the current student
  const userApplications = getApplicationsByUser(currentUser.id);
  const userResumes = getResumesByUser(currentUser.id);
  
  // Get jobs the student has applied to
  const appliedJobs = userApplications.map(app => {
    const job = jobs.find(job => job.id === app.jobId);
    if (!job) return null;
    
    return {
      ...job,
      applicationStatus: app.status,
      applicationId: app.id,
      similarityScore: app.similarityScore,
    };
  }).filter(Boolean);

  // Get jobs the student has not applied to
  const availableJobs = jobs.filter(
    job => !userApplications.some(app => app.jobId === job.id)
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <Button onClick={() => navigate("/student/upload-resume")}>
            <Upload className="mr-2 h-4 w-4" /> Upload Resume
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{availableJobs.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Applications Submitted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userApplications.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resumes Uploaded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userResumes.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="available-jobs">
          <TabsList className="mb-4">
            <TabsTrigger value="available-jobs">Available Jobs</TabsTrigger>
            <TabsTrigger value="my-applications">My Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available-jobs">
            {jobsLoading ? (
              <p>Loading jobs...</p>
            ) : availableJobs.length > 0 ? (
              <JobList jobs={availableJobs} userRole="student" />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="mb-4">You've applied to all available jobs!</p>
                  <p className="text-muted-foreground">Check back later for new opportunities.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="my-applications">
            {appLoading ? (
              <p>Loading applications...</p>
            ) : appliedJobs.length > 0 ? (
              <JobList jobs={appliedJobs} userRole="student" showApplicationStatus />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="mb-4">You haven't applied to any jobs yet.</p>
                  <Button onClick={() => navigate("/student/dashboard")}>
                    Browse Available Jobs
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
