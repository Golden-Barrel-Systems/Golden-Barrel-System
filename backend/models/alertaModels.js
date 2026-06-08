const database = require("../database/config");

function registrar(idMedicao, mensagem, peso) {
  var instrucaoSql = `INSERT INTO alerta (fk_medicao, mensagem, peso) VALUES (${idMedicao}, '${mensagem}', '${peso}');`;

  return database.executar(instrucaoSql);
}

function buscar(idCamara) {
  var instrucaoSql = `SELECT * FROM vw_ultimos_alertas where id_camara = ${idCamara}`;

  return database.executar(instrucaoSql);
}

function listarAlertasPorSensor(idSensor) {
  var instrucaoSql = `
         SELECT
            a.id_alerta,
            s.id_sensor,
            m.valor,
            m.tipo,
            a.mensagem,
            a.peso,
            DATE_FORMAT(a.data_hora,'%d/%m/%Y %H:%i:%s') as dataHora,
            DATE_FORMAT(a.data_hora,'%H:%i') as hora,
            sensor_meta.numero_serial AS nome 
        FROM alerta a
        JOIN medicao m
            ON a.fk_medicao = m.id_medicao
        JOIN sensor s
            ON m.fk_sensor = s.id_sensor
            JOIN sensor_meta
        ON sensor_meta.fk_sensor = s.id_sensor 
        WHERE s.id_sensor = ${idSensor}
        ORDER BY dataHora DESC
        LIMIT 10;
    `;

  return database.executar(instrucaoSql);
}

module.exports = {
  registrar,
  buscar,
  listarAlertasPorSensor,
};
