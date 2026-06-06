var database = require("../database/config");

function listar() {
  var instrucaoSql = `SELECT id_empresa, nome, codigo FROM empresa`;

  return database.executar(instrucaoSql);
}

module.exports = { listar };
