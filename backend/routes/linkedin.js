import express from 'express';
import { findAndSaveDecisionMakers, getContactsByLead, getAllContacts } from '../controllers/linkedinController.js';

const router = express.Router();

router.get('/', getAllContacts);
router.post('/find', findAndSaveDecisionMakers);
router.get('/lead/:leadId', getContactsByLead);

export default router;
