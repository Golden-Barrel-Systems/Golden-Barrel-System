const sensorModel = require('../models/sensorModels')

async function dadosSensor(req, res) {
    const id_camara = req.body.id_camara
    try {
        const data = await sensorModel.buscarDadosSensor(id_camara);

        if(data.length <= 0) {
            return res.status(404).json({ mensagem: "Nenhum sensor encontrado" })
        };

        return res.status(200).json(data)
        
    } catch (error) {
        return res.status(500).json({ erro: error.sqlMessage })
    }
};

function temperaturaAtual(req, res) {
    var idSensor = req.params.idSensor;

    sensorModel.temperaturaAtual(idSensor).then((resultado) => {
        res.status(200).json(resultado);
    });
}

function umidadeAtual(req, res) {
    var idSensor = req.params.idSensor;

    sensorModel.umidadeAtual(idSensor).then((resultado) => {
        res.status(200).json(resultado);
    });
}

function ultimasMedicoes(req, res) {
    var idSensor = req.params.idSensor;

    sensorModel.ultimasMedicoes(idSensor).then((resultado) => {
        res.status(200).json(resultado);
    });
}



module.exports = {
    dadosSensor,
    temperaturaAtual,
    umidadeAtual,
    ultimasMedicoes
}