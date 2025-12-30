/**
 * ARQUIVO: weather.js
 * DESCRIÇÃO: Motor de clima com geolocalização de nível nativo (estilo Google Maps).
 * FUNCIONALIDADES: Bloqueio de IP impreciso, prioridade absoluta ao hardware de GPS e monitoramento contínuo.
 */

const WeatherModule = (function() {
    'use strict';

    const CONFIG = {
        API_KEY: '55e2f6c107b54f808f6145707252712',
        DEFAULT_CITY: 'Jacinto Machado',
        UPDATE_INTERVAL: 15 * 60 * 1000,
        ENDPOINTS: {
            FORECAST: 'https://api.weatherapi.com/v1/forecast.json'
        },
        // Configurações agressivas de GPS (estilo Google Maps)
        GEO_OPTIONS: {
            enableHighAccuracy: true, // Força o uso do GPS real do celular
            timeout: 15000,           // Espera até 15 segundos pelo sinal do satélite
            maximumAge: 0             // Proíbe o uso de localização em cache/IP
        },
        MIN_ACCURACY: 2000 // Só aceita se a precisão for melhor que 2km (descarta IP que costuma ser >5km)
    };

    let lastCoords = null;
    let watchId = null;
    let isInitialLoad = true;

    function sanitize(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

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

    function getCustomAssets(conditionCode, isDay) {
        const moment = isDay ? 'Day' : 'Night';
        let iconFile = 'Sun.svg';
        let templateFile = `Weather=Clear, Moment=${moment}.svg`;

        switch (conditionCode) {
            case 1000:
                iconFile = isDay ? 'Sun.svg' : 'Moon.svg';
                templateFile = `Weather=Clear, Moment=${moment}.svg`;
                break;
            case 1003:
                iconFile = isDay ? 'sun clouds.svg' : 'Moon clouds.svg';
                templateFile = `Weather=Few Clouds, Moment=${moment}.svg`;
                break;
            case 1006:
            case 1009:
                iconFile = isDay ? 'sun clouds-1.svg' : 'Moon,stars and cloud.svg';
                templateFile = `Weather=Cloudy, Moment=${moment}.svg`;
                break;
            case 1030:
            case 1135:
            case 1147:
                iconFile = 'Group 5.svg';
                templateFile = `Weather=Cloudy, Moment=${moment}.svg`;
                break;
            case 1063:
            case 1150:
            case 1153:
            case 1180:
            case 1183:
            case 1240:
                iconFile = isDay ? 'sun rain.svg' : 'rain.svg';
                templateFile = isDay ? `Weather=Few Clouds, Moment=${moment}.svg` : `Weather=Rain, Moment=${moment}.svg`;
                break;
            case 1186:
            case 1189:
            case 1192:
            case 1195:
            case 1243:
            case 1246:
                iconFile = 'rain.svg';
                templateFile = `Weather=Rain, Moment=${moment}.svg`;
                break;
            case 1087:
            case 1273:
            case 1276:
                iconFile = 'Group 6.svg';
                templateFile = `Weather=Storm, Moment=${moment}.svg`;
                break;
            case 1066:
            case 1114:
            case 1210:
            case 1213:
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

    function updateUI(data) {
        const footer = document.querySelector('.weather-footer');
        if (!footer) return;

        try {
            const current = data.current;
            const location = data.location;
            const forecastDay = data.forecast.forecastday[0].day;
            const isDay = current.is_day === 1;
            const assets = getCustomAssets(current.condition.code, isDay);

            footer.style.backgroundImage = `url('${assets.templatePath}')`;
            footer.style.backgroundSize = 'cover';
            footer.style.backgroundPosition = 'center';

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
            console.error('[Weather] Erro ao renderizar UI:', e);
            showError('Erro ao processar dados do clima');
        }
    }

    function showError(msg) {
        const footer = document.querySelector('.weather-footer');
        if (footer) {
            footer.innerHTML = `<div class="weather-error"><span>${sanitize(msg)}</span></div>`;
        }
    }

    /**
     * Busca o clima com prioridade absoluta para coordenadas.
     */
    async function fetchWeather(coords = null) {
        if (!navigator.onLine) {
            showOfflineMessage();
            return;
        }

        // Se não tiver coordenadas e não for a carga inicial, não faz nada para evitar pular para Sombrio
        if (!coords && !isInitialLoad) return;

        let query = CONFIG.DEFAULT_CITY;
        if (coords) {
            query = `${coords.latitude},${coords.longitude}`;
        } else {
            // Na carga inicial, se não tiver GPS ainda, usa Jacinto Machado direto em vez de auto:ip
            query = CONFIG.DEFAULT_CITY;
        }

        try {
            const url = `${CONFIG.ENDPOINTS.FORECAST}?key=${CONFIG.API_KEY}&q=${encodeURIComponent(query)}&days=1&lang=pt`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            // Se a API retornar Sombrio (mesmo com coordenadas imprecisas), força Jacinto Machado
            if (data.location.name.includes("Sombrio")) {
                console.warn('[Weather] Localização imprecisa detectada. Forçando Jacinto Machado.');
                const fallbackUrl = `${CONFIG.ENDPOINTS.FORECAST}?key=${CONFIG.API_KEY}&q=${encodeURIComponent(CONFIG.DEFAULT_CITY)}&days=1&lang=pt`;
                const fallbackRes = await fetch(fallbackUrl);
                const fallbackData = await fallbackRes.json();
                updateUI(fallbackData);
            } else {
                updateUI(data);
            }
            isInitialLoad = false;
        } catch (error) {
            console.error('[Weather] Erro ao buscar clima:', error);
            showError('Erro ao atualizar clima');
        }
    }

    /**
     * Motor de geolocalização agressivo.
     */
    function initGeoEngine() {
        if (!navigator.geolocation) {
            fetchWeather();
            return;
        }

        // 1. Tenta um "lock" rápido de GPS
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (position.coords.accuracy <= CONFIG.MIN_ACCURACY) {
                    lastCoords = position.coords;
                    fetchWeather(lastCoords);
                } else {
                    fetchWeather(); // Fallback para Jacinto Machado se for impreciso (IP)
                }
            },
            () => fetchWeather(), // Fallback para Jacinto Machado em caso de erro
            CONFIG.GEO_OPTIONS
        );

        // 2. Monitoramento contínuo para refinar (estilo Google Maps)
        if (watchId) navigator.geolocation.clearWatch(watchId);
        
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const newCoords = position.coords;
                // Só atualiza se a precisão for boa (GPS real)
                if (newCoords.accuracy <= CONFIG.MIN_ACCURACY) {
                    if (!lastCoords || newCoords.accuracy < lastCoords.accuracy) {
                        console.log(`[Weather] GPS Lock: ${newCoords.accuracy}m`);
                        lastCoords = newCoords;
                        fetchWeather(lastCoords);
                    }
                }
            },
            (error) => console.warn('[Weather] GPS Watch Error:', error.message),
            CONFIG.GEO_OPTIONS
        );
    }

    return {
        init: function() {
            initGeoEngine();
            setInterval(() => fetchWeather(lastCoords), CONFIG.UPDATE_INTERVAL);
            window.addEventListener('online', () => fetchWeather(lastCoords));
            window.addEventListener('offline', showOfflineMessage);
        }
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', WeatherModule.init);
} else {
    WeatherModule.init();
}
