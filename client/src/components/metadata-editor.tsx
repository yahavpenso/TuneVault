import { Edit2, X, Check } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DownloadJob } from "@shared/schema";

interface MetadataEditorProps {
  job: DownloadJob;
  onMetadataChange?: (metadata: any) => void;
}

export function MetadataEditor({ job, onMetadataChange }: MetadataEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(job.metadata?.title || "");
  const [artist, setArtist] = useState(job.metadata?.artist || "");

  const handleSave = () => {
    if (onMetadataChange) {
      onMetadataChange({ ...job.metadata, title, artist });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(job.metadata?.title || "");
    setArtist(job.metadata?.artist || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="p-4 bg-card/50 border border-card-border space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter track title"
            data-testid="input-edit-title"
            className="font-body"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Artist
          </label>
          <Input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Enter artist name"
            data-testid="input-edit-artist"
            className="font-body"
          />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            data-testid="button-save-metadata"
            className="flex-1 gap-2"
          >
            <Check className="h-4 w-4" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            data-testid="button-cancel-metadata"
            className="flex-1 gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-card/50 border border-card-border flex items-center justify-between">
      <div className="flex-1">
        <h4 className="font-semibold text-foreground" data-testid="text-metadata-title">
          {title || "Untitled"}
        </h4>
        {artist && (
          <p className="text-sm text-muted-foreground">{artist}</p>
        )}
      </div>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        data-testid="button-edit-metadata"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
    </Card>
  );
}
