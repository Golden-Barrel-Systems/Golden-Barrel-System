const database = require('../database/config');

function cadastrar(codEmpresa, senha, tipoUsuario, cpf, email) {

    const instrucaoSQL = `
        INSERT INTO usuario (codEmpresa, senha, tipoUsuario, cpf, email)
        VALUES (
            '${codEmpresa}',
            '${senha}',
            '${tipoUsuario}',
            '${cpf}',
            '${email}'
        );
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
    buscarUsuario
};