import { listarCamaras, pegarDados } from "./sensorfatch.js";

const selectCamaras = document.getElementById('selectCamaras')

const Glinha = document.getElementById('graficLine');
const Gbar = document.getElementById('graficBar');

let popularKpisCallId = 0;

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
                selectCamaras.innerHTML = '';
                for (let i = 0; i < json.length; i++) {
                    selectCamaras.innerHTML += `
                        <option value="${json[i].id_camara}">${json[i].camara}</option>
                    `
                }
                console.log("Select preenchido com câmaras:", json);
                carregarDados();
                popularKpis();
            })
        })
        .catch(err => {
            console.log(err);
        })
}

popularSelect();


function insertOrdered(listHorario, listValor, hora, valor) {
    if (listHorario.length === 0) {
        listHorario.push(hora);
        listValor.push(valor);
        return;
    }

    let inserted = false;
    for (let k = 0; k < listHorario.length; k++) {
        if (hora < listHorario[k]) {
            listHorario.splice(k, 0, hora);
            listValor.splice(k, 0, valor);
            inserted = true;
            break;
        }
    }

    if (!inserted) {
        listHorario.push(hora);
        listValor.push(valor);
    }
}

async function popularKpis() {
    const currentCallId = ++popularKpisCallId;
    const kpis = document.getElementById("kpis");
    const kpisAtual = kpis.querySelectorAll(".kpi");
    for (let j = 1; j < kpisAtual.length; j++) {
        kpisAtual[j].remove();
    }

    try {
        const respostaSensores = await fetch(`/camara/listarSensores/${selectCamaras.value}`);
        if (currentCallId !== popularKpisCallId) return;

        const sensores = await respostaSensores.json();
        if (currentCallId !== popularKpisCallId) return;

        for (let i = 0; i < sensores.length; i++) {
            const sensor = sensores[i];
            const sensorIndex = i;
            const tempIdeal = Number(sensor.temperatura_ideal);
            const umiIdeal = Number(sensor.umidade_ideal);

            const [tempRes, umiRes] = await Promise.all([
                fetch(`/sensor/temperaturaAtual/${sensor.id_sensor}`),
                fetch(`/sensor/umidadeAtual/${sensor.id_sensor}`)
            ]);
            if (currentCallId !== popularKpisCallId) return;

            const tempJson = await tempRes.json();
            const umiJson = await umiRes.json();
            if (currentCallId !== popularKpisCallId) return;

            const temperaturaAtual = tempJson[0]?.valor ?? "N/A";
            const umidadeAtual = umiJson[0]?.valor ?? "N/A";

            let tempStatus = "ideal";
            if (temperaturaAtual < tempIdeal - 3 || temperaturaAtual > tempIdeal + 3) {
                tempStatus = "critico";
            } else if (temperaturaAtual < tempIdeal - 1 || temperaturaAtual > tempIdeal + 1) {
                tempStatus = "alerta";
            }

            let umiStatus = "ideal";
            if (umidadeAtual < umiIdeal - 3 || umidadeAtual > umiIdeal + 3) {
                umiStatus = "critico";
            } else if (umidadeAtual < umiIdeal - 1 || umidadeAtual > umiIdeal + 1) {
                umiStatus = "alerta";
            }

            const tempColor = tempStatus === "critico" ? 'rgba(255, 0, 0, 0.8)' : tempStatus === "alerta" ? 'rgba(255, 166, 0, 0.69)' : 'rgba(0, 128, 0, 0.5)';
            const umiColor = umiStatus === "critico" ? 'rgba(255, 0, 0, 0.8)' : umiStatus === "alerta" ? 'rgba(255, 166, 0, 0.69)' : 'rgba(0, 128, 0, 0.5)';

            if (currentCallId !== popularKpisCallId) return;
            kpis.innerHTML += `
                <div class="kpi" style="background-color: ${tempColor}">
                    <h3 style="color: white">SENSOR ${sensorIndex + 1} - TEMPERATURA</h3>
                    <center style="color: white">Temperatura Atual</center>
                    <p style="color: white">${temperaturaAtual}°C</p>
                    <div class="desc" style="color: white">
                        Ideal: Entre ${tempIdeal - 1}°C e ${tempIdeal + 1}°C
                    </div>
                </div>
            `;

            if (currentCallId !== popularKpisCallId) return;
            kpis.innerHTML += `
                <div class="kpi" style="background-color: ${umiColor}">
                    <h3 style="color: white">SENSOR ${sensorIndex + 1} - UMIDADE</h3>
                    <center style="color: white">Umidade Atual</center>
                    <p style="color: white">${umidadeAtual}%</p>
                    <div class="desc" style="color: white">
                        Ideal: Entre ${umiIdeal - 1}% e ${umiIdeal + 1}%
                    </div>
                </div>
            `;
        }

        if (currentCallId !== popularKpisCallId) return;
        buscarAlertas(selectCamaras.value);
    } catch (err) {
        console.log(err);
    }
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

let tempIdealMin = temperatura_ideal - 1;
let tempIdealMax = temperatura_ideal + 1;

let umiIdealMin = umidade_ideal - 1;
let umiIdealMax = umidade_ideal + 1;

let tempAlertaMin = temperatura_ideal - 3;
let tempAlertaMax = temperatura_ideal + 3;

let umiAlertaMin = umidade_ideal - 3;
let umiAlertaMax = umidade_ideal + 3;

let sensor1_temperatura = [];
let sensor1_umidade = [];

let sensor2_temperatura = [];
let sensor2_umidade = [];

let ultimaTemperatura1 = '';
let ultimaUmidade1 = '';

let ultimaTemperatura2 = '';
let ultimaUmidade2 = '';

async function carregarDados() {
    try {
        let camaraSelecionada = Number(selectCamaras.value);

        console.log("selectCamaras.value:", selectCamaras.value);
        console.log("camaraSelecionada (Number):", camaraSelecionada);

        const respostaSensores = await fetch(`/camara/listarSensores/${camaraSelecionada}`, {
            method: "GET"
        });
        const sensores = await respostaSensores.json();

        console.log("Sensores carregados:", sensores);

        sensor1_temperatura = [];
        sensor1_umidade = [];
        sensor2_temperatura = [];
        sensor2_umidade = [];
        horarios = [];

        for (let i = 0; i < sensores.length; i++) {
            const sensor = sensores[i];
            const sensorIndex = i;

            console.log(`Carregando sensor ${i}:`, sensor);

            const respostaMedicoes = await fetch(`/sensor/ultimasMedicoes/${sensor.id_sensor}`, {
                method: "GET"
            });
            const medicoes = await respostaMedicoes.json();

            console.log(`Medições do sensor ${i} (ID: ${sensor.id_sensor}):`, medicoes);

            let labelsTempLocal = [];
            let dadosTempLocal = [];
            let labelsUmiLocal = [];
            let dadosUmiLocal = [];

            for (let j = 0; j < medicoes.length; j++) {
                const medicao = medicoes[j];
                const hora = medicao.data_hora.substring(11, 16);

                if (medicao.tipo === 'temperatura') {
                    insertOrdered(labelsTempLocal, dadosTempLocal, hora, Number(medicao.valor));
                } else if (medicao.tipo === 'umidade') {
                    insertOrdered(labelsUmiLocal, dadosUmiLocal, hora, Number(medicao.valor));
                }
            }

            console.log(`Dados processados sensor ${i}:`, { labelsTempLocal, dadosTempLocal, labelsUmiLocal, dadosUmiLocal });

            if (sensorIndex === 0) {
                sensor1_temperatura = dadosTempLocal;
                sensor1_umidade = dadosUmiLocal;
                horarios = labelsTempLocal;
            } else if (sensorIndex === 1) {
                sensor2_temperatura = dadosTempLocal;
                sensor2_umidade = dadosUmiLocal;
            }
        }

        console.log("Dados carregados:");
        console.log("Sensor 1 Temperatura:", sensor1_temperatura);
        console.log("Sensor 1 Umidade:", sensor1_umidade);
        console.log("Sensor 2 Temperatura:", sensor2_temperatura);
        console.log("Sensor 2 Umidade:", sensor2_umidade);
        console.log("Horários:", horarios);
        renderizarGraficos();
        buscarAlertas(selectCamaras.value);

    } catch (err) {
        console.error("Erro ao carregar dados:", err);
    }
}

function renderizarGraficos() {
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

selectCamaras.addEventListener("change", async () => {
    await carregarDados();
    popularKpis();
});

popularSelect();