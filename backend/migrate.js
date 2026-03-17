import pool from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runUpdate() {
  try {
    console.log('Reading schema setup file...');
    const setupSql = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf8');
    
    console.log('Applying database schema...');
    await pool.query(setupSql);
    
    console.log('Database schema applied successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error applying schema:', err.message);
    process.exit(1);
  }
}

runUpdate();
