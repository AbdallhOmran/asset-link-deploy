const express = require('express')
const router = express.Router();

const {
    createNegotiation,
    createOffer,
    getNegotiation,
    getVersionHistory,
    getCurrentNegotiation,
    acceptOffer,
    rejectOffer
} = require('../controllers/negotiation.controller')

router.post('/', createNegotiation)
router.post('/:negotiationId/offers', createOffer);
router.get('/company/:id', getNegotiation);
router.get('/:id/history', getVersionHistory);
router.get('/company/:id/current', getCurrentNegotiation);
router.patch('/:id/accept', acceptOffer);
router.patch('/:id/reject', rejectOffer);
module.exports = router;