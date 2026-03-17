import linkedinService from '../services/linkedinService.js';
import pool from '../db.js';

export const findAndSaveDecisionMakers = async (req, res) => {
  try {
    const { leadId } = req.body;
    
    // 1. Fetch Lead details
    const leadResult = await pool.query('SELECT * FROM leads WHERE id = $1', [leadId]);
    if (leadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    const lead = leadResult.rows[0];
    const companyName = lead.company || lead.name;

    // 2. Call LinkedIn discovery service
    const contactsFound = await linkedinService.findDecisionMakers(companyName);
    const savedContacts = [];

    // 3. Save to database
    for (const contact of contactsFound) {
      // Check if contact already exists for this lead
      const existing = await pool.query(
        'SELECT * FROM contacts WHERE lead_id = $1 AND linkedin_url = $2',
        [leadId, contact.linkedin_url]
      );

      if (existing.rows.length === 0) {
        const result = await pool.query(
          'INSERT INTO contacts (lead_id, name, role, linkedin_url) VALUES ($1, $2, $3, $4) RETURNING *',
          [leadId, contact.name, contact.role, contact.linkedin_url]
        );
        savedContacts.push(result.rows[0]);
      }
    }

    res.json({
      message: `Found and saved ${savedContacts.length} new decision makers.`,
      contacts: savedContacts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContactsByLead = async (req, res) => {
    try {
        const { leadId } = req.params;
        const result = await pool.query('SELECT * FROM contacts WHERE lead_id = $1', [leadId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getAllContacts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contacts');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
