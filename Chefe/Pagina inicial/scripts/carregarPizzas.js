const token=localStorage.getItem("token")
const retirada=document.querySelector("#retirada");
const entrega=document.querySelector("#entrega");


fetch("http://127.0.0.1:8000/progrsso", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
    },
}).then(response => {
    return response.json()
})
.then(pizzas => {
    console.log(pizzas)
    pizzas.forEach(users => {
        const usuario=users[1]
        const dados=JSON.parse(users[2])

        if (temPedido(dados)){//Verifica se tem algum pedido 
            //console.log("Existe pedidos")
            const pedido=JSON.parse(dados["pedidos"])["Dados"]
            pedido.forEach(element => {
                adicionarPedidos(element, usuario, dados)
            });
        }
    });
})


function temPedido(dado) {
    if (!dado) return false; // null, undefined, 0, "", false...

    if (Array.isArray(dado)) {
        return dado.length > 0; // Verifica se o array tem itens
    }

    if (typeof dado === "object") {
        return Object.keys(dado).length > 0; // Verifica se o objeto tem chaves
    }

    return true; // Para strings, números, etc. (qualquer valor "não vazio")
}


function adicionarPedidos(element, usuario, dados){
    //console.log(element)
    const body_pizza=document.createElement("div")
    body_pizza.classList.add("pizza")

    const nome_remetente=document.createElement("h4")
    const detalhes=document.createElement("p")
    detalhes.textContent=`${element["Pizza"]} e ${element["Outro sabor"]}`
    nome_remetente.textContent=usuario

    const dDetalhes=document.createElement("div");
    dDetalhes.classList.add("hidden-infos")

    const iImg=document.createElement("img")
    iImg.src=`http://127.0.0.1:8000/fotos/${element["Img"]}`
    iImg.classList.add("Infos")
    iImg.style="width:100px;"

    const pTamanho=document.createElement("p")
    pTamanho.textContent=`Tamanho: ${element["Tamanho"]}`
    pTamanho.classList.add("Infos") 

    const pBorda=document.createElement("p")
    pBorda.textContent=`Borda: ${element["Borda"]}`
    pBorda.classList.add("Infos")  

    const pDetalhes=document.createElement("p")
    //pDetalhes.textContent=`Detalhes ${element["Detalhes"]}`
    pDetalhes.classList.add("Infos")

    const pQuantidade=document.createElement("p")
    pQuantidade.textContent=`Quantidade: ${element["Quantidade"]}`
    pQuantidade.classList.add("Infos")

    const pSache=document.createElement("p")
    pSache.textContent=`Sache: ${element["Sache"]}`
    pSache.classList.add("Infos")
    
    const button_aceitar=document.createElement("div")
    const button_rejeitar=document.createElement("div")
    
    body_pizza.addEventListener("click", ()=>{
        dDetalhes.classList.toggle("hidden-infos")
    })
    body_pizza.appendChild(nome_remetente)
    body_pizza.appendChild(detalhes)
    body_pizza.appendChild(dDetalhes)
    dDetalhes.appendChild(iImg)
    dDetalhes.appendChild(pBorda)
    dDetalhes.appendChild(pDetalhes)
    dDetalhes.appendChild(pQuantidade)
    dDetalhes.appendChild(pSache)
    dDetalhes.appendChild(pTamanho)

    const destino = (dados["local"] == "Retirada no local!") ? "retirada" : "entrega";
    const container = document.querySelector(`#${destino}`);

    if (container) {
        container.appendChild(body_pizza);
    } else {
        console.log(`${element["Pizza"]} e ${element["Outro sabor"]}`)
        console.error("Container não encontrado! Valor de dados['local']:", dados["local"]);
    }
}