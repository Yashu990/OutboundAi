import aiService from '../services/aiService.js';
import pool from '../db.js';

export const generateAndSaveMessage = async (req, res) => {
  try {
    const { contactId, type = 'linkedin' } = req.body;
    
    // 1. Fetch Contact and associated Lead data
    const contactResult = await pool.query(`
      SELECT c.*, 
             l.name as lead_name, 
             l.address as lead_address, 
             l.website as lead_website,
             l.phone as lead_phone
      FROM contacts c 
      JOIN leads l ON c.lead_id = l.id 
      WHERE c.id = $1
    `, [contactId]);

    if (contactResult.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const contact = contactResult.rows[0];
    const contactData = {
      name: contact.name,
      company: contact.lead_name,
      role: contact.role,
      address: contact.lead_address,
      website: contact.lead_website,
      phone: contact.lead_phone,
      type: type
    };

    // 2. Generate AI message
    const messageText = await aiService.generateOutreachMessage(contactData);

    // 3. Save to database
    const result = await pool.query(
      'INSERT INTO messages (contact_id, message_text, type) VALUES ($1, $2, $3) RETURNING *',
      [contactId, messageText, type]
    );

    res.json({
      message: 'AI message generated successfully.',
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessagesByContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const result = await pool.query(
      'SELECT * FROM messages WHERE contact_id = $1 ORDER BY created_at DESC', 
      [contactId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
