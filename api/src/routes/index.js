const { Router } = require('express');
const authRoutes = require('./authRoutes');
const psicologoRoutes = require('./psicologoRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/psicologos', psicologoRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
