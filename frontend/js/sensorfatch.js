export async function pegarDados(token) {
    try{
        const resposta = await fetch('/sensor/buscar', {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        const data = await resposta.json()
        return data;
        
    }
    catch (error) {
        throw new Error(error)
    };
}

export async function listarCamaras(token) {
    try{
        const resposta = await fetch('/camara/todas', {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        const data = await resposta.json()
        return data;
        
    }
    catch (error) {
        throw new Error(error)
    };
}