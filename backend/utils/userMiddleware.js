const sessoes = {};

function random() {
    const numeroAleatorio = Math.random() * 10;

    return numeroAleatorio;
}

function gerarToken() {

    const caracteresEspeciais = ['!', '@', '#', '$', '%', '¨', '&', '*', '(', ')', '-', '_', '+', '=', '[', ']', '{', '}', '|', '/', '?', '>', '<', ',', '.', '~', '^', '`', ':', ';', '§', '°', 'ª', 'º', '£', '¢', '¬', '¤', '±', '©', '®', '÷', '«', '»', '¿', '¡', 'ç', 'Ç', 'ã', 'Ã', 'õ', 'Õ', 'á', 'Á', 'é', 'É', 'í', 'Í', 'ó', 'Ó', 'ú', 'Ú', 'â', 'Â', 'ê', 'Ê', 'î', 'Î', 'ô', 'Ô', 'û', 'Û', 'à', 'À', 'ü', 'Ü'];

    const caracteres = {
        0: "a",
        1: "B",
        2: "x",
        3: "K",
        4: "Z",
        5: "c",
        6: "u",
        7: "p",
        8: "q",
        9: "Q"
    }

    const num1 = ((random() + 1) * 20.05 / 2)
    const num2 = ((random() + 1) * 10.05 / 2)
    const num3 = ((random() + 1) * 1.05 / 2)
    const char0 = caracteresEspeciais[parseInt(random())];
    const char1 = caracteresEspeciais[parseInt(random() + 10)];
    const char2 = caracteresEspeciais[parseInt(random() + 20)];
    const char3 = caracteresEspeciais[parseInt(random() + 30)];
    const char4 = caracteresEspeciais[parseInt(random() + 40)];
    const char5 = caracteresEspeciais[parseInt(random() + 50)];

    const tokenMontado = `GoldenBrrl:${parseInt(num1)}${caracteres[parseInt(random())]}${caracteres[parseInt(random())]}${char0}${parseInt(num2)}${caracteres[parseInt(random())]}${char1}${caracteres[parseInt(random())]}${char2}${caracteres[parseInt(random())]}${parseInt(num3)}${caracteres[parseInt(random())]}${caracteres[parseInt(random())]}${char3}${char4}${char5}${parseInt(num1)}${parseInt(num3)}${parseInt(num2)}${caracteres[parseInt(random())]}${char0}${caracteres[parseInt(random())]}${char5}${caracteres[parseInt(random())]}${char2}${char1}${caracteres[parseInt(random())]}${caracteres[parseInt(random())]}${char0}${char1}${char2}${char3}${char4}${char5}${char5}${char4}${char3}${char2}${char1}${char0}`;

    return tokenMontado
}

function autenticarSessao(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ erro: 'Sem token', codigo: 0 });
    };

    const token = authHeader.split(' ')[1];

    const sessao = sessoes[token]
    const agora = new Date()

    if (!sessao) {
        return res.status(403).json({ erro: 'Sessão inválida', codigo: 1 })
    } else if (agora > sessao.expiraEm) {
        delete sessoes[token];
        return res.status(403).json({ erro: 'O token expirou', codigo: 2 })
    };

    req.usuario = sessao;

    next()
};

module.exports = {
    gerarToken,
    autenticarSessao,
    sessoes
}