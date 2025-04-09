
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Building, ClipboardList, Calendar } from "lucide-react";
import { Job } from "@/types";

interface JobWithStatus extends Job {
  applicationStatus?: "applied" | "shortlisted" | "rejected";
  applicationId?: string;
  similarityScore?: number;
}

interface JobListProps {
  jobs: JobWithStatus[];
  userRole: "hr" | "student";
  showApplicationStatus?: boolean;
}

const JobList: React.FC<JobListProps> = ({ jobs, userRole, showApplicationStatus = false }) => {
  const navigate = useNavigate();

  if (!jobs.length) {
    return <p className="text-center py-10">No jobs found</p>;
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  {showApplicationStatus && job.applicationStatus && (
                    <Badge variant={job.applicationStatus === "shortlisted" ? "default" : "outline"}>
                      {job.applicationStatus.charAt(0).toUpperCase() + job.applicationStatus.slice(1)}
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    Company Name
                  </div>
                  
                  {job.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Posted {new Date(job.postedAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 4 && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      +{job.skills.length - 4} more
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 line-clamp-2">
                  {job.description.length > 150
                    ? `${job.description.substring(0, 150)}...`
                    : job.description}
                </p>
                
                {showApplicationStatus && job.similarityScore !== undefined && (
                  <div className="flex items-center mt-2">
                    <span className="text-sm mr-2">Match Score:</span>
                    <span 
                      className={`text-sm font-medium px-2 py-0.5 rounded ${
                        job.similarityScore >= 0.7
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {Math.round(job.similarityScore * 100)}%
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex md:flex-col gap-2 md:items-end">
                {userRole === "hr" ? (
                  <>
                    {job.applicationStatus === "shortlisted" && (
                      <Button 
                        variant="default"
                        onClick={() => navigate(`/hr/shortlisted/${job.id}`)}
                      >
                        View Shortlisted
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => console.log("Edit job", job.id)}
                    >
                      Edit Job
                    </Button>
                  </>
                ) : (
                  <>
                    {showApplicationStatus ? (
                      <Button 
                        variant="outline"
                        onClick={() => console.log("View application", job.applicationId)}
                      >
                        <ClipboardList className="h-4 w-4 mr-2" />
                        View Application
                      </Button>
                    ) : (
                      <Button
                        onClick={() => navigate(`/student/apply/${job.id}`)}
                      >
                        Apply Now
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobList;
