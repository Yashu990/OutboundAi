import express from 'express';
import { sendInitialOutreach, getOutreachStatus } from '../controllers/outreachController.js';

const router = express.Router();

router.post('/send', sendInitialOutreach);
router.get('/status/:contactId', getOutreachStatus);

export default router;
