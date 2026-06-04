function listarAlertas() {
    fetch("/alerta/listar")
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            }
            throw "Erro ao buscar alertas";
        })
        .then(function (dados) {
            console.log("Alertas:", dados);
        })
        .catch(function (erro) {
            console.log(`#ERRO: ${erro}`);
        });
}