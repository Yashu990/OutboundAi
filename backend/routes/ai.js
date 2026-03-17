import express from 'express';
import { generateAndSaveMessage, getMessagesByContact } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate', generateAndSaveMessage);
router.get('/contact/:contactId', getMessagesByContact);

export default router;
