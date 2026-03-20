import pool from './backend/db.js';

async function check() {
  try {
    const result = await pool.query(`
      SELECT column_name
      FROM information_schema.columns 
      WHERE table_name = 'contacts'
    `);
    console.log('Columns:');
    result.rows.forEach(r => console.log('- ' + r.column_name));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
