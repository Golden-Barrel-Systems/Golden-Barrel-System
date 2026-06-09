function formatarCNPJ(cnpj) {
    let digitos = '';
    for (let i = 0; i < cnpj.length; i++) {
        if (cnpj[i] >= '0' && cnpj[i] <= '9') {
            digitos += cnpj[i];
        }
    }
    
    if (digitos.length > 14) {
        digitos = digitos.substring(0, 14);
    }
    
    let resultado = '';
    for (let i = 0; i < digitos.length; i++) {
        resultado += digitos[i];
        
        if (i === 1) resultado += '.';
        else if (i === 4) resultado += '.';
        else if (i === 7) resultado += '/';
        else if (i === 11) resultado += '-';
    }
    
    return resultado;
}

function formatarCEP(cep) {
    let digitos = '';
    for (let i = 0; i < cep.length; i++) {
        if (cep[i] >= '0' && cep[i] <= '9') {
            digitos += cep[i];
        }
    }
    
    if (digitos.length > 8) {
        digitos = digitos.substring(0, 8);
    }
    
    let resultado = '';
    for (let i = 0; i < digitos.length; i++) {
        resultado += digitos[i];
        
        if (i === 4) resultado += '-';
    }
    
    return resultado;
}

function aplicarMascaraCNPJ(event) {
    event.target.value = formatarCNPJ(event.target.value);
}

function aplicarMascaraCEP(event) {
    event.target.value = formatarCEP(event.target.value);
}

function limparNumeros(texto) {
    let resultado = '';
    for (let i = 0; i < texto.length; i++) {
        if (texto[i] !== '.' && texto[i] !== '/' && texto[i] !== "-") {
            resultado += texto[i];
        }
    }
    return resultado;
}

function validarCNPJ(cnpj) {
    const cnpjLimpo = limparNumeros(cnpj);
    
    if (cnpjLimpo.length !== 14) return false;
    
    let todosIguais = true;
    for (let i = 1; i < cnpjLimpo.length; i++) {
        if (cnpjLimpo[i] !== cnpjLimpo[0]) {
            todosIguais = false;
            break;
        }
    }
    if (todosIguais) return false;
    
    return true;
}

function validarCEP(cep) {
    const cepLimpo = limparNumeros(cep);
    return cepLimpo.length === 8;
}

function validarEmail(email) {

    let temArroba = false;
    let posicaoArroba = -1;
    for (let i = 0; i < email.length; i++) {
        if (email[i] === '@') {
            if (temArroba) return false;
            temArroba = true;
            posicaoArroba = i;
        }
    }
    
    if (!temArroba || posicaoArroba === 0 || posicaoArroba === email.length - 1) {
        return false;
    }
    
    let temPonto = false;
    let posicaoPonto = -1;
    for (let i = posicaoArroba + 1; i < email.length; i++) {
        if (email[i] === '.') {
            temPonto = true;
            posicaoPonto = i;
            break;
        }
    }
    
    if (!temPonto || posicaoPonto === posicaoArroba + 1 || posicaoPonto === email.length - 1) {
        return false;
    }
    
    for (let i = 0; i < email.length; i++) {
        if (email[i] === ' ' || email[i] === '\t' || email[i] === '\n') {
            return false;
        }
    }
    
    return true;
}

function validarNome(nome) {
    return nome.trim().length >= 3;
}

function validarLogradouro(logradouro) {
    return logradouro.trim().length >= 3;
}

function validarNumero(numero) {
    return numero.trim().length > 0 && !isNaN(numero);
}

function validarBairro(bairro) {
    return bairro.trim().length >= 2;
}

function validarCidade(cidade) {
    return cidade.trim().length >= 2;
}

function validarUF(uf) {
    return uf.trim().length === 2;
}

function cadastrar(event) {
    event.preventDefault();
    
    const nome = document.getElementById('input_nome').value.trim();
    const cnpj = document.getElementById('input_cnpj').value;
    const logradouro = document.getElementById('input_logradouro').value.trim();
    const numero = document.getElementById('input_numero').value.trim();
    const complemento = document.getElementById('input_complemento').value.trim();
    const bairro = document.getElementById('input_bairro').value.trim();
    const cidade = document.getElementById('input_cidade').value.trim();
    const uf = document.getElementById('input_uf').value;
    const cep = document.getElementById('input_cep').value;
    
    let temErro = false;
    
    const mensagensErro = document.querySelectorAll('.message-error');
    for (let i = 0; i < mensagensErro.length; i++) {
        mensagensErro[i].textContent = '';
    }
    
    if (!validarNome(nome)) {
        document.getElementById('mensagem_nome').textContent = 'Nome deve ter pelo menos 3 caracteres';
        temErro = true;
    }
    
    if (!validarCNPJ(cnpj)) {
        document.getElementById('mensagem_cnpj').textContent = 'CNPJ inválido';
        temErro = true;
    }
    
    if (!validarCEP(cep)) {
        document.getElementById('mensagem_cep').textContent = 'CEP deve ter 8 dígitos';
        temErro = true;
    }
    
    if (!validarLogradouro(logradouro)) {
        document.getElementById('mensagem_logradouro').textContent = 'Logradouro deve ter pelo menos 3 caracteres';
        temErro = true;
    }
    
    if (!validarNumero(numero)) {
        document.getElementById('mensagem_numero').textContent = 'Número deve ser válido';
        temErro = true;
    }
    
    if (!validarBairro(bairro)) {
        document.getElementById('mensagem_bairro').textContent = 'Bairro deve ter pelo menos 2 caracteres';
        temErro = true;
    }
    
    if (!validarCidade(cidade)) {
        document.getElementById('mensagem_cidade').textContent = 'Cidade deve ter pelo menos 2 caracteres';
        temErro = true;
    }
    
    if (!validarUF(uf)) {
        document.getElementById('mensagem_uf').textContent = 'Estado é obrigatório';
        temErro = true;
    }
    
    if (temErro) return;
    
    const dadosEmpresa = {
        nome: nome,
        cnpj: limparNumeros(cnpj),
        logradouro: logradouro,
        numero: numero,
        complemento: complemento || null,
        bairro: bairro,
        cidade: cidade,
        uf: uf,
        cep: limparNumeros(cep)
    };
    
    fetch('/empresas/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosEmpresa)
    })
    .then(resposta => {
        if (resposta.ok) {
            alert('Empresa cadastrada com sucesso!');
            window.location = 'login.html';
        } else {
            return resposta.json().then(erro => {
                throw erro;
            });
        }
    })
    .catch(erro => {
        console.error('Erro:', erro);
        if (erro.erro) {
            if (erro.erro.includes('Duplicate entry')) {
                alert('Erro: CNPJ já cadastrado no sistema');
            } else {
                alert('Erro ao cadastrar empresa: ' + erro.erro);
            }
        } else {
            alert('Erro ao cadastrar empresa. Tente novamente.');
        }
    });
}

function voltar() {
    if (confirm('Deseja descartar as alterações?')) {
        window.location = './index.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const inputCNPJ = document.getElementById('input_cnpj');
    const inputCEP = document.getElementById('input_cep');
    
    if (inputCNPJ) {
        inputCNPJ.addEventListener('input', aplicarMascaraCNPJ);
    }
    
    if (inputCEP) {
        inputCEP.addEventListener('input', aplicarMascaraCEP);
    }
});
