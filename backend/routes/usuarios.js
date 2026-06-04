const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");
const utils = require('../utils/userMiddleware')

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
    usuarioController.autenticarUsuario(req, res);
});

module.exports = router;