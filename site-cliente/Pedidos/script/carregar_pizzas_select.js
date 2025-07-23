function adicionar_sabores(){
    const token=localStorage.getItem("token");
    fetch(' http://127.0.0.1:8000' , {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
    }
    }).then(response => {
        return response.json();
    }).then(data => {
    adicionar_sabores_selected("#SelectedTradicionais", data["Tradicionais"])
    adicionar_sabores_selected("#SelectedEspeciais", data["Especiais"])
    adicionar_sabores_selected("#SelectedDoces", data["Doces"])
    }).catch(error => {
        console.log(error, "error");
    });
} 

function adicionar_sabores_selected(Div_pai, pizzas){
    const DivPai=document.querySelector(Div_pai)
    
    Object.keys(pizzas).forEach(Elements => {
            const opt=document.createElement("option")
            opt.value=Elements;
            opt.textContent=Elements;

            DivPai.appendChild(opt)
        })
    }