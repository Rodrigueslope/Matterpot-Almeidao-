// RBIM - Monitoramento em Tempo Real - Estádio Almeidão (João Pessoa-PB)
const tempData = {
  labels: [],
  datasets: [{
    label: 'Temperatura (°C)',
    data: [],
    borderColor: '#e63946',
    backgroundColor: 'rgba(230, 57, 70, 0.2)',
    fill: true,
    tension: 0.3
  }]
};

const ventoData = {
  labels: [],
  datasets: [{
    label: 'Vento (km/h)',
    data: [],
    borderColor: '#1d3557',
    backgroundColor: 'rgba(29, 53, 87, 0.2)',
    fill: true,
    tension: 0.3
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
  type: 'line',
  data: tempData,
  options: { responsive: true }
});

const ventoChart = new Chart(document.getElementById('ventoChart'), {
  type: 'line',
  data: ventoData,
  options: { responsive: true }
});

const publicoChart = new Chart(document.getElementById('publicoChart'), {
  type: 'doughnut',
  data: publicoData,
  options: { responsive: true }
});

function fetchClima() {
  fetch('https://api.openweathermap.org/data/2.5/weather?q=Joao%20Pessoa,BR&units=metric&appid=d9da98b35660b007a19706897feaa7416')
    .then(res => res.json())
    .then(data => {
      const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      if (tempData.labels.length >= 8) {
        tempData.labels.shift();
        tempData.datasets[0].data.shift();
        ventoData.labels.shift();
        ventoData.datasets[0].data.shift();
      }

      tempData.labels.push(hora);
      tempData.datasets[0].data.push(data.main.temp);

      ventoData.labels.push(hora);
      ventoData.datasets[0].data.push(data.wind.speed);

      tempChart.update();
      ventoChart.update();
    });
}

fetchClima();
setInterval(fetchClima, 5000);
