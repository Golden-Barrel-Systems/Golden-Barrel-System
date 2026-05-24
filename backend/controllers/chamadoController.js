const chamadoModel = require('../models/chamadoModels')

async function buscarChamados(req, res) {
    const nivelSuporte = req.body.usuario.nivelSuporte;
    // const nivelSuporte = 3;

    try {
        const chamados = await chamadoModel.buscarChamados(nivelSuporte);

        if(chamados.length <= 0) {
            return res.status(200).json("Nenhum chamado encontrado para suporte nivel: " + nivelSuporte);
        };

        return res.status(200).json(chamados);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ erro: error.sqlMessage });
    };
};

async function repassarChamado(req, res) {
    const id = req.body.id;

    try {
        const repassou = await chamadoModel.repassarChamado(id);

        return res.status(200).json({ mensagem: `O chamado #${id} foi encaminhado`});
    } catch (error) {
        console.log(error)
        return res.status(500).json({ erro: error.sqlMessage })
    };
};

async function responderChamado(req, res) {
    const { idChamado, respostaChamado } = req.body;

    try {
        const resposta = await chamadoModel.fecharChamado(idChamado, respostaChamado);

        return res.status(200).json({ mensagem: `O chamado #${idChamado} foi respondido e fechado` })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ erro: error.sqlMessage })
    }
}

module.exports = {
    buscarChamados,
    repassarChamado,
    responderChamado
}