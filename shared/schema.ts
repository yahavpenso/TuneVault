import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Download job schema
export const downloadJobSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  platform: z.enum(["youtube", "soundcloud", "spotify", "other"]),
  format: z.enum(["mp3", "wav", "flac"]),
  quality: z.enum(["128", "320", "lossless"]),
  status: z.enum(["pending", "fetching", "converting", "completed", "error"]),
  progress: z.number().min(0).max(100),
  resultFileUrl: z.string().optional(),
  metadata: z.object({
    title: z.string().optional(),
    artist: z.string().optional(),
    thumbnail: z.string().optional(),
    duration: z.number().optional(),
  }).optional(),
  error: z.string().optional(),
  createdAt: z.date(),
});

export const insertDownloadJobSchema = downloadJobSchema.omit({
  id: true,
  createdAt: true,
  status: true,
  progress: true,
});

export type DownloadJob = z.infer<typeof downloadJobSchema>;
export type InsertDownloadJob = z.infer<typeof insertDownloadJobSchema>;

// Search result schema
export const searchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string().optional(),
  platform: z.enum(["youtube", "soundcloud", "spotify", "other"]),
  url: z.string().url(),
  thumbnail: z.string().optional(),
  duration: z.number().optional(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;

// Download request validation schema
export const downloadRequestSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  format: z.enum(["mp3", "wav", "flac"]),
  quality: z.enum(["128", "320", "lossless"]),
});

export type DownloadRequest = z.infer<typeof downloadRequestSchema>;

// Search request validation schema
export const searchRequestSchema = z.object({
  query: z.string().min(1, "Please enter a search query"),
  platform: z.enum(["youtube", "soundcloud", "all"]).optional(),
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;
