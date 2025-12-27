/**
 * ARQUIVO: weather.js
 * DESCRIÇÃO: Gerencia a integração com a API de clima (WeatherAPI).
 * FUNCIONALIDADES: Exibe SEMPRE os dados de JACINTO MACHADO.
 * OBSERVAÇÃO: A pedido do usuário, a localização automática foi desativada para garantir que sempre mostre a cidade correta.
 */

// CONFIGURAÇÕES DA API
const WEATHER_API_KEY = '55e2f6c107b54f808f6145707252712'; // Chave de acesso à WeatherAPI
const WEATHER_API_FORECAST = 'https://api.weatherapi.com/v1/forecast.json'; // Endpoint para dados atuais e previsão

// LOCALIZAÇÃO FIXA DEFINIDA PELO USUÁRIO
const FIXED_LOCATION = 'Jacinto Machado';

/**
 * FUNÇÃO: Inicialização ao carregar a página
 * O QUE FAZ: Dispara a busca inicial do clima e configura a atualização periódica.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Chama a função principal para carregar o clima assim que o site abre
    initWeatherWidget();
    
    // Configura um temporizador para atualizar o clima de Jacinto Machado a cada 15 minutos (900.000 ms)
    setInterval(initWeatherWidget, 15 * 60 * 1000);
});

/**
 * FUNÇÃO: initWeatherWidget
 * O QUE FAZ: Inicia o processo de busca de dados para a cidade fixa (Jacinto Machado).
 */
async function initWeatherWidget() {
    console.log('--- INICIANDO WEATHER WIDGET (MODO FIXO: JACINTO MACHADO) ---');
    
    // Seleciona o elemento do rodapé onde o clima será exibido
    const weatherFooter = document.querySelector('.weather-footer');
    if (!weatherFooter) return; // Se o elemento não existir, interrompe a execução

    // Busca os dados meteorológicos especificamente para Jacinto Machado
    await fetchWeatherData(FIXED_LOCATION);

    /* 
       CÓDIGO DE LOCALIZAÇÃO DINÂMICA (DESATIVADO A PEDIDO DO USUÁRIO)
       Este bloco está comentado para evitar que o navegador peça permissão de GPS 
       ou mude a cidade automaticamente para locais vizinhos (como Sombrio).
       
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // fetchWeatherData(`${position.coords.latitude},${position.coords.longitude}`);
            },
            (error) => { console.log('GPS desativado.'); },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }
    */
}

/**
 * FUNÇÃO: fetchWeatherData
 * O QUE FAZ: Faz a requisição para a API externa e processa a resposta JSON.
 * PARÂMETROS: query (nome da cidade ou coordenadas).
 */
async function fetchWeatherData(query) {
    console.log(`🔍 Buscando dados na API para: ${query}`);
    try {
        // Monta a URL da requisição pedindo 1 dia de previsão (para obter máxima e mínima) e idioma em português
        const url = `${WEATHER_API_FORECAST}?key=${WEATHER_API_KEY}&q=${query}&days=1&lang=pt`;
        
        // Realiza a chamada assíncrona para a API
        const response = await fetch(url);
        
        // Verifica se a resposta foi bem-sucedida (status 200)
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        
        // Converte a resposta bruta em um objeto JavaScript (JSON)
        const data = await response.json();
        
        // Verifica se os dados essenciais (clima atual e previsão) estão presentes
        if (data.current && data.forecast && data.forecast.forecastday[0]) {
            // Chama a função para desenhar as informações na tela
            displayWeatherInfo(data);
        }
    } catch (error) {
        // Em caso de erro (falta de internet, chave inválida, etc), exibe mensagem de erro no console e na tela
        console.error('❌ Erro ao buscar clima:', error);
        showWeatherError('Erro ao buscar clima');
    }
}

/**
 * FUNÇÃO: getCustomAssets
 * O QUE FAZ: Escolhe o ícone (.svg) e a imagem de fundo (.svg) com base na condição do tempo e se é dia ou noite.
 * PARÂMETROS: conditionCode (código da WeatherAPI), isDay (booleano 0 ou 1).
 */
function getCustomAssets(conditionCode, isDay) {
    // Define se é 'Day' ou 'Night' para compor o nome do arquivo de template
    const moment = isDay ? 'Day' : 'Night';
    
    // Valores padrão (caso a condição não seja mapeada)
    let iconFile = 'Sun.svg';
    let templateFile = `Weather=Clear, Moment=${moment}.svg`;

    // Mapeamento baseado nos códigos oficiais da WeatherAPI
    switch (conditionCode) {
        case 1000: // Céu Limpo / Ensolarado
            iconFile = isDay ? 'Sun.svg' : 'Moon.svg';
            templateFile = `Weather=Clear, Moment=${moment}.svg`;
            break;
        case 1003: // Parcialmente Nublado
            iconFile = isDay ? 'sun clouds.svg' : 'Moon clouds.svg';
            templateFile = `Weather=Few Clouds, Moment=${moment}.svg`;
            break;
        case 1006: // Nublado
        case 1009: // Encoberto
            iconFile = isDay ? 'sun clouds-1.svg' : 'Moon,stars and cloud.svg';
            templateFile = `Weather=Cloudy, Moment=${moment}.svg`;
            break;
        case 1030: // Névoa
        case 1135: // Nevoeiro
        case 1147: // Nevoeiro Congelante
            iconFile = 'Group 5.svg';
            templateFile = `Weather=Cloudy, Moment=${moment}.svg`;
            break;
        case 1063: // Possibilidade de chuva
        case 1150: // Chuvisco leve
        case 1153: // Chuvisco
        case 1180: // Chuva leve irregular
        case 1183: // Chuva leve
        case 1240: // Aguaceiros leves
            iconFile = isDay ? 'sun rain.svg' : 'rain.svg';
            templateFile = isDay ? `Weather=Few Clouds, Moment=${moment}.svg` : `Weather=Rain, Moment=${moment}.svg`;
            break;
        case 1186: // Chuva moderada ocasional
        case 1189: // Chuva moderada
        case 1192: // Chuva forte ocasional
        case 1195: // Chuva forte
        case 1243: // Aguaceiros moderados ou fortes
        case 1246: // Aguaceiros torrenciais
            iconFile = 'rain.svg';
            templateFile = `Weather=Rain, Moment=${moment}.svg`;
            break;
        case 1087: // Trovoadas
        case 1273: // Chuva leve com trovoadas
        case 1276: // Chuva moderada ou forte com trovoadas
            iconFile = 'Group 6.svg';
            templateFile = `Weather=Storm, Moment=${moment}.svg`;
            break;
        case 1066: // Possibilidade de neve
        case 1114: // Neve soprada
        case 1210: // Neve leve irregular
        case 1213: // Neve leve
            iconFile = 'Group 7.svg';
            templateFile = `Weather=Cloudy, Moment=${moment}.svg`;
            break;
        default:
            // Fallback para qualquer outra condição desconhecida
            iconFile = isDay ? 'Sun.svg' : 'Moon.svg';
            templateFile = `Weather=Clear, Moment=${moment}.svg`;
    }

    // Retorna os caminhos completos para os arquivos de imagem
    return {
        iconPath: `./database/Weather/icon/${iconFile}`,
        templatePath: `./database/Weather/templates/${templateFile}`
    };
}

/**
 * FUNÇÃO: displayWeatherInfo
 * O QUE FAZ: Gera o HTML dinâmico com os dados do clima e insere na página.
 * PARÂMETROS: data (objeto com dados da API).
 */
function displayWeatherInfo(data) {
    const weatherFooter = document.querySelector('.weather-footer');
    if (!weatherFooter) return;

    // Extrai as partes necessárias do objeto de dados
    const current = data.current; // Dados atuais (temp, umidade, etc)
    const location = data.location; // Dados do local (nome da cidade, país)
    const forecastDay = data.forecast.forecastday[0].day; // Dados da previsão do dia (máx/mín)
    const isDay = current.is_day === 1; // Verifica se é dia (1) ou noite (0)
    
    // Obtém os caminhos das imagens personalizadas
    const assets = getCustomAssets(current.condition.code, isDay);

    // Aplica a imagem de fundo dinâmica ao widget usando CSS inline
    weatherFooter.style.backgroundImage = `url('${assets.templatePath}')`;
    weatherFooter.style.backgroundSize = 'cover';
    weatherFooter.style.backgroundPosition = 'center';

    // Monta a estrutura HTML interna do widget
    weatherFooter.innerHTML = `
        <div class="weather-content custom-theme">
            <!-- Nome da Cidade e País -->
            <div class="weather-location">
                <span class="weather-city">${location.name}, ${location.country}</span>
            </div>
            
            <!-- Bloco Principal: Ícone e Temperatura Atual -->
            <div class="weather-main">
                <div class="weather-icon-section">
                    <img src="${assets.iconPath}" alt="${current.condition.text}" class="weather-icon">
                </div>
                
                <div class="weather-temp-current">
                    <div class="weather-temp-line">
                        <span class="weather-temp-value">${Math.round(current.temp_c)}</span>
                        <span class="weather-temp-unit">°C</span>
                    </div>
                    <span class="weather-feels-like">Sensação: ${Math.round(current.feelslike_c)}°C</span>
                </div>
            </div>
            
            <!-- Bloco de Detalhes: Máxima, Mínima, Umidade, Nuvens e Chuva -->
            <div class="weather-details">
                <div class="weather-detail-item">
                    <span class="weather-detail-label">Máx.</span>
                    <span class="weather-detail-value">${Math.round(forecastDay.maxtemp_c)}°C</span>
                </div>
                <div class="weather-detail-item">
                    <span class="weather-detail-label">Mín.</span>
                    <span class="weather-detail-value">${Math.round(forecastDay.mintemp_c)}°C</span>
                </div>
                <div class="weather-detail-item">
                    <span class="weather-detail-label">Humid.</span>
                    <span class="weather-detail-value">${current.humidity}%</span>
                </div>
                <div class="weather-detail-item">
                    <span class="weather-detail-label">Nuvens</span>
                    <span class="weather-detail-value">${current.cloud}%</span>
                </div>
                <div class="weather-detail-item">
                    <span class="weather-detail-label">Chuva</span>
                    <span class="weather-detail-value">${current.precip_mm}mm</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * FUNÇÃO: showWeatherError
 * O QUE FAZ: Exibe uma mensagem de erro visual caso a API falhe.
 */
function showWeatherError(msg) {
    const footer = document.querySelector('.weather-footer');
    if (footer) {
        footer.innerHTML = `<div class="weather-error"><span>${msg}</span></div>`;
    }
}
