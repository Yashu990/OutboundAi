import express from 'express';
import { getDeals, createDeal, updateDealStage } from '../controllers/dealsController.js';

const router = express.Router();

router.get('/', getDeals);
router.post('/', createDeal);
router.put('/:id/stage', updateDealStage);

export default router;
