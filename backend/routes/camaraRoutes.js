const express = require('express');
const router = express.Router();

const camaraController = require('../controllers/camaraController');

router.get('/dados', (req, res) => {
    camaraController.listarCamara(req, res);
});

module.exports = router;