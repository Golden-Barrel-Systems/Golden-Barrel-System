const chamadoCamara = require('../models/camaraModels')

async function listarCamara(req, res) {
    const idEmpresa = req.body.idEmpresa;

    const camara = await chamadoCamara.listarCamara(idEmpresa);

    let pegarItens = {
        IDCamara: camara.idCamara,
        NomeCamara: camara.nomeCamara,
        Temperatura: camara.temperaturaIdeal,
        Umidade: camara.umidadeIdeal,
        IDempresa: idEmpresa,
        IDendereco: camara.endereco
    };

    return res.status(200).json(pegarItens);
}

module.exports = {
    listarCamara
};