import { getDatabase, initDatabase } from '../db/database';
import * as fs from 'fs';
import * as path from 'path';

interface Account {
  account_id: string;
  name: string;
  industry: string;
  segment: string;
}

interface Rep {
  rep_id: string;
  name: string;
}

interface Deal {
  deal_id: string;
  account_id: string;
  rep_id: string;
  stage: string;
  amount: number | null;
  created_at: string;
  closed_at: string | null;
}

interface Activity {
  activity_id: string;
  deal_id: string;
  type: string;
  timestamp: string;
}

interface Target {
  month: string;
  target: number;
}

function seedDatabase() {
  initDatabase();
  const db = getDatabase();

  // Clear existing data
  db.exec(`
    DELETE FROM activities;
    DELETE FROM deals;
    DELETE FROM targets;
    DELETE FROM accounts;
    DELETE FROM reps;
  `);

  // Read JSON files
  // In production (Render with rootDir=backend): data folder is copied to backend/data/ during build
  // In local dev: data folder is at repo root
  const possiblePaths = [
    path.join(process.cwd(), 'data'),         // backend/data/ (production - after copy)
    path.join(__dirname, '../../data'),       // backend/dist/data/ (fallback)
    path.join(process.cwd(), '../data'),      // ../data/ (local dev - repo root)
    path.join(__dirname, '../../../data'),    // From dist/scripts, up to root (local dev)
  ];
  
  let dataDir = possiblePaths[0];
  let found = false;
  for (const testPath of possiblePaths) {
    const testFile = path.join(testPath, 'accounts.json');
    if (fs.existsSync(testFile)) {
      dataDir = testPath;
      found = true;
      console.log(`Found data directory at: ${dataDir}`);
      break;
    }
  }
  
  // Verify data directory exists
  if (!found) {
    console.error('Data directory not found. Tried paths:', possiblePaths);
    console.error('Current working directory:', process.cwd());
    console.error('__dirname:', __dirname);
    throw new Error(`Cannot find data files. Tried: ${possiblePaths.join(', ')}`);
  }
  
  const accounts: Account[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'accounts.json'), 'utf-8')
  );
  
  const reps: Rep[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'reps.json'), 'utf-8')
  );
  
  const deals: Deal[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'deals.json'), 'utf-8')
  );
  
  const activities: Activity[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'activities.json'), 'utf-8')
  );
  
  const targets: Target[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'targets.json'), 'utf-8')
  );

  // Insert accounts
  const insertAccount = db.prepare(`
    INSERT INTO accounts (account_id, name, industry, segment)
    VALUES (?, ?, ?, ?)
  `);
  
  const insertAccountMany = db.transaction((accounts: Account[]) => {
    for (const account of accounts) {
      insertAccount.run(account.account_id, account.name, account.industry, account.segment);
    }
  });
  
  insertAccountMany(accounts);
  console.log(`Inserted ${accounts.length} accounts`);

  // Insert reps
  const insertRep = db.prepare(`
    INSERT INTO reps (rep_id, name)
    VALUES (?, ?)
  `);
  
  const insertRepMany = db.transaction((reps: Rep[]) => {
    for (const rep of reps) {
      insertRep.run(rep.rep_id, rep.name);
    }
  });
  
  insertRepMany(reps);
  console.log(`Inserted ${reps.length} reps`);

  // Insert deals
  const insertDeal = db.prepare(`
    INSERT INTO deals (deal_id, account_id, rep_id, stage, amount, created_at, closed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const insertDealMany = db.transaction((deals: Deal[]) => {
    for (const deal of deals) {
      insertDeal.run(
        deal.deal_id,
        deal.account_id,
        deal.rep_id,
        deal.stage,
        deal.amount,
        deal.created_at,
        deal.closed_at
      );
    }
  });
  
  insertDealMany(deals);
  console.log(`Inserted ${deals.length} deals`);

  // Insert activities
  const insertActivity = db.prepare(`
    INSERT INTO activities (activity_id, deal_id, type, timestamp)
    VALUES (?, ?, ?, ?)
  `);
  
  const insertActivityMany = db.transaction((activities: Activity[]) => {
    for (const activity of activities) {
      insertActivity.run(
        activity.activity_id,
        activity.deal_id,
        activity.type,
        activity.timestamp
      );
    }
  });
  
  insertActivityMany(activities);
  console.log(`Inserted ${activities.length} activities`);

  // Insert targets
  const insertTarget = db.prepare(`
    INSERT INTO targets (month, target)
    VALUES (?, ?)
  `);
  
  const insertTargetMany = db.transaction((targets: Target[]) => {
    for (const target of targets) {
      insertTarget.run(target.month, target.target);
    }
  });
  
  insertTargetMany(targets);
  console.log(`Inserted ${targets.length} targets`);

  console.log('Database seeded successfully!');
}

seedDatabase();
