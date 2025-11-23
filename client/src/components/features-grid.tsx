import { Music, Zap, Award, Shield, Download, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Music,
    title: "Multiple Formats",
    description: "Download in MP3, WAV, or FLAC format with customizable quality settings",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Fast Conversion",
    description: "Lightning-fast processing with optimized conversion algorithms",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Award,
    title: "High Quality",
    description: "Support for up to lossless quality audio with no compression artifacts",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "No Registration",
    description: "Start downloading immediately without creating an account or signing up",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    icon: Download,
    title: "Batch Downloads",
    description: "Queue multiple downloads and convert several files at once",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Fully responsive design works perfectly on phones, tablets, and desktops",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <Card
            key={index}
            className="p-6 hover-elevate transition-all border-card-border"
            data-testid={`card-feature-${index}`}
          >
            <div className="space-y-4">
              <div className={`inline-flex p-3 rounded-full ${feature.bgColor}`}>
                <Icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
