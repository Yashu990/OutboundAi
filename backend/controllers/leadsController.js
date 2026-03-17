import leadService from '../services/leadService.js';
import mapsService from '../services/mapsService.js';

export const getLeads = async (req, res) => {
  try {
    const leads = await leadService.getAll();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createLead = async (req, res) => {
  try {
    const lead = await leadService.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const lead = await leadService.updateStatus(id, status);
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchMapsLeads = async (req, res) => {
  try {
    const { query, limit } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    // 1. DELETE PREVIOUS SEARCH RESULTS
    // We clear the leads table to show fresh results for the new search
    await leadService.deleteAll();

    const externalLeads = await mapsService.searchLeads(query, limit || 200);
    const savedLeads = [];

    for (const lead of externalLeads) {
      const saved = await leadService.create(lead);
      savedLeads.push(saved);
    }

    res.json({
      message: `Successfully fetched ${savedLeads.length} FRESH leads from Google.`,
      newLeads: savedLeads,
      totalFetched: externalLeads.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const importLeads = async (req, res) => {
  try {
    const { leads } = req.body;
    if (!Array.isArray(leads)) return res.status(400).json({ error: 'Leads array is required' });

    const savedLeads = [];
    for (const lead of leads) {
      // Basic validation: must have at least a name
      if (!lead.name) continue;

      const existing = await leadService.findByParams(lead.name, lead.phone);
      if (!existing) {
        const saved = await leadService.create({
          name: lead.name,
          company: lead.company || lead.name,
          email: lead.email || null,
          phone: lead.phone || null,
          website: lead.website || null,
          address: lead.address || null,
          status: 'prospect'
        });
        savedLeads.push(saved);
      }
    }

    res.json({
      message: `Successfully imported ${savedLeads.length} leads.`,
      newLeads: savedLeads,
      totalReceived: leads.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
