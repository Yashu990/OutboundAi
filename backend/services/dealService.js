import pool from '../db.js';

const dealService = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM deals ORDER BY created_at DESC');
    return result.rows;
  },
  create: async (deal) => {
    const { name, company, value, stage } = deal;
    const result = await pool.query(
      'INSERT INTO deals (name, company, value, stage) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, company, value, stage || 'prospect']
    );
    return result.rows[0];
  },
  updateStage: async (id, stage) => {
    const result = await pool.query(
      'UPDATE deals SET stage = $1 WHERE id = $2 RETURNING *',
      [stage, id]
    );
    return result.rows[0];
  }
};

export default dealService;
