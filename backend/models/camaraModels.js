const database = require("../database/config");

function listarCamara(codEmpresa) {

    let instrucaoSql = `
        SELECT
            idCamara,
            nomeCamara,
            temperaturaIdeal,
            umidadeIdeal,
            idEmpresa,
            endereco
        FROM camara 
        WHERE codEmpresa = ${codEmpresa};
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    listarCamara
};