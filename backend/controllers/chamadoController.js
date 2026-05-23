const chamadoModel = require('../models/chamadoModels')

async function buscarChamados(req, res) {
    const nivelSuporte = req.body.usuario.nivelSuporte;
    // const nivelSuporte = 3;

    try {
        const chamados = await chamadoModel.buscarChamados(nivelSuporte);

        if(chamados.length <= 0) {
            return res.status(200).json("Nenhum chamado encontrado para suporte nivel: " + nivelSuporte);
        };

        console.log(chamados);

        return res.status(200).json(chamados);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ erro: error.sqlMessage });
    };
};

module.exports = {
    buscarChamados
}