const express = require('express');
const database = require('../database/config');

function buscarDadosSensor(id_camara) {
    const instrucaoSQL = `
        SELECT s.idSensor, s.id_camara, s.localizacao, sm.fabricante, sm.modelo, sm.numSerial, sm.dataInstalacao, sm.dataCalibracao FROM sensor s LEFT JOIN sensor_meta sm ON s.idSensor = sm.idSensor WHERE s.id_camara = ${id_camara};
    `;

    return database.executar(instrucaoSQL);
};

function buscarMedicoes(idSensor) {
    const instrucaoSQL = `
        SELECT valor, tipo FROM medicoes WHERE idSensor = ${idSensor} ORDER BY idMedicao DESC;
    `;

    return database.executar(idSensor);
};

function temperaturaAtual(idSensor) {
    var instrucaoSql = `select * from vw_temperatura_atual where id_sensor = ${idSensor};`;

    return database.executar(instrucaoSql);
}

function umidadeAtual(idSensor) {
    var instrucaoSql = `select * from vw_umidade_atual where id_sensor = ${idSensor};`;

    return database.executar(instrucaoSql);
}

module.exports = {
    buscarDadosSensor,
    buscarMedicoes,
    temperaturaAtual,
    umidadeAtual
};