const usuarioModel = require('../models/usuarioModels');
const userUtils = require('../utils/userMiddleware')

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    const codigo = req.body.codigo;
    const email = req.body.email;
    const senha = req.body.senha;
    const cpf = req.body.cpf;
    const tipoUsuario = req.body.tipoUsuario
    

    // Faça as validações dos valores
    if (codigo == undefined) {
        res.status(400).send("Seu codigo está undefined!");
    } else if (email == undefined && cpf == undefined) {
        res.status(400).send("Seu email e cpf estão undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    }else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(codigo,senha,tipoUsuario,cpf,email)
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
  const codigo = req.body.codigo;

  usuarioModel
    .buscarUsuario(email, senha, codigo)
    .then(function (resultadoAutenticar) {
      if (resultadoAutenticar.length === 1) {
        if (resultadoAutenticar[0].senha !== senha)
          return res.status(401).json({ mensagem: "Senha inválida" });
        else if (resultadoAutenticar[0].codigo_empresa !== codigo)
          return res
            .status(401)
            .json({ mensagem: "Código errado ou inválido" });

        const usuario = resultadoAutenticar[0];

        const token = userUtils.gerarToken();
        const vidaToken = 4 * 60 * 60 * 1000;

        userUtils.sessoes[token] = {
          id_usuario: usuario.id_usuario,
          codigo_empresa: usuario.codigo_empresa,
          tipo: usuario.tipo,
          cpf: usuario.cpf || "Sem CPF",
          email: usuario.email || "Sem email",
          criadoEm: new Date(),
          expiraEm: new Date(Date.now() + vidaToken),
        };

        console.log(userUtils.sessoes);
        res
          .status(200)
          .json({
            token: token,
            tipo: usuario.tipo,
            codigo: usuario.codigo_empresa,
          });
      } else {
        console.log("Email e/ou senha inválidos!");
        res.status(401).json({ mensagem: "Email e/ou senha inválidos" });
      }
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500, erro.sqlMessage);
    });
}

module.exports = {
    autenticarUsuario,
    cadastrar
}