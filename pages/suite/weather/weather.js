/**
 * ARQUIVO: weather.js
 * DESCRIÇÃO: Motor de clima com geolocalização de nível nativo (estilo Google Maps).
 * FUNCIONALIDADES: Bloqueio de IP impreciso, prioridade absoluta ao hardware de GPS e monitoramento contínuo.
 * VERSÃO: 2.0.0 - Auditoria Total e Comentários Detalhados
 */

/**
 * Módulo WeatherModule encapsulado para gerenciar a lógica de clima e geolocalização.
 */
const WeatherModule = (function() {
    'use strict';

    /**
     * Configurações globais do motor de clima.
     */
    const CONFIG = {
        API_KEY: '55e2f6c107b54f808f6145707252712', // Chave de acesso à API WeatherAPI
        DEFAULT_CITY: 'Jacinto Machado',             // Cidade padrão caso o GPS falhe
        UPDATE_INTERVAL: 15 * 60 * 1000,             // Intervalo de atualização (15 minutos)
        ENDPOINTS: {
            FORECAST: 'https://api.weatherapi.com/v1/forecast.json' // Endpoint para previsão
        },
        /**
         * Configurações agressivas de GPS (estilo Google Maps):
         * enableHighAccuracy: Força o uso do hardware de GPS em vez de triangulação de rede.
         * timeout: Tempo máximo de espera pelo sinal do satélite.
         * maximumAge: Garante que a localização seja sempre fresca, não usando cache.
         */
        GEO_OPTIONS: {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        },
        // Limite de precisão: Descarta localizações baseadas em IP (que costumam ter erro > 5km)
        MIN_ACCURACY: 2000 
    };

    let lastCoords = null;      // Armazena as últimas coordenadas válidas obtidas
    let watchId = null;         // ID do monitoramento contínuo de posição
    let isInitialLoad = true;   // Flag para controlar o primeiro carregamento

    /**
     * Sanitiza strings para evitar injeção de código malicioso no HTML.
     */
    function sanitize(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    /**
     * Exibe uma mensagem amigável quando o dispositivo está sem internet.
     */
    function showOfflineMessage() {
        const footer = document.querySelector('.weather-footer');
        if (footer) {
            footer.innerHTML = `
                <div class="weather-error">
                    <span style="font-size: 14px; opacity: 0.8;">🌐 Conecte-se à rede para atualizar o clima</span>
                </div>
            `;
            footer.style.backgroundImage = 'none';
        }
    }

    /**
     * Determina se é dia ou noite baseado no horário local do dispositivo.
     * Regra customizada: Dia (6h30 às 18h30), Noite (fora desse intervalo).
     * @returns {boolean} Verdadeiro se for dia.
     */
    function isDayTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        
        // 6h30 = 390 minutos, 18h30 = 1110 minutos
        const dayStart = 6 * 60 + 30;
        const dayEnd = 18 * 60 + 30;
        
        return totalMinutes >= dayStart && totalMinutes < dayEnd;
    }

    /**
     * Mapeia os códigos de condição da API para os ícones e templates visuais locais.
     * @param {number} conditionCode Código numérico da condição climática.
     * @param {boolean} isDay Status de dia/noite.
     * @returns {Object} Caminhos para o ícone e o template de fundo.
     */
    function getCustomAssets(conditionCode, isDay) {
        const moment = isDay ? 'Day' : 'Night';
        let iconFile = 'Sun.svg';
        let templateFile = `Weather=Clear, Moment=${moment}.svg`;

        // Seleção baseada nos códigos oficiais da WeatherAPI
        switch (conditionCode) {
            case 1000: // Céu limpo
                iconFile = isDay ? 'Sun.svg' : 'Moon.svg';
                templateFile = `Weather=Clear, Moment=${moment}.svg`;
                break;
            case 1003: // Parcialmente nublado
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
            case 1147: // Nevoeiro congelante
                iconFile = 'Group 5.svg';
                templateFile = `Weather=Cloudy, Moment=${moment}.svg`;
                break;
            case 1063: // Chuva leve irregular
            case 1150: // Chuvisco leve
            case 1153: // Chuvisco
            case 1180: // Chuva leve e irregular
            case 1183: // Chuva leve
            case 1240: // Aguaceiros leves
                iconFile = isDay ? 'sun rain.svg' : 'rain.svg';
                templateFile = isDay ? `Weather=Few Clouds, Moment=${moment}.svg` : `Weather=Rain, Moment=${moment}.svg`;
                break;
            case 1186: // Chuva moderada e irregular
            case 1189: // Chuva moderada
            case 1192: // Chuva forte e irregular
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
            case 1066: // Neve leve e irregular
            case 1114: // Neve soprada pelo vento
            case 1210: // Neve leve
            case 1213: // Neve leve e contínua
                iconFile = 'Group 7.svg';
                templateFile = `Weather=Cloudy, Moment=${moment}.svg`;
                break;
            default:
                iconFile = isDay ? 'Sun.svg' : 'Moon.svg';
                templateFile = `Weather=Clear, Moment=${moment}.svg`;
        }

        return {
            iconPath: `./database/Weather/icon/${iconFile}`,
            templatePath: `./database/Weather/templates/${templateFile}`
        };
    }

    /**
     * Renderiza os dados do clima na interface do usuário.
     * @param {Object} data Dados brutos retornados pela API.
     */
    function updateUI(data) {
        const footer = document.querySelector('.weather-footer');
        if (!footer) return;

        try {
            const current = data.current;
            const location = data.location;
            const forecastDay = data.forecast.forecastday[0].day;
            const isDay = isDayTime(); // Aplica a lógica customizada de dia/noite
            const assets = getCustomAssets(current.condition.code, isDay);

            // Aplica o template de fundo dinâmico
            footer.style.backgroundImage = `url('${assets.templatePath}')`;
            footer.style.backgroundSize = 'cover';
            footer.style.backgroundPosition = 'center';

            // Monta o HTML interno do widget de clima
            footer.innerHTML = `
                <div class="weather-content custom-theme">
                    <div class="weather-location">
                        <span class="weather-city">${sanitize(location.name)}, ${sanitize(location.country)}</span>
                    </div>
                    <div class="weather-main">
                        <div class="weather-icon-section">
                            <img src="${assets.iconPath}" alt="${sanitize(current.condition.text)}" class="weather-icon">
                        </div>
                        <div class="weather-temp-current">
                            <div class="weather-temp-line">
                                <span class="weather-temp-value">${Math.round(current.temp_c)}</span>
                                <span class="weather-temp-unit">°C</span>
                            </div>
                            <span class="weather-feels-like">Sensação: ${Math.round(current.feelslike_c)}°C</span>
                        </div>
                    </div>
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
        } catch (e) {
            console.error('[Weather] Erro crítico ao renderizar interface:', e);
            showError('Erro ao processar dados do clima');
        }
    }

    /**
     * Exibe uma mensagem de erro no widget de clima.
     */
    function showError(msg) {
        const footer = document.querySelector('.weather-footer');
        if (footer) {
            footer.innerHTML = `<div class="weather-error"><span>${sanitize(msg)}</span></div>`;
        }
    }

    /**
     * Realiza a requisição para a API de clima.
     * @param {Object|null} coords Coordenadas geográficas (latitude/longitude).
     */
    async function fetchWeather(coords = null) {
        // Verifica se há conexão com a internet
        if (!navigator.onLine) {
            showOfflineMessage();
            return;
        }

        // Evita requisições sem coordenadas após a carga inicial
        if (!coords && !isInitialLoad) return;

        let query = CONFIG.DEFAULT_CITY;
        if (coords) {
            // Se houver coordenadas, usa o formato "lat,lon"
            query = `${coords.latitude},${coords.longitude}`;
        } else {
            // Fallback para a cidade padrão na carga inicial
            query = CONFIG.DEFAULT_CITY;
        }

        try {
            const url = `${CONFIG.ENDPOINTS.FORECAST}?key=${CONFIG.API_KEY}&q=${encodeURIComponent(query)}&days=1&lang=pt`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            const data = await response.json();

            /**
             * FILTRO DE PRECISÃO:
             * Se a API retornar "Sombrio" (comum em IPs da região), forçamos Jacinto Machado
             * para garantir a fidelidade local solicitada.
             */
            if (data.location.name.includes("Sombrio")) {
                console.warn('[Weather] Localização imprecisa (Sombrio) detectada. Forçando Jacinto Machado.');
                const fallbackUrl = `${CONFIG.ENDPOINTS.FORECAST}?key=${CONFIG.API_KEY}&q=${encodeURIComponent(CONFIG.DEFAULT_CITY)}&days=1&lang=pt`;
                const fallbackRes = await fetch(fallbackUrl);
                const fallbackData = await fallbackRes.json();
                updateUI(fallbackData);
            } else {
                updateUI(data);
            }
            isInitialLoad = false;
        } catch (error) {
            console.error('[Weather] Erro ao buscar dados da API:', error);
            showError('Erro ao atualizar clima');
        }
    }

    /**
     * Inicializa o motor de geolocalização de alta precisão.
     */
    function initGeoEngine() {
        // Verifica se o navegador suporta geolocalização
        if (!navigator.geolocation) {
            fetchWeather(); // Fallback imediato para cidade padrão
            return;
        }

        /**
         * 1. Tenta obter a posição atual rapidamente.
         */
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Só aceita se a precisão for melhor que o limite definido (descarta IP)
                if (position.coords.accuracy <= CONFIG.MIN_ACCURACY) {
                    lastCoords = position.coords;
                    fetchWeather(lastCoords);
                } else {
                    fetchWeather(); // Fallback se for impreciso
                }
            },
            () => fetchWeather(), // Fallback em caso de erro de permissão ou sinal
            CONFIG.GEO_OPTIONS
        );

        /**
         * 2. Monitoramento contínuo (Watch Position).
         * Refina a localização conforme o sinal do GPS melhora.
         */
        if (watchId) navigator.geolocation.clearWatch(watchId);
        
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const newCoords = position.coords;
                // Só atualiza se a precisão for alta (GPS real do hardware)
                if (newCoords.accuracy <= CONFIG.MIN_ACCURACY) {
                    // Atualiza se for a primeira vez ou se a nova precisão for melhor que a anterior
                    if (!lastCoords || newCoords.accuracy < lastCoords.accuracy) {
                        console.log(`[Weather] GPS Lock Refinado: ${newCoords.accuracy}m`);
                        lastCoords = newCoords;
                        fetchWeather(lastCoords);
                    }
                }
            },
            (error) => console.warn('[Weather] Erro no monitoramento GPS:', error.message),
            CONFIG.GEO_OPTIONS
        );
    }

    /**
     * Expõe os métodos públicos e configura os intervalos de atualização.
     */
    return {
        init: function() {
            initGeoEngine(); // Inicia o motor de localização
            
            // Agenda atualizações periódicas
            setInterval(() => fetchWeather(lastCoords), CONFIG.UPDATE_INTERVAL);
            
            // Listeners para reconexão de rede
            window.addEventListener('online', () => fetchWeather(lastCoords));
            window.addEventListener('offline', showOfflineMessage);
        }
    };
})();

/**
 * Inicialização segura do módulo.
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', WeatherModule.init);
} else {
    WeatherModule.init();
}
