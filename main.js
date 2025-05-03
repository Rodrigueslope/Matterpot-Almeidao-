const apiKey = 'SUA_NOVA_CHAVE_AQUI'; // Substitua pela sua chave válida
const cidade = 'João Pessoa';
const unidade = 'metric';
const lang = 'pt_br';

const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=${unidade}&lang=${lang}&appid=${apiKey}`;

// DOM Targets
const tempEl = document.getElementById('temperatura');
const ventoEl = document.getElementById('vento');

async function carregarClima() {
  try {
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
    const dados = await resposta.json();

    const temperatura = dados.main.temp.toFixed(1);
    const vento = dados.wind.speed.toFixed(1);

    tempEl.innerHTML = `${temperatura} °C`;
    ventoEl.innerHTML = `${vento} km/h`;

  } catch (erro) {
    tempEl.innerHTML = 'Erro ao carregar';
    ventoEl.innerHTML = 'Erro ao carregar';
    console.error('Falha ao buscar clima:', erro);
  }
}

carregarClima();
