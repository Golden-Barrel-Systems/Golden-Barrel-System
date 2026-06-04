export async function pegarDados(idCamara) {
    try{
        const resposta = await fetch('http://localhost:8080/sensor/buscar', {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({idCamara: idCamara})
        })
        const data = await resposta.json()
        return data;
        
    }
    catch (error) {
        throw new Error(error)
    };
}