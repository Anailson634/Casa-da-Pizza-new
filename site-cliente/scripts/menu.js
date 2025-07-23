var total=0
function desaparecer(url_page, url_menu){
    let item_flex=document.querySelector(url_page);
    const elementos=[['.tradicionais-catalago','#menu-tradicionais'], ['.especiais-catalago', '#menu-especiais'],
    ['.doces-catalago', '#menu-doces'], ['.bebidas-catalago', '#menu-bebidas'], ['.carrinho-catalago', '#menu-carrinho']]
    elementos.forEach(item =>{
        let item_none=document.querySelector(item[0]);
        let item_menu=document.querySelector(item[1]);
        if (item[0]==url_page){
            item_flex.style.display="flex";
            item_menu.style.backgroundColor="#eea4722f";
        } else {
            item_none.style.display="none";
            item_menu.style.backgroundColor="#ffffff00";
        }
    })
}

function carregar_carrinho(){
    total=0
    desaparecer('.carrinho-catalago', 'menu-carrinho')
    const main=document.querySelector(".carrinho_catalago2")
    const conta_valor=document.querySelector("#conta_valor")
    main.innerHTML=""
    carregar_carrinho_dados().then(date=>{
        date["Dados"].forEach(element=>{
            const qtn_pizza=element["Quantidade"];
            let preco_pizza=(parseFloat(element["Tamanho_preco"])*qtn_pizza)
            total+=preco_pizza
            
            if (element["Borda"]!="Nenhuma"){
                total, preco_pizza+=(5.0*qtn_pizza);
            }
            let card=document.createElement("abbr");
            card.title=`R$${preco_pizza}`
            card.classList.add("card");
            let cardCircle=document.createElement("img");
            cardCircle.classList.add("card-circle");
            cardCircle.src=`http://127.0.0.1:8000/fotos/${element["Img"]}`;
            
            //Card frontal
            let cardMaster=document.createElement("div");
            cardMaster.classList.add("card-front");
            cardMaster.classList.add("cardMaster");
            
            let cardFront=document.createElement("div");
            cardFront.classList.add("card-front")
            let cardInfo=document.createElement("div");
            cardInfo.classList.add("card-info");
            let hInfo=document.createElement("h3");
            hInfo.textContent=element["Pizza"];
            let pInfo=document.createElement("p");
            pInfo.textContent=element["Detalhes"];
            
            //Adicionar a tela
            adicionar_contador(qtn_pizza, cardMaster, element["Pizza"])
            main.appendChild(card);
            card.appendChild(cardMaster);
            cardMaster.appendChild(cardFront);
            
            cardFront.appendChild(cardCircle);
            cardFront.appendChild(cardInfo);
            cardInfo.appendChild(hInfo);
            cardInfo.appendChild(pInfo);
        })
        conta_valor.textContent=`R$${total}`
    })
    
}
function adicionar_contador(valor, corpo="body", pizza){
    const divNumberQtn=document.createElement("div");
    const divUp=document.createElement("div");
    const pNumber=document.createElement("p");
    const divDown=document.createElement("div");
    
    divNumberQtn.classList.add("numberQtn");
    divUp.classList.add("upNumber");
    pNumber.classList.add("number");
    pNumber.id=`number-${pizza.replace(" ", "")}`
    divDown.classList.add("downNumber");
    
    pNumber.textContent=valor;
    divUp.textContent="⮝";
    divDown.textContent="⮟";
    divUp.addEventListener("click", ()=>{
        criar_janela_popup("Erro de função", "Esta função não esta disponivel ainda!")
        //pNumber.textContent=parseInt(pNumber.textContent)+1;
    })
    divDown.addEventListener("click", ()=>{
        const valueformate=parseInt(pNumber.textContent)
        if(valueformate!=0){
            criar_janela_popup("Erro de função", "Esta função não esta disponivel ainda!")
            //pNumber.textContent=valueformate-1;
        }
    })
    
    divNumberQtn.appendChild(divUp);
    divNumberQtn.appendChild(pNumber);
    divNumberQtn.appendChild(divDown);
    corpo.appendChild(divNumberQtn);
}
function pedir_pizzas(){
    sessionStorage.clear()
    sessionStorage.setItem("Valor", total)
    carregar_carrinho_dados().then(data => {
        sessionStorage.setItem("Pizzas", JSON.stringify(data))
    })
    location.href="../Finalizar compra/finalizarCompra.html"
}
function carregar_carrinho_dados() {
    const token=localStorage.getItem("token")
    return fetch("http://127.0.0.1:8000/carrinho", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json());
}