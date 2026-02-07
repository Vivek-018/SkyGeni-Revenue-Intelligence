import { getDatabase } from '../db/database';

export interface DriversResponse {
  pipelineSize: number;
  winRate: number;
  averageDealSize: number;
  salesCycleTime: number; // in days
}

function getCurrentQuarter(): { start: string; end: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  
  let startMonth: number;
  let endMonth: number;
  
  if (month >= 1 && month <= 3) {
    startMonth = 1;
    endMonth = 3;
  } else if (month >= 4 && month <= 6) {
    startMonth = 4;
    endMonth = 6;
  } else if (month >= 7 && month <= 9) {
    startMonth = 7;
    endMonth = 9;
  } else {
    startMonth = 10;
    endMonth = 12;
  }
  
  const start = `${year}-${String(startMonth).padStart(2, '0')}-01`;
  const lastDay = new Date(year, endMonth, 0).getDate();
  const end = `${year}-${String(endMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  
  return { start, end };
}

export function getDrivers(): DriversResponse {
  const db = getDatabase();
  const current = getCurrentQuarter();
  
  // Pipeline size: sum of all open deals (not Closed Won or Closed Lost)
  const pipelineResult = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as pipeline_size
    FROM deals
    WHERE stage NOT IN ('Closed Won', 'Closed Lost')
      AND amount IS NOT NULL
      AND created_at <= ?
  `).get(current.end) as { pipeline_size: number };
  
  const pipelineSize = pipelineResult.pipeline_size || 0;
  
  // Win rate: closed won / (closed won + closed lost) in current quarter
  const winRateResult = db.prepare(`
    SELECT 
      COUNT(CASE WHEN stage = 'Closed Won' THEN 1 END) as won,
      COUNT(CASE WHEN stage = 'Closed Lost' THEN 1 END) as lost
    FROM deals
    WHERE (stage = 'Closed Won' OR stage = 'Closed Lost')
      AND closed_at >= ?
      AND closed_at <= ?
  `).get(current.start, current.end) as { won: number; lost: number };
  
  const totalClosed = winRateResult.won + winRateResult.lost;
  const winRate = totalClosed > 0 ? (winRateResult.won / totalClosed) * 100 : 0;
  
  // Average deal size: average of closed won deals in current quarter
  const avgDealResult = db.prepare(`
    SELECT AVG(amount) as avg_deal_size
    FROM deals
    WHERE stage = 'Closed Won'
      AND closed_at >= ?
      AND closed_at <= ?
      AND amount IS NOT NULL
  `).get(current.start, current.end) as { avg_deal_size: number | null };
  
  const averageDealSize = avgDealResult.avg_deal_size || 0;
  
  // Sales cycle time: average days between created_at and closed_at for closed won deals in current quarter
  const cycleTimeResult = db.prepare(`
    SELECT 
      AVG(
        (julianday(closed_at) - julianday(created_at))
      ) as avg_cycle_days
    FROM deals
    WHERE stage = 'Closed Won'
      AND closed_at >= ?
      AND closed_at <= ?
      AND created_at IS NOT NULL
      AND closed_at IS NOT NULL
  `).get(current.start, current.end) as { avg_cycle_days: number | null };
  
  const salesCycleTime = cycleTimeResult.avg_cycle_days ? Math.round(cycleTimeResult.avg_cycle_days) : 0;
  
  return {
    pipelineSize,
    winRate,
    averageDealSize: Math.round(averageDealSize),
    salesCycleTime,
  };
}
