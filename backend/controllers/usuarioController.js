const usuarioModel = require('../models/usuarioModels');
const userUtils = require('../utils/userMiddleware')

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var codigo = req.body.codigoServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cpf = req.body.cpfServer;
    

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    }else if (cpf == undefined) {
        res.status(400).send("Sua senha está undefined!");
    }
     else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(codigo,senha,cpf,email)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function autenticarUsuario(req, res) {
    const email = req.body.email;
    const senha = req.body.senha;

    usuarioModel.buscarUsuario(email, senha)
    .then(
        function (resultadoAutenticar){
            if (resultadoAutenticar.length === 1){

                if(resultadoAutenticar[0].senha !== senha) return res.status(401).json({ mensagem: "Senha inválida" })
                
                const usuario = resultadoAutenticar[0];
                
                const token = userUtils.gerarToken()
                const vidaToken = 4 * 60 * 60 * 1000;
                
                userUtils.sessoes[token] = {
                    idUsuario: usuario.idUsuario,
                    codEmpresa: usuario.codEmpresa,
                    tipoUsuario: usuario.tipoUsuario,
                    cpf: usuario.cpf || "Sem CPF",
                    email: usuario.email || "Sem email",
                    criadoEm: new Date(),
                    expiraEm: new Date(Date.now() + vidaToken)
                }

                console.log(userUtils.sessoes)
                res.status(200).json({ token })
            } else {
                console.log('Email e/ou senha inválidos!')
                res.status(401).json({ mensagem: "Email e/ou senha inválidos"})
            }
        }
    ).catch(
        function (erro) {
            console.log(erro)
            res.status(500, erro.sqlMessage)
        }
    )
};

module.exports = {
    autenticarUsuario,
    cadastrar
}