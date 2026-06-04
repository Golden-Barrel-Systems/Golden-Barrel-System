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

module.exports = router;