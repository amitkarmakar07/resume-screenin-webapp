
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, FileText, BriefcaseBusiness, MapPin, DollarSign, Clock } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useJobs } from "@/contexts/JobContext";
import { useApplications } from "@/contexts/ApplicationContext";

const ApplyJob = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { getJob } = useJobs();
  const { getResumesByUser, applyToJob, loading } = useApplications();
  
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [applying, setApplying] = useState(false);

  // Redirect if not logged in or not student
  if (!currentUser || currentUser.role !== "student") {
    navigate("/login");
    return null;
  }

  if (!jobId) {
    navigate("/student/dashboard");
    return null;
  }

  const job = getJob(jobId);
  const userResumes = getResumesByUser(currentUser.id);

  if (!job) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <h2 className="text-xl">Job not found</h2>
          <Button className="mt-4" onClick={() => navigate("/student/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleApply = async () => {
    if (!selectedResumeId) {
      toast({
        variant: "destructive",
        title: "No resume selected",
        description: "Please select a resume to apply with.",
      });
      return;
    }
    
    setApplying(true);
    try {
      await applyToJob(jobId, selectedResumeId);
      
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted.",
      });
      
      navigate("/student/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Application failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Apply for Job</h1>
          <p className="text-muted-foreground mt-1">
            Complete your application for {job.title}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              
              <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
                {job.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                )}
                
                {job.salary && (
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {job.salary}
                  </div>
                )}
                
                {job.experience && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.experience}
                  </div>
                )}
                
                <div className="flex items-center">
                  <BriefcaseBusiness className="h-4 w-4 mr-1" />
                  Posted {new Date(job.postedAt).toLocaleDateString()}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Job Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Resume</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-4 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : userResumes.length > 0 ? (
              <div className="space-y-6">
                <RadioGroup value={selectedResumeId} onValueChange={setSelectedResumeId}>
                  {userResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className={`p-4 border rounded-lg cursor-pointer hover:border-app-primary transition-colors ${
                        selectedResumeId === resume.id ? "border-app-primary bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedResumeId(resume.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value={resume.id} id={resume.id} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={resume.id} className="font-medium cursor-pointer">
                            {resume.fileName}
                          </Label>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <FileText className="h-3 w-3 mr-1" />
                            <span>Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/student/upload-resume")}
                  >
                    Upload New Resume
                  </Button>
                  <Button 
                    onClick={handleApply} 
                    disabled={applying || !selectedResumeId}
                  >
                    {applying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <p>You need to upload a resume before applying.</p>
                <Button onClick={() => navigate("/student/upload-resume")}>
                  Upload Resume
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ApplyJob;
