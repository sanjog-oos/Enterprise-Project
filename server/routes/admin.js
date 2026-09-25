const express = require('express');
const User    = require('../models/User');
const Attempt = require('../models/Attempt');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken, requireAdmin);

router.get('/stats', async (_req, res) => {
  try {
    const [totalUsers, totalAttempts, avgResult] = await Promise.all([
      User.countDocuments({ role: 'player' }),
      Attempt.countDocuments(),
      Attempt.aggregate([
        { $group: { _id: null, avgScore: { $avg: '$score' } } }
      ])
    ]);

    const avgScore = avgResult.length ? Math.round(avgResult[0].avgScore * 10) / 10 : 0;

    const [ratingDist, scenarioDist] = await Promise.all([
      Attempt.aggregate([{ $group: { _id: '$rating', count: { $sum: 1 } } }]),
      Attempt.aggregate([{ $group: { _id: '$scenarioId', count: { $sum: 1 }, avgScore: { $avg: '$score' } } }, { $sort: { avgScore: -1 } }])
    ]);

    const ratings = { Safe: 0, Risky: 0, Dangerous: 0 };
    ratingDist.forEach(r => { ratings[r._id] = r.count; });

    res.json({ totalUsers, totalAttempts, avgScore, ratings, scenarioDist });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Server error fetching stats.' });
  }
});

router.get('/users', async (_req, res) => {
  try {
    const players = await User.find({ role: 'player' }).select('-password').lean();


    const enriched = await Promise.all(
      players.map(async (player) => {
        const attempts = await Attempt
          .find({ userId: player._id })
          .sort({ createdAt: -1 })
          .lean();

        const attemptCount = attempts.length;
        const latestScore  = attemptCount ? attempts[0].score   : null;
        const latestRating = attemptCount ? attempts[0].rating  : null;
        const bestScore    = attemptCount
          ? Math.min(...attempts.map(a => a.score))
          : null;

        return { ...player, attemptCount, latestScore, latestRating, bestScore };
      })
    );


    enriched.sort((a, b) => b.attemptCount - a.attemptCount);

    res.json(enriched);
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ message: 'Server error fetching users.' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin account.' });
    }

    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      Attempt.deleteMany({ userId: req.params.id })
    ]);

    res.json({ message: 'User and all their attempts deleted.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error deleting user.' });
  }
});

module.exports = router;