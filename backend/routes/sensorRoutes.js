const express = require('express');
const router = express.Router();

const sensorController = require('../controllers/sensorController');
const userUtils = require('../utils/userMiddleware')

router.post('/buscar', userUtils.autenticarSessao(),(req, res) => {
    sensorController.dadosSensor(req, res)
});

module.exports = router