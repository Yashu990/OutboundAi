import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env explicitly
const envResult = dotenv.config({ path: path.join(__dirname, '.env') });

if (envResult.error) {
  console.warn('⚠️  Could not find .env file in backend folder, trying parent...');
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
}

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000 // 5 seconds timeout
});

// Avoid crashing the whole process on pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err.message);
});

export default pool;
