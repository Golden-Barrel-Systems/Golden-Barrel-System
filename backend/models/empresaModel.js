var database = require("../database/config");

function listar() {
  var instrucaoSql = `SELECT id_empresa, nome, codigo FROM empresa`;

  return database.executar(instrucaoSql);
}

function cadastrar(endereco, nome, cnpj, codigo) {
  const instrucaoSql = `
    INSERT INTO empresa (fk_endereco, cnpj, nome, codigo) VALUES (${endereco}, '${cnpj}', '${nome}', '${codigo}');
  `;

  return database.executar(instrucaoSql);
};

function cadastarEndereco(l, n, c, b, ci, u, ce) {
  const instrucaoSql = `
    INSERT INTO endereco VALUES (DEFAULT, '${l}', '${n}', '${c}', '${b}', '${ci}', '${u}', '${ce}');
  `;

  return database.executar(instrucaoSql);
};

module.exports = { listar, cadastrar, cadastarEndereco };
