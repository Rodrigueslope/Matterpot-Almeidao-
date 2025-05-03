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
    backgroundColor: '#1d3557'
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
setInterval(fetchClima, 60000); // 1 minuto


// ⏱️ Inicia leitura periódica
fetchClima();
setInterval(fetchClima, 5000);
