import pool from './db.js';
import emailService from './services/emailService.js';

const startWorker = () => {
  console.log('Follow-up worker started (polling mode)...');
  
  // Run every 10 minutes (demo mode)
  setInterval(async () => {
    try {
      const now = new Date();
      
      // Find pending followups that are due
      const result = await pool.query(`
        SELECT f.*, c.name as contact_name, l.email, m.message_text 
        FROM followups f
        JOIN contacts c ON f.contact_id = c.id
        JOIN leads l ON c.lead_id = l.id
        JOIN messages m ON f.message_id = m.id
        WHERE f.status = 'pending' AND f.scheduled_at <= $1
      `, [now]);

      for (const followup of result.rows) {
        console.log(`Processing follow-up for ${followup.contact_name}`);
        
        const sendResult = await emailService.sendEmail(
          followup.email || 'test@example.com',
          `Follow-up: Reconnecting with ${followup.contact_name}`,
          `Hi ${followup.contact_name}, just checking in on my previous message regarding ${followup.message_text.substring(0, 30)}...`
        );

        if (sendResult.success) {
           await pool.query('UPDATE followups SET status = $1 WHERE id = $2', ['sent', followup.id]);
        }
      }
    } catch (err) {
      console.error('Worker error:', err.message);
    }
  }, 10 * 60 * 1000); 
};

export default startWorker;
