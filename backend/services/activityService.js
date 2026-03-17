import pool from '../db.js';

const activityService = {
  getByLeadId: async (leadId) => {
    const result = await pool.query(
      'SELECT * FROM activities WHERE lead_id = $1 ORDER BY created_at DESC',
      [leadId]
    );
    return result.rows;
  },
  create: async (activity) => {
    const { lead_id, type, note } = activity;
    const result = await pool.query(
      'INSERT INTO activities (lead_id, type, note) VALUES ($1, $2, $3) RETURNING *',
      [lead_id, type, note]
    );
    return result.rows[0];
  }
};

export default activityService;
