const chamadoCamara = require('../models/camaraModels')

async function listarCamaras(req, res) {
    try {
        const codigo_empresa = req.usuario.codigo_empresa;
        const empresa = await chamadoCamara.buscarEmpresa(codigo_empresa);

        if (empresa.length === 0) {
            return res.status(404).json({ mensagem: "Empresa não encontrada" });
        }

        const camaras = await chamadoCamara.listarCamaras(empresa[0].id_empresa);

        const data = []

        for (let i = 0; i < camaras.length; i++) {
            const camara = camaras[i];

            const pegarItens = {
                id_camara: camara.id_camara,
                nome: camara.nome,
                temperatura: camara.temperatura_ideal,
                umidade: camara.umidade_ideal,
                fk_empresa: camara.fk_empresa,
                localizacaoInterna: camara.localizacao_interna
            };

            data.push(pegarItens)
        }

        return res.status(200).json(data);
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({ mensagem: erro.sqlMessage || "Erro ao listar câmaras" });
    }
}

async function listarCamara(req, res) {
    try {
        const id_camara = req.body.id_camara;

        const resultado = await chamadoCamara.listarCamara(id_camara);

        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Câmara não encontrada" });
        }

        const camara = resultado[0];

        let pegarItens = {
            id_camara: camara.id_camara,
            nome: camara.nome,
            temperatura: camara.temperatura_ideal,
            umidade: camara.umidade_ideal,
            fk_empresa: camara.fk_empresa,
            fk_endereco: camara.fk_endereco,
            localizacaoInterna: camara.localizacao_interna
        };

        return res.status(200).json(pegarItens);
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({ mensagem: erro.sqlMessage || "Erro ao listar câmara" });
    }
}

function listar(req, res) {
    var codigoEmpresa = req.params.codigoEmpresa;

    chamadoCamara.listar(codigoEmpresa).then((resultado) => {
        res.status(200).json(resultado);
    });
}

function listarSensores(req, res) {
    var idCamara = req.params.idCamara;

    chamadoCamara.listarSensores(idCamara).then((resultado) => {
        res.status(200).json(resultado);
    });
}

module.exports = {
    listarCamaras,
    listarCamara,
    listar,
    listarSensores,
};
