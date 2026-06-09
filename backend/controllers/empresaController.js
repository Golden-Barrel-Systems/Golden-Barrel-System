var empresaModel = require("../models/empresaModel");
const empresaUtils = require("../utils/empresaMiddleware")

function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrar(req, res) {
  const nome = req.body.nome;
  const cnpj = req.body.cnpj;
  const lograd = req.body.logradouro;
  const num = req.body.numero;
  const comp = req.body.complemento;
  const bairro = req.body.bairro;
  const cidade = req.body.cidade;
  const uf = req.body.uf;
  const cep = req.body.cep;
  const letras = nome.substring(0, 3).toUpperCase()
  const cod = empresaUtils.gerarCodigo(letras);

  empresaModel.cadastarEndereco(lograd, num, comp, bairro, cidade, uf, cep)
  .then((response) => {
    empresaModel.cadastrar(response.insertId, nome, cnpj, cod)
    .then((resposta) => {
      return res.status(201).json({ mensagem: "Empresa cadastrada" });
    });
  })
  .catch((e) => {
    if(e.code === 'ER_DUP_ENTRY') return res.status(409).json({ erro: e.sqlMessage });
    return res.status(500).json({ erro: e.sqlMessage });
  });
};

module.exports = {
  listar,
  cadastrar
};
