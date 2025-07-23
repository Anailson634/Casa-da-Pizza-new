const corpo=document.querySelector("body")

const link=document.createElement("link")
link.rel="stylesheet"
link.type="text/css"
link.href="/styles/showpopup.css"
document.head.appendChild(link)

function criar_janela_popup(motivo_erro, mensagem, color="#e74c3c"){
    const divJanela=document.createElement("div")
    divJanela.classList.add("janela_popup")

    const corpo_aviso=document.createElement("div")
    corpo_aviso.classList.add("corpo_aviso")
    corpo_aviso.style.background=color
    const img_aviso=document.createElement("img")
    img_aviso.src="/Icons/aviso.png"
    img_aviso.alt="Aviso!"

    const mensagem_erro=document.createElement("h2")
    mensagem_erro.textContent=motivo_erro

    const corpo_mensagem=document.createElement("div")
    corpo_mensagem.classList.add("corpo_mensagem")
    corpo_mensagem.innerHTML=mensagem

    const button_ok=document.createElement("div")
    button_ok.classList.add("button_ok")
    button_ok.style.background=color
    button_ok.innerHTML="OK"
    button_ok.addEventListener("click",function (){
        divJanela.remove()
    })

    divJanela.appendChild(corpo_aviso)
    corpo_aviso.appendChild(img_aviso)
    corpo_aviso.appendChild(mensagem_erro)
    corpo_aviso.appendChild(corpo_mensagem)
    divJanela.appendChild(button_ok)
    corpo.appendChild(divJanela)
}
