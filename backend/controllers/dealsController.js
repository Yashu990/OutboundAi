import dealService from '../services/dealService.js';

export const getDeals = async (req, res) => {
  try {
    const deals = await dealService.getAll();
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDeal = async (req, res) => {
  try {
    const deal = await dealService.create(req.body);
    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDealStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    const deal = await dealService.updateStage(id, stage);
    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
