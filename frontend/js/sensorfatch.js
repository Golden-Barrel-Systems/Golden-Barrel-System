export async function pegarDados(token) {
    try{
        const resposta = await fetch('http://localhost:8080/sensor/buscar', {

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