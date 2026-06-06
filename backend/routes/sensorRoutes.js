const express = require('express');
const router = express.Router();

const sensorController = require('../controllers/sensorController');
const userUtils = require('../utils/userMiddleware')

router.post('/buscar', userUtils.autenticarSessao, (req, res) => {
    sensorController.dadosSensor(req, res)
});

router.get("/temperaturaAtual/:idSensor", function (req, res) {
    sensorController.temperaturaAtual(req, res);
});

router.get("/umidadeAtual/:idSensor", function (req, res) {
    sensorController.umidadeAtual(req, res);
});

module.exports = router