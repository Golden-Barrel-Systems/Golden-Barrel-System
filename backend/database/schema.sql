CREATE DATABASE IF NOT EXISTS goldenbarrel;

USE goldenbarrel;

CREATE TABLE IF NOT EXISTS endereco (
    id_endereco INT PRIMARY KEY AUTO_INCREMENT,
    logradouro VARCHAR(45) NOT NULL,
    numero VARCHAR(4),
    complemento VARCHAR(255),
    bairro VARCHAR(45) NOT NULL,
    cidade VARCHAR(45) NOT NULL,
    uf CHAR(2),
    cep CHAR(9)
);

CREATE TABLE IF NOT EXISTS empresa (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    fk_endereco INT UNIQUE,
    cnpj CHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(45),
    codigo CHAR(8) NOT NULL UNIQUE,
    CONSTRAINT fk_endereco_empresa FOREIGN KEY (fk_endereco)
        REFERENCES endereco (id_endereco)
);

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    codigo_empresa CHAR(8) NOT NULL,
    email VARCHAR(40) UNIQUE NOT NULL,
    senha VARCHAR(22) NOT NULL,
    tipo VARCHAR(13) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    CONSTRAINT chk_tipo_usuario CHECK (tipo IN ('funcionario' , 'representante',
        'administrador',
        'suporte_1',
        'suporte_2',
        'suporte_3'))
);

CREATE TABLE IF NOT EXISTS camara (
    id_camara INT PRIMARY KEY AUTO_INCREMENT,
    fk_empresa INT NOT NULL,
    fk_endereco INT NOT NULL,
    nome VARCHAR(45),
    localizacao_interna VARCHAR(100),
    temperatura_ideal DECIMAL(3 , 1 ),
    umidade_ideal DECIMAL(4 , 2 ),
    CONSTRAINT fk_empresa FOREIGN KEY (fk_empresa)
        REFERENCES empresa (id_empresa),
    CONSTRAINT fk_endereco FOREIGN KEY (fk_endereco)
        REFERENCES endereco (id_endereco)
);

CREATE TABLE IF NOT EXISTS sensor (
    id_sensor INT PRIMARY KEY AUTO_INCREMENT,
    fk_camara INT NOT NULL,
    posicionamento VARCHAR(25),
    CONSTRAINT fk_camara FOREIGN KEY (fk_camara)
        REFERENCES camara (id_camara)
);

CREATE TABLE IF NOT EXISTS sensor_meta (
    fk_sensor INT UNIQUE,
    fabricante VARCHAR(45),
    modelo VARCHAR(100),
    numero_serial VARCHAR(45) UNIQUE,
    data_instalacao DATE,
    data_calibracao DATE,
    CONSTRAINT fk_sensor FOREIGN KEY (fk_sensor)
        REFERENCES sensor (id_sensor),
    PRIMARY KEY (fk_sensor)
);

CREATE TABLE IF NOT EXISTS medicao (
    id_medicao INT PRIMARY KEY AUTO_INCREMENT,
    fk_sensor INT NOT NULL,
    valor DECIMAL(4 , 1 ) NOT NULL,
    tipo VARCHAR(11) NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP (),
    CONSTRAINT fk_sensor_medicao FOREIGN KEY (fk_sensor)
        REFERENCES sensor (id_sensor),
    CONSTRAINT chk_tipo CHECK (tipo IN ('temperatura' , 'umidade'))
);

CREATE TABLE IF NOT EXISTS alerta (
    id_alerta INT PRIMARY KEY AUTO_INCREMENT,
    fk_medicao INT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP (),
    mensagem VARCHAR(60),
    peso VARCHAR(7),
    CONSTRAINT chk_peso CHECK (peso IN ('critico' , 'medio', 'leve')),
    CONSTRAINT fk_medicao FOREIGN KEY (fk_medicao)
        REFERENCES medicao (id_medicao)
);

CREATE TABLE IF NOT EXISTS chamado (
    id_chamado INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    data_abertura DATE NOT NULL,
    assunto VARCHAR(45) NOT NULL,
    descricao VARCHAR(500) NULL,
    statuss VARCHAR(7) DEFAULT 'aberto',
    resposta VARCHAR(500) DEFAULT 'Sem resposta',
    nivel_suporte INT DEFAULT 1,
    prioridade VARCHAR(5) NOT NULL,
    CONSTRAINT fk_usuario FOREIGN KEY (fk_usuario)
        REFERENCES usuario (id_usuario),
    CONSTRAINT chk_statuss CHECK (statuss IN ('fechado' , 'aberto')),
    CONSTRAINT chk_nivel_suporte CHECK (nivel_suporte IN (1 , 2, 3)),
    CONSTRAINT chk_prioridade CHECK (prioridade IN ('baixa' , 'media', 'alta'))
);