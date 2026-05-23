const database = require("../database/config");

function listarCamara(idEmpresa) {

    let instrucaoSql = `
        SELECT
            idCamara,
            nomeCamara,
            temperaturaIdeal,
            umidadeIdeal,
            idEmpresa,
            endereco
        FROM camara 
        WHERE idEmpresa = ${idEmpresa};
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    listarCamara
};