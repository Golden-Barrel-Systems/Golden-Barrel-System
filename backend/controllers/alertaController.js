const alertaModel = require('../models/alertaModels')

async function listarAlertasPorSensor(req, res) {
    try {
        const id_sensor = req.body.id_sensor;

        const alertas = await alertaModel.listarAlertasPorSensor(id_sensor);

        if (alertas.length === 0) {
            return res.status(404).json({ mensagem: "Nenhum alerta encontrado para este sensor" });
        }

        const data = [];

        for (let i = 0; i < alertas.length; i++) {
            const alerta = alertas[i];

            const pegarItens = {
                id_alerta: alerta.id_alerta,
                descricao: alerta.descricao,
                tipo: alerta.tipo,
                status: alerta.status,
                fk_sensor: alerta.fk_sensor,
                data_criacao: alerta.data_criacao
            };

            data.push(pegarItens);
        }

        return res.status(200).json(data);
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({ mensagem: erro.sqlMessage || "Erro ao listar alertas do sensor" });
    }
}

module.exports = {
    listarAlertasPorSensor
}