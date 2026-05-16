const express = require('express');
const database = require('../database/config');

function buscarDadosSensor() {
    const instrucaoSQL = `
        SELECT s.idSensor, s.idCamara, s.localizacao, sm.fabricante, sm.modelo, sm.numSerial, sm.dataInstalacao, sm.dataCalibracao FROM sensor s LEFT JOIN sensor_meta sm ON s.idSensor = sm.idSensor;
    `;

    database.executar(instrucaoSQL);
};

module.exports = {
    buscarDadosSensor
};