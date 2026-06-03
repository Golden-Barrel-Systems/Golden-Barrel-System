
export async function pegarDados() {
    try{
        const resposta = await fetch('http://localhost:8080/sensor/buscar', {

            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        const data = await resposta.json();
        return data;
        
    }
    catch (error) {
        throw new Error(error)
    };
}