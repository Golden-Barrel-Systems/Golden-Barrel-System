const repassarBtn = document.getElementById('btn-repassar');
const enviarBtn = document.getElementById('btn-enviar');
const chamadosContainer = document.getElementById('chamados')

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

    console.log("Resposta do Chat: " + resposta);

    
    return resposta;
}

async function carregarChamados() {
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
        const data = chamado.dtAbertura.slice(0, 10);
        chamadosContainer.innerHTML += `
            <div class="chamado">
                <h2>Chamado #${chamado.idChamado}</h2>
                <p><strong>ID do Usuário:</strong> ${chamado.usuario}</p>
                <p><strong>Assunto:</strong> ${chamado.assunto}</p>
                <p><strong>Status:</strong> ${chamado.statuss}</p>
                <p><strong>Data de abertura:</strong> ${data}</p>
                <p><strong>Descrição:</strong></p>
                <div class="descricao">
                    <p>${chamado.descricao}</p>
                </div>
                <button class="button btn-repassar" id="btn-repassar">Repassar para nível superior</button>
            </div>
        `;
    };

};

carregarChamados()

enviarBtn.addEventListener('click', () => {
    const input = document.getElementById('user-input');
    const mensagem = input.value;
    
    if(!mensagem) {
        console.log("Mensagem vazia ou com erro")
        return
    };
    
    console.log("Botão clicado!");
    
    carregarResposta(mensagem)
    .then(resposta => {
        document.getElementById('chat-bot-msg').innerHTML = resposta;
    })

    input.value = '';
})