
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, Loader2, AlertTriangle, FileText } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useApplications } from "@/contexts/ApplicationContext";

const UploadResume = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { uploadResume, loading, getResumesByUser } = useApplications();
  
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not logged in or not student
  if (!currentUser || currentUser.role !== "student") {
    navigate("/login");
    return null;
  }

  // Get current user's resumes
  const userResumes = getResumesByUser(currentUser.id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          variant: "destructive",
          title: "Unsupported file type",
          description: "Please upload a PDF, DOCX, or TXT file.",
        });
        return;
      }
      
      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Maximum file size is 5MB.",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(droppedFile.type)) {
        toast({
          variant: "destructive",
          title: "Unsupported file type",
          description: "Please upload a PDF, DOCX, or TXT file.",
        });
        return;
      }
      
      // Check file size (5MB limit)
      if (droppedFile.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Maximum file size is 5MB.",
        });
        return;
      }
      
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a resume file to upload.",
      });
      return;
    }
    
    setUploading(true);
    try {
      await uploadResume(file);
      
      toast({
        title: "Resume uploaded",
        description: "Your resume has been successfully uploaded.",
      });
      
      navigate("/student/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Upload Your Resume</h1>
          <p className="text-muted-foreground mt-1">
            Upload your resume to apply for jobs on HiringHive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Upload Resume</CardTitle>
                  <CardDescription>
                    Supported formats: PDF, DOCX, TXT (Max 5MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {file ? (
                      <div className="space-y-2">
                        <FileText className="h-12 w-12 mx-auto text-app-primary" />
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          Change File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="font-medium">
                          Drag & drop your resume here, or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supported formats: PDF, DOCX, TXT (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>

                  <Input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                  />

                  <div className="flex justify-end mt-6">
                    <Button
                      type="submit"
                      disabled={uploading || !file}
                      className="w-full md:w-auto"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Upload Resume"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>

            <Alert className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Make sure your resume is up-to-date and includes relevant skills and experience.
                This helps our AI matching system find the best job opportunities for you.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Resumes</CardTitle>
                <CardDescription>
                  Previously uploaded resumes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-4 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : userResumes.length > 0 ? (
                  <div className="space-y-4">
                    {userResumes.map((resume) => (
                      <div
                        key={resume.id}
                        className="p-3 border rounded-lg flex items-center space-x-3"
                      >
                        <FileText className="h-5 w-5 text-app-primary flex-shrink-0" />
                        <div className="truncate">
                          <p className="font-medium truncate">{resume.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(resume.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No resumes uploaded yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UploadResume;
