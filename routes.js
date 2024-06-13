const express = require('express');
const router = express.Router();
const insuranceController = require('./controllers/insuranceController');

router.get('/api/initial', insuranceController.initialInteraction);
router.post('/api/interact', insuranceController.handleInteraction);

//router.post('/api/recommendation', insuranceController.getInsuranceRecommendation);

module.exports = router;