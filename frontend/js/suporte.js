const repassarBtn = document.getElementById('btn-repassar');
const enviarBtn = document.getElementById('btn-enviar');
const chamadosContainer = document.getElementById('chamados');
const selectStatus = document.getElementById('item-status');
const selectPrioriade = document.getElementById('item-prioridade');

async function gerarResposta(mensagem) {
    try {
        const resposta = await fetch('http://localhost:8080/chat/gerar', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mensagem: mensagem
            })
        })
    
        const data = await resposta.json();
        return data.resposta;
    } catch (error) {
        throw new Error(error)
    };
}

async function carregarResposta(mensagem) {
    const resposta = await gerarResposta(mensagem);

    return resposta;
}

async function carregarChamados(status, prioridade) {
    const resposta = await fetch('http://localhost:8080/chamado/buscar', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: {
                nivelSuporte: 3
            }
        })
    });

    const chamados = await resposta.json();

    for (let i = 0; i < chamados.length; i++) {
        const chamado = chamados[i];

        if (prioridade !== 'todas') {   
            if (chamado.statuss !== status || chamado.prioridade !== prioridade) {
                continue;
            };
        }

        const data = chamado.dtAbertura.slice(0, 10);
        chamadosContainer.innerHTML += `
            <div class="chamado">
                <div class="chamado-header">
                    <h2>Chamado #${chamado.idChamado}</h2>
                    <span class="status ${chamado.statuss}"><strong>Status:</strong> ${chamado.statuss}</span>
                </div>
                <p><strong>Prioridade:</strong> ${chamado.prioridade}</p>
                <p><strong>ID do Usuário:</strong> ${chamado.usuario}</p>
                <p><strong>Assunto:</strong> ${chamado.assunto}</p>
                <p><strong>Data de abertura:</strong> ${data}</p>
                <p><strong>Descrição:</strong></p>
                <div class="descricao">
                    <p>${chamado.descricao}</p>
                </div>
                <div class="buttons-div">
                    <button class="button btn-fechar" id="btn-fechar">Fechar chamado</button>
                    <button class="button btn-repassar" id="btn-repassar">Repassar para nível superior</button>
                </div>
            </div>
        `;
    };

};

carregarChamados(selectStatus.value, selectPrioriade.value)

enviarBtn.addEventListener('click', () => {
    const input = document.getElementById('user-input');
    const mensagem = input.value;
    
    if(!mensagem) {
        console.log("Mensagem vazia ou com erro")
        return
    };
    
    console.log("Botão clicado!");
    document.getElementById('msg-ul').innerHTML += `
            <li class="msg-li-user">
                ${mensagem}
            </li>
        `;
    
    // carregarResposta(mensagem)
    // .then(resposta => {
        document.getElementById('msg-ul').innerHTML += `
            <li class="msg-li">
                O usuario deve mamar o ADM para recuperar seu acesso ao sistema de informações.
            </li>
        `;
    // })

    input.value = '';
});

selectStatus.addEventListener('change', () => {
    const status = selectStatus.value;
    const prioridade = selectPrioriade.value
    chamadosContainer.innerHTML = '';

    carregarChamados(status, prioridade)
});

selectPrioriade.addEventListener('change', () => {
    const status = selectStatus.value;
    const prioridade = selectPrioriade.value
    chamadosContainer.innerHTML = '';

    carregarChamados(status, prioridade)
});