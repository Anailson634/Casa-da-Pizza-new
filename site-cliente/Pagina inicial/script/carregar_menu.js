import API_KEY_PATH from "../API_herf";

function carregar(){
    const nome_usuario=document.querySelector("#Nome").value.toLowerCase();
    const senha_usuario=document.querySelector("#Senha").value;
    fetch(`${API_KEY_PATH}/login`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Nome": nome_usuario,
                "Senha": senha_usuario
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data["Operacao"]){
                criar_janela_popup('Usuario não encontrado', 'Verifique suas credenciais, algo parece esta incorreto!')
            } else{
                location.href="/catalago.html"
                localStorage.setItem("token", data["Mensagem"])
            }
            
        })
}