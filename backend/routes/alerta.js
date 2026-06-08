const express = require("express");
const router = express.Router();

const alertaController = require("../controllers/alertaController");

router.post("/registrar", function (req, res) {
  alertaController.registrar(req, res);
});

router.get("/buscar/:idCamara", function (req, res) {
  alertaController.buscar(req, res);
});

router.get("/sensor/:idSensor", function (req, res) {
  alertaController.listarAlertasPorSensor(req, res);
});

module.exports = router;
