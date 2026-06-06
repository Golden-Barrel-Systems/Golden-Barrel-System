const selectCamaras = document.getElementById("selectCamaras");
const selectSensores = document.getElementById("selectSensores");

let sensor_nome = "";
let camara_nome = "";
let sensor_posicao = "";

let temperaturaIdeal = 0;
let umidadeIdeal = 0;

let tempIdealMin = temperaturaIdeal - 1; // 17
let tempIdealMax = temperaturaIdeal + 1; // 19

let umiIdealMin = umidadeIdeal - 1; // 64
let umiIdealMax = umidadeIdeal + 1; // 66

let tempAlertaMin = temperaturaIdeal - 3; // 15
let tempAlertaMax = temperaturaIdeal + 3; // 21

let umiAlertaMin = umidadeIdeal - 3; // 62
let umiAlertaMax = umidadeIdeal + 3; // 68

const GlinhaT = document.getElementById("graficLineT");
const GlinhaU = document.getElementById("graficLineU");

let graficoTemperatura = null;
let graficoUmidade = null;

function carregarDados() {
  let camaraSelecionada = Number(selectCamaras.value);
  let sensorSelecionado = Number(selectSensores.value);

  let horarios = [];
  let temperaturas = [];
  let umidades = [];
  let qtdSensores = 2;

  if (camaraSelecionada == 1 && sensorSelecionado == 1) {
    let sensor1_horarios = [
      "08:00",
      "08:15",
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
    ];

    let sensor1_temperatura = [
      17, 17, 17, 18, 18, 18, 18, 18, 19, 19, 19, 18, 18, 18, 18, 18, 18,
    ];
    let sensor1_umidade = [
      66, 66, 65, 65, 65, 65, 64, 64, 64, 64, 64, 65, 65, 65, 65, 65, 65,
    ];

    sensor_nome = "Sensor 1";
    camara_nome = "Câmara 1";
    sensor_posicao = "Frente";

    horarios = sensor1_horarios;
    temperaturas = sensor1_temperatura;
    umidades = sensor1_umidade;

    listaAlertas.innerHTML = `


        `;
  } else if (camaraSelecionada == 1 && sensorSelecionado == 2) {
    let sensor2_horarios = [
      "08:00",
      "08:15",
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
    ];
    let sensor2_temperatura = [
      17, 17, 18, 18, 18, 18, 18, 20, 19, 18, 18, 18, 18, 18, 18, 18, 18,
    ];
    let sensor2_umidade = [
      65, 65, 65, 65, 64, 64, 64, 63, 64, 64, 65, 65, 65, 65, 65, 65, 65,
    ];

    sensor_nome = "Sensor 2";
    camara_nome = "Câmara 1";
    sensor_posicao = "Centro";

    horarios = sensor2_horarios;
    temperaturas = sensor2_temperatura;
    umidades = sensor2_umidade;

    listaAlertas.innerHTML = `

            <div class="alertasAlerta">
            <h3>Temperatura em Alerta</h3>
            <p>Sensor 2 registrou 20°C às 09:45 (Alerta: 15°C até 17°C ou 19°C até 21°C).</p>
            </div>

            <div class="alertasAlerta">
            <h3>Umidade em Alerta</h3>
            <p>Sensor 2 registrou 63% às 09:45 (Alerta: 62% até 64% ou 66% até 68%).</p>
            </div>

    `;
  } else if (camaraSelecionada == 2 && sensorSelecionado == 1) {
    let sensor1_horarios = [
      "08:00",
      "08:15",
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
    ];

    let sensor1_temperatura = [
      18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26,
    ];
    let sensor1_umidade = [
      66, 65, 65, 64, 64, 63, 63, 62, 62, 61, 61, 60, 60, 59, 59, 58, 58,
    ];

    sensor_nome = "Sensor 1";
    camara_nome = "Câmara 2";
    sensor_posicao = "Frente";

    horarios = sensor1_horarios;
    temperaturas = sensor1_temperatura;
    umidades = sensor1_umidade;

    listaAlertas.innerHTML = `
           
            <div class="alertasAvisos">
            <h3>Temperatura Crítica</h3>
            <p>Sensor 1 registrou 26°C às 12:00 (Crítico: abaixo de 15°C ou acima de 21°C).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Umidade Crítica</h3>
            <p>Sensor 1 registrou 58% às 12:00 (Crítico: abaixo de 62% ou acima de 68%).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Temperatura Crítica</h3>
            <p>Sensor 1 registrou 25°C às 11:45 (Crítico: abaixo de 15°C ou acima de 21°C).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Umidade Crítica</h3>
            <p>Sensor 1 registrou 58% às 11:45 (Crítico: abaixo de 62% ou acima de 68%).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Temperatura Crítica</h3>
            <p>Sensor 1 registrou 24°C às 11:30 (Crítico: abaixo de 15°C ou acima de 21°C).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Umidade Crítica</h3>
            <p>Sensor 1 registrou 59% às 11:30 (Crítico: abaixo de 62% ou acima de 68%).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Temperatura Crítica</h3>
            <p>Sensor 1 registrou 23°C às 11:15 (Crítico: abaixo de 15°C ou acima de 21°C).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Umidade Crítica</h3>
            <p>Sensor 1 registrou 60% às 11:15 (Crítico: abaixo de 62% ou acima de 68%).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Temperatura Crítica</h3>
            <p>Sensor 1 registrou 23°C às 11:00 (Crítico: abaixo de 15°C ou acima de 21°C).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Umidade Crítica</h3>
            <p>Sensor 1 registrou 61% às 11:00 (Crítico: abaixo de 62% ou acima de 68%).</p>
            </div>

            `;
  } else if (camaraSelecionada == 2 && sensorSelecionado == 2) {
    let sensor2_horarios = [
      "08:00",
      "08:15",
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
    ];
    let sensor2_temperatura = [
      18, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25,
    ];
    let sensor2_umidade = [
      65, 65, 64, 64, 63, 63, 62, 62, 61, 61, 60, 60, 59, 59, 58, 58, 57,
    ];

    sensor_nome = "Sensor 2";
    camara_nome = "Câmara 2";
    sensor_posicao = "Fundo";

    horarios = sensor2_horarios;
    temperaturas = sensor2_temperatura;
    umidades = sensor2_umidade;

    listaAlertas.innerHTML = `
            <div class="alertasAvisos">
            <h3>Temperatura Crítica</h3>
            <p>Sensor 2 registrou 25°C às 12:00 (Crítico: abaixo de 15°C ou acima de 21°C).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Umidade Crítica</h3>
            <p>Sensor 2 registrou 57% às 12:00 (Crítico: abaixo de 62% ou acima de 68%).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Temperatura Crítica</h3>
            <p>Sensor 2 registrou 25°C às 11:45 (Crítico: abaixo de 15°C ou acima de 21°C).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Umidade Crítica</h3>
            <p>Sensor 2 registrou 58% às 11:45 (Crítico: abaixo de 62% ou acima de 68%).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Temperatura Crítica</h3>
            <p>Sensor 2 registrou 24°C às 11:30 (Crítico: abaixo de 15°C ou acima de 21°C).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Umidade Crítica</h3>
            <p>Sensor 2 registrou 59% às 11:30 (Crítico: abaixo de 62% ou acima de 68%).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Temperatura Crítica</h3>
            <p>Sensor 2 registrou 23°C às 11:15 (Crítico: abaixo de 15°C ou acima de 21°C).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Umidade Crítica</h3>
            <p>Sensor 2 registrou 60% às 11:15 (Crítico: abaixo de 62% ou acima de 68%).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Temperatura Crítica</h3>
            <p>Sensor 2 registrou 23°C às 11:00 (Crítico: abaixo de 15°C ou acima de 21°C).</p>
            </div>

            <div class="alertasAvisos">
            <h3>Umidade Crítica</h3>
            <p>Sensor 2 registrou 61% às 11:00 (Crítico: abaixo de 62% ou acima de 68%).</p>
            </div>

            `;
  }

  let ultimaTemperatura = temperaturas[temperaturas.length - 1];
  let ultimaUmidade = umidades[umidades.length - 1];

  const statusTemperatura = document.getElementById("statusTemperatura");
  const statusUmidade = document.getElementById("statusUmidade");
  const statusPosicaoSensor = document.getElementById("statusPosicaoSensor");
  const statusQtdSensores = document.getElementById("statusQtdSensores");
  const statusStatusSensor = document.getElementById("statusStatusSensor");

  document.getElementById("kpiTemperatura").innerHTML =
    `${ultimaTemperatura} °C`;
  document.getElementById("kpiUmidade").innerHTML = `${ultimaUmidade} %`;
  document.getElementById("kpiPosicaoSensor").innerHTML = sensor_posicao;
  document.getElementById("kpiQtdSensores").innerHTML = qtdSensores;
  document.getElementById("resumoPainel").innerHTML =
    `${camara_nome} · ${sensor_nome} - ${sensor_posicao}`;

  if (
    ultimaTemperatura < tempAlertaMin ||
    ultimaTemperatura > tempAlertaMax || // SENSOR 1 - temperatura critica
    ultimaUmidade < umiAlertaMin ||
    ultimaUmidade > umiAlertaMax || // SENSOR 1 - umidade critica
    ultimaTemperatura < tempAlertaMin ||
    ultimaTemperatura > tempAlertaMax || // SENSOR 2 - temperatura critica
    ultimaUmidade < umiAlertaMin ||
    ultimaUmidade > umiAlertaMax
  ) {
    // SENSOR 2 - umidade critica
    document.getElementById("kpiStatusCamara").innerHTML =
      `<span style="color: red"><b>Crítico</b></span>`; // algum sensor critico = câmara critica
  } else if (
    ultimaTemperatura < tempIdealMin ||
    ultimaTemperatura > tempIdealMax || // SENSOR 1 - temperatura alerta
    ultimaUmidade < umiIdealMin ||
    ultimaUmidade > umiIdealMax || // SENSOR 1 - umidade alerta
    ultimaTemperatura < tempIdealMin ||
    ultimaTemperatura > tempIdealMax || // SENSOR 2 - temperatura alerta
    ultimaUmidade < umiIdealMin ||
    ultimaUmidade > umiIdealMax
  ) {
    // SENSOR 2 - umidade alerta
    document.getElementById("kpiStatusCamara").innerHTML =
      `<span style="color: orange"><b>Alerta</b></span>`; // algum sensor alerta = câmara alerta
  } else {
    // TDS os sensores ideais = câmara ideal
    document.getElementById("kpiStatusCamara").innerHTML =
      `<span style="color: green"><b>Ideal</b></span>`;
  }

  if (
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

  if (graficoTemperatura != null) {
    graficoTemperatura.destroy();
  }

  if (graficoUmidade != null) {
    graficoUmidade.destroy();
  }

  graficoTemperatura = new Chart(GlinhaT, {
    type: "line",
    data: {
      labels: horarios,
      datasets: [
        {
          label: "Temperatura",
          data: temperaturas,
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

  graficoUmidade = new Chart(GlinhaU, {
    type: "line",
    data: {
      labels: horarios,
      datasets: [
        {
          label: "Umidade",
          data: umidades,
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
}

selectCamaras.addEventListener("change", carregarDados);
selectSensores.addEventListener("change", carregarDados);

// Buscando e adicionando camaras e sensores direto do banco

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

async function carregarselects() {
  try {
    await popularSelectCamara();
    console.log("resposta camara:", selectCamaras.value);

    await popularSelectSensor();
    console.log("resposta sensor:", selectSensores.value);

    await coletarDados();
  } catch (err) {
    console.log(err);
  }
}
carregarselects();
carregarDados();

async function coletarDados() {
  const sensores = await fetch(`/camara/listarSensores/${selectCamaras.value}`);

  const sensoresJson = await sensores.json();

  temperaturaIdeal = sensoresJson[0].temperatura_ideal;
  umidadeIdeal = sensoresJson[0].umidade_ideal;
}

selectCamaras.addEventListener("change", coletarDados);
selectCamaras.addEventListener("change", view);

function view() {
  console.log(temperaturaIdeal);
  console.log(umidadeIdeal);
}
