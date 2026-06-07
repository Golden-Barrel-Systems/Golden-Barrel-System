const express = require('express');
const router = express.Router();

const alertaController = require('../controllers/alertaController');

router.post("/registrar", function (req, res) {
    alertaController.registrar(req, res);
});

module.exports = router;