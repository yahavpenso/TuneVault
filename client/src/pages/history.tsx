import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DownloadJob } from "@shared/schema";

export default function History() {
  const { data: downloads = [], isLoading } = useQuery<DownloadJob[]>({
    queryKey: ["/api/downloads/history"],
    initialData: [],
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "pending":
      case "fetching":
      case "converting":
        return <Clock className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "youtube":
        return "text-red-500";
      case "soundcloud":
        return "text-orange-500";
      case "spotify":
        return "text-green-500";
      case "applemusic":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-foreground">Download History</h1>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading history...</p>
            </div>
          ) : downloads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No downloads yet</p>
              <Link href="/">
                <Button data-testid="button-start-download">Start Downloading</Button>
              </Link>
            </div>
          ) : (
            downloads.map((download) => (
              <Card key={download.id} className="p-4 hover-elevate">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium uppercase ${getPlatformColor(download.platform)}`}>
                        {download.platform}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        {download.format} • {download.quality}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground truncate" data-testid={`text-download-title-${download.id}`}>
                      {download.metadata?.title || "Untitled"}
                    </h3>
                    {download.metadata?.artist && (
                      <p className="text-sm text-muted-foreground truncate">{download.metadata.artist}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(download.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(download.status)}
                      <span className="text-sm font-medium text-foreground">
                        {getStatusText(download.status)}
                      </span>
                    </div>
                    {download.status === "completed" && download.resultFileUrl && (
                      <a href={download.resultFileUrl} download>
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid={`button-download-${download.id}`}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
