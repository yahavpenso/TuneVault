import { randomUUID } from "crypto";
import { desc, eq, limit } from "drizzle-orm";
import type { DownloadJob, InsertDownloadJob, SearchResult } from "@shared/schema";
import { downloadJobsTable, recentSearchesTable } from "@shared/schema";
import { db } from "./db";

export interface IStorage {
  // Download operations
  createDownloadJob(job: InsertDownloadJob): Promise<DownloadJob>;
  getDownloadJob(id: string): Promise<DownloadJob | undefined>;
  updateDownloadJob(id: string, updates: Partial<DownloadJob>): Promise<DownloadJob>;
  getAllDownloadJobs(): Promise<DownloadJob[]>;
  getRecentDownloads(count?: number): Promise<DownloadJob[]>;
  
  // Search operations
  searchMusic(query: string): Promise<SearchResult[]>;
  getRecentSearches(): Promise<string[]>;
  addRecentSearch(query: string): Promise<void>;
}

export class DbStorage implements IStorage {
  // Download operations
  async createDownloadJob(insertJob: InsertDownloadJob): Promise<DownloadJob> {
    const id = randomUUID();
    const now = new Date();
    
    const result = await db.insert(downloadJobsTable).values({
      id,
      ...insertJob,
      status: "pending",
      progress: "0",
      createdAt: now,
      updatedAt: now,
    }).returning();

    return this.mapDbToJob(result[0]);
  }

  async getDownloadJob(id: string): Promise<DownloadJob | undefined> {
    const result = await db
      .select()
      .from(downloadJobsTable)
      .where(eq(downloadJobsTable.id, id))
      .limit(1);

    return result.length > 0 ? this.mapDbToJob(result[0]) : undefined;
  }

  async updateDownloadJob(id: string, updates: Partial<DownloadJob>): Promise<DownloadJob> {
    const now = new Date();
    const dbUpdates: any = {
      ...updates,
      updatedAt: now,
    };
    
    // Convert progress to string for numeric column
    if (updates.progress !== undefined) {
      dbUpdates.progress = String(updates.progress);
    }

    const result = await db
      .update(downloadJobsTable)
      .set(dbUpdates)
      .where(eq(downloadJobsTable.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error("Download job not found");
    }

    return this.mapDbToJob(result[0]);
  }

  async getAllDownloadJobs(): Promise<DownloadJob[]> {
    const results = await db.select().from(downloadJobsTable);
    return results.map(r => this.mapDbToJob(r));
  }

  async getRecentDownloads(count: number = 10): Promise<DownloadJob[]> {
    const results = await db
      .select()
      .from(downloadJobsTable)
      .orderBy(desc(downloadJobsTable.createdAt))
      .limit(count);

    return results.map(r => this.mapDbToJob(r));
  }

  // Search operations
  async searchMusic(query: string): Promise<SearchResult[]> {
    // This will be implemented with real search in the backend
    return [];
  }

  async getRecentSearches(): Promise<string[]> {
    const results = await db
      .select({ query: recentSearchesTable.query })
      .from(recentSearchesTable)
      .orderBy(desc(recentSearchesTable.createdAt))
      .limit(10);

    return results.map(r => r.query);
  }

  async addRecentSearch(query: string): Promise<void> {
    // Delete if already exists
    await db
      .delete(recentSearchesTable)
      .where(eq(recentSearchesTable.query, query));

    // Add new entry
    await db.insert(recentSearchesTable).values({
      id: randomUUID(),
      query,
      createdAt: new Date(),
    });
  }

  // Helper to convert database record to DownloadJob
  private mapDbToJob(dbRecord: any): DownloadJob {
    return {
      id: dbRecord.id,
      url: dbRecord.url,
      platform: dbRecord.platform as any,
      format: dbRecord.format as any,
      quality: dbRecord.quality as any,
      status: dbRecord.status as any,
      progress: Number(dbRecord.progress),
      resultFileUrl: dbRecord.resultFileUrl,
      metadata: dbRecord.metadata as any,
      error: dbRecord.error,
      createdAt: dbRecord.createdAt,
      updatedAt: dbRecord.updatedAt,
    };
  }
}

export const storage = new DbStorage();
