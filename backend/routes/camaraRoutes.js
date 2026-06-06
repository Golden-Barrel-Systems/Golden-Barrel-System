const express = require('express');
const router = express.Router();

const camaraController = require('../controllers/camaraController');
const userUtils = require('../utils/userMiddleware');

router.post('/todas', userUtils.autenticarSessao, (req, res) => {
    camaraController.listarCamaras(req, res);
});

router.post('/dados', userUtils.autenticarSessao, (req, res) => {
    camaraController.listarCamara(req, res)
})

router.get("/listar/:codigoEmpresa", function (req, res) {
    camaraController.listar(req, res);
});

router.get("/listarSensores/:idCamara", function (req, res) {
    camaraController.listarSensores(req, res);
});

module.exports = router;