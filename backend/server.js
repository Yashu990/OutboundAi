import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leadRoutes from './routes/leads.js';
import dealRoutes from './routes/deals.js';
import activityRoutes from './routes/activities.js';
import statsRoutes from './routes/stats.js';
import linkedinRoutes from './routes/linkedin.js';
import aiRoutes from './routes/ai.js';
import outreachRoutes from './routes/outreach.js';
import startWorker from './worker.js';
import pool from './db.js';

dotenv.config();

// Test Database Connection
(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL Connected Successfully at:', res.rows[0].now);
  } catch (err) {
    console.error('❌ PostgreSQL Connection Error:', err.message);
  }
})();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/linkedin', linkedinRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/outreach', outreachRoutes);

app.get('/', (req, res) => {
  res.send('Outbound CRM API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startWorker();
});
