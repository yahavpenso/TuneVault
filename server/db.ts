import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const db = drizzle({
  connection: process.env.DATABASE_URL,
  logger: process.env.NODE_ENV === "development",
});

// Test database connection
export async function testConnection() {
  try {
    await db.execute(sql`SELECT NOW()`);
    console.log("✓ Database connection successful");
    return true;
  } catch (error) {
    console.error("✗ Database connection failed:", error);
    return false;
  }
}
