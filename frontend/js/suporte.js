const repassarBtn = document.getElementById('btn-repassar');
const chamadosContainer = document.getElementById('chamados');
const selectStatus = document.getElementById('item-status');
const selectPrioriade = document.getElementById('item-prioridade');
const chatPlaceholder = document.getElementById('chat-placeholder')


const nivelSuporte = 3;

if (nivelSuporte === 3) {
    chatPlaceholder.innerHTML = `
        <div class="chat-btn-logo chat-opened" id="chat-btn-logo">
            <img src="./assets/img/logo.png" alt="GoldenIA" class="chat-logo" id="chat-logo">
        </div>
        <div class="chat-bot chat-closed" id="chat-bot">
            <div class="chat-header">
                <h2>GoldenIA</h2>
            
                <button class="btn-minimizar" id="btn-minimizar"><svg width="30px" height="30px" viewBox="-2 -2 24.00 24.00" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000000" stroke-width="0.0002"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.12"></g><g id="SVGRepo_iconCarrier"> <path fill="#FEFEFE" fill-rule="evenodd" d="M11 8a1 1 0 001 1h6a1 1 0 100-2h-3.586l3.793-3.793a1 1 0 00-1.414-1.414L13 5.586V2a1 1 0 10-2 0v6zm-2 4a1 1 0 00-1-1H2a1 1 0 100 2h3.586l-3.793 3.793a1 1 0 101.414 1.414L7 14.414V18a1 1 0 102 0v-6z"></path> </g></svg></button>
            </div>
            <div id="chat-bot-msg" class="chat-bot-msg">
                <ul class="msg-ul" id="msg-ul"></ul>
            </div>
            <div class="input-mensagem">
                <textarea name="user-input" id="user-input" class="user-input" placeholder="Digite sua mensagem..."></textarea>
            </div>
            <button class="button btn-enviar" id="btn-enviar">Enviar</button>
        </div>
    `;
    const enviarBtn = document.getElementById('btn-enviar');
    const btnMinimizar = document.getElementById('btn-minimizar');
    const btnAbrir = document.getElementById('chat-btn-logo');
    const btnAbrirImg = document.getElementById('chat-logo');
    const chatContainer = document.getElementById('chat-bot')
    
    btnAbrir.addEventListener('click', () => {
        chatContainer.classList.toggle("chat-opened", true)
        chatContainer.classList.toggle("chat-closed", false)
        btnAbrir.classList.toggle("chat-opened", false)
        btnAbrir.classList.toggle("chat-closed", true)
    })
    
    btnAbrirImg.addEventListener('click', (e) => {
        e.preventDefault();
    
        chatContainer.classList.toggle("chat-opened", true)
        chatContainer.classList.toggle("chat-closed", false)
        btnAbrir.classList.toggle("chat-opened", false)
        btnAbrir.classList.toggle("chat-closed", true)
    })
    
    btnMinimizar.addEventListener('click', () => {
        chatContainer.classList.toggle("chat-opened", false)
        chatContainer.classList.toggle("chat-closed", true)
        btnAbrir.classList.toggle("chat-opened", true)
        btnAbrir.classList.toggle("chat-closed", false)
    })

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
}

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

            if (chamado.statuss !== status) {
                continue;
            };

            if (prioridade !== 'todas') {
                if (chamado.prioridade !== prioridade) {
                    continue;
                }
            };

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