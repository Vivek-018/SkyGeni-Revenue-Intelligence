import { getDatabase } from '../db/database';

export interface SummaryResponse {
  currentQuarterRevenue: number;
  target: number;
  gap: number;
  gapPercentage: number;
  change: {
    type: 'YoY' | 'QoQ';
    value: number;
    percentage: number;
  };
}

function getCurrentQuarter(): { start: string; end: string; quarter: number; year: number } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  
  let quarter: number;
  let startMonth: number;
  let endMonth: number;
  
  if (month >= 1 && month <= 3) {
    quarter = 1;
    startMonth = 1;
    endMonth = 3;
  } else if (month >= 4 && month <= 6) {
    quarter = 2;
    startMonth = 4;
    endMonth = 6;
  } else if (month >= 7 && month <= 9) {
    quarter = 3;
    startMonth = 7;
    endMonth = 9;
  } else {
    quarter = 4;
    startMonth = 10;
    endMonth = 12;
  }
  
  const start = `${year}-${String(startMonth).padStart(2, '0')}-01`;
  const lastDay = new Date(year, endMonth, 0).getDate();
  const end = `${year}-${String(endMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  
  return { start, end, quarter, year };
}

function getPreviousQuarter(quarter: number, year: number): { start: string; end: string; quarter: number; year: number } {
  let prevQuarter = quarter - 1;
  let prevYear = year;
  
  if (prevQuarter === 0) {
    prevQuarter = 4;
    prevYear = year - 1;
  }
  
  let startMonth: number;
  let endMonth: number;
  
  if (prevQuarter === 1) {
    startMonth = 1;
    endMonth = 3;
  } else if (prevQuarter === 2) {
    startMonth = 4;
    endMonth = 6;
  } else if (prevQuarter === 3) {
    startMonth = 7;
    endMonth = 9;
  } else {
    startMonth = 10;
    endMonth = 12;
  }
  
  const start = `${prevYear}-${String(startMonth).padStart(2, '0')}-01`;
  const lastDay = new Date(prevYear, endMonth, 0).getDate();
  const end = `${prevYear}-${String(endMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  
  return { start, end, quarter: prevQuarter, year: prevYear };
}

function getSameQuarterLastYear(quarter: number, year: number): { start: string; end: string } {
  const prevYear = year - 1;
  
  let startMonth: number;
  let endMonth: number;
  
  if (quarter === 1) {
    startMonth = 1;
    endMonth = 3;
  } else if (quarter === 2) {
    startMonth = 4;
    endMonth = 6;
  } else if (quarter === 3) {
    startMonth = 7;
    endMonth = 9;
  } else {
    startMonth = 10;
    endMonth = 12;
  }
  
  const start = `${prevYear}-${String(startMonth).padStart(2, '0')}-01`;
  const lastDay = new Date(prevYear, endMonth, 0).getDate();
  const end = `${prevYear}-${String(endMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  
  return { start, end };
}

function getRevenueForPeriod(startDate: string, endDate: string): number {
  const db = getDatabase();
  
  const result = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as revenue
    FROM deals
    WHERE stage = 'Closed Won'
      AND closed_at IS NOT NULL
      AND closed_at >= ?
      AND closed_at <= ?
      AND amount IS NOT NULL
  `).get(startDate, endDate) as { revenue: number };
  
  return result.revenue || 0;
}

function getTargetForQuarter(quarter: number, year: number): number {
  const db = getDatabase();
  
  let startMonth: number;
  let endMonth: number;
  
  if (quarter === 1) {
    startMonth = 1;
    endMonth = 3;
  } else if (quarter === 2) {
    startMonth = 4;
    endMonth = 6;
  } else if (quarter === 3) {
    startMonth = 7;
    endMonth = 9;
  } else {
    startMonth = 10;
    endMonth = 12;
  }
  
  const months: string[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    months.push(`${year}-${String(m).padStart(2, '0')}`);
  }
  
  const placeholders = months.map(() => '?').join(',');
  const result = db.prepare(`
    SELECT COALESCE(SUM(target), 0) as total_target
    FROM targets
    WHERE month IN (${placeholders})
  `).get(...months) as { total_target: number };
  
  return result.total_target || 0;
}

export function getSummary(): SummaryResponse {
  const current = getCurrentQuarter();
  const currentRevenue = getRevenueForPeriod(current.start, current.end);
  const target = getTargetForQuarter(current.quarter, current.year);
  const gap = currentRevenue - target;
  const gapPercentage = target > 0 ? (gap / target) * 100 : 0;
  
  // Calculate QoQ change
  const previous = getPreviousQuarter(current.quarter, current.year);
  const previousRevenue = getRevenueForPeriod(previous.start, previous.end);
  const qoqChange = currentRevenue - previousRevenue;
  const qoqPercentage = previousRevenue > 0 ? (qoqChange / previousRevenue) * 100 : 0;
  
  // Calculate YoY change
  const lastYear = getSameQuarterLastYear(current.quarter, current.year);
  const lastYearRevenue = getRevenueForPeriod(lastYear.start, lastYear.end);
  const yoyChange = currentRevenue - lastYearRevenue;
  const yoyPercentage = lastYearRevenue > 0 ? (yoyChange / lastYearRevenue) * 100 : 0;
  
  // Use YoY if we have data, otherwise QoQ
  const useYoY = lastYearRevenue > 0;
  
  return {
    currentQuarterRevenue: currentRevenue,
    target,
    gap,
    gapPercentage,
    change: {
      type: useYoY ? 'YoY' : 'QoQ',
      value: useYoY ? yoyChange : qoqChange,
      percentage: useYoY ? yoyPercentage : qoqPercentage,
    },
  };
}
