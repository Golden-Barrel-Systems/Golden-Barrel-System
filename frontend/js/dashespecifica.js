const selectCamaras = document.getElementById("selectCamaras");
const selectSensores = document.getElementById("selectSensores");

let temperaturaIdeal;
let umidadeIdeal;

let tempIdealMin;
let tempIdealMax;

let umiIdealMin;
let umiIdealMax;

let tempAlertaMin;
let tempAlertaMax;

let umiAlertaMin;
let umiAlertaMax;

const GlinhaT = document.getElementById("graficLineT");
const GlinhaU = document.getElementById("graficLineU");

let graficoTemperatura = null;
let graficoUmidade = null;

// pegar dados do select da camara
async function popularSelectCamara() {
  const camaras = await fetch(
    `/camara/listar/${sessionStorage.codigo_empresa}`,
  );

  const jsonCameras = await camaras.json();

  selectCamaras.innerHTML = "";

  for (let i = 0; i < jsonCameras.length; i++) {
    selectCamaras.innerHTML += `
     <option value="${jsonCameras[i].id_camara}">${jsonCameras[i].camara}</option> `;
  }
}

// pegar dados do select do sensor
async function popularSelectSensor() {
  const sensores = await fetch(`/camara/listarSensores/${selectCamaras.value}`);

  const sensoresJson = await sensores.json();

  selectSensores.innerHTML = "";

  for (let i = 0; i < sensoresJson.length; i++) {
    console.log("Dados", sensoresJson);
    selectSensores.innerHTML += `
     <option value="${sensoresJson[i].id_sensor}"> Sensor ${sensoresJson[i].id_sensor} - ${sensoresJson[i].posicionamento}</option> `;
  }
}

// carregar os selects do sensor e camara
async function carregarselects() {
  try {
    await popularSelectCamara();
    console.log("resposta camara:", selectCamaras.value);

    await popularSelectSensor();
    console.log("resposta sensor:", selectSensores.value);

    await coletarDados();

    await buscarDadosGrafico();
  } catch (err) {
    console.log(err);
  }
}
carregarselects();

// coletar dados para kpis
async function coletarDados() {
  let sensorNome = "";
  let camaraNome = "";
  let sensorPosicao = "";

  //dados camara
  const camaras = await fetch(
    `/camara/listar/${sessionStorage.codigo_empresa}`,
  );
  const jsonCameras = await camaras.json();

  // dados sensores
  const sensores = await fetch(`/camara/listarSensores/${selectCamaras.value}`);
  const sensoresJson = await sensores.json();

  let cont = 0;

  for (let i = 0; i < sensoresJson.length; i++) {
    cont++;
    if (selectSensores.value == sensoresJson[i].id_sensor) {
      sensorNome = `Sensor ${sensoresJson[i].id_sensor}`;
      sensorPosicao = sensoresJson[i].posicionamento;

      for (let j = 0; j < jsonCameras.length; j++) {
        if (jsonCameras[j].id_camara == selectCamaras.value) {
          camaraNome = jsonCameras[j].camara;
          break;
        }
      }
    }
  }

  temperaturaIdeal = Number(sensoresJson[0].temperatura_ideal);
  umidadeIdeal = Number(sensoresJson[0].umidade_ideal);

  tempIdealMin = temperaturaIdeal - 1;
  tempIdealMax = temperaturaIdeal + 1;

  umiIdealMin = umidadeIdeal - 1;
  umiIdealMax = umidadeIdeal + 1;

  tempAlertaMin = temperaturaIdeal - 3;
  tempAlertaMax = temperaturaIdeal + 3;

  umiAlertaMin = umidadeIdeal - 3;
  umiAlertaMax = umidadeIdeal + 3;

  // painel de resumo
  document.getElementById("resumoPainel").innerHTML =
    `${camaraNome} · ${sensorNome} - ${sensorPosicao}`;

  document.getElementById("kpiPosicaoSensor").innerHTML = sensorPosicao;
  document.getElementById("kpiQtdSensores").innerHTML = cont;
}

// função para utilizar dados dos graficos
async function buscarDadosGrafico() {
  const resposta = await fetch(
    `/sensor/ultimasMedicoes/${selectSensores.value}`,
  );

  const dados = await resposta.json();

  console.log(dados);

  // temperatura
  let labelsTemp = [];
  let dadosTemp = [];

  //umidade
  let labelsUmi = [];
  let dadosUmi = [];

  // separação dados do fetch das mediçoes
  for (let i = dados.length - 1; i >= 0; i--) {
    let hora = dados[i].data_hora.substring(11, 16); // separar a hora do grafico em padrão ex: 11:00

    if (dados[i].tipo == "temperatura") {
      labelsTemp.push(hora);

      dadosTemp.push(Number(dados[i].valor));
    }

    if (dados[i].tipo == "umidade") {
      labelsUmi.push(hora);

      dadosUmi.push(Number(dados[i].valor));
    }
  }

  console.log("Temperatura");
  console.log(temperaturaIdeal);
  console.log(labelsTemp);
  console.log(dadosTemp);

  console.log("Umidade");
  console.log(umidadeIdeal);
  console.log(labelsUmi);
  console.log(dadosUmi);

  let ultimaTemperatura = dadosTemp[dadosTemp.length - 1];
  let ultimaUmidade = dadosUmi[dadosUmi.length - 1];

  // grafico de temperatura

  if (graficoTemperatura != null) {
    graficoTemperatura.destroy();
  }

  graficoTemperatura = new Chart(GlinhaT, {
    type: "line",
    data: {
      labels: labelsTemp,
      datasets: [
        {
          label: "Temperatura",
          data: dadosTemp,
          borderWidth: 2,
          borderColor: "red",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  // grafico de umidade

  if (graficoUmidade != null) {
    graficoUmidade.destroy();
  }

  graficoUmidade = new Chart(GlinhaU, {
    type: "line",
    data: {
      labels: labelsUmi,
      datasets: [
        {
          label: "Umidade",
          data: dadosUmi,
          borderWidth: 2,
          borderColor: "blue",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  const statusTemperatura = document.getElementById("statusTemperatura");
  const statusUmidade = document.getElementById("statusUmidade");
  const statusPosicaoSensor = document.getElementById("statusPosicaoSensor");
  const statusQtdSensores = document.getElementById("statusQtdSensores");
  const statusStatusSensor = document.getElementById("statusStatusSensor");

  // kpis de tem e umi
  document.getElementById("kpiTemperatura").innerHTML =
    `${ultimaTemperatura} °C`;
  document.getElementById("kpiUmidade").innerHTML = `${ultimaUmidade} %`;

  document.getElementById("umidadessidea").innerHTML =
    ` Umidade Ideal é entre ${umiIdealMin}% e ${umiIdealMax}% `;

  document.getElementById("tempsidea").innerHTML =
    ` Temperatura Ideal é entre ${tempIdealMin}°C e ${tempIdealMax}°C `;

  // verificações para verificar status da camara
  if (
    ultimaTemperatura < tempAlertaMin ||
    ultimaTemperatura > tempAlertaMax ||
    ultimaUmidade < umiAlertaMin ||
    ultimaUmidade > umiAlertaMax ||
    ultimaTemperatura < tempAlertaMin ||
    ultimaTemperatura > tempAlertaMax ||
    ultimaUmidade < umiAlertaMin ||
    ultimaUmidade > umiAlertaMax
  ) {
    document.getElementById("kpiStatusCamara").innerHTML =
      `<span style="color: red"><b>Crítico</b></span>`; // algum sensor critico = câmara critica
  } else if (
    ultimaTemperatura < tempIdealMin ||
    ultimaTemperatura > tempIdealMax ||
    ultimaUmidade < umiIdealMin ||
    ultimaUmidade > umiIdealMax ||
    ultimaTemperatura < tempIdealMin ||
    ultimaTemperatura > tempIdealMax ||
    ultimaUmidade < umiIdealMin ||
    ultimaUmidade > umiIdealMax
  ) {
    document.getElementById("kpiStatusCamara").innerHTML =
      `<span style="color: orange"><b>Alerta</b></span>`; // algum sensor alerta = câmara alerta
  } else {
    // TDS os sensores ideais = câmara ideal
    document.getElementById("kpiStatusCamara").innerHTML =
      `<span style="color: green"><b>Ideal</b></span>`;
  }

  if (
    // vericar status de temp/umi atual
    ultimaTemperatura >= tempIdealMin &&
    ultimaTemperatura <= tempIdealMax &&
    ultimaUmidade >= umiIdealMin &&
    ultimaUmidade <= umiIdealMax
  ) {
    statusTemperatura.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
    statusTemperatura.style.color = "White";
    statusUmidade.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
    statusUmidade.style.color = "White";
  } else if (
    ultimaTemperatura < tempAlertaMin ||
    ultimaTemperatura > tempAlertaMax ||
    ultimaUmidade < umiAlertaMin ||
    ultimaUmidade > umiAlertaMax
  ) {
    statusTemperatura.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
    statusTemperatura.style.color = "White";
    statusUmidade.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
    statusUmidade.style.color = "White";
  } else {
    statusTemperatura.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
    statusUmidade.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
    statusTemperatura.style.color = "White";
    statusUmidade.style.color = "White";
  }
}

selectCamaras.addEventListener("change", async function () {
  await popularSelectSensor();
  await coletarDados();
  await buscarDadosGrafico();
});

selectSensores.addEventListener("change", async function () {
  await coletarDados();
  await buscarDadosGrafico();
});

window.onload = async function () {
  await carregarselects();
};
