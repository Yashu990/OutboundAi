import pool from '../db.js';
import emailService from '../services/emailService.js';

export const sendInitialOutreach = async (req, res) => {
  try {
    const { contactId, messageId } = req.body;

    // 1. Fetch Contact and Message
    const contactResult = await pool.query(`
      SELECT c.*, l.email as lead_email 
      FROM contacts c 
      JOIN leads l ON c.lead_id = l.id 
      WHERE c.id = $1
    `, [contactId]);

    const messageResult = await pool.query('SELECT * FROM messages WHERE id = $1', [messageId]);

    if (contactResult.rows.length === 0 || messageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Contact or Message not found' });
    }

    const contact = contactResult.rows[0];
    const message = messageResult.rows[0];
    const targetEmail = contact.lead_email || 'test@example.com'; 

    // 2. Send Email (using our service)
    const result = await emailService.sendEmail(
      targetEmail,
      `Connecting with ${contact.name}`,
      message.message_text
    );

    if (result.success) {
      // 3. Log initial outreach
      await pool.query(
        'INSERT INTO outreach_logs (contact_id, message_id, status) VALUES ($1, $2, $3)',
        [contactId, messageId, 'sent']
      );

      // 4. Schedule Follow-ups (Day 3, 7, 14)
      const followUpIntervals = [3, 7, 14];
      for (const days of followUpIntervals) {
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + days);
        
        await pool.query(
          'INSERT INTO followups (contact_id, message_id, scheduled_at, status) VALUES ($1, $2, $3, $4)',
          [contactId, messageId, scheduledDate, 'pending']
        );
      }

      res.json({ message: 'Outreach sent and follow-ups scheduled.', log: result });
    } else {
      res.status(500).json({ error: 'Failed to send email', details: result.error });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOutreachStatus = async (req, res) => {
  try {
    const { contactId } = req.params;
    const logs = await pool.query('SELECT * FROM outreach_logs WHERE contact_id = $1', [contactId]);
    const followups = await pool.query('SELECT * FROM followups WHERE contact_id = $1', [contactId]);
    
    res.json({
      logs: logs.rows,
      followups: followups.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
