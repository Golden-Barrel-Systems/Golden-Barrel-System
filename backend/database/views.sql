USE goldenbarrel;

CREATE VIEW
    vw_total_chamados AS
SELECT
    *
FROM
    chamado;

CREATE VIEW
    vw_selecionar_camaras AS
SELECT
    empresa.codigo AS Empresa,
    camara.id_camara AS id_camara,
    camara.nome AS camara
FROM
    camara
    JOIN empresa ON empresa.id_empresa = camara.fk_empresa;

CREATE VIEW
    vw_selecionar_sensores AS
SELECT
    camara.id_camara AS id_camara,
    sensor.id_sensor AS id_sensor,
    sensor.posicionamento AS posicionamento,
    camara.temperatura_ideal AS temperatura_ideal,
    camara.umidade_ideal AS umidade_ideal,
    sensor_meta.numero_serial AS nome
FROM
    sensor
    JOIN camara ON sensor.fk_camara = camara.id_camara
    JOIN sensor_meta ON sensor_meta.fk_sensor = sensor.id_sensor;
    

CREATE VIEW
    vw_umidade_atual AS
SELECT
    medicao.data_hora,
    medicao.id_medicao,
    sensor.id_sensor,
    medicao.valor,
    medicao.tipo,
    camara.umidade_ideal
FROM
    medicao
    JOIN sensor ON medicao.fk_sensor = sensor.id_sensor
    JOIN camara ON sensor.fk_camara = camara.id_camara
WHERE
    medicao.tipo = 'umidade'
ORDER BY
    medicao.data_hora DESC;

CREATE VIEW
    vw_temperatura_atual AS
SELECT
    medicao.data_hora,
    medicao.id_medicao,
    sensor.id_sensor,
    medicao.valor,
    medicao.tipo,
    camara.temperatura_ideal
FROM
    medicao
    JOIN sensor ON medicao.fk_sensor = sensor.id_sensor
    JOIN camara ON sensor.fk_camara = camara.id_camara
WHERE
    medicao.tipo = 'temperatura'
ORDER BY
    medicao.data_hora DESC;

CREATE VIEW
    vw_ultimos_alertas AS
SELECT
    DATE_FORMAT (alerta.data_hora, '%H:%i') AS hora,
    camara.id_camara,
    sensor_meta.numero_serial,
    medicao.valor,
    alerta.mensagem,
    alerta.peso
FROM
    alerta
    JOIN medicao ON alerta.fk_medicao = medicao.id_medicao
    JOIN sensor ON medicao.fk_sensor = sensor.id_sensor
    JOIN sensor_meta ON sensor_meta.fk_sensor = sensor.id_sensor
    JOIN camara ON sensor.fk_camara = camara.id_camara
ORDER BY
    alerta.data_hora DESC
LIMIT
    10;