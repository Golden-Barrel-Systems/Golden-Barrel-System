require("dotenv").config({ path: '.env' });

const { GoogleGenAI, ThinkingLevel } = require('@google/genai');
const chatBot = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});


async function gerarResposta(req, res) {
    const mensagem = req.body.mensagem;
    try {
        const resposta = await chatBot.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Você está atuando como o GoldenIA, um chatbot auxiliar de suporte N3. O usuário abriu um chamado, em um parágrafo me responda: ${mensagem}`
        })

        return res.status(200).json({ resposta: resposta.text });
    } catch(error) {
        console.log({ Erro: error })
        return res.status(500).json({ erro: error })
    }
};

module.exports = {
    gerarResposta
}