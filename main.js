// RBIM – Gêmeo Digital do Estádio Almeidão

const tempData = {
  labels: [],
  datasets: [{
    label: 'Temperatura (°C)',
    data: [],
    backgroundColor: '#e63946'
  }]
};

const ventoData = {
  labels: [],
  datasets: [{
    label: 'Vento (km/h)',
    data: [],
    backgroundColor: '#f4a261'
  }]
};

const publicoData = {
  labels: ['Norte', 'Sul', 'Leste', 'Oeste'],
  datasets: [{
    label: 'Público',
    data: [3600, 2200, 3100, 4000],
    backgroundColor: ['#457b9d', '#a8dadc', '#f4a261', '#e76f51']
  }]
};

const tempChart = new Chart(document.getElementById('tempChart'), {
  type: 'bar',
  data: tempData,
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 45
      }
    }
  }
});

const ventoChart = new Chart(document.getElementById('ventoChart'), {
  type: 'bar',
  data: ventoData,
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 30
      }
    }
  }
});

const publicoChart = new Chart(document.getElementById('publicoChart'), {
  type: 'doughnut',
  data: publicoData,
  options: {
    responsive: true
  }
});

let historicoTemperatura = [];
let historicoVento = [];

function calcularMedia(lista) {
  const soma = lista.reduce((acc, val) => acc + val, 0);
  return (soma / lista.length).toFixed(1);
}

function atualizarMedia() {
  const mediaTemp = calcularMedia(historicoTemperatura);
  const mediaVento = calcularMedia(historicoVento);

  document.getElementById('mediaTemp').textContent = `Média Temp: ${mediaTemp} °C`;
  document.getElementById('mediaVento').textContent = `Média Vento: ${mediaVento} km/h`;
}

function resetarHistorico() {
  historicoTemperatura = [];
  historicoVento = [];
  atualizarMedia();
}

function fetchClima() {
  fetch('https://api.open-meteo.com/v1/forecast?latitude=-7.12&longitude=-34.86&current=temperature_2m,wind_speed_10m')
    .then(res => res.json())
    .then(data => {
      const hora = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const temperatura = data.current.temperature_2m;
      const vento = data.current.wind_speed_10m;

      if (tempData.labels.length >= 8) {
        tempData.labels.shift();
        tempData.datasets[0].data.shift();
        ventoData.labels.shift();
        ventoData.datasets[0].data.shift();
      }

      tempData.labels.push(hora);
      tempData.datasets[0].data.push(temperatura);

      ventoData.labels.push(hora);
      ventoData.datasets[0].data.push(vento);

      historicoTemperatura.push(temperatura);
      historicoVento.push(vento);

      tempChart.update();
      ventoChart.update();
      atualizarMedia();
    })
    .catch(err => console.error('Erro ao buscar clima:', err));
}

fetchClima();
setInterval(fetchClima, 5000); // Atualiza a cada 5 segundos
function carregarEventos() {
  const planilhaID = "1YGlLGLG7OcSLJ9ly9a9mkvydP3rfvwTrk9AXxYsKhsU";
  const abaNome = "EventosAlmeidao"; // ou "Sheet1"
  const url = `https://opensheet.elk.sh/${planilhaID}/${abaNome}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      // Corrige nomes das chaves com espaços
      data = data.map(e => ({
        DATA: e["DATA "]?.trim(),
        EVENTO: e["EVENTO"]?.trim()
      }));

      const hoje = new Date();
      const eventosFuturos = data
        .filter(e => {
          const partes = e.DATA.split("/");
          const dataEvento = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
          return dataEvento >= hoje;
        })
        .sort((a, b) => {
          const da = a.DATA.split("/").reverse().join("-");
          const db = b.DATA.split("/").reverse().join("-");
          return new Date(da) - new Date(db);
        });

      const lista = document.getElementById("eventosList");
      lista.innerHTML = "";

      if (eventosFuturos.length === 0) {
        lista.innerHTML = "<li>Sem eventos futuros cadastrados.</li>";
        return;
      }

      eventosFuturos.forEach(evento => {
        const li = document.createElement("li");
        li.textContent = `${evento.DATA} – ${evento.EVENTO}`;
        lista.appendChild(li);
      });
    })
    .catch(err => {
      document.getElementById("eventosList").innerHTML = "Erro ao carregar eventos.";
      console.error("Erro ao buscar eventos:", err);
    });
}


// E depois chame a função assim que carregar a página:
carregarEventos();


