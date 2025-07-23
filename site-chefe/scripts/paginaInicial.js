function carregar(){
    fetch("http://127.0.0.1:8000/login", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Nome": "ADM",
                "Senha": "CasadaPizza"
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data["Operacao"]){
                cadastrar()
            } else{
                localStorage.setItem("token", data["Mensagem"])
                location.href="../Pagina inicial/dashbord.html"
            }
        }
    )
}
function cadastrar(){
    fetch(" http://127.0.0.1:8000/cadastro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "role": "chefe",
            "Nome": "ADM",
            "Telefone": "75982006977",
            "Senha": "CasadaPizza"
        })
    }).then(response =>{return response.json()})
    .then(data=>{
        console.log(data)
        if (data["sucesso"]){
            criar_janela_popup("Sucesso", data["mensagem"], color="#3ce745")
            location.href="index.html"
        } else {
            criar_janela_popup("Usuario existente", data["Usuario existente"])
        }
    })
}