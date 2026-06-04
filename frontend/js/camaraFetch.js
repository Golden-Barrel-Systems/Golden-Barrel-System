function camarasDados() {
    fetch("/camara/dados")
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            }
            throw "Erro ao buscar dados das câmaras";
        })
        .then(function (dados) {
            console.log(dados);
        })
        .catch(function (erro) {
            console.log(`#ERRO: ${erro}`);
        });
}