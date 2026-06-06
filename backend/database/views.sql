USE goldenbarrel;

CREATE VIEW vw_total_chamados AS
    SELECT 
        *
    FROM
        chamado;
       
       
CREATE VIEW vw_selecionar_camaras AS
    SELECT 
        empresa.codigo AS Empresa,
        camara.id_camara AS id_camara,
        camara.nome AS camara
    FROM
        camara
            JOIN
        empresa ON empresa.id_empresa = camara.fk_empresa;
       
       
CREATE VIEW vw_selecionar_sensores AS
    SELECT 
        camara.id_camara AS id_camara,
        sensor.id_sensor AS id_sensor,
        sensor.posicionamento AS posicionamento,
        camara.temperatura_ideal AS temperatura_ideal,
        camara.umidade_ideal AS umidade_ideal
    FROM
        sensor
            JOIN
        camara ON sensor.fk_camara = camara.id_camara;


CREATE VIEW vw_umidade_atual AS
    SELECT 
        sensor.id_sensor,
        medicao.valor,
        medicao.tipo,
        medicao.data_hora
    FROM
        medicao
            JOIN
        sensor ON medicao.fk_sensor = sensor.id_sensor
    WHERE
        medicao.tipo = 'umidade'
    ORDER BY medicao.data_hora DESC;
    
    
CREATE VIEW vw_temperatura_atual AS
    SELECT 
        sensor.id_sensor,
        medicao.valor,
        medicao.tipo,
        medicao.data_hora
    FROM
        medicao
            JOIN
        sensor ON medicao.fk_sensor = sensor.id_sensor
    WHERE
        medicao.tipo = 'temperatura'
    ORDER BY medicao.data_hora DESC;