const database = require("../database/config");

function registrar(idMedicao, mensagem, peso) {
    var instrucaoSql = `INSERT INTO alerta (fk_medicao, mensagem, peso) VALUES (${idMedicao}, '${mensagem}', '${peso}');`;

    return database.executar(instrucaoSql);
}

function buscar(idCamara) {
    var instrucaoSql = `SELECT * FROM vw_ultimos_alertas where id_camara = ${idCamara}`;

    return database.executar(instrucaoSql);
}

module.exports = {
    registrar,
    buscar
};
