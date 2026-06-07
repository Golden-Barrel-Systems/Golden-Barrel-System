USE goldenbarrel;

-- ENDERECO
INSERT INTO endereco
(logradouro, numero, complemento, bairro, cidade, uf, cep)
VALUES
('Rua das Palmeiras', '120', 'Galpão A', 'Centro', 'Campinas', 'SP', '13000-000'),
('Avenida Industrial', '500', 'Bloco B', 'Distrito Industrial', 'Campinas', 'SP', '13001-000');

-- EMPRESA
INSERT INTO empresa
(fk_endereco, cnpj, nome, codigo)
VALUES
(1, '12345678000199', 'Golden Barrel LTDA', 'GBR00001');

-- USUARIO
INSERT INTO usuario
(codigo_empresa, email, senha, tipo, cpf)
VALUES
('GBR00001', 'admin@goldenbarrel.com', 'Admin@123', 'administrador', '12345678901'),
('GBR00001', 'funcionario@goldenbarrel.com', 'Func@123', 'funcionario', '98765432100'),
('GBR00001', 'suporte@goldenbarrel.com', 'Suporte@123', 'suporte_1', '11122233344');

-- CAMARA
INSERT INTO camara
(fk_empresa, fk_endereco, nome, localizacao_interna,
 temperatura_ideal, umidade_ideal)
VALUES
(1, 2, 'Câmara Blended 01', 'Setor Norte', 4.0, 75.00);

-- SENSOR
INSERT INTO sensor
(fk_camara, posicionamento)
VALUES
(1, 'Entrada'),
(1, 'Centro');

-- SENSOR_META
INSERT INTO sensor_meta
(fk_sensor, fabricante, modelo, numero_serial,
 data_instalacao, data_calibracao)
VALUES
(1, 'SensTech', 'ST-Temp-Umi-X1', 'SN124',
 '2025-01-10', '2025-06-01'),
(2, 'SensTech', 'ST-Temp-Umi-X2', 'SN123',
 '2025-01-10', '2025-06-01');

-- MEDICAO
INSERT INTO medicao (fk_sensor, valor, tipo, data_hora) VALUES
(1, 24.5, 'temperatura', '2026-06-05 08:00:00'),
(1, 63.2, 'umidade',     '2026-06-05 08:00:00'),
(1, 25.1, 'temperatura', '2026-06-05 08:15:00'),
(1, 62.7, 'umidade',     '2026-06-05 08:15:00'),
(2, 22.8, 'temperatura', '2026-06-05 08:00:00'),
(2, 58.9, 'umidade',     '2026-06-05 08:00:00'),
(2, 23.4, 'temperatura', '2026-06-05 08:15:00'),
(2, 60.1, 'umidade',     '2026-06-05 08:15:00');


INSERT INTO alerta
(fk_medicao, mensagem, peso)
VALUES
(3, 'Temperatura acima do ideal', 'medio'),
(4, 'Umidade acima do ideal', 'leve');

-- CHAMADO
INSERT INTO chamado
(fk_usuario, data_abertura, assunto, descricao, prioridade)
VALUES
(2, CURRENT_DATE(), 'Sensor sem comunicação', 'O sensor da entrada parou de enviar dados.', 'alta');