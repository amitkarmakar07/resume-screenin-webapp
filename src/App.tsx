
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { JobProvider } from "@/contexts/JobContext";
import { ApplicationProvider } from "@/contexts/ApplicationContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

// HR Pages
import HRDashboard from "./pages/hr/Dashboard";
import CreateJob from "./pages/hr/CreateJob";
import ShortlistedCandidates from "./pages/hr/ShortlistedCandidates";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import UploadResume from "./pages/student/UploadResume";
import ApplyJob from "./pages/student/ApplyJob";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <JobProvider>
        <ApplicationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* HR Routes */}
                <Route path="/hr/dashboard" element={<HRDashboard />} />
                <Route path="/hr/create-job" element={<CreateJob />} />
                <Route path="/hr/shortlisted/:jobId" element={<ShortlistedCandidates />} />
                
                {/* Student Routes */}
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/upload-resume" element={<UploadResume />} />
                <Route path="/student/apply/:jobId" element={<ApplyJob />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ApplicationProvider>
      </JobProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
