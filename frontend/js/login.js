const loginBtn = document.getElementById('btn-logar');

loginBtn.addEventListener('click', () => {
    const tipoUsuario = 'suporte 1'
    
    if (tipoUsuario.startsWith('suporte')) {
        window.location.href="./suporte.html"
        return
    };

    window.location.href="./dashGeral.html"
})