const express = require('express');
const router = express.Router();

const chamadoController = require('../controllers/chamadoController')

router.post('/buscar', (req, res) => {
    chamadoController.buscarChamados(req, res)
});

module.exports = router;