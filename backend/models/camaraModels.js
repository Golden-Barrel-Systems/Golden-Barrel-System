const database = require("../database/config");

function buscarEmpresa(codEmpresa) {
    const instrucaoSQL = `
        SELECT * FROM empresa WHERE codEmpresa = '${codEmpresa}';
    `;

    return database.executar(instrucaoSQL)
};

function listarCamaras(idEmpresa) {

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

function listarCamara(idCamara) {

    let instrucaoSql = `
        SELECT
            idCamara,
            nomeCamara,
            temperaturaIdeal,
            umidadeIdeal,
            idEmpresa,
            endereco
        FROM camara 
        WHERE idCamara = ${idCamara};
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    listarCamaras,
    listarCamara,
    buscarEmpresa
};