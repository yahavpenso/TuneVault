import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { downloadRequestSchema, searchRequestSchema } from "@shared/schema";

// Helper to detect platform from URL
function detectPlatform(url: string): "youtube" | "soundcloud" | "spotify" | "applemusic" | "other" {
  const urlLower = url.toLowerCase();
  if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) {
    return "youtube";
  }
  if (urlLower.includes("soundcloud.com")) {
    return "soundcloud";
  }
  if (urlLower.includes("spotify.com")) {
    return "spotify";
  }
  if (urlLower.includes("music.apple.com") || urlLower.includes("open.spotify.com")) {
    return "applemusic";
  }
  return "other";
}

// Helper to extract video/track ID and fetch metadata
async function fetchMetadata(url: string, platform: string) {
  // In a real implementation, this would use ytdl-core, soundcloud-downloader, etc.
  // For MVP, we'll return mock metadata
  const mockTitles = [
    { title: "Summer Vibes Mix 2024", artist: "DJ Chill" },
    { title: "Epic Movie Soundtrack", artist: "Orchestra Masters" },
    { title: "Lofi Hip Hop Beats", artist: "Lofi Producer" },
    { title: "Rock Legends Collection", artist: "Classic Rock Band" },
    { title: "Electronic Dance Mix", artist: "EDM Artist" },
  ];

  const random = mockTitles[Math.floor(Math.random() * mockTitles.length)];
  
  return {
    title: random.title,
    artist: random.artist,
    thumbnail: `https://picsum.photos/seed/${Math.random()}/300/300`,
    duration: Math.floor(Math.random() * 300) + 60, // 1-6 minutes
  };
}

// Simulate download and conversion process
async function processDownload(jobId: string) {
  // Simulate fetching phase
  await storage.updateDownloadJob(jobId, { status: "fetching", progress: 10 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await storage.updateDownloadJob(jobId, { status: "fetching", progress: 30 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await storage.updateDownloadJob(jobId, { status: "fetching", progress: 50 });
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate converting phase
  await storage.updateDownloadJob(jobId, { status: "converting", progress: 60 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await storage.updateDownloadJob(jobId, { status: "converting", progress: 80 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await storage.updateDownloadJob(jobId, { status: "converting", progress: 95 });
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Complete
  await storage.updateDownloadJob(jobId, {
    status: "completed",
    progress: 100,
    resultFileUrl: `/api/files/${jobId}.mp3`,
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/download - Create download job
  app.post("/api/download", async (req, res) => {
    try {
      const validation = downloadRequestSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid request",
          details: validation.error.issues,
        });
      }

      const { url, format, quality } = validation.data;
      const platform = detectPlatform(url);

      // Fetch metadata
      const metadata = await fetchMetadata(url, platform);

      // Create download job
      const job = await storage.createDownloadJob({
        url,
        platform,
        format,
        quality,
        metadata,
      });

      // Start processing in background
      processDownload(job.id).catch(async (error) => {
        await storage.updateDownloadJob(job.id, {
          status: "error",
          error: error.message || "Download failed",
        });
      });

      res.json(job);
    } catch (error: any) {
      console.error("Download error:", error);
      res.status(500).json({
        error: "Failed to start download",
        message: error.message,
      });
    }
  });

  // GET /api/download/:id - Get download job status
  app.get("/api/download/:id", async (req, res) => {
    try {
      const job = await storage.getDownloadJob(req.params.id);
      
      if (!job) {
        return res.status(404).json({ error: "Download job not found" });
      }

      res.json(job);
    } catch (error: any) {
      console.error("Get download job error:", error);
      res.status(500).json({
        error: "Failed to get download job",
        message: error.message,
      });
    }
  });

  // POST /api/search - Search for music
  app.post("/api/search", async (req, res) => {
    try {
      const validation = searchRequestSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid search request",
          details: validation.error.issues,
        });
      }

      const { query } = validation.data;
      
      // Add to recent searches
      await storage.addRecentSearch(query);

      // In a real implementation, this would search YouTube, SoundCloud APIs
      // For MVP, return mock results
      const mockResults = [
        {
          id: "1",
          title: `${query} - Official Audio`,
          artist: "Artist Name",
          platform: "youtube" as const,
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail: "https://picsum.photos/seed/1/300/300",
          duration: 245,
        },
        {
          id: "2",
          title: `${query} (Live Performance)`,
          artist: "Live Band",
          platform: "youtube" as const,
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail: "https://picsum.photos/seed/2/300/300",
          duration: 312,
        },
        {
          id: "3",
          title: `Best of ${query}`,
          artist: "Compilation",
          platform: "soundcloud" as const,
          url: "https://soundcloud.com/example",
          thumbnail: "https://picsum.photos/seed/3/300/300",
          duration: 180,
        },
      ];

      res.json(mockResults);
    } catch (error: any) {
      console.error("Search error:", error);
      res.status(500).json({
        error: "Search failed",
        message: error.message,
      });
    }
  });

  // GET /api/search/recent - Get recent searches
  app.get("/api/search/recent", async (req, res) => {
    try {
      const searches = await storage.getRecentSearches();
      res.json(searches);
    } catch (error: any) {
      console.error("Get recent searches error:", error);
      res.status(500).json({
        error: "Failed to get recent searches",
        message: error.message,
      });
    }
  });

  // GET /api/files/:filename - Serve download files
  app.get("/api/files/:filename", async (req, res) => {
    try {
      // For MVP, serve a sample audio file
      // In production, this would stream the actual converted file from storage
      const filename = req.params.filename;
      
      // Set headers to trigger download
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Length", "1024"); // Mock file size
      
      // Send a small mock audio file (silence)
      // In production, you would stream the actual file: res.sendFile(filePath)
      const mockAudioData = Buffer.alloc(1024); // Empty buffer representing a tiny audio file
      res.send(mockAudioData);
    } catch (error: any) {
      console.error("File serve error:", error);
      res.status(500).json({
        error: "Failed to serve file",
        message: error.message,
      });
    }
  });

  // GET /api/downloads/history - Get download history
  app.get("/api/downloads/history", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const downloads = await storage.getRecentDownloads(limit);
      res.json(downloads);
    } catch (error: any) {
      console.error("Get history error:", error);
      res.status(500).json({
        error: "Failed to get download history",
        message: error.message,
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
