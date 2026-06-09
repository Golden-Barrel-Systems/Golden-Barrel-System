function gerarNumero() {
    let numero = '';
    for (let i = 0; i < 5; i++) {
        const num = parseInt(Number(Math.random() * 9 + 1));
        numero += num.toString();
    };

    console.log(numero);
    return numero;
};

function gerarCodigo(letras) {
    const numeros = gerarNumero()
    const codigo = letras + numeros;

    return codigo;
};

module.exports = { gerarCodigo }