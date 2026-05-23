const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController')

router.post('/gerar', (req, res) => {
    chatController.gerarResposta(req, res);
});

module.exports = router;