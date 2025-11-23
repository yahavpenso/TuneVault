import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { pgTable, text, varchar, timestamp, numeric, jsonb, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Drizzle Tables
export const downloadJobsTable = pgTable("download_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: varchar("url").notNull(),
  platform: varchar("platform", { enum: ["youtube", "soundcloud", "spotify", "applemusic", "other"] }).notNull(),
  format: varchar("format", { enum: ["mp3", "wav", "flac"] }).notNull(),
  quality: varchar("quality", { enum: ["128", "320", "lossless"] }).notNull(),
  status: varchar("status", { enum: ["pending", "fetching", "converting", "completed", "error"] }).notNull().default("pending"),
  progress: numeric("progress", { precision: 3, scale: 0 }).notNull().default("0"),
  resultFileUrl: varchar("result_file_url"),
  metadata: jsonb("metadata"),
  error: text("error"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const recentSearchesTable = pgTable("recent_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  query: varchar("query").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Zod Schemas
export const downloadJobSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  platform: z.enum(["youtube", "soundcloud", "spotify", "applemusic", "other"]),
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
  updatedAt: z.date(),
});

export const insertDownloadJobSchema = downloadJobSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
  platform: z.enum(["youtube", "soundcloud", "spotify", "applemusic", "other"]),
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
