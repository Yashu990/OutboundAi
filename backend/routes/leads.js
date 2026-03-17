import express from 'express';
import { getLeads, createLead, updateLeadStatus, searchMapsLeads, importLeads } from '../controllers/leadsController.js';

const router = express.Router();

router.get('/', getLeads);
router.post('/', createLead);
router.post('/search', searchMapsLeads);
router.post('/batch', importLeads);
router.put('/:id/status', updateLeadStatus);

export default router;
