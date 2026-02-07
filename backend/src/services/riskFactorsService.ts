import { getDatabase } from '../db/database';

export interface StaleDeal {
  deal_id: string;
  account_id: string;
  rep_id: string;
  amount: number;
  stage: string;
  daysSinceUpdate: number;
  created_at: string;
}

export interface UnderperformingRep {
  rep_id: string;
  name: string;
  winRate: number;
  totalDeals: number;
  closedWon: number;
  closedLost: number;
}

export interface LowActivityAccount {
  account_id: string;
  name: string;
  segment: string;
  daysSinceLastActivity: number;
  openDeals: number;
}

export interface RiskFactorsResponse {
  staleDeals: StaleDeal[];
  underperformingReps: UnderperformingRep[];
  lowActivityAccounts: LowActivityAccount[];
}

export function getRiskFactors(): RiskFactorsResponse {
  const db = getDatabase();
  
  // Stale deals: deals older than 30 days that are not closed
  const staleDeals = db.prepare(`
    SELECT 
      d.deal_id,
      d.account_id,
      d.rep_id,
      d.amount,
      d.stage,
      d.created_at,
      CAST((julianday('now') - julianday(d.created_at)) AS INTEGER) as days_since_update
    FROM deals d
    WHERE d.stage NOT IN ('Closed Won', 'Closed Lost')
      AND d.amount IS NOT NULL
      AND (julianday('now') - julianday(d.created_at)) > 30
    ORDER BY days_since_update DESC
    LIMIT 20
  `).all() as Array<{
    deal_id: string;
    account_id: string;
    rep_id: string;
    amount: number;
    stage: string;
    created_at: string;
    days_since_update: number;
  }>;
  
  const staleDealsFormatted: StaleDeal[] = staleDeals.map(deal => ({
    deal_id: deal.deal_id,
    account_id: deal.account_id,
    rep_id: deal.rep_id,
    amount: deal.amount,
    stage: deal.stage,
    daysSinceUpdate: deal.days_since_update,
    created_at: deal.created_at,
  }));
  
  // Underperforming reps: reps with win rate < 30% and at least 5 closed deals
  const underperformingReps = db.prepare(`
    SELECT 
      r.rep_id,
      r.name,
      COUNT(CASE WHEN d.stage = 'Closed Won' THEN 1 END) as closed_won,
      COUNT(CASE WHEN d.stage = 'Closed Lost' THEN 1 END) as closed_lost,
      COUNT(CASE WHEN d.stage IN ('Closed Won', 'Closed Lost') THEN 1 END) as total_closed
    FROM reps r
    LEFT JOIN deals d ON r.rep_id = d.rep_id
      AND d.stage IN ('Closed Won', 'Closed Lost')
      AND d.closed_at >= date('now', '-90 days')
    GROUP BY r.rep_id, r.name
    HAVING total_closed >= 5
  `).all() as Array<{
    rep_id: string;
    name: string;
    closed_won: number;
    closed_lost: number;
    total_closed: number;
  }>;
  
  const underperformingRepsFormatted: UnderperformingRep[] = underperformingReps
    .map(rep => {
      const winRate = rep.total_closed > 0 ? (rep.closed_won / rep.total_closed) * 100 : 0;
      return {
        rep_id: rep.rep_id,
        name: rep.name,
        winRate: Math.round(winRate * 100) / 100,
        totalDeals: rep.total_closed,
        closedWon: rep.closed_won,
        closedLost: rep.closed_lost,
      };
    })
    .filter(rep => rep.winRate < 30)
    .sort((a, b) => a.winRate - b.winRate);
  
  // Low activity accounts: accounts with no activity in last 30 days but have open deals
  const lowActivityAccounts = db.prepare(`
    SELECT 
      a.account_id,
      a.name,
      a.segment,
      COUNT(DISTINCT d.deal_id) as open_deals,
      MAX(act.timestamp) as last_activity
    FROM accounts a
    LEFT JOIN deals d ON a.account_id = d.account_id
      AND d.stage NOT IN ('Closed Won', 'Closed Lost')
    LEFT JOIN activities act ON d.deal_id = act.deal_id
    GROUP BY a.account_id, a.name, a.segment
    HAVING COUNT(DISTINCT d.deal_id) > 0
       AND (last_activity IS NULL 
       OR (julianday('now') - julianday(last_activity)) > 30)
    ORDER BY open_deals DESC
    LIMIT 20
  `).all() as Array<{
    account_id: string;
    name: string;
    segment: string;
    open_deals: number;
    last_activity: string | null;
  }>;
  
  const lowActivityAccountsFormatted: LowActivityAccount[] = lowActivityAccounts.map(account => {
    const daysSinceLastActivity = account.last_activity
      ? Math.round((Date.now() - new Date(account.last_activity).getTime()) / (1000 * 60 * 60 * 24))
      : 999; // No activity ever
      
    return {
      account_id: account.account_id,
      name: account.name,
      segment: account.segment,
      daysSinceLastActivity,
      openDeals: account.open_deals,
    };
  });
  
  return {
    staleDeals: staleDealsFormatted,
    underperformingReps: underperformingRepsFormatted,
    lowActivityAccounts: lowActivityAccountsFormatted,
  };
}
