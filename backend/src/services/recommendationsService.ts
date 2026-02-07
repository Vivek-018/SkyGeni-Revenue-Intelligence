import { getDatabase } from '../db/database';
import { getRiskFactors } from './riskFactorsService';

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
}

export function getRecommendations(): Recommendation[] {
  const db = getDatabase();
  const riskFactors = getRiskFactors();
  const recommendations: Recommendation[] = [];
  
  // Recommendation 1: Focus on stale deals
  if (riskFactors.staleDeals.length > 0) {
    const enterpriseStale = riskFactors.staleDeals.filter(deal => {
      const account = db.prepare('SELECT segment FROM accounts WHERE account_id = ?').get(deal.account_id) as { segment: string } | undefined;
      return account?.segment === 'Enterprise';
    });
    
    if (enterpriseStale.length > 0) {
      recommendations.push({
        priority: 'high',
        title: 'Focus on Enterprise deals older than 30 days',
        description: `${enterpriseStale.length} Enterprise deals have been open for more than 30 days, representing significant revenue at risk.`,
        action: `Review and prioritize ${enterpriseStale.length} stale Enterprise deals`,
      });
    } else if (riskFactors.staleDeals.length > 5) {
      recommendations.push({
        priority: 'high',
        title: 'Address stale pipeline',
        description: `${riskFactors.staleDeals.length} deals have been open for more than 30 days without progress.`,
        action: `Review ${riskFactors.staleDeals.length} stale deals and create action plans`,
      });
    }
  }
  
  // Recommendation 2: Coach underperforming reps
  if (riskFactors.underperformingReps.length > 0) {
    const worstRep = riskFactors.underperformingReps[0];
    recommendations.push({
      priority: 'high',
      title: `Coach ${worstRep.name} on win rate`,
      description: `${worstRep.name} has a win rate of ${worstRep.winRate.toFixed(1)}% (${worstRep.closedWon}/${worstRep.totalDeals} deals), well below the target of 30%.`,
      action: `Schedule coaching session with ${worstRep.name} to improve deal qualification and closing techniques`,
    });
  }
  
  // Recommendation 3: Increase activity for low activity accounts
  if (riskFactors.lowActivityAccounts.length > 0) {
    const segmentGroups = riskFactors.lowActivityAccounts.reduce((acc, account) => {
      acc[account.segment] = (acc[account.segment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topSegment = Object.entries(segmentGroups).sort((a, b) => b[1] - a[1])[0];
    
    if (topSegment) {
      recommendations.push({
        priority: 'medium',
        title: `Increase activity for ${topSegment[0]} segment`,
        description: `${topSegment[1]} ${topSegment[0]} accounts have no activity in the last 30 days but have open deals.`,
        action: `Create outreach campaign for ${topSegment[1]} ${topSegment[0]} accounts with open deals`,
      });
    }
  }
  
  // Recommendation 4: Pipeline size analysis
  const pipelineResult = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as pipeline_size
    FROM deals
    WHERE stage NOT IN ('Closed Won', 'Closed Lost')
      AND amount IS NOT NULL
  `).get() as { pipeline_size: number };
  
  const summaryResult = db.prepare(`
    SELECT 
      COALESCE(SUM(CASE WHEN stage = 'Closed Won' AND closed_at >= date('now', 'start of month') THEN amount END), 0) as current_month_revenue,
      COALESCE(SUM(CASE WHEN stage = 'Closed Won' AND closed_at >= date('now', 'start of month', '-1 month') AND closed_at < date('now', 'start of month') THEN amount END), 0) as last_month_revenue
    FROM deals
  `).get() as { current_month_revenue: number; last_month_revenue: number };
  
  const pipelineSize = pipelineResult.pipeline_size;
  const currentMonthRevenue = summaryResult.current_month_revenue;
  const lastMonthRevenue = summaryResult.last_month_revenue;
  
  // If pipeline is less than 3x current month revenue, recommend building pipeline
  if (pipelineSize > 0 && currentMonthRevenue > 0 && pipelineSize < currentMonthRevenue * 3) {
    recommendations.push({
      priority: 'medium',
      title: 'Build pipeline to ensure future revenue',
      description: `Current pipeline ($${Math.round(pipelineSize / 1000)}k) is less than 3x current month revenue. Aim for 3-4x coverage.`,
      action: 'Focus on prospecting and deal creation to build pipeline coverage',
    });
  }
  
  // Recommendation 5: Deal size optimization
  const avgDealResult = db.prepare(`
    SELECT 
      AVG(CASE WHEN stage = 'Closed Won' AND closed_at >= date('now', '-90 days') THEN amount END) as avg_won,
      AVG(CASE WHEN stage NOT IN ('Closed Won', 'Closed Lost') THEN amount END) as avg_open
    FROM deals
    WHERE amount IS NOT NULL
  `).get() as { avg_won: number | null; avg_open: number | null };
  
  const avgWon = avgDealResult.avg_won || 0;
  const avgOpen = avgDealResult.avg_open || 0;
  
  if (avgOpen > 0 && avgWon > 0 && avgOpen < avgWon * 0.7) {
    recommendations.push({
      priority: 'low',
      title: 'Focus on larger deals',
      description: `Average open deal size ($${Math.round(avgOpen)}) is significantly lower than average won deal size ($${Math.round(avgWon)}).`,
      action: 'Review deal qualification criteria and focus on larger opportunities',
    });
  }
  
  // Ensure we have at least 3 recommendations
  if (recommendations.length < 3) {
    recommendations.push({
      priority: 'low',
      title: 'Maintain consistent activity levels',
      description: 'Continue regular outreach and follow-ups to maintain pipeline health.',
      action: 'Review activity metrics weekly and ensure all reps meet activity targets',
    });
  }
  
  return recommendations.slice(0, 5); // Return top 5
}
