const express = require('express');
const database = require('../database/config');

function buscarDadosSensor(idCamara) {
    const instrucaoSQL = `
        SELECT s.idSensor, s.idCamara, s.localizacao, sm.fabricante, sm.modelo, sm.numSerial, sm.dataInstalacao, sm.dataCalibracao FROM sensor s LEFT JOIN sensor_meta sm ON s.idSensor = sm.idSensor WHERE s.idCamara = ${idCamara};
    `;

    return database.executar(instrucaoSQL);
};

function buscarMedicoes(idSensor) {
    const instrucaoSQL = `
        SELECT valor, tipo FROM medicoes WHERE idSensor = ${idSensor} ORDER BY idMedicao DESC;
    `;

    return database.executar(idSensor);
};

module.exports = {
    buscarDadosSensor,
    buscarMedicoes
};