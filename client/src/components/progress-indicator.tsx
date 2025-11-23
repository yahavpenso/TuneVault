import { useEffect } from "react";
import { Loader2, Music } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import type { DownloadJob } from "@shared/schema";

interface ProgressIndicatorProps {
  job: DownloadJob;
  onUpdate?: (job: DownloadJob) => void;
}

export function ProgressIndicator({ job, onUpdate }: ProgressIndicatorProps) {
  const { data: updatedJob } = useQuery<DownloadJob>({
    queryKey: [`/api/download/${job.id}`],
    initialData: job,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 1000;
      if (data.status === "completed" || data.status === "error") return false;
      return 1000;
    },
    enabled: !!job.id && job.status !== "completed" && job.status !== "error",
  });

  const currentJob = updatedJob || job;
  const progress = typeof currentJob.progress === 'number' ? currentJob.progress : 0;

  // Notify parent when job updates
  useEffect(() => {
    if (updatedJob && onUpdate) {
      onUpdate(updatedJob);
    }
  }, [updatedJob, onUpdate]);

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Preparing download...";
      case "fetching":
        return "Fetching audio...";
      case "converting":
        return "Converting to " + currentJob.format.toUpperCase() + "...";
      default:
        return "Processing...";
    }
  };

  const getEstimatedTime = (progress: number) => {
    if (progress < 10) return "Estimating time...";
    if (progress < 50) return "About 30 seconds";
    if (progress < 80) return "Almost there...";
    return "Finishing up...";
  };

  return (
    <Card className="p-6 sm:p-8 shadow-2xl border-card-border">
      <div className="space-y-6">
        {/* Icon and Status */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-secondary/20 blur-xl rounded-full"></div>
            <div className="relative bg-secondary/10 p-6 rounded-full">
              <Loader2 className="h-12 w-12 text-secondary animate-spin" />
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-heading text-2xl font-semibold text-foreground">
              {getStatusText(currentJob.status)}
            </h3>
            <p className="font-body text-sm text-muted-foreground">
              {getEstimatedTime(progress)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-body text-sm font-medium text-foreground">
              Progress
            </span>
            <span className="font-body text-sm font-semibold text-secondary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress 
            value={progress} 
            className="h-3"
            data-testid="progress-bar"
          />
        </div>

        {/* Metadata if available */}
        {currentJob.metadata?.title && (
          <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-muted">
            {currentJob.metadata.thumbnail ? (
              <img 
                src={currentJob.metadata.thumbnail} 
                alt={currentJob.metadata.title}
                className="w-16 h-16 rounded-md object-cover shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center shrink-0">
                <Music className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-heading text-base font-semibold text-foreground truncate">
                {currentJob.metadata.title}
              </h4>
              {currentJob.metadata.artist && (
                <p className="font-body text-sm text-muted-foreground truncate">
                  {currentJob.metadata.artist}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
