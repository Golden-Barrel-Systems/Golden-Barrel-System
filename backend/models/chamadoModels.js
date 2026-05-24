const database = require('../database/config');

function buscarChamados(nivelSuporte) {
    const instrucaoSql = `
        SELECT * FROM todosChamados WHERE nvSuporte = ${nivelSuporte};
    `;

    return database.executar(instrucaoSql);
};

function enviarChamado(userId, assunto, descricao) {
    const instrucaoSql = `
        INSERT INTO chamados values(default, ${assunto}, default, CURDATE(), ${descricao}, default, ${userId});
    `;

    return database.executar(instrucaoSql);
};

function repassarChamado(idChamado) {
    const instrucaoSql = `
        UPDATE chamados SET nvSuporte = nvSuporte + 1 WHERE idChamado = ${idChamado};
    `;

    return database.executar(instrucaoSql);
};

function fecharChamado(idChamado, respostaChamado) {
    const instrucaoSql = `
        UPDATE chamados SET statuss = 'fechado', resposta = '${respostaChamado}' WHERE idChamado = ${idChamado}
    `;

    return database.executar(instrucaoSql)
}

module.exports = {
    buscarChamados,
    enviarChamado,
    repassarChamado,
    fecharChamado
};