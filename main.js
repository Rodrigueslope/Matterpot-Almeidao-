// RBIM – Gêmeo Digital do Estádio Almeidão (João Pessoa - PB)

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

// 🔄 Função com Open-Meteo (sem chave, sem CORS)
function fetchClima() {
  fetch('https://api.open-meteo.com/v1/forecast?latitude=-7.12&longitude=-34.88&current=temperature_2m,wind_speed_10m')
    .then(res => res.json())
    .then(data => {
      const hora = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const temp = data.current.temperature_2m;
      const vento = data.current.wind_speed_10m;

      if (tempData.labels.length >= 8) {
        tempData.labels.shift();
        tempData.datasets[0].data.shift();
        ventoData.labels.shift();
        ventoData.datasets[0].data.shift();
      }

      tempData.labels.push(hora);
      tempData.datasets[0].data.push(temp);

      ventoData.labels.push(hora);
      ventoData.datasets[0].data.push(vento);

      tempChart.update();
      ventoChart.update();
    })
    .catch(err => console.error('Erro ao buscar clima:', err));
}

// ⏱️ Inicia leitura periódica
fetchClima();
setInterval(fetchClima, 5000);
