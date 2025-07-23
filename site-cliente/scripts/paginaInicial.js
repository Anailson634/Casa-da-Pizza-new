function carregar(){
    const nome_usuario=document.querySelector("#Nome").value.toLowerCase();
    const senha_usuario=document.querySelector("#Senha").value;
    fetch("http://127.0.0.1:8000/login", {
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
            navigator.geolocation.watchPosition(
                (position) => {
                    //navigator.clipboard.writeText(`${position.coords.latitude}, ${position.coords.longitude}`)
                    if (data["Operacao"]){
                        criar_janela_popup('Usuario não encontrado', 'Verifique suas credenciais, algo parece esta incorreto!')
                    } else{
                        localStorage.setItem("token", data["Mensagem"])
                        localStorage.setItem("Localizacao", [position.coords.latitude,position.coords.longitude, position.coords.accuracy])
                        location.href="../Pagina inicial/catalago.html"
                    }
                },
                (error) => {
                    if (error.code===error.PERMISSION_DENIED) {
                        criar_janela_popup("Acesso negado", "As entregas não poderão ser entregues caso não permita o acesso a sua localizção!")
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge:0
                }
            )
        }
    )
}