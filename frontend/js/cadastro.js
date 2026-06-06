function voltar() {
  window.location = "../index.html";
}

function CPF() {
  let cpf = input_CPF.value;

  if (cpf.length == 4) {
    if (cpf.substring(3, 4) != ".") {
      input_CPF.value = cpf.substring(0, 3) + "." + cpf.substring(3);
    }
  }

  if (cpf.length == 8) {
    if (cpf.substring(7, 8) != ".") {
      input_CPF.value = cpf.substring(0, 7) + "." + cpf.substring(7);
    }
  }

  if (cpf.length == 12) {
    if (cpf.substring(11, 12) != "-") {
      input_CPF.value = cpf.substring(0, 11) + "-" + cpf.substring(11);
    }
  }
}

let validaçãoS = ``;
let mensagem = ``;
function senhaa() {
  let contadorSenha = 0;

  let senha = input_senha.value;

  let temNumero = false;

  for (let i = 0; i < senha.length; i++) {
    if (senha[i] >= "0" && senha[i] <= "9") {
      temNumero = true;
    }
  }

  if (senha == senha.toLowerCase()) {
  } else if (senha != senha.toLowerCase()) {
    contadorSenha++;
  }
  if (senha == senha.toUpperCase()) {
  } else if (senha != senha.toUpperCase()) {
    contadorSenha++;
  }
  if (temNumero != true) {
  } else if (temNumero == true) {
    contadorSenha++;
  }
  if (senha.length < 8) {
  } else if (senha.length >= 8) {
    contadorSenha++;
  }

  if (contadorSenha == 4) {
    validaçãoS = "Forte";
    mensagem = `<span style= "color: green">*Senha forte</span>`;
  } else if (contadorSenha >= 2) {
    validaçãoS = "Média";
    mensagem = `<span style= "color: orange">*Senha média</span>`;
  } else if (contadorSenha == 1) {
    mensagem = `<span style= "color: red">*Senha fraca</span>`;
  } else if (contadorSenha == 0) {
    mensagem = `<span style= "color: red">*Senha insegura</span>`;
  }
  mensagemsenha.innerHTML = mensagem;
}

function cadastrar() {
  let nome = input_nome.value;
  let cpf = input_CPF.value;
  let email = input_email.value;
  let senha = input_senha.value;
  let confirmaçãoSenha = input_confi_senha.value;
  let codigo = input_codigo.value;
  let codigoEhValido = false;
  let contador = 0;

  for (let i = 0; i < listaEmpresasCadastradas.length; i++) {
    if (codigo == listaEmpresasCadastradas[i].codigo) {
      codigoEhValido = true;
      break;
    }
  }

  if (nome.length < 3) {
    mensagemnome.innerHTML = `<span style= "color: red">*Insira um nome válido</span>`;
  } else {
    contador++;
    mensagemnome.innerHTML = ``;
  }
  if (!email.includes("@") || !email.includes(".") || email.endsWith("@")) {
    mensagememail.innerHTML = `<span style= "color: red">*Insira um email válido</span>`;
  } else {
    contador++;
    mensagememail.innerHTML = ``;
  }
  if (validaçãoS != "Forte") {
    mensagemsenha.innerHTML = `<span style= "color: red">*Necessita de uma senha forte</span>`;
  } else {
    contador++;
    mensagemsenha.innerHTML = mensagem;
  }

  if (senha != confirmaçãoSenha) {
    mensagemconfirm.innerHTML = `<span style= "color: red">*Senha incorreta</span>`;
  } else {
    contador++;
    mensagemconfirm.innerHTML = ``;
  }
  if (cpf.length != 14) {
    mensagemcpf.innerHTML = `<span style= "color: red">*CPF inválido</span>`;
  } else {
    contador++;
    mensagemcpf.innerHTML = ``;
  }
  if (!codigoEhValido) {
    mensagemcod.innerHTML = `<span style= "color: red">*Código incorreto</span>`;
  } else {
    contador++;
    mensagemcod.innerHTML = ``;
  }


  if (contador == 6) {
    fetch("/usuarios/cadastrar", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        codigo_empresaServer: codigo,
        senhaServer: senha,
        tipoUsuarioServer: "funcionario",
        cpfServer: cpf.replace(/\D/g, ""),
        emailServer: email,
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
          alert("Cadastro realizado com sucesso!");

          window.location = "login.html";
        } else {
          throw "Houve um erro ao tentar realizar o cadastro!";
        }
      })

      .catch(function (erro) {
        console.log(`#ERRO: ${erro}`);
      });
  }
}

var listaEmpresasCadastradas = [];

listar();
console.log(listaEmpresasCadastradas);

function listar() {
  fetch("/empresas/listar", {
    method: "GET",
  })
    .then(function (resposta) {
      resposta.json().then((empresas) => {
        empresas.forEach((empresa) => {
          listaEmpresasCadastradas.push(empresa);
        });
      });
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });
}
