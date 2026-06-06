const database = require("../database/config");

function cadastrar(codigoEmpresa, senha, tipo, cpf, email) {
  const instrucaoSQL = `
        INSERT INTO 
            usuario (email, senha, tipo, cpf, codigo_empresa)
        VALUES 
            ('${email}', '${senha}', '${tipo}', '${cpf}', '${codigoEmpresa}');
    `;

  return database.executar(instrucaoSQL);
}

function buscarUsuario(email, senha, codigo_empresa) {
  const instrucaoSQL = `
        SELECT id_usuario, codigo_empresa, tipo, cpf, email, senha
        FROM usuario
        WHERE (email = '${email}'
           OR cpf = '${email}') AND senha = '${senha}' AND codigo_empresa = '${codigo_empresa}';
    `;

  return database.executar(instrucaoSQL);
}

module.exports = {
  cadastrar,
  buscarUsuario,
};
