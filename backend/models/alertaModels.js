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
            a.data_hora
        FROM alerta a
        JOIN medicao m
            ON a.fk_medicao = m.id_medicao
        JOIN sensor s
            ON m.fk_sensor = s.id_sensor
        WHERE s.id_sensor = ${idSensor}
        ORDER BY a.data_hora DESC
        LIMIT 10;
    `;

  return database.executar(instrucaoSql);
}

module.exports = {
  registrar,
  buscar,
  listarAlertasPorSensor
};
