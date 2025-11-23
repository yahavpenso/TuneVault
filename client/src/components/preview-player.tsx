import { Play, Pause } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DownloadJob } from "@shared/schema";

interface PreviewPlayerProps {
  job: DownloadJob;
}

export function PreviewPlayer({ job }: PreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const previewUrl = (job.metadata as any)?.previewUrl;

  if (!previewUrl) {
    return null;
  }

  return (
    <Card className="p-4 bg-card/50 border border-card-border">
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
          data-testid="button-play-preview"
          className="shrink-0"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground mb-1">Preview</p>
          <div className="w-full bg-muted rounded-full h-2" data-testid="preview-progress">
            <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }}></div>
          </div>
        </div>
      </div>
    </Card>
  );
}
