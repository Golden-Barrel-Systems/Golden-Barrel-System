import { listarCamaras, pegarDados } from "./sensorfatch.js";

const selectCamaras = document.getElementById('selectCamaras')

const Glinha = document.getElementById('graficLine');
const Gbar = document.getElementById('graficBar');

// async function dados() {
//     const token = localStorage.getItem("token")
//     const data = await listarCamaras(token)

//     return data
// };

// async function popularSelect() {
//     const array = await dados();

//     let mensagem = '';

//     for (let i = 0; i < array.length; i++) {
//         const camara = array[i]
//         mensagem += `
//             <option value="${camara}">Câmara ${i+1}</option>
//         `;
//     }

//     selectCamaras.innerHTML = mensagem
// };

// popularSelect();


function popularSelect() {
    fetch(`/camara/listar/${sessionStorage.codigo_empresa}`, {
        method: "GET"
    })
        .then(res => {
            res.json().then(json => {
                for (let i = 0; i < json.length; i++) {
                    selectCamaras.innerHTML += `
                        <option value="${json[i].id_camara}">${json[i].camara}</option>
                    `
                }
                popularKpis();
            })
        })
        .catch(err => {
            console.log(err);
        })
}

popularSelect();


function popularKpis() {
    fetch(`/camara/listarSensores/${selectCamaras.value}`, {
        method: "GET"
    })
        .then(res => {
            res.json().then(json => {

                for (let i = 0; i < json.length; i++) {

                    fetch(`/sensor/temperaturaAtual/${json[i].id_sensor}`, {
                        method: "GET"
                    }).then(res => {
                        res.json().then(json => {

                            let temperaturaAtual = json[0].valor;
                            let temperaturaIdeal = Number(json[i].temperatura_ideal);

                            let temperaturaCriticoMinimo = temperaturaIdeal - 5;
                            let temperaturaCriticoMaximo = temperaturaIdeal + 5;

                            let color;

                            if (temperaturaAtual >= (temperaturaIdeal - 1) && temperaturaAtual <= (temperaturaIdeal + 1)) {
                                color = 'rgba(0, 128, 0, 0.5)';
                            } else if (temperaturaAtual <= temperaturaCriticoMinimo || temperaturaAtual >= temperaturaCriticoMaximo) {
                                color = 'rgba(255, 0, 0, 0.8)';
                                // registrarAlerta(json[i].id_medicao, "Temperatura acima do ideal", "critico");
                            } else {
                                color = 'rgba(255, 166, 0, 0.69)';
                                // registrarAlerta(json[i].id_medicao, "Temperatura acima do ideal", "medio");
                            }


                            kpis.innerHTML += `
                                <div class="kpi" style="background-color: ${color}">
                                    <h3 style="color: white">SENSOR ${i + 1}</h3>
                                    <center style="color: white">Temperatura Atual</center>
                                    <p id="kpiTemperatura2" style="color: white">${temperaturaAtual}°C</p>
                                    <div class="desc" style="color: white">
                                        Ideal: Entre ${temperaturaIdeal - 1}°C e ${temperaturaIdeal + 1}°C
                                    </div>
                                </div>
                            `

                            buscarAlertas(selectCamaras.value);
                        })
                    }).catch(err => {
                        console.log(err);
                    })

                    fetch(`/sensor/umidadeAtual/${json[i].id_sensor}`, {
                        method: "GET"
                    }).then(res => {
                        res.json().then(json => {

                            let umidadeAtual = json[0].valor;
                            let umidadeIdeal = Number(json[i].umidade_ideal);

                            let umidadeCriticoMinimo = umidadeIdeal - 5;
                            let umidadeCriticoMaximo = umidadeIdeal + 5;

                            let color;

                            if (umidadeAtual >= (umidadeIdeal - 1) && umidadeAtual <= (umidadeIdeal + 1)) {
                                color = 'rgba(0, 128, 0, 0.5)';
                            } else if (umidadeAtual <= umidadeCriticoMinimo || umidadeAtual >= umidadeCriticoMaximo) {
                                color = 'rgba(255, 0, 0, 0.8)';
                                // registrarAlerta(json[i].id_medicao, "Umidade acima do ideal", "critico");
                            } else {
                                color = 'rgba(255, 166, 0, 0.69)';
                                // registrarAlerta(json[i].id_medicao, "Umidade acima do ideal", "medio");
                            }

                            kpis.innerHTML += `
                                <div class="kpi" style="background-color: ${color}">
                                    <h3 style="color: white">SENSOR ${i + 1}</h3>
                                    <center style="color: white">Umidade Atual</center>
                                    <p id="kpiUmidade1" style="color: white">${umidadeAtual}%</p>
                                    <div class="desc" style="color: white">
                                        Ideal: Entre ${Number(json[i].umidade_ideal) - 1}°C e ${Number(json[i].umidade_ideal) + 1}°C
                                    </div>
                                </div>
                             `

                            buscarAlertas(selectCamaras.value);
                        })
                    }).catch(err => {
                        console.log(err);
                    })
                }
            })
        })
        .catch(err => {
            console.log(err);
        })
}

function registrarAlerta(idMedicao, mensagem, peso) {
    fetch("/alerta/registrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idMedicaoServer: idMedicao,
            mensagemServer: mensagem,
            pesoServer: peso,
        }),
    })
        .then(res => {
            buscarAlertas(selectCamaras.value);
        })
        .catch(err => {
            console.log(err);
        })
}

function buscarAlertas(idCamara) {
    fetch(`/alerta/buscar/${idCamara}`, {
        method: "GET"
    }).then(res => {
        res.json().then(json => {
            exibirAlertas(json);
        })
    }).catch(err => {
        console.log(err);
    })
}

function exibirAlertas(alertas) {
    listaAlertas.innerHTML = ``;

    for (let i = 0; i < alertas.length; i++) {


        if (alertas[i].mensagem == 'Umidade acima do ideal' || alertas[i].mensagem == 'Umidade abaixo do ideal') {
            listaAlertas.innerHTML += `
                <div class="alertas${alertas[i].peso}">
                    <h3${alertas[i].mensagem}</h3>
                    <p>Sensor ${alertas[i].numero_serial} registrou ${alertas[i].valor}% de umidade às ${alertas[i].hora}.</p>
                </div>
            `
        } else {
            listaAlertas.innerHTML += `
                <div class="alertas${alertas[i].peso}">
                    <h3${alertas[i].mensagem}</h3>
                    <p>Sensor ${alertas[i].numero_serial} registrou ${alertas[i].valor}°C às ${alertas[i].hora}.</p>
                </div>
            `
        }
    }
}

let graficoTemperatura = null;
let graficoUmidade = null;

let horarios = ["08:00", "08:15", "08:30", "08:45",
    "09:00", "09:15", "09:30", "09:45",
    "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45",
    "12:00"];

let temperatura_ideal = 18;
let umidade_ideal = 65;

let tempIdealMin = temperatura_ideal - 1; // 17
let tempIdealMax = temperatura_ideal + 1; // 19

let umiIdealMin = umidade_ideal - 1; // 64
let umiIdealMax = umidade_ideal + 1; // 66

let tempAlertaMin = temperatura_ideal - 3; // 15
let tempAlertaMax = temperatura_ideal + 3; // 21

let umiAlertaMin = umidade_ideal - 3; // 62
let umiAlertaMax = umidade_ideal + 3; // 68

let sensor1_temperatura = [];
let sensor1_umidade = [];

let sensor2_temperatura = [];
let sensor2_umidade = [];

let ultimaTemperatura1 = '';
let ultimaUmidade1 = '';

let ultimaTemperatura2 = '';
let ultimaUmidade2 = '';

function carregarDados() {

    let camaraSelecionada = Number(selectCamaras.value);

    if (camaraSelecionada == 1) {

        sensor1_temperatura = [17, 17, 17, 18, 18, 18, 18, 18, 19, 19, 19, 18, 18, 18, 18, 18, 18];
        sensor1_umidade = [66, 66, 65, 65, 65, 65, 64, 64, 64, 64, 64, 65, 65, 65, 65, 65, 65];

        sensor2_temperatura = [17, 17, 18, 18, 18, 18, 18, 19, 19, 18, 18, 18, 18, 18, 18, 18, 18];
        sensor2_umidade = [65, 65, 65, 65, 64, 64, 64, 64, 64, 64, 65, 65, 65, 65, 65, 65, 65];

        ultimaTemperatura1 = sensor1_temperatura[sensor1_temperatura.length - 1];
        ultimaUmidade1 = sensor1_umidade[sensor1_umidade.length - 1];

        ultimaTemperatura2 = sensor2_temperatura[sensor2_temperatura.length - 1];
        ultimaUmidade2 = sensor2_umidade[sensor2_umidade.length - 1];

        const statusTemperatura1 = document.getElementById("statusTemperatura1");
        const statusUmidade1 = document.getElementById("statusUmidade1");
        const statusTemperatura2 = document.getElementById("statusTemperatura2");
        const statusUmidade2 = document.getElementById("statusUmidade2");
        const statusPosicaoSensor = document.getElementById("statusPosicaoSensor");
        const statusQtdSensores = document.getElementById("statusQtdSensores");
        const statusStatusSensor = document.getElementById("statusStatusSensor");

        document.getElementById("kpiTemperatura1").innerHTML = `${ultimaTemperatura1} °C`;
        document.getElementById("kpiUmidade1").innerHTML = `${ultimaUmidade1} %`;
        document.getElementById("resumoPainel").innerHTML = `Câmara ${camaraSelecionada}`;
        document.getElementById("kpiTemperatura2").innerHTML = `${ultimaTemperatura2} °C`;
        document.getElementById("kpiUmidade2").innerHTML = `${ultimaUmidade2} %`;

        if ((ultimaTemperatura1 < tempAlertaMin || ultimaTemperatura1 > tempAlertaMax) ||  // SENSOR 1 - temperatura critica
            (ultimaUmidade1 < umiAlertaMin || ultimaUmidade1 > umiAlertaMax) ||             // SENSOR 1 - umidade critica
            (ultimaTemperatura2 < tempAlertaMin || ultimaTemperatura2 > tempAlertaMax) ||   // SENSOR 2 - temperatura critica
            (ultimaUmidade2 < umiAlertaMin || ultimaUmidade2 > umiAlertaMax)) {             // SENSOR 2 - umidade critica
            document.getElementById("kpiStatusCamara").innerHTML = `<span style="color: red"><b>Crítico</b></span>`;    // algum sensor critico = câmara critica

        } else if ((ultimaTemperatura1 < tempIdealMin || ultimaTemperatura1 > tempIdealMax) ||  // SENSOR 1 - temperatura alerta
            (ultimaUmidade1 < umiIdealMin || ultimaUmidade1 > umiIdealMax) ||                   // SENSOR 1 - umidade alerta
            (ultimaTemperatura2 < tempIdealMin || ultimaTemperatura2 > tempIdealMax) ||         // SENSOR 2 - temperatura alerta
            (ultimaUmidade2 < umiIdealMin || ultimaUmidade2 > umiIdealMax)) {                  // SENSOR 2 - umidade alerta
            document.getElementById("kpiStatusCamara").innerHTML = `<span style="color: orange"><b>Alerta</b></span>`;  // algum sensor alerta = câmara alerta

        } else { // TDS os sensores ideais = câmara ideal
            document.getElementById("kpiStatusCamara").innerHTML = `<span style="color: green"><b>Ideal</b></span>`;
        }

        if (ultimaTemperatura1 > tempAlertaMax || ultimaTemperatura1 < tempAlertaMin) {
            statusTemperatura1.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        } else if (ultimaTemperatura1 > tempIdealMax || ultimaTemperatura1 < tempIdealMin) {
            statusTemperatura1.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
        } else {
            statusTemperatura1.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
        }

        if (ultimaUmidade1 > umiAlertaMax || ultimaUmidade1 < umiAlertaMin) {
            statusUmidade1.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        } else if (ultimaUmidade1 > umiIdealMax || ultimaUmidade1 < umiIdealMin) {
            statusUmidade1.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
        } else {
            statusUmidade1.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
        }

        if (ultimaTemperatura2 > tempAlertaMax || ultimaTemperatura2 < tempAlertaMin) {
            statusTemperatura2.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        } else if (ultimaTemperatura2 > tempIdealMax || ultimaTemperatura2 < tempIdealMin) {
            statusTemperatura2.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
        } else {
            statusTemperatura2.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
        }

        if (ultimaUmidade2 > umiAlertaMax || ultimaUmidade2 < umiAlertaMin) {
            statusUmidade2.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        } else if (ultimaUmidade2 > umiIdealMax || ultimaUmidade2 < umiIdealMin) {
            statusUmidade2.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
        } else {
            statusUmidade2.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
        }


        listaAlertas.innerHTML = `

            <div class="alertasAlerta">
            <h3>Temperatura em Alerta</h3>
            <p>Sensor 2 registrou 20°C às 09:45 (Alerta: 15°C até 17°C ou 19°C até 21°C).</p>
            </div>

            <div class="alertasAlerta">
            <h3>Umidade em Alerta</h3>
            <p>Sensor 2 registrou 63% às 09:45 (Alerta: 62% até 64% ou 66% até 68%).</p>
            </div>
     
     `
    } else if (camaraSelecionada == 2) {

        sensor1_temperatura = [18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26];
        sensor1_umidade = [66, 65, 65, 64, 64, 63, 63, 62, 62, 61, 61, 60, 60, 59, 59, 58, 58];

        sensor2_temperatura = [18, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25];
        sensor2_umidade = [65, 65, 64, 64, 63, 63, 62, 62, 61, 61, 60, 60, 59, 59, 58, 58, 57];

        ultimaTemperatura1 = sensor1_temperatura[sensor1_temperatura.length - 1];
        ultimaUmidade1 = sensor1_umidade[sensor1_umidade.length - 1];

        ultimaTemperatura2 = sensor2_temperatura[sensor2_temperatura.length - 1];
        ultimaUmidade2 = sensor2_umidade[sensor2_umidade.length - 1];

        const statusTemperatura1 = document.getElementById("statusTemperatura1");
        const statusUmidade1 = document.getElementById("statusUmidade1");
        const statusTemperatura2 = document.getElementById("statusTemperatura2");
        const statusUmidade2 = document.getElementById("statusUmidade2");
        const statusPosicaoSensor = document.getElementById("statusPosicaoSensor");
        const statusQtdSensores = document.getElementById("statusQtdSensores");
        const statusStatusSensor = document.getElementById("statusStatusSensor");

        document.getElementById("kpiTemperatura1").innerHTML = `${ultimaTemperatura1} °C`;
        document.getElementById("kpiUmidade1").innerHTML = `${ultimaUmidade1} %`;
        document.getElementById("resumoPainel").innerHTML = `Câmara ${camaraSelecionada}`;
        document.getElementById("kpiTemperatura2").innerHTML = `${ultimaTemperatura2} °C`;
        document.getElementById("kpiUmidade2").innerHTML = `${ultimaUmidade2} %`;

        if ((ultimaTemperatura1 < tempAlertaMin || ultimaTemperatura1 > tempAlertaMax) ||  // SENSOR 1 - temperatura critica
            (ultimaUmidade1 < umiAlertaMin || ultimaUmidade1 > umiAlertaMax) ||             // SENSOR 1 - umidade critica
            (ultimaTemperatura2 < tempAlertaMin || ultimaTemperatura2 > tempAlertaMax) ||   // SENSOR 2 - temperatura critica
            (ultimaUmidade2 < umiAlertaMin || ultimaUmidade2 > umiAlertaMax)) {             // SENSOR 2 - umidade critica
            document.getElementById("kpiStatusCamara").innerHTML = `<span style="color: red"><b>Crítico</b></span>`;    // algum sensor critico = câmara critica

        } else if ((ultimaTemperatura1 < tempIdealMin || ultimaTemperatura1 > tempIdealMax) ||  // SENSOR 1 - temperatura alerta
            (ultimaUmidade1 < umiIdealMin || ultimaUmidade1 > umiIdealMax) ||                   // SENSOR 1 - umidade alerta
            (ultimaTemperatura2 < tempIdealMin || ultimaTemperatura2 > tempIdealMax) ||         // SENSOR 2 - temperatura alerta
            (ultimaUmidade2 < umiIdealMin || ultimaUmidade2 > umiIdealMax)) {                  // SENSOR 2 - umidade alerta
            document.getElementById("kpiStatusCamara").innerHTML = `<span style="color: orange"><b>Alerta</b></span>`;  // algum sensor alerta = câmara alerta

        } else { // TDS os sensores ideais = câmara ideal
            document.getElementById("kpiStatusCamara").innerHTML = `<span style="color: green"><b>Ideal</b></span>`;
        }

        if (ultimaTemperatura1 > tempAlertaMax || ultimaTemperatura1 < tempAlertaMin) {
            statusTemperatura1.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        } else if (ultimaTemperatura1 > tempIdealMax || ultimaTemperatura1 < tempIdealMin) {
            statusTemperatura1.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
        } else {
            statusTemperatura1.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
        }

        if (ultimaUmidade1 > umiAlertaMax || ultimaUmidade1 < umiAlertaMin) {
            statusUmidade1.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        } else if (ultimaUmidade1 > umiIdealMax || ultimaUmidade1 < umiIdealMin) {
            statusUmidade1.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
        } else {
            statusUmidade1.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
        }

        if (ultimaTemperatura2 > tempAlertaMax || ultimaTemperatura2 < tempAlertaMin) {
            statusTemperatura2.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        } else if (ultimaTemperatura2 > tempIdealMax || ultimaTemperatura2 < tempIdealMin) {
            statusTemperatura2.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
        } else {
            statusTemperatura2.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
        }

        if (ultimaUmidade2 > umiAlertaMax || ultimaUmidade2 < umiAlertaMin) {
            statusUmidade2.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        } else if (ultimaUmidade2 > umiIdealMax || ultimaUmidade2 < umiIdealMin) {
            statusUmidade2.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
        } else {
            statusUmidade2.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
        }


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
     <p>Sensor 2 registrou 25°C às 12:00 (Crítico: abaixo de 15°C ou acima de 21°C).</p>
     </div>

     <div class="alertasAvisos">
     <h3>Umidade Crítica</h3>
     <p>Sensor 2 registrou 57% às 12:00 (Crítico: abaixo de 62% ou acima de 68%).</p>
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
     <p>Sensor 2 registrou 25°C às 11:45 (Crítico: abaixo de 15°C ou acima de 21°C).</p>
     </div>

     <div class="alertasAvisos">
     <h3>Umidade Crítica</h3>
     <p>Sensor 2 registrou 58% às 11:45 (Crítico: abaixo de 62% ou acima de 68%).</p>
     </div>

     <div class="alertasAvisos">
     <h3>Temperatura Crítica</h3>
     <p>Sensor 1 registrou 24°C às 11:30 (Crítico: abaixo de 15°C ou acima de 21°C).</p>
     </div>

     <div class="alertasAvisos">
     <h3>Umidade Crítica</h3>
     <p>Sensor 1 registrou 59% às 11:30 (Crítico: abaixo de 62% ou acima de 68%).</p>
     </div>
     
 `

    }

    if (graficoTemperatura != null) {
        graficoTemperatura.destroy();
    }

    if (graficoUmidade != null) {
        graficoUmidade.destroy();
    }

    graficoUmidade = new Chart(Glinha, {
        type: "line",
        data: {
            labels: horarios,
            datasets: [{
                label: "Sensor 1 - Umidade (%)",
                data: sensor1_umidade,
                borderWidth: 2,
            },
            {
                label: "Sensor 2 - Umidade (%)",
                data: sensor2_umidade,
                borderWidth: 2,

            }

            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    graficoTemperatura = new Chart(Gbar, {
        type: "line",
        data: {
            labels: horarios,
            datasets: [{
                label: "Sensor 1 - Temperatura (°C)",
                data: sensor1_temperatura,
                borderWidth: 2,
            },
            {
                label: "Sensor 2 - Temperatura (°C)",
                data: sensor2_temperatura,
                borderWidth: 2,

            }

            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }


    });

}



// selectCamaras.addEventListener("change", carregarDados);

// carregarDados();
