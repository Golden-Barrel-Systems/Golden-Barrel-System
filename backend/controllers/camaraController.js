const chamadoCamara = require('../models/camaraModels')

async function listarCamara(req, res) {
    const codEmpresa = req.body.codEmpresa;

    const camara = await chamadoCamara.listarCamara(codEmpresa);

    let pegarItens = {
        IDCamara: camara.idCamara,
        NomeCamara: camara.nomeCamara,
        Temperatura: camara.temperaturaIdeal,
        Umidade: camara.umidadeIdeal,
        codEmpresa: codEmpresa,
        IDendereco: camara.endereco
    };

    return res.status(200).json(pegarItens);
}

module.exports = {
    listarCamara
};