const express = require('express');
const router = express.Router();

const chamadoController = require('../controllers/chamadoController')
const userUtils = require('../utils/userMiddleware')

router.post('/buscar', userUtils.autenticarSessao, (req, res) => {
    chamadoController.buscarChamados(req, res)
});

router.post('/repassar', userUtils.autenticarSessao, (req, res) => {
    chamadoController.repassarChamado(req, res)
});

router.post('/responder', userUtils.autenticarSessao, (req, res) => {
    chamadoController.responderChamado(req, res)
});

module.exports = router;