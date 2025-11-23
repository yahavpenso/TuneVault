import { useState } from "react";
import { Clipboard, Music2, FileAudio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { DownloadJob, DownloadRequest } from "@shared/schema";

interface ConverterCardProps {
  onDownloadStart: (job: DownloadJob) => void;
}

export function ConverterCard({ onDownloadStart }: ConverterCardProps) {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<"mp3" | "wav" | "flac">("mp3");
  const [quality, setQuality] = useState<"128" | "320" | "lossless">("320");

  const downloadMutation = useMutation({
    mutationFn: async (data: DownloadRequest) => {
      const response = await apiRequest("POST", "/api/download", data);
      return await response.json() as DownloadJob;
    },
    onSuccess: (data) => {
      onDownloadStart(data);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: error.message || "Failed to start download. Please check the URL and try again.",
      });
    },
  });

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      toast({
        title: "URL pasted",
        description: "Ready to download",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Paste failed",
        description: "Please paste manually or check clipboard permissions.",
      });
    }
  };

  const handleDownload = () => {
    if (!url.trim()) {
      toast({
        variant: "destructive",
        title: "URL required",
        description: "Please enter a valid URL",
      });
      return;
    }

    downloadMutation.mutate({ url, format, quality });
  };

  const formatButtons = [
    { value: "mp3", label: "MP3", icon: Music2, description: "Most compatible" },
    { value: "wav", label: "WAV", icon: FileAudio, description: "Uncompressed" },
    { value: "flac", label: "FLAC", icon: FileAudio, description: "Lossless" },
  ] as const;

  return (
    <Card className="p-6 sm:p-8 shadow-2xl border-card-border">
      <div className="space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <Label htmlFor="url-input" className="font-body text-sm font-medium text-foreground">
            Paste URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="url-input"
              data-testid="input-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDownload()}
              className="h-14 text-base font-body border-2 focus-visible:ring-2 focus-visible:ring-secondary"
              disabled={downloadMutation.isPending}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handlePaste}
              className="h-14 w-14 shrink-0"
              title="Paste from clipboard"
              data-testid="button-paste"
              disabled={downloadMutation.isPending}
            >
              <Clipboard className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-3">
          <Label className="font-body text-sm font-medium text-foreground">
            Select Format
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {formatButtons.map((btn) => {
              const Icon = btn.icon;
              const isActive = format === btn.value;
              return (
                <button
                  key={btn.value}
                  onClick={() => setFormat(btn.value)}
                  data-testid={`button-format-${btn.value}`}
                  disabled={downloadMutation.isPending}
                  className={`
                    group relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
                    ${isActive 
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg' 
                      : 'bg-card border-card-border text-card-foreground hover-elevate active-elevate-2'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <Icon className="h-6 w-6" />
                  <span className="font-heading text-base font-semibold">{btn.label}</span>
                  <span className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {btn.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quality Selection */}
        <div className="space-y-2">
          <Label htmlFor="quality-select" className="font-body text-sm font-medium text-foreground">
            Audio Quality
          </Label>
          <Select value={quality} onValueChange={(v) => setQuality(v as any)} disabled={downloadMutation.isPending}>
            <SelectTrigger id="quality-select" data-testid="select-quality" className="h-12 font-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="128">128 kbps - Good quality</SelectItem>
              <SelectItem value="320">320 kbps - High quality</SelectItem>
              <SelectItem value="lossless">Lossless - Best quality</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          disabled={downloadMutation.isPending || !url.trim()}
          className="w-full h-12 text-base font-heading font-semibold shadow-lg"
          size="lg"
          data-testid="button-download"
        >
          {downloadMutation.isPending ? "Starting..." : "Download Now"}
        </Button>
      </div>
    </Card>
  );
}
