import { randomUUID } from "crypto";
import type { DownloadJob, InsertDownloadJob, SearchResult } from "@shared/schema";

export interface IStorage {
  // Download operations
  createDownloadJob(job: InsertDownloadJob): Promise<DownloadJob>;
  getDownloadJob(id: string): Promise<DownloadJob | undefined>;
  updateDownloadJob(id: string, updates: Partial<DownloadJob>): Promise<DownloadJob>;
  getAllDownloadJobs(): Promise<DownloadJob[]>;
  
  // Search operations
  searchMusic(query: string): Promise<SearchResult[]>;
  getRecentSearches(): Promise<string[]>;
  addRecentSearch(query: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private downloadJobs: Map<string, DownloadJob>;
  private recentSearches: string[];

  constructor() {
    this.downloadJobs = new Map();
    this.recentSearches = [];
  }

  // Download operations
  async createDownloadJob(insertJob: InsertDownloadJob): Promise<DownloadJob> {
    const id = randomUUID();
    const job: DownloadJob = {
      ...insertJob,
      id,
      status: "pending",
      progress: 0,
      createdAt: new Date(),
    };
    this.downloadJobs.set(id, job);
    return job;
  }

  async getDownloadJob(id: string): Promise<DownloadJob | undefined> {
    return this.downloadJobs.get(id);
  }

  async updateDownloadJob(id: string, updates: Partial<DownloadJob>): Promise<DownloadJob> {
    const job = this.downloadJobs.get(id);
    if (!job) {
      throw new Error("Download job not found");
    }
    const updatedJob = { ...job, ...updates };
    this.downloadJobs.set(id, updatedJob);
    return updatedJob;
  }

  async getAllDownloadJobs(): Promise<DownloadJob[]> {
    return Array.from(this.downloadJobs.values());
  }

  // Search operations
  async searchMusic(query: string): Promise<SearchResult[]> {
    // This will be implemented with real search in the backend
    return [];
  }

  async getRecentSearches(): Promise<string[]> {
    return this.recentSearches.slice(0, 10);
  }

  async addRecentSearch(query: string): Promise<void> {
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(s => s !== query);
    // Add to beginning
    this.recentSearches.unshift(query);
    // Keep only last 10
    this.recentSearches = this.recentSearches.slice(0, 10);
  }
}

export const storage = new MemStorage();
