const express = require('express');
const Attempt = require('../models/Attempt');
const User    = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/submit-score', verifyToken, async (req, res) => {
  try {
    const { score, safeDecisions, totalDecisions, scenarioId, duration } = req.body;
    if (score === undefined || score === null) return res.status(400).json({ message: 'Score is required.' });


    const s = Number(score);
    const rating = s <= 2 ? 'Safe' : s <= 5 ? 'Risky' : 'Dangerous';

    const attempt = new Attempt({
      userId:         req.user.id,
      score:          s,
      safeDecisions:  Number(safeDecisions)  || 0,
      totalDecisions: Number(totalDecisions) || 0,
      scenarioId:     scenarioId || 'unknown',
      duration:       Number(duration) || 0,
      rating
    });
    await attempt.save();

    console.log('Score saved:', req.user.id, 'score:', s, 'rating:', rating, 'scenario:', scenarioId);
    res.status(201).json({ message: 'Score saved.', attempt });
  } catch (err) {
    console.error('Submit score error:', err);
    res.status(500).json({ message: 'Server error saving score.' });
  }
});

router.get('/my-attempts', verifyToken, async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/my-stats', verifyToken, async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id }).lean();
    const total   = attempts.length;
    const best    = total ? Math.min(...attempts.map(a => a.score)) : null;
    const avg     = total ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / total * 10) / 10 : 0;
    const safe    = attempts.filter(a => a.rating === 'Safe').length;
    const risky   = attempts.filter(a => a.rating === 'Risky').length;
    const danger  = attempts.filter(a => a.rating === 'Dangerous').length;

    let streak = 0;
    for (const a of [...attempts].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt))) {
      if (a.rating === 'Safe') streak++; else break;
    }
    const scenarioBreakdown = {};
    attempts.forEach(a => {
      if (!scenarioBreakdown[a.scenarioId]) scenarioBreakdown[a.scenarioId] = { count: 0, totalScore: 0 };
      scenarioBreakdown[a.scenarioId].count++;
      scenarioBreakdown[a.scenarioId].totalScore += a.score;
    });
    res.json({ total, best, avg, safe, risky, danger, streak, scenarioBreakdown });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const top = await Attempt.aggregate([
      { $group: { _id: '$userId', bestScore: { $min: '$score' }, attempts: { $sum: 1 }, avgScore: { $avg: '$score' } } },
      { $sort: { bestScore: 1, attempts: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', bestScore: 1, attempts: 1, avgScore: { $round: ['$avgScore', 1] } } }
    ]);
    res.json(top);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;