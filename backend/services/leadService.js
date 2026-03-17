import pool from '../db.js';
import linkedinService from './linkedinService.js';

const leadService = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    return result.rows;
  },
  create: async (lead) => {
    const { name, company, email, phone, status, website, address } = lead;
    const result = await pool.query(
      'INSERT INTO leads (name, company, email, phone, status, website, address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, company, email, phone, status || 'prospect', website, address]
    );
    
    const savedLead = result.rows[0];
    
    // Auto-enrich in background (don't black the main request, but we trigger it)
    leadService.enrichLead(savedLead.id, savedLead.company || savedLead.name).catch(console.error);
    
    return savedLead;
  },
  
  enrichLead: async (leadId, companyName) => {
    console.log(`--- [AUTO ENRICH] Finding CEO for: ${companyName} ---`);
    const contactsFound = await linkedinService.findDecisionMakers(companyName);
    
    for (const contact of contactsFound) {
      const existing = await pool.query(
        'SELECT * FROM contacts WHERE lead_id = $1 AND linkedin_url = $2',
        [leadId, contact.linkedin_url]
      );

      if (existing.rows.length === 0) {
        await pool.query(
          'INSERT INTO contacts (lead_id, name, role, linkedin_url, email) VALUES ($1, $2, $3, $4, $5)',
          [leadId, contact.name, contact.role, contact.linkedin_url, contact.email || null]
        );
      }
    }
    console.log(`--- [AUTO ENRICH] Completed for ${companyName} ---`);
  },

  findByParams: async (name, phone) => {
    const result = await pool.query(
      'SELECT * FROM leads WHERE name = $1 AND (phone = $2 OR website = $3)',
      [name, phone, name] // Rough check
    );
    return result.rows[0];
  },
  deleteAll: async () => {
    // Clear contacts mapping first due to foreign key constraints
    await pool.query('DELETE FROM contacts');
    await pool.query('DELETE FROM leads');
  },
  updateStatus: async (id, status) => {
    const result = await pool.query(
      'UPDATE leads SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }
};

export default leadService;
