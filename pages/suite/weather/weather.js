/**
 * ARQUIVO: weather.js
 * DESCRIÇÃO: Motor de clima com geolocalização de nível nativo e suporte offline.
 * FUNCIONALIDADES: Persistência de dados local, geolocalização rápida (5s) e avisos de conectividade.
 * VERSÃO: 2.3.0 - Resiliência Offline e Otimização de GPS
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
        GEO_OPTIONS: {
            enableHighAccuracy: true,
            timeout: 5000, // Reduzido para 5 segundos conforme solicitado
            maximumAge: 0
        },
        MIN_ACCURACY: 2000,
        STORAGE_KEY: 'suite_weather_data' // Chave para persistência local
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

    /**
     * Salva os dados do clima no LocalStorage para persistência offline.
     */
    function saveToLocal(data) {
        try {
            const payload = {
                timestamp: Date.now(),
                data: data
            };
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
            console.error('[Weather] Erro ao salvar no LocalStorage:', e);
        }
    }

    /**
     * Carrega os dados do clima do LocalStorage.
     */
    function loadFromLocal() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved).data;
            }
        } catch (e) {
            console.error('[Weather] Erro ao carregar do LocalStorage:', e);
        }
        return null;
    }

    function showOfflineMessage() {
        const footer = document.querySelector('.weather-footer');
        if (footer) {
            const offlineBanner = document.createElement('div');
            offlineBanner.className = 'weather-offline-banner';
            offlineBanner.innerHTML = '🌐 Conecte-se à internet para atualizar o clima';
            offlineBanner.style.cssText = 'font-size: 12px; background: rgba(0,0,0,0.5); padding: 4px; text-align: center; width: 100%; position: absolute; top: 0;';
            
            if (!footer.querySelector('.weather-offline-banner')) {
                footer.style.position = 'relative';
                footer.prepend(offlineBanner);
            }
        }
    }

    function isDayTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        const dayStart = 6 * 60 + 30;
        const dayEnd = 18 * 60 + 30;
        return totalMinutes >= dayStart && totalMinutes < dayEnd;
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
            const isDay = isDayTime();
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
            
            // Se estiver offline, reaplica o aviso após limpar o innerHTML
            if (!navigator.onLine) showOfflineMessage();
            
        } catch (e) {
            console.error('[Weather] Erro ao renderizar interface:', e);
        }
    }

    async function fetchWeather() {
        if (!navigator.onLine) {
            const cachedData = loadFromLocal();
            if (cachedData) {
                updateUI(cachedData);
                showOfflineMessage();
            }
            return;
        }

        // Localização fixada permanentemente em Jacinto Machado conforme diretriz do usuário
        const query = CONFIG.DEFAULT_CITY;

        try {
            const url = `${CONFIG.ENDPOINTS.FORECAST}?key=${CONFIG.API_KEY}&q=${encodeURIComponent(query)}&days=1&lang=pt`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            const data = await response.json();

            updateUI(data);
            saveToLocal(data); // Salva para uso offline futuro
        } catch (e) {
            console.error('[Weather] Erro na requisição:', e);
            const cachedData = loadFromLocal();
            if (cachedData) updateUI(cachedData);
        }
    }

    function init() {
        // Carrega dados cacheados imediatamente para evitar tela vazia
        const cachedData = loadFromLocal();
        if (cachedData) updateUI(cachedData);

        // Busca inicial fixada em Jacinto Machado
        fetchWeather();

        // Atualização periódica
        setInterval(() => fetchWeather(), CONFIG.UPDATE_INTERVAL);
        
        // Listeners de conectividade
        window.addEventListener('online', () => fetchWeather());
        window.addEventListener('offline', showOfflineMessage);
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', WeatherModule.init);
