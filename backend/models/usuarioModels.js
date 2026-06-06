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

function buscarUsuario(email, senha, codEmpresa) {

    const instrucaoSQL = `
        SELECT idUsuario, codEmpresa, tipoUsuario, cpf, email, senha
        FROM usuario
        WHERE (email = '${email}'
           OR cpf = '${email}') AND senha = '${senha}' AND codEmpresa = '${codEmpresa}';
    `;

    return database.executar(instrucaoSQL);
}

module.exports = {
  cadastrar,
  buscarUsuario,
};
