import { listarCamaras, pegarDados } from "./sensorfatch.js";

const selectCamaras = document.getElementById('selectCamaras')

const Glinha = document.getElementById('graficLine');
const Gbar = document.getElementById('graficBar');

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
                listarSensoresCamara();

                console.log("Select preenchido com câmaras:", json);
                carregarDados();
            })
        })
        .catch(err => {
            console.log(err);
        })
}

popularSelect();


function listarSensoresCamara() {
    fetch(`/camara/listarSensores/${selectCamaras.value}`, {
        method: "GET"
    })
        .then(res => {
            res.json().then(json => {

                exibirTemperaturaAtual(json);
                exibirUmidadeturaAtual(json);
                totalKpis = json.length * 2;

                setInterval(() => {
                    kpis.innerHTML = ``;
                    kpisProntos = 0;
                    exibirTemperaturaAtual(json);
                    exibirUmidadeturaAtual(json);
                }, 5000);
            })
        })
        .catch(err => {
            console.log(err);
        })
}

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


var situacaoSensores = [];

let kpisProntos = 0;
let totalKpis = 0;

function exibirTemperaturaAtual(sensores) {

    for (let i = 0; i < sensores.length; i++) {

        fetch(`/sensor/temperaturaAtual/${sensores[i].id_sensor}`, {
            method: "GET"
        }).then(res => {
            res.json().then(json => {

                let temperaturaAtual = json[0].valor;
                let temperaturaIdeal = Number(json[i].temperatura_ideal);

                let temperaturaCriticoMinimo = temperaturaIdeal - 5;
                let temperaturaCriticoMaximo = temperaturaIdeal + 5;
                let temperaturaAlertaMinimo = temperaturaIdeal - 4;

                let color;

                if (temperaturaAtual >= (temperaturaIdeal - 1) && temperaturaAtual <= (temperaturaIdeal + 1)) {

                    color = 'rgba(0, 128, 0, 0.5)';

                } else if (temperaturaAtual <= temperaturaCriticoMinimo) {

                    color = 'rgba(255, 0, 0, 0.8)';

                    situacaoSensores.push("critico");


                    // registrarAlerta(json[i].id_medicao, "temperatura abaixo do ideal", "critico");

                } else if (temperaturaAtual >= temperaturaCriticoMaximo) {

                    color = 'rgba(255, 0, 0, 0.8)';

                    situacaoSensores.push("critico");

                    // registrarAlerta(json[i].id_medicao, "temperatura acima do ideal", "critico");

                } else if (temperaturaAtual <= temperaturaAlertaMinimo) {

                    color = 'rgba(255, 166, 0, 0.69)';

                    situacaoSensores.push("alerta");

                    // registrarAlerta(json[i].id_medicao, "temperatura abaixo do ideal", "medio");

                } else {

                    color = 'rgba(255, 166, 0, 0.69)';

                    situacaoSensores.push("alerta");

                    // registrarAlerta(json[i].id_medicao, "temperatura acima do ideal", "medio");

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

                kpisProntos++;

                console.log(kpisProntos, totalKpis)

                if (kpisProntos == totalKpis) {
                    validarStatusCamara();
                }

                buscarAlertas(selectCamaras.value);
            })
        }).catch(err => {
            console.log(err);
        })
    }

}


function exibirUmidadeturaAtual(sensores) {

    for (let i = 0; i < sensores.length; i++) {

        fetch(`/sensor/umidadeAtual/${sensores[i].id_sensor}`, {
            method: "GET"
        }).then(res => {
            res.json().then(json => {

                let umidadeAtual = json[0].valor;
                let umidadeIdeal = Number(json[i].umidade_ideal);

                let umidadeCriticoMinimo = umidadeIdeal - 5;
                let umidadeCriticoMaximo = umidadeIdeal + 5;
                let umidadeAlertaMinimo = umidadeIdeal - 4;

                let color;

                if (umidadeAtual >= (umidadeIdeal - 1) && umidadeAtual <= (umidadeIdeal + 1)) {

                    color = 'rgba(0, 128, 0, 0.5)';

                } else if (umidadeAtual <= umidadeCriticoMinimo) {

                    color = 'rgba(255, 0, 0, 0.8)';

                    situacaoSensores.push("critico");

                    // registrarAlerta(json[i].id_medicao, "Umidade abaixo do ideal", "critico");

                } else if (umidadeAtual >= umidadeCriticoMaximo) {

                    color = 'rgba(255, 0, 0, 0.8)';

                    situacaoSensores.push("critico");

                    // registrarAlerta(json[i].id_medicao, "Umidade acima do ideal", "critico");

                } else if (umidadeAtual <= umidadeAlertaMinimo) {

                    color = 'rgba(255, 166, 0, 0.69)';

                    situacaoSensores.push("alerta");

                    // registrarAlerta(json[i].id_medicao, "Umidade abaixo do ideal", "medio");

                } else {

                    color = 'rgba(255, 166, 0, 0.69)';

                    situacaoSensores.push("alerta");

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

                kpisProntos++;

                console.log(kpisProntos, totalKpis)

                if (kpisProntos == totalKpis) {
                    validarStatusCamara();
                }

                buscarAlertas(selectCamaras.value);
            })
        }).catch(err => {
            console.log(err);
        })

    }
}

function validarStatusCamara() {
    if (situacaoSensores.includes("critico")) {

        kpis.innerHTML += `
            <div class="kpi" id="statusCamara">
                <h3>Status Camara</h3>
                <p id="kpiStatusCamara">Crítico</p>
                <div class="desc">
                    Condição atual da câmara de acordo com temperatura e umidade
                </div>
                </div>
            </div>
        `;

        kpiStatusCamara.style.color = 'rgba(255, 0, 0, 0.8)';

    } else if (situacaoSensores.includes("alerta")) {
        kpis.innerHTML += `
            <div class="kpi" id="statusCamara">
                <h3>Status Camara</h3>
                <p id="kpiStatusCamara">Alerta</p>
                <div class="desc">
                    Condição atual da câmara de acordo com temperatura e umidade
                </div>
                </div>
            </div>
        `;


        kpiStatusCamara.style.color = 'rgba(255, 166, 0, 0.69)';
    } else {
        kpis.innerHTML += `
            <div class="kpi" id="statusCamara">
                <h3>Status Camara</h3>
                <p id="kpiStatusCamara">Normal</p>
                <div class="desc">
                    Condição atual da câmara de acordo com temperatura e umidade
                </div>
                </div>
            </div>
        `;

        kpiStatusCamara.style.color = 'rgba(0, 128, 0, 0.5)';
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
});

