/**
 * ARQUIVO: env-loader.js
 * DESCRIÇÃO: Carregador de variáveis de ambiente para o front-end.
 * FUNCIONALIDADES: Centraliza as chaves de API para fácil manutenção e segurança.
 */

const ENV = (function() {
    'use strict';

    // Em um ambiente de produção real, estas chaves seriam injetadas pelo servidor de build
    // ou carregadas via uma chamada de API segura para o seu back-end.
    // Para este projeto, centralizamos aqui para facilitar a transição para um back-end real.
    const config = {
        FIREBASE_API_KEY: "AIzaSyDYaFrq8MphGFmR-zU00bO9fKBEUIH4UYM",
        WEATHER_API_KEY: "55e2f6c107b54f808f6145707252712"
    };

    return {
        get: (key) => config[key] || null
    };
})();
