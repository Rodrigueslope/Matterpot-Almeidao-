// Espera o DOM carregar totalmente
document.addEventListener('DOMContentLoaded', () => {
  const tempCtx = document.getElementById('tempChart').getContext('2d');
  const ventoCtx = document.getElementById('ventoChart').getContext('2d');
  const publicoCtx = document.getElementById('publicoChart').getContext('2d');

  // === 1. API OpenWeather ===
  const API_KEY = 'd9da98b3560b007a19706897feaa7416'; // Sua chave
  const cidade = 'Joao Pessoa,BR';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${API_KEY}`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("API não autorizada ou falhou");
      return res.json();
    })
    .then(data => {
      const temp = data.main.temp;
      const vento = data.wind.speed;

      // === Temperatura ===
      new Chart(tempCtx, {
        type: 'bar',
        data: {
          labels: ['Temperatura'],
          datasets: [{
            label: 'Temperatura (°C)',
            data: [temp],
            backgroundColor: '#0096FF'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, max: 40 }
          }
        }
      });

      // === Velocidade do Vento ===
      new Chart(ventoCtx, {
        type: 'bar',
        data: {
          labels: ['Velocidade do Vento'],
          datasets: [{
            label: 'Vento (km/h)',
            data: [vento],
            backgroundColor: '#1d3557'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, max: 30 }
          }
        }
      });
    })
    .catch(err => {
      console.error('Erro ao carregar dados da API:', err.message);
    });

  // === 2. Público simulado ===
  new Chart(publicoCtx, {
    type: 'doughnut',
    data: {
      labels: ['Norte', 'Sul', 'Leste', 'Oeste'],
      datasets: [{
        label: 'Público',
        data: [3600, 2200, 3100, 4000],
        backgroundColor: ['#457b9d', '#a8dadc', '#f4a261', '#e76f51']
      }]
    },
    options: {
      responsive: true
    }
  });
});

