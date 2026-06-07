const database = require("../database/config");

function registrar(idMedicao, mensagem, peso) {
    var instrucaoSql = `INSERT INTO alerta (fk_medicao, mensagem, peso) VALUES (${idMedicao}, '${mensagem}', '${peso}');`;

    return database.executar(instrucaoSql);
}

module.exports = {
    registrar,
};
