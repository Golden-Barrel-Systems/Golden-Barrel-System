const database = require('../database/config');

function buscarChamados(nivelSuporte) {
    const instrucaoSql = `
        SELECT * FROM chamado WHERE nivel_suporte = ${nivelSuporte};
    `;

    return database.executar(instrucaoSql);
};

function enviarChamado(userId, assunto, descricao) {
    const instrucaoSql = `
        INSERT INTO chamado values(default, ${assunto}, default, CURDATE(), ${descricao}, default, ${userId});
    `;

    return database.executar(instrucaoSql);
};

function repassarChamado(idChamado) {
    const instrucaoSql = `
        UPDATE chamado SET nivel_suporte = nivel_suporte + 1 WHERE id_chamado = ${idChamado};
    `;

    return database.executar(instrucaoSql);
};

function fecharChamado(idChamado, respostaChamado) {
    const instrucaoSql = `
        UPDATE chamado SET statuss = 'fechado', resposta = '${respostaChamado}' WHERE id_chamado = ${idChamado}
    `;

    return database.executar(instrucaoSql)
}

module.exports = {
    buscarChamados,
    enviarChamado,
    repassarChamado,
    fecharChamado
};