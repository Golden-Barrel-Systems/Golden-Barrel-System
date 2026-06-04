const sensorModel = require('../models/sensorModels')

async function dadosSensor(req, res) {
    const idCamara = req.usuario.idCamara
    try {
        const data = await sensorModel.buscarDadosSensor(idCamara);

        if(data.length <= 0) {
            return res.status(404).json({ mensagem: "Nenhum sensor encontrado" })
        };

        return res.status(200).json(data)
        
    } catch (error) {
        return res.status(500).json({ erro: error.sqlMessage })
    }
};

module.exports = {
    dadosSensor
}