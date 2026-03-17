import pool from '../db.js';

export const getStats = async (req, res) => {
  try {
    // 1. Only count "Real" leads (Exclude raw search 'prospects')
    const leadsCount = await pool.query("SELECT COUNT(*) FROM leads WHERE status NOT IN ('prospect', 'Lost')");
    const dealsCount = await pool.query('SELECT COUNT(*) FROM deals');
    
    // 2. Pipeline stats
    const newLeadsResult = await pool.query("SELECT COUNT(*) FROM leads WHERE status = 'New'");
    const contactedResult = await pool.query("SELECT COUNT(*) FROM leads WHERE status IN ('Contacted', 'contacted')");
    const wonResult = await pool.query("SELECT COUNT(*) FROM deals WHERE stage = 'Won'");

    // 3. Simple Conversion Rate Calculation
    const total = parseInt(leadsCount.rows[0].count);
    const won = parseInt(wonResult.rows[0].count);
    const rate = total > 0 ? ((won / total) * 100).toFixed(1) : "0";

    const recentActivities = await pool.query(`
      SELECT a.*, l.name as lead_name 
      FROM activities a 
      LEFT JOIN leads l ON a.lead_id = l.id 
      ORDER BY a.created_at DESC 
      LIMIT 10
    `);

    res.json({
      totalLeads: total,
      activeDeals: parseInt(dealsCount.rows[0].count),
      conversionRate: `${rate}%`,
      pipeline: {
        prospect: parseInt(newLeadsResult.rows[0].count),
        contacted: parseInt(contactedResult.rows[0].count),
        closed: won
      },
      recentActivities: recentActivities.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
