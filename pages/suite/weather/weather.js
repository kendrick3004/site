/**
 * ARQUIVO: weather.js
 * DESCRIÇÃO: Módulo de clima com alta robustez e segurança.
 * FUNCIONALIDADES: Integração com WeatherAPI, tratamento de erros e exibição de dados.
 * OBSERVAÇÃO: Travado em Jacinto Machado conforme solicitação do usuário.
 */

const WeatherModule = (function() {
    'use strict';

    // Configurações privadas encapsuladas para segurança
    const CONFIG = {
        API_KEY: '55e2f6c107b54f808f6145707252712',
        DEFAULT_CITY: 'Jacinto Machado',
        UPDATE_INTERVAL: 15 * 60 * 1000, // 15 minutos
        ENDPOINTS: {
            FORECAST: 'https://api.weatherapi.com/v1/forecast.json'
        }
    };

    /**
     * Sanitiza strings para evitar ataques XSS ao inserir dados dinâmicos no DOM.
     */
    function sanitize(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    /**
     * Mapeia códigos de condição da WeatherAPI para ícones e templates locais.
     */
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

    /**
     * Atualiza a interface com tratamento de erros e segurança.
     */
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

            // Template seguro usando strings sanitizadas
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
     * Busca dados da API com AbortController para evitar requisições pendentes.
     */
    async function fetchWeather() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const url = `${CONFIG.ENDPOINTS.FORECAST}?key=${CONFIG.API_KEY}&q=${encodeURIComponent(CONFIG.DEFAULT_CITY)}&days=1&lang=pt`;
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn('[Weather] Requisição expirou (timeout)');
            } else {
                console.error('[Weather] Erro na busca:', error);
                showError('Serviço de clima temporariamente indisponível');
            }
        }
    }

    // API Pública do Módulo
    return {
        init: function() {
            fetchWeather();
            setInterval(fetchWeather, CONFIG.UPDATE_INTERVAL);
        }
    };
})();

// Inicialização segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', WeatherModule.init);
} else {
    WeatherModule.init();
}
