const database = require("../database/config");

function buscarEmpresa(codigo_empresa) {
    const instrucaoSQL = `
        SELECT * FROM empresa WHERE codigo = '${codigo_empresa}';
    `;

    return database.executar(instrucaoSQL)
};

function listarCamaras(id_empresa) {

    let instrucaoSql = `
        SELECT
            id_camara,
            nome,
            temperatura_ideal,
            umidade_ideal,
            fk_empresa,
            fk_endereco,
            localizacao_interna
        FROM camara 
        WHERE fk_empresa = ${id_empresa};
    `;

    return database.executar(instrucaoSql);
}

function listarCamara(id_camara) {

    let instrucaoSql = `
        SELECT
            id_camara,
            nome,
            temperatura_ideal,
            umidade_ideal,
            fk_empresa,
            fk_endereco,
            localizacao_interna
        FROM camara 
        WHERE id_camara = ${id_camara};
    `;

    return database.executar(instrucaoSql);
}

function listar(codigoEmpresa) {
    var instrucaoSql = `SELECT * FROM vw_selecionar_camaras WHERE empresa = '${codigoEmpresa}'`;

    return database.executar(instrucaoSql);
}

function listarSensores(idCamara) {
    var instrucaoSql = `SELECT * FROM vw_selecionar_sensores WHERE id_camara = '${idCamara}';`;

    return database.executar(instrucaoSql);
}

module.exports = {
    listarCamaras,
    listarCamara,
    buscarEmpresa,
    listar,
    listarSensores,
};
