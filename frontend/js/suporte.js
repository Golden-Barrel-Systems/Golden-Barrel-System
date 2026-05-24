const chamadosContainer = document.getElementById('chamados');
const selectStatus = document.getElementById('item-status');
const selectPrioriade = document.getElementById('item-prioridade');
const chatPlaceholder = document.getElementById('chat-placeholder')


const nivelSuporte = 3;

if (nivelSuporte === 3) {
    chatPlaceholder.innerHTML = `
        <div class="chat-btn-logo opened" id="chat-btn-logo">
            <img src="./assets/img/logo.png" alt="GoldenIA" class="chat-logo" id="chat-logo">
        </div>
        <div class="chat-bot closed" id="chat-bot">
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
        chatContainer.classList.toggle("opened", true)
        chatContainer.classList.toggle("closed", false)
        btnAbrir.classList.toggle("opened", false)
        btnAbrir.classList.toggle("closed", true)
    })
    
    btnAbrirImg.addEventListener('click', (e) => {
        e.preventDefault();
    
        chatContainer.classList.toggle("opened", true)
        chatContainer.classList.toggle("closed", false)
        btnAbrir.classList.toggle("opened", false)
        btnAbrir.classList.toggle("closed", true)
    })
    
    btnMinimizar.addEventListener('click', () => {
        chatContainer.classList.toggle("opened", false)
        chatContainer.classList.toggle("closed", true)
        btnAbrir.classList.toggle("opened", true)
        btnAbrir.classList.toggle("closed", false)
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
        
        carregarResposta(mensagem)
        .then(resposta => {
            document.getElementById('msg-ul').innerHTML += `
                ${resposta}
            `;
        })

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
                nivelSuporte: nivelSuporte
            }
        })
    });

    const chamados = await resposta.json();
    let chamadosMostrados = [];
    chamadosContainer.innerHTML = '';

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
        chamadosMostrados.push(chamado)

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
                    <button class="button btn-responder" id="btn-responder">Responder</button>
                    <button class="button btn-repassar" id="btn-repassar">Repassar para nível superior</button>
                </div>
            </div>
        `;

    };

    const responderBtn = document.querySelectorAll('#btn-responder');
    const repassarBtn = document.querySelectorAll('#btn-repassar');

    if(status === 'fechado') {
        for (let j = 0; j < responderBtn.length; j++) {
            for(let k = 0; k < responderBtn.length; k++) {
                responderBtn[k].classList.add('disabled');
                repassarBtn[k].classList.add('disabled')
            }
        };
        return;
    }
    for (let j = 0; j < responderBtn.length; j++) {
        responderBtn[j].addEventListener('click', () => {
            console.log(chamadosMostrados[j])
            const data = chamadosMostrados[j].dtAbertura.slice(0, 10);
            abirModalChamado(chamadosMostrados[j].idChamado, chamadosMostrados[j].statuss, chamadosMostrados[j].prioridade, chamadosMostrados[j].usuario, chamadosMostrados[j].assunto, data, chamadosMostrados[j].descricao);
            for(let k = 0; k < responderBtn.length; k++) {
                responderBtn[k].classList.add('disabled');
                repassarBtn[k].classList.add('disabled')
            }
        });

        repassarBtn[j].addEventListener('click', () => {
            repassarChamado(chamadosMostrados[j].idChamado)
            .then(
                setTimeout(() => {
                    carregarChamados(status, prioridade)
                }, 200)
            );
        });
    };
};

async function repassarChamado(id) {
    try {
        const resposta = await fetch('http://localhost:8080/chamado/repassar', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id
            })
        });

        if(!resposta.ok) {
            return false
        };

        console.log(resposta.json().mensagem);
    } catch (error) {
        throw new Error(error);
        return false;
    };
};

async function responderChamado(id, respostaChamado) {
    try {
        const resposta = await fetch('http://localhost:8080/chamado/responder', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idChamado: id,
                respostaChamado: respostaChamado
            })
        });

        if(!resposta.ok) {
            console.error(resposta.json())
            return false
        };

        console.log(resposta.json().mensagem)
    } catch (error) {
        throw new Error(error)
        return false
    }
}

async function abirModalChamado(id, status, prioridade, usuario, assunto, data, descricao) {
    const chamadoModal = document.getElementById('chamado-modal');
    
    chamadoModal.innerHTML = ''

    chamadoModal.classList.toggle('closed', false);
    chamadoModal.classList.toggle('opened', true);

    chamadoModal.innerHTML = `
        <div class="chamado-modal-content">
            <span class="close-button" id="close-button">
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><circle cx="12" cy="11.9999" r="9" stroke="#0D0D0D" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle><path d="M14 10L10 14" stroke="#0D0D0D" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M10 10L14 14" stroke="#0D0D0D" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></g></svg>
            </span>
            <div class="chamado-header">
                <h2>Chamado #<span id="modal-chamado-id">${id}</span></h2>
                <span class="status ${status}"><strong>Status:</strong> <span id="modal-chamado-status">${status}</span></span>
            </div>
            <p><strong>Assunto:</strong> <span id="modal-chamado-assunto">${assunto}</span></p>
            <p><strong>Prioridade:</strong> <span id="modal-chamado-prioridade">${prioridade}</span></p>
            <p><strong>Descrição:</strong></p>
            <div class="descricao">
                <p id="modal-chamado-descricao">${descricao}</p>
            </div>
            <p><strong>Resposta:</strong></p>
            <div class="resposta-container">
                <textarea name="suporte-resposta" id="suporte-resposta" class="suporte-resposta"></textarea>
            </div>
            <button class="button btn-fechar" id="btn-fechar">Enviar</button>
        </div>
    `;

    const fecharBtn = document.getElementById('close-button');
    const chamadoResposta = document.getElementById('suporte-resposta');
    const chamadoEnviar = document.getElementById('btn-fechar');


    fecharBtn.addEventListener('click', () => {
        chamadoModal.classList.toggle('opened', false);
        chamadoModal.classList.toggle('closed', true);
        
        const responderBtn = document.querySelectorAll('#btn-responder');
        const repassarBtn = document.querySelectorAll('#btn-repassar');

        for (let i = 0; i < responderBtn.length; i++) {
            
            responderBtn[i].classList.remove('disabled');
            repassarBtn[i].classList.remove('disabled');

        }

        carregarChamados(selectStatus.value, selectPrioriade.value)

        return;
    });

    chamadoEnviar.addEventListener('click', () => {
        const resposta = chamadoResposta.value;

        if(!resposta) {
            console.error("Resposta vazia ou com erro!");
            return;
        };

        responderChamado(id, resposta)
        .then(
            setTimeout(() => {
                fecharBtn.click()
            }, 200)
        )
    })

}

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