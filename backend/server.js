const ambiente_processo = 'desenvolvimento';

const caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require("dotenv").config({ path: caminho_env });

const express = require("express");
const cors = require("cors");
const path = require("path");
const PORTA_APP = process.env.APP_PORT;
const HOST_APP = process.env.APP_HOST;

const app = express();

// const indexRouter = require("./src/routes/index");
// const usuarioRouter = require("./src/routes/usuarios");
// const avisosRouter = require("./src/routes/avisos");
// const medidasRouter = require("./src/routes/medidas");
// const aquariosRouter = require("./src/routes/aquarios");
// const empresasRouter = require("./src/routes/empresas");
const chatRouter = require("./routes/chatRoutes");
const chamadosRouter = require("./routes/chamadoRoutes");
const camaraRouter = require("./routes/camaraRoutes");
const sensorRouter = require("./routes/sensorRoutes");
const usuarioRouter = require("./routes/usuarios");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "..", "frontend")));



app.use(cors());

// app.use("/", indexRouter);
// app.use("/usuarios", usuarioRouter);
// app.use("/avisos", avisosRouter);
// app.use("/medidas", medidasRouter);
// app.use("/aquarios", aquariosRouter);
// app.use("/empresas", empresasRouter);
app.use("/chat", chatRouter);
app.use("/chamado", chamadosRouter);
app.use("/camara", camaraRouter);
app.use("/sensor", sensorRouter);
app.use("/usuarios", usuarioRouter);

app.listen(PORTA_APP, function () {
    console.log(`Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP}`)
});
