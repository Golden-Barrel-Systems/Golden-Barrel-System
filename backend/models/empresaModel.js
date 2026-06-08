var database = require("../database/config");

function listar() {
  var instrucaoSql = `SELECT id_empresa, nome, codigo FROM empresa`;

  return database.executar(instrucaoSql);
}

function cadastrar(nome, cnpj) {
  const instrucaoSql = `
    INSERT INTO empresa.cnpj, empresa.nome VALUES ('${cnpj}', '${nome}');
  `;

  return database.executar(instrucaoSql);
};

function cadastarEndereco(l, n, c, b, ci, u, ce) {
  const instrucaoSql = `
    INSERT INTO endereco VALUES ('${l}', '${n}', '${c}', '${b}', '${ci}', '${u}', '${ce}');
  `;

  return database.executar(instrucaoSql);
};

module.exports = { listar, cadastrar, cadastarEndereco };
