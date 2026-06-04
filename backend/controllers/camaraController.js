const chamadoCamara = require('../models/camaraModels')

async function listarCamaras(req, res) {
    const codEmpresa = req.usuario.codEmpresa;

    const empresa = await chamadoCamara.buscarEmpresa(codEmpresa);

    const camaras = await chamadoCamara.listarCamaras(empresa[0].idEmpresa);

    const data = []

    for (let i = 0; i < camaras.length; i++) {
        const camara = camaras[i];
        
        const pegarItens = {
            IdCamara: camara.idCamara,
            nomeCamara: camara.nomeCamara,
            temperatura: camara.temperaturaIdeal,
            umidade: camara.umidadeIdeal,
            IdEndereco: camara.endereco
        };

        data.push(pegarItens)
    }

    return res.status(200).json(data);
}

async function listarCamara(req, res) {
    const codEmpresa = req.body.idCamara;

    const camara = await chamadoCamara.listarCamara(idCamara);

    let pegarItens = {
        IdCamara: camara.idCamara,
        nomeCamara: camara.nomeCamara,
        temperatura: camara.temperaturaIdeal,
        umidade: camara.umidadeIdeal,
        codEmpresa: camara.codEmpresa,
        IdEndereco: camara.endereco
    };

    return res.status(200).json(pegarItens);
}

module.exports = {
    listarCamaras,
    listarCamara
};