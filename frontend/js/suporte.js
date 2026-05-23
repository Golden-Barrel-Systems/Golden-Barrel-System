const repassarBtn = document.getElementById('btn-repassar');
const enviarBtn = document.getElementById('btn-enviar');

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

})