var empresaModel = require("../models/empresaModel");

function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrar(req, res) {
  const nome = req.body.nome;
  const cnpj = req.body.cpnj;
  const lograd = req.body.logradouro;
  const num = req.body.numero;
  const comp = req.body.complemento;
  const bairro = req.body.bairro;
  const cidade = req.body.cidade;
  const uf = req.body.uf;
  const cep = req.body.cep;

  empresaModel.cadastrar(nome, cnpj)
  .then((response) => {
    empresaModel.cadastarEndereco(lograd, nome, comp, bairro, cidade, uf, cep)
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
