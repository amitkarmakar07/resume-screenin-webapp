
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useJobs } from "@/contexts/JobContext";
import { useApplications } from "@/contexts/ApplicationContext";
import JobList from "@/components/job/JobList";
import { PlusCircle } from "lucide-react";

const HRDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { jobs, loading: jobsLoading } = useJobs();
  const { applications, shortlistedCandidates, loading: appLoading } = useApplications();
  const [activeTab, setActiveTab] = useState("posted-jobs");

  // Redirect if not logged in or not HR
  if (!currentUser || currentUser.role !== "hr") {
    navigate("/login");
    return null;
  }

  // Get jobs posted by the current HR
  const postedJobs = jobs.filter(job => job.postedBy === currentUser.id);
  
  // Get total applications for all posted jobs
  const totalApplications = applications.filter(app => 
    postedJobs.some(job => job.id === app.jobId)
  ).length;
  
  // Get total shortlisted candidates for all posted jobs
  const totalShortlisted = shortlistedCandidates.filter(candidate => 
    postedJobs.some(job => job.id === candidate.jobId)
  ).length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">HR Dashboard</h1>
          <Button onClick={() => navigate("/hr/create-job")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Post New Job
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Jobs Posted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{postedJobs.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalApplications}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Shortlisted Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalShortlisted}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posted-jobs" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="posted-jobs">Posted Jobs</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted Candidates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posted-jobs">
            {jobsLoading ? (
              <p>Loading jobs...</p>
            ) : postedJobs.length > 0 ? (
              <JobList jobs={postedJobs} userRole="hr" />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="mb-4">You haven't posted any jobs yet.</p>
                  <Button onClick={() => navigate("/hr/create-job")}>
                    Post Your First Job
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="shortlisted">
            {appLoading ? (
              <p>Loading candidates...</p>
            ) : totalShortlisted > 0 ? (
              <div className="space-y-6">
                {postedJobs.map(job => {
                  const candidates = shortlistedCandidates.filter(
                    candidate => candidate.jobId === job.id
                  );
                  
                  if (candidates.length === 0) return null;
                  
                  return (
                    <Card key={job.id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50">
                        <CardTitle>{job.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mt-4">
                          <Button size="sm" onClick={() => navigate(`/hr/shortlisted/${job.id}`)}>
                            View {candidates.length} Shortlisted Candidates
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p>No candidates have been shortlisted yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default HRDashboard;
