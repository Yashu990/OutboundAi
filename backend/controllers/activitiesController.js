import activityService from '../services/activityService.js';

export const getActivities = async (req, res) => {
  try {
    const { leadId } = req.query;
    const activities = await activityService.getByLeadId(leadId);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createActivity = async (req, res) => {
  try {
    const activity = await activityService.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
