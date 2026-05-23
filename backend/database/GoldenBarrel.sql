create database if not exists goldenbarrel;

use goldenbarrel;

create table endereco (
	idEndereco INT PRIMARY KEY AUTO_INCREMENT,
    logradouro varchar(60) NOT NULL,
    bairro varchar(50) NOT NULL,
    cidade varchar(50) NOT NULL,
    UF char(2)
);

create table empresa (
	idEmpresa INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    cnpj char(14) NOT NULL UNIQUE,
    nomeEmpresa varchar(60),
    codEmpresa char(8) NOT NULL UNIQUE,
    endereco INT UNIQUE,
    constraint fkEndereco foreign key (endereco) references endereco(idEndereco)
);

create table usuario (
	idUsuario INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    codEmpresa char(8),
    senha varchar(22),
    tipoUsuario varchar(13),
    cpf char(11) unique,
    email varchar(40) unique,
    constraint chkTipoUsuario check(tipoUsuario IN('funcionario', 'representante', 'administrador', 'suporte_1', 'suporte_2', 'suporte_3')),
    constraint fkCodEmpresa foreign key (codEmpresa) references empresa(codEmpresa)
);

create table chamados (
	idChamado INT PRIMARY KEY AUTO_INCREMENT,
    assunto varchar(64) NOT NULL,
    statuss enum('aberto', 'fechado') default 'aberto',
    dtAbertura date NOT NULL,
    descricao varchar(500),
    nvSuporte INT default 1,
    usuario INT NOT NULL,
    prioridade enum('baixa', 'media', 'alta') NOT NULL,
    resposta varchar(500) default 'Sem resposta',
    constraint chkNvSuporte check(nvSuporte IN(1, 2 ,3)),
    constraint fkUsuario foreign key (usuario) references usuario(idUsuario)
);

create view todosChamados as select * from chamados;

create table camara (
	idCamara INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nomeCamara varchar(10),
    temperaturaIdeal decimal(3,1),
    umidadeIdeal decimal(4,2),
    idEmpresa INT,
    endereco varchar(100),
    constraint fkIdEmpresa foreign key (idEmpresa) references empresa(idEmpresa)
);

create table sensor (
	idSensor INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    idCamara INT,
    localizacao varchar(25),
    constraint fkIdCamara foreign key (idCamara) references camara(idCamara)
);

create table sensor_meta (
	idSensor INT PRIMARY KEY,
    fabricante varchar(80),
    modelo varchar(80),
    numSerial varchar(40) UNIQUE,
    dataInstalacao DATE,
    dataCalibracao DATE,
    CONSTRAINT fkSensorMeta FOREIGN KEY (idSensor) REFERENCES sensor(idSensor)
);

create table medicoes (
	idMedicao INT AUTO_INCREMENT,
    valor decimal(4,1),
    tipo varchar(11),
    idSensor INT,
    constraint fkIdSensor foreign key (idSensor) references sensor(idSensor),
    constraint chkTipo check(tipo IN('temperatura', 'umidade')),
    primary key (idMedicao, idSensor)
);

create table alertas (
	idAlerta INT AUTO_INCREMENT,
    idMedicao INT,
    horaAlerta datetime default current_timestamp,
    mensagemAlerta varchar(60),
    pesoAlerta varchar(7),
    constraint chkPesoAlerta check(pesoAlerta IN('crítico', 'medio', 'leve')),
    constraint fkIdMedicao foreign key (idMedicao) references medicoes(idMedicao),
    primary key (idAlerta, idMedicao)
);

INSERT INTO endereco (logradouro, bairro, cidade, UF) VALUES
('Av. Paulista, 1000', 'Bela Vista', 'São Paulo', 'SP'),
('Rua das Flores, 250', 'Jardim', 'Campinas', 'SP'),
('R. da Constituição, 45', 'Centro', 'Belo Horizonte', 'MG'),
('Av. Brasil, 120', 'Boa Viagem', 'Recife', 'PE');

INSERT INTO empresa (cnpj, nomeEmpresa, codEmpresa, endereco) VALUES
('01234567000189', 'Golden Barrel SP Ltda', 'GBSP0001', 1),
('98765432000155', 'Golden Barrel Campinas', 'GBCP0001', 2),
('11122233000166', 'Golden Barrel BH', 'GBBH0001', 3),
('22233344000177', 'Golden Barrel Recife', 'GBRC0001', 4);

INSERT INTO usuario (codEmpresa, senha, tipoUsuario, cpf, email) VALUES
('GBSP0001', 'senhaExemplo1', 'administrador', '12345678901', 'admin@gbsp.com'),
('GBSP0001', 'senhaExemplo2', 'representante', '23456789012', 'rep.sp@gbsp.com'),
('GBCP0001', 'senhaExemplo3', 'funcionario', '34567890123', 'func.cp@gbcp.com'),
('GBBH0001', 'senhaExemplo4', 'funcionario', '45678901234', 'func.bh@gbbh.com');

INSERT INTO camara (nomeCamara, temperaturaIdeal, umidadeIdeal, idEmpresa, endereco) VALUES
('C01', 5.0, 0.65, 1, 'Galpão A - Rua Interna 1'),
('C02', 4.5, 0.70, 1, 'Galpão A - Rua Interna 2'),
('C01', 6.0, 0.60, 2, 'Setor Norte - Prédio 2'),
('C01', 5.5, 0.68, 3, 'Armazém 3 - Ala B');

INSERT INTO sensor (idCamara, localizacao) VALUES
(1, 'Prateleira 1 - Frente'),
(1, 'Prateleira 2 - Fundo'),
(2, 'Centro da câmara'),
(3, 'Entrada da câmara');

INSERT INTO sensor_meta (idSensor, fabricante, modelo, numSerial, dataInstalacao, dataCalibracao) VALUES
(1, 'SensTech', 'ST-100', 'SN-ST100-0001', '2025-10-01', '2026-04-01'),
(2, 'SensTech', 'ST-100', 'SN-ST100-0002', '2025-10-02', '2026-04-02'),
(3, 'ThermoCorp', 'TC-200', 'SN-TC200-0003', '2025-11-15', '2026-04-05'),
(4, 'HumiSense', 'HS-50', 'SN-HS50-0004', '2025-12-01', '2026-03-20');

INSERT INTO chamados values(default, 'Problema de Login', default, CURDATE(), 'Estou tentando entrar na minha conta mas aparece um erro 403 Forbidden na tela', default, 1, 'media', default);
INSERT INTO chamados values(default, 'Problema na dashboard', default, CURDATE(), 'A dashboard não mostra as medições de temperatura', default, 1, 'alta', default);

select * from medicoes;

select * from todosChamados;

describe chamados;

UPDATE chamados SET nvSuporte = nvSuporte + 1 WHERE idChamado = 1;