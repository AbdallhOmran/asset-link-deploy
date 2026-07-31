const express = require('express')
const router = express.Router();
const requireIdempotency = require('../middlewares/idempotency.middleware');

const {
    createNegotiation,
    createOffer,
    getNegotiation,
    getVersionHistory,
    getCurrentNegotiation,
    acceptOffer,
    rejectOffer
} = require('../controllers/negotiation.controller')

const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, createNegotiation)
router.post('/:negotiationId/offers', authMiddleware, createOffer);
router.get('/company/:id', authMiddleware, getNegotiation);
router.get('/:id/history', authMiddleware, getVersionHistory);
router.get('/company/:id/current', authMiddleware, getCurrentNegotiation);
router.patch('/:id/accept', authMiddleware, requireIdempotency, acceptOffer);
router.patch('/:id/reject', authMiddleware, rejectOffer);
module.exports = router;