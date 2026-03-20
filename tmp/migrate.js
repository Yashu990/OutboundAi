import pool from './backend/db.js';

async function migrate() {
  try {
    await pool.query('ALTER TABLE contacts ADD COLUMN IF NOT EXISTS email VARCHAR(255);');
    console.log('✅ Migration successful: email column added/checked.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
