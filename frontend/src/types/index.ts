export interface Summary {
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

export interface Drivers {
  pipelineSize: number;
  winRate: number;
  averageDealSize: number;
  salesCycleTime: number;
}

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

export interface RiskFactors {
  staleDeals: StaleDeal[];
  underperformingReps: UnderperformingRep[];
  lowActivityAccounts: LowActivityAccount[];
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
}
