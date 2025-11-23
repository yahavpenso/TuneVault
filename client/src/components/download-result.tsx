import { Download, RefreshCw, Music, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DownloadJob } from "@shared/schema";

interface DownloadResultProps {
  job: DownloadJob;
  onConvertAnother: () => void;
}

export function DownloadResult({ job, onConvertAnother }: DownloadResultProps) {
  const isSuccess = job.status === "completed";

  const handleDownloadFile = () => {
    if (job.resultFileUrl) {
      window.open(job.resultFileUrl, "_blank");
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className={`p-6 sm:p-8 shadow-2xl border-2 ${
      isSuccess ? "border-secondary/50 bg-secondary/5" : "border-destructive/50 bg-destructive/5"
    }`}>
      <div className="space-y-6">
        {/* Status Icon and Message */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {isSuccess ? (
            <>
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/30 blur-xl rounded-full"></div>
                <div className="relative bg-secondary/20 p-6 rounded-full">
                  <CheckCircle2 className="h-16 w-16 text-secondary" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  Download Ready!
                </h3>
                <p className="font-body text-base text-muted-foreground">
                  Your file has been converted successfully
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/30 blur-xl rounded-full"></div>
                <div className="relative bg-destructive/20 p-6 rounded-full">
                  <XCircle className="h-16 w-16 text-destructive" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  Download Failed
                </h3>
                <p className="font-body text-base text-destructive">
                  {job.error || "An error occurred during processing"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* File Info */}
        {isSuccess && job.metadata && (
          <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-card-border">
            {job.metadata.thumbnail ? (
              <img 
                src={job.metadata.thumbnail} 
                alt={job.metadata.title || "Thumbnail"}
                className="w-20 h-20 rounded-md object-cover shrink-0"
                data-testid="img-thumbnail"
              />
            ) : (
              <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center shrink-0">
                <Music className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0 space-y-2">
              <h4 className="font-heading text-lg font-semibold text-foreground line-clamp-2" data-testid="text-title">
                {job.metadata.title || "Untitled"}
              </h4>
              {job.metadata.artist && (
                <p className="font-body text-sm text-muted-foreground" data-testid="text-artist">
                  {job.metadata.artist}
                </p>
              )}
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="secondary" className="font-body uppercase" data-testid="badge-format">
                  {job.format}
                </Badge>
                <Badge variant="outline" className="font-body" data-testid="badge-quality">
                  {job.quality === "lossless" ? "Lossless" : `${job.quality} kbps`}
                </Badge>
                {job.metadata.duration && (
                  <span className="font-body text-xs text-muted-foreground">
                    {formatDuration(job.metadata.duration)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {isSuccess && (
            <Button
              onClick={handleDownloadFile}
              className="flex-1 h-12 text-base font-heading font-semibold shadow-lg"
              size="lg"
              data-testid="button-download-file"
            >
              <Download className="h-5 w-5 mr-2" />
              Download File
            </Button>
          )}
          <Button
            onClick={onConvertAnother}
            variant={isSuccess ? "outline" : "default"}
            className="flex-1 h-12 text-base font-heading font-semibold"
            size="lg"
            data-testid="button-convert-another"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Convert Another
          </Button>
        </div>
      </div>
    </Card>
  );
}
