const data = JSON.parse(sessionStorage.getItem("pizza"));
const pizza_img = document.querySelector("#imagem_path");
document.querySelector(".nome_pizza").textContent = data["Pizza"];
document.querySelector(".informacoes").textContent = data["Detalhes"];

const bordas = document.querySelector(".bordas");
data["Bordas"].forEach(element => {
  const label = document.createElement("label");
  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "borda";
  radio.value = element;
  label.textContent = element;
  label.appendChild(radio);
  bordas.appendChild(label);
  if (element=="Nenhuma"){
    radio.checked=true
  }
});

const tamanho = document.querySelector(".tamanho");
Object.entries(data["Tamanho"]).forEach(([key, val]) => {
  const label = document.createElement("label");
  const radio = document.createElement("input");
  const pText=document.createElement("p");
  radio.type = "radio";
  radio.name = "tamanho";
  radio.value = val;
  radio.checked = true;

  pText.textContent = key;
  pText.id="TamanhoPizzaText"
  label.appendChild(pText)
  label.appendChild(radio);
  tamanho.appendChild(label);
});

pizza_img.src = `http://127.0.0.1:8000/fotos/${data["Icon"]}`;