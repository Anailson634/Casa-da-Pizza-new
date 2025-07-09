var lista_pedidos={}
document.addEventListener('DOMContentLoaded', () => {
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
    criar_lista(data["Tradicionais"], '.tradicionais-catalago', data["Bordas Recheadas"], data["Tradicionais tamanho"]); 
    criar_lista(data["Especiais"], ".especiais-catalago", data["Bordas Recheadas"], data["Especiais e doces tamanho"]);
    criar_lista(data["Doces"], ".doces-catalago", data["Bordas Recheadas"], data["Especiais e doces tamanho"] );
}).catch(error => {
    console.log(error);
});
});

function criar_lista(data, divPai, bordasPizza=none, tamanhosPizza=none) {
    let main = document.querySelector(divPai);
    Object.entries(data).forEach(pizza => {
        let card=document.createElement("div");
        card.classList.add("card");
        let cardCircle=document.createElement("img");
        cardCircle.classList.add("card-circle");
        cardCircle.src=`http://127.0.0.1:8000/fotos/${pizza[1]["Icon"]}`;

        //Card frontal
        let cardFront=document.createElement("div");
        cardFront.classList.add("card-front")
        let cardInfo=document.createElement("div");
        cardInfo.classList.add("card-info");
        let hInfo=document.createElement("h3");
        hInfo.textContent=pizza[0];
        let pInfo=document.createElement("p");
        pInfo.textContent=pizza[1]["Detalhes"];

        card.addEventListener("click",()=>{
            location.href="../Pedidos/pedido_pizza.html";
            sessionStorage.setItem("pizza", JSON.stringify({"Icon":pizza[1]["Icon"],
                                                            "Pizza":pizza[0],
                                                            "Detalhes":pizza[1]["Detalhes"],
                                                            "Bordas": bordasPizza,
                                                            "Tamanho": tamanhosPizza,
                                                            
            }))
        })
        //Adicionar a tela
        main.appendChild(card);
        card.appendChild(cardFront);

        cardFront.appendChild(cardCircle);
        cardFront.appendChild(cardInfo);
        cardInfo.appendChild(hInfo);
        cardInfo.appendChild(pInfo);
    });

}