const express = require('express');
const { Incident } = require('../models');
const auth = require('../middleware/auth');
const { Sequelize } = require('sequelize');

const { generateIncidentId } = require('../utils/generateIncidentId');

const router = express.Router();


router.post('/', auth, async (req, res) => {
  try {
    const { details, priority } = req.body;
    if (!details) return res.status(400).json({ message: 'Incident details required' });

    let incidentId;
    for (let i=0;i<5;i++){
      incidentId = generateIncidentId();
      const exists = await Incident.findOne({ where: { incident_id: incidentId }});
      if (!exists) break;
      incidentId = null;
    }
    if (!incidentId) return res.status(500).json({ message: 'Try again to generate id' });

    const incident = await Incident.create({
      incident_id: incidentId,
      reporter_id: req.user.id,
      reporter_name: req.user.name,
      details,
      reported_at: new Date(),
      priority: priority || 'Low',
      status: 'Open'
    });
    res.json({ message: 'Incident created', incident });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', auth, async (req, res) => {
  const incidents = await Incident.findAll({
    where: { reporter_id: req.user.id },
    order: [
      [
        // custom sorting for priority
        Sequelize.literal(`
          CASE 
            WHEN priority = 'High' THEN 1
            WHEN priority = 'Medium' THEN 2
            WHEN priority = 'Low' THEN 3
            ELSE 4
          END
        `),
        'ASC'
      ],
      ['created_at', 'DESC'] // then sort by latest created
    ]
  });

  res.json({ incidents });
});



router.get('/:id', auth, async (req, res) => {
  const inc = await Incident.findOne({ where: { id: req.params.id, reporter_id: req.user.id }});
  if (!inc) return res.status(404).json({ message: 'Not found' });
  res.json({ incident: inc });
});


router.put('/:id', auth, async (req, res) => {
  const inc = await Incident.findOne({ where: { id: req.params.id, reporter_id: req.user.id }});
  if (!inc) return res.status(404).json({ message: 'Not found' });
  if (inc.status === 'Closed') return res.status(403).json({ message: 'Closed incidents cannot be edited' });

  const { details, priority, status } = req.body;
  if (details) inc.details = details;
  if (priority) inc.priority = priority;
  if (status) inc.status = status; 
  await inc.save();
  res.json({ message: 'Updated', incident: inc });
});
router.delete('/:id', auth, async (req, res) => {
  try {
    const inc = await Incident.findOne({ where: { id: req.params.id, reporter_id: req.user.id }});
    
    if (!inc) {
   
      return res.status(404).json({ message: 'Incident not found' });
    }

    await inc.destroy();
    
    res.json({ message: 'Incident deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
