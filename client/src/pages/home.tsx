import { useState } from "react";
import { Music, Search } from "lucide-react";
import { SiYoutube, SiSoundcloud, SiSpotify, SiApplemusic } from "react-icons/si";
import { ConverterCard } from "@/components/converter-card";
import { ProgressIndicator } from "@/components/progress-indicator";
import { DownloadResult } from "@/components/download-result";
import { SearchSection } from "@/components/search-section";
import { FeaturesGrid } from "@/components/features-grid";
import { Footer } from "@/components/footer";
import type { DownloadJob } from "@shared/schema";

export default function Home() {
  const [downloadJob, setDownloadJob] = useState<DownloadJob | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const handleDownloadComplete = (job: DownloadJob) => {
    setDownloadJob(job);
  };

  const handleConvertAnother = () => {
    setDownloadJob(null);
  };

  const handleDownloadStart = (job: DownloadJob) => {
    setDownloadJob(job);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-background via-secondary/5 to-primary/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          {/* Header/Brand */}
          <div className="flex items-center justify-center mb-12">
            <Music className="h-10 w-10 text-primary mr-3" />
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground">
              TuneDownload
            </h1>
          </div>

          {/* Hero Heading */}
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Download Music in Seconds
            </h2>
            <p className="font-body text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Convert and download audio from YouTube, SoundCloud, and more. 
              Choose your format, select quality, and get your music instantly.
            </p>
          </div>

          {/* Supported Platforms */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-card-border">
              <SiYoutube className="h-5 w-5 text-[#FF0000]" />
              <span className="font-body text-sm text-card-foreground">YouTube</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-card-border">
              <SiSoundcloud className="h-5 w-5 text-[#FF5500]" />
              <span className="font-body text-sm text-card-foreground">SoundCloud</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-card-border">
              <SiSpotify className="h-5 w-5 text-[#1DB954]" />
              <span className="font-body text-sm text-card-foreground">Spotify</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-card-border">
              <SiApplemusic className="h-5 w-5 text-[#FA243C]" />
              <span className="font-body text-sm text-card-foreground">Apple Music</span>
            </div>
            <span className="font-body text-sm text-muted-foreground">and more...</span>
          </div>

          {/* Main Converter/Progress/Result Section */}
          <div className="max-w-4xl mx-auto">
            {!downloadJob && (
              <ConverterCard onDownloadStart={handleDownloadStart} />
            )}

            {downloadJob && downloadJob.status !== "completed" && downloadJob.status !== "error" && (
              <ProgressIndicator 
                job={downloadJob} 
                onUpdate={(updatedJob) => setDownloadJob(updatedJob)}
              />
            )}

            {downloadJob && (downloadJob.status === "completed" || downloadJob.status === "error") && (
              <DownloadResult 
                job={downloadJob} 
                onConvertAnother={handleConvertAnother}
              />
            )}
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="inline-flex items-center gap-2 font-heading text-2xl sm:text-3xl font-semibold text-foreground hover-elevate active-elevate-2 px-6 py-3 rounded-lg transition-all"
            data-testid="button-toggle-search"
          >
            <Search className="h-6 w-6" />
            Search for Music
          </button>
        </div>
        
        {showSearch && <SearchSection />}
      </div>

      {/* Features Grid */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose TuneDownload?
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Fast, reliable, and high-quality music downloads with multiple format options
            </p>
          </div>
          <FeaturesGrid />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
