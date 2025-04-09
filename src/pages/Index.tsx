
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Search, FileCheck, User, Building, Clock } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Redirect authenticated users to their respective dashboards
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "hr") {
        navigate("/hr/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    }
  }, [currentUser, navigate]);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                AI-Powered Resume Screening for Better Hiring
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                HiringHive uses advanced AI to match job descriptions with the perfect candidates, 
                saving HR teams time while helping students find their ideal positions.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-app-primary hover:bg-app-secondary"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="bg-app-primary/10 rounded-lg p-6 relative">
                <div className="absolute -top-4 -left-4 bg-app-primary text-white font-semibold py-1 px-3 rounded-md">
                  For HR Teams
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-app-primary mt-1" />
                    <p className="ml-2 text-gray-800">Post jobs and get matched with qualified candidates</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-app-primary mt-1" />
                    <p className="ml-2 text-gray-800">Save time with automatic candidate screening</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-app-primary mt-1" />
                    <p className="ml-2 text-gray-800">Send bulk emails to shortlisted candidates</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-app-secondary/10 rounded-lg p-6 mt-4 relative">
                <div className="absolute -top-4 -left-4 bg-app-secondary text-white font-semibold py-1 px-3 rounded-md">
                  For Students
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-app-secondary mt-1" />
                    <p className="ml-2 text-gray-800">Upload your resume once, apply to multiple jobs</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-app-secondary mt-1" />
                    <p className="ml-2 text-gray-800">Get matched with jobs that fit your skills</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-app-secondary mt-1" />
                    <p className="ml-2 text-gray-800">Track your application status in real-time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How HiringHive Works</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform streamlines the recruitment process, making it easier for both HR professionals and job seekers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 text-app-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Post & Match</h3>
                <p className="text-gray-600">
                  HR professionals post detailed job descriptions while students upload their resumes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 text-app-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. AI Screening</h3>
                <p className="text-gray-600">
                  Our AI analyzes and compares resumes to job descriptions, shortlisting the best matches.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 text-app-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Connect</h3>
                <p className="text-gray-600">
                  HR professionals review shortlisted candidates and reach out to schedule interviews.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Key Features</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Powerful tools for both HR professionals and job-seeking students
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg bg-white hover:shadow-md transition-shadow">
              <Building className="h-10 w-10 text-app-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Company Profiles</h3>
              <p className="text-gray-600">
                Create detailed company profiles to attract the right talent for your organization.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-white hover:shadow-md transition-shadow">
              <FileCheck className="h-10 w-10 text-app-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Resume Parsing</h3>
              <p className="text-gray-600">
                Our system extracts key information from resumes for better matching with job requirements.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-white hover:shadow-md transition-shadow">
              <Search className="h-10 w-10 text-app-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Matching</h3>
              <p className="text-gray-600">
                Advanced algorithms ensure the best candidates are shortlisted based on skills and experience.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-white hover:shadow-md transition-shadow">
              <Clock className="h-10 w-10 text-app-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Track application status and get notified about important changes in real-time.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-white hover:shadow-md transition-shadow">
              <User className="h-10 w-10 text-app-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Candidate Management</h3>
              <p className="text-gray-600">
                Organize, filter, and manage candidates efficiently with our intuitive dashboard.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-white hover:shadow-md transition-shadow">
              <ArrowRight className="h-10 w-10 text-app-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Bulk Email</h3>
              <p className="text-gray-600">
                Contact multiple shortlisted candidates at once with customizable email templates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-app-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to Transform Your Hiring Process?</h2>
          <p className="mt-4 max-w-2xl mx-auto">
            Join HiringHive today and experience the power of AI-driven resume screening technology.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/register")}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-app-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
