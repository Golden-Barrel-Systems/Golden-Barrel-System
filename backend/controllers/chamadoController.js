const chamadoModel = require('../models/chamadoModels')

async function buscarChamados(req, res) {
    const tipoUsuario = req.usuario.tipo;

    const nivelSuporte = tipoUsuario.split('_')[1]
    // const nivelSuporte = 3;

    try {
        const chamados = await chamadoModel.buscarChamados(nivelSuporte);

        if(chamados.length <= 0) {
            return res.status(200).json("Nenhum chamado encontrado para suporte nivel: " + nivelSuporte);
        };

        let permission = false;

        if (nivelSuporte === 3) permission = true;

        return res.status(200).json({chamados: chamados, agent: permission});
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
    const { id_chamado, respostaChamado } = req.body;

    try {
        const resposta = await chamadoModel.fecharChamado(id_chamado, respostaChamado);

        return res.status(200).json({ mensagem: `O chamado #${id_chamado} foi respondido e fechado` })
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