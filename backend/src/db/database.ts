import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Default to data directory
// In production: data folder is copied to backend/data/ during build
// In local dev: data folder is at repo root
const DB_PATH = process.env.DB_PATH || (
  process.env.NODE_ENV === 'production' 
    ? path.join(process.cwd(), 'data/revenue.db')  // backend/data/revenue.db
    : path.join(__dirname, '../../../data/revenue.db')  // Local: repo root/data/revenue.db
);

// Ensure data directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function initDatabase() {
  const db = getDatabase();

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      account_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      industry TEXT,
      segment TEXT
    );

    CREATE TABLE IF NOT EXISTS reps (
      rep_id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS deals (
      deal_id TEXT PRIMARY KEY,
      account_id TEXT,
      rep_id TEXT,
      stage TEXT,
      amount REAL,
      created_at TEXT,
      closed_at TEXT,
      FOREIGN KEY (account_id) REFERENCES accounts(account_id),
      FOREIGN KEY (rep_id) REFERENCES reps(rep_id)
    );

    CREATE TABLE IF NOT EXISTS activities (
      activity_id TEXT PRIMARY KEY,
      deal_id TEXT,
      type TEXT,
      timestamp TEXT,
      FOREIGN KEY (deal_id) REFERENCES deals(deal_id)
    );

    CREATE TABLE IF NOT EXISTS targets (
      month TEXT PRIMARY KEY,
      target REAL NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_deals_account ON deals(account_id);
    CREATE INDEX IF NOT EXISTS idx_deals_rep ON deals(rep_id);
    CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
    CREATE INDEX IF NOT EXISTS idx_deals_created ON deals(created_at);
    CREATE INDEX IF NOT EXISTS idx_activities_deal ON activities(deal_id);
    CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);
  `);

  console.log('Database initialized');
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
