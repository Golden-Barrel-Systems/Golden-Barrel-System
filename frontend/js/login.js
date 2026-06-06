const loginBtn = document.getElementById('btn-logar');

loginBtn.addEventListener('click', () => {
    const email = document.getElementById('input_email').value;
    const senha = document.getElementById('input_senha').value;
    const codigo = document.getElementById('input_codigo').value;

    const usuario = autenticarUsuario(email, senha, codigo)
    
    .then(resposta => {
        const token = resposta.token;
        const codigo = resposta.codigo;
        const tipoUsuario = resposta.tipo;
        

        localStorage.setItem("token", token);
        sessionStorage.setItem("codigo_empresa", codigo)
        
        if (tipoUsuario.startsWith('suporte')) {
            window.location.href="./suporte.html"
            return
        };

        window.location.href="./dashGeral.html"
    })

})

async function autenticarUsuario(email, senha, codigo) {
    try {
        const resposta = await fetch('/usuarios/autenticar', {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha,
                codigo: codigo
            })
        })

        if(!resposta.status === 401) {
            return false
        };

        const data = await resposta.json();

        return data
    } catch (error) {
        throw new Error(error)
        return;
    }
}