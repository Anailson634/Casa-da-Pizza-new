const div_total=document.querySelector("#Valor_total");
var valor_taxa=0;

function valor_original(){
  div_total.textContent=`R$${sessionStorage.getItem("Valor")}`
}
function calcularEntrega(){
    const local_pizzaria=[-12.01470139169226, -41.67078112331352];
    const local_cliente=localStorage.getItem("Localizacao").split(",");
    const calculo_distancia=calcularDistancia({lat: local_pizzaria[0], lon: local_pizzaria[1]}, {lat:local_cliente[0], lon: local_cliente[1]})
    console.log(calculo_distancia.toFixed(1))
    
    if (calculo_distancia<=0.7){
      //alert("A taxa de viagem não sera cobrada")
      valor_taxa=0;
    } else if (calculo_distancia>=1 && calculo_distancia<4.9){
      valor_taxa=1.14;
      /*if (window.confirm(`A viagem ficou em ${(valor_taxa).toFixed(2)}`)) {
        valor_taxa=9;
        valor_taxa=5;
      }*/
    } else if (calculo_distancia>=4.9 && calculo_distancia<=5.8){
      valor_taxa=10;
    }
    div_total.textContent=`R$${parseFloat(div_total.textContent.replace("R$", ""))+valor_taxa}`
}
function calcularDistancia(coord1, coord2) {
  const R = 6371; // Raio da Terra em km

  const lat1 = coord1.lat * Math.PI / 180;
  const lat2 = coord2.lat * Math.PI / 180;
  const deltaLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const deltaLon = (coord2.lon - coord1.lon) * Math.PI / 180;

  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon/2) * Math.sin(deltaLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const distancia = R * c;

  return distancia; // em km
}

//const pontoA = { lat: -12.01470139169226, lon: -41.67078112331352 };
//const pontoB = { lat: -12.013749, lon: -41.6610258 };

//const distancia = calcularDistancia(pontoA, pontoB);

//console.log(`Distância entre os pontos: ${distancia.toFixed(3)} km`);
