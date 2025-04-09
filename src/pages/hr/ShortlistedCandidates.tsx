
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Mail, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useJobs } from "@/contexts/JobContext";
import { useApplications } from "@/contexts/ApplicationContext";
import { ShortlistedCandidate } from "@/types";

const ShortlistedCandidates = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { getJob } = useJobs();
  const { getShortlistedByJob, simulateSendEmails, loading } = useApplications();
  
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState("");
  const [sendingEmails, setSendingEmails] = useState(false);

  // Redirect if not logged in or not HR
  if (!currentUser || currentUser.role !== "hr") {
    navigate("/login");
    return null;
  }

  if (!jobId) {
    navigate("/hr/dashboard");
    return null;
  }

  const job = getJob(jobId);
  const shortlisted = getShortlistedByJob(jobId);

  // Sort candidates by similarity score in descending order
  const sortedCandidates = [...shortlisted].sort(
    (a, b) => b.similarityScore - a.similarityScore
  );

  if (!job) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <h2 className="text-xl">Job not found</h2>
          <Button className="mt-4" onClick={() => navigate("/hr/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleEmailButtonClick = () => {
    // Set default email template
    setEmailTemplate(
      `Dear Candidate,\n\nCongratulations! Your application for the ${job.title} position has been shortlisted for further consideration.\n\nWe were impressed by your qualifications and would like to invite you for an interview. We'll be in touch shortly with more details.\n\nBest regards,\nRecruitment Team`
    );
    setEmailModalOpen(true);
  };

  const handleSendEmails = async () => {
    if (!emailTemplate.trim()) {
      toast({
        variant: "destructive",
        title: "Email template is empty",
        description: "Please provide an email message before sending.",
      });
      return;
    }

    setSendingEmails(true);
    try {
      await simulateSendEmails(sortedCandidates, emailTemplate);
      
      toast({
        title: "Emails Sent",
        description: `Successfully sent emails to ${sortedCandidates.length} candidates.`,
      });
      
      setEmailModalOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send emails",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setSendingEmails(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className="text-gray-500 mt-1">Shortlisted Candidates</p>
          </div>
          
          {sortedCandidates.length > 0 && (
            <Button onClick={handleEmailButtonClick}>
              <Mail className="mr-2 h-4 w-4" />
              Send Emails to Shortlisted
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : sortedCandidates.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Match Score</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead className="text-right">Shortlisted On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-block px-2 py-1 rounded-md bg-green-100 text-green-800 font-medium">
                        {Math.round(candidate.similarityScore * 100)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={candidate.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-app-primary hover:text-app-secondary"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </TableCell>
                    <TableCell className="text-right text-gray-500">
                      {new Date(candidate.shortlistedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium">No candidates have been shortlisted yet</h3>
            <p className="text-gray-500 mt-2">
              When candidates with a match score above 70% apply, they will appear here.
            </p>
          </div>
        )}

        {/* Email Template Dialog */}
        <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Email Shortlisted Candidates</DialogTitle>
              <DialogDescription>
                Customize the email template that will be sent to all {sortedCandidates.length} shortlisted candidates.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Textarea
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                className="min-h-[200px]"
                placeholder="Enter your email message here..."
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEmailModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendEmails} disabled={sendingEmails}>
                {sendingEmails ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Emails
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ShortlistedCandidates;
