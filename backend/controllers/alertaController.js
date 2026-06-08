const alertaModel = require("../models/alertaModels");

async function listarAlertasPorSensor(req, res) {
  try {
    const idSensor = req.params.idSensor;

    const resultado = await alertaModel.listarAlertasPorSensor(idSensor);

    res.status(200).json(resultado);
  } catch (erro) {
    console.log(erro);

    res.status(500).json({
      erro: erro.sqlMessage,
    });
  }
}

function registrar(req, res) {
  var idMedicao = req.body.idMedicaoServer;
  var mensagem = req.body.mensagemServer;
  var peso = req.body.pesoServer;

  alertaModel.registrar(idMedicao, mensagem, peso).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscar(req, res) {
  var idCamara = req.params.idCamara;

  alertaModel.buscar(idCamara).then((resultado) => {
    res.status(200).json(resultado);
  });
}

module.exports = {
  registrar,
  buscar,
  listarAlertasPorSensor
};
