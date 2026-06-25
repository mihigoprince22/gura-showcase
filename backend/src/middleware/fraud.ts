import type { FastifyRequest, FastifyReply } from 'fastify';
import { queryOne } from '../config/database.js';

export async function fraudScoringMiddleware(request: FastifyRequest, reply: FastifyReply) {
  // Only apply to authenticated routes that involve transactions or trust
  if (!request.user || !request.user.sub) return;

  const userId = request.user.sub;

  try {
    // Basic MVP Fraud Scoring (Algorithm 05)
    // - Account age
    // - Past payment failures (simulated for MVP)
    // - High dispute rate
    
    let fraudScore = 0;

    const sqlUser = `
      SELECT created_at, seller_tier, verification_status 
      FROM users WHERE id = $1
    `;
    const user = await queryOne(sqlUser, [userId]);
    
    if (user) {
      const accountAgeDays = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24);
      
      // Penalty for very new accounts making high-value actions
      if (accountAgeDays < 7) fraudScore += 20;

      // Bonus for verified users
      if (user.seller_tier === 'gura_certified' || user.seller_tier === 'super_seller') fraudScore -= 30;
      
      // Note: In a real implementation we would query transactions for payment failures
      // and orders for dispute rates here.

      // Bound score between 0 and 100
      fraudScore = Math.max(0, Math.min(100, fraudScore));

      // Append score to headers for admin visibility or downstream logic
      reply.header('x-gura-fraud-score', fraudScore.toString());

      if (fraudScore > 80) {
        // High risk - could block action
        console.warn(`[FRAUD ALERT] High risk action attempted by user ${userId} (Score: ${fraudScore})`);
        // For MVP, we don't block. We just log.
        // throw new Error('Action blocked due to security policies.');
      }
    }
  } catch (err) {
    console.error('[FRAUD MIDDLEWARE] Error:', err);
    // Do not block request on fraud scoring error
  }
}
