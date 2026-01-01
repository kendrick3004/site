/*
 * ARQUIVO: login.js
 * DESCRIÇÃO: Lógica de autenticação, validação de usuários e sistema de bloqueio persistente.
 * FUNCIONALIDADES: Gerencia o login, contador de erros e bloqueio temporário via localStorage.
 * VERSÃO: 2.0.0 - Auditoria Total e Comentários Detalhados
 */

/**
 * Chaves utilizadas para armazenar dados no localStorage do navegador.
 * ERROR_COUNT: Armazena o número de tentativas falhas consecutivas.
 * BLOCK_UNTIL: Armazena o timestamp (em milissegundos) até quando o usuário está bloqueado.
 */
const STORAGE_KEYS = {
    ERROR_COUNT: 'login_error_count',
    BLOCK_UNTIL: 'login_block_until'
};

/**
 * Obtém o contador de erros atual do localStorage.
 * @returns {number} O número de erros registrados, ou 0 se não houver registro.
 */
function getErrorCount() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.ERROR_COUNT) || '0');
}

/**
 * Salva o contador de erros no localStorage.
 * @param {number} count O novo valor do contador de erros.
 */
function setErrorCount(count) {
    localStorage.setItem(STORAGE_KEYS.ERROR_COUNT, count.toString());
}

/**
 * Obtém o timestamp de bloqueio do localStorage.
 * @returns {number} O timestamp de expiração do bloqueio, ou 0 se não houver bloqueio.
 */
function getBlockUntil() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.BLOCK_UNTIL) || '0');
}

/**
 * Salva o timestamp de bloqueio no localStorage.
 * @param {number} timestamp O timestamp absoluto (Date.now() + tempo) para o bloqueio.
 */
function setBlockUntil(timestamp) {
    localStorage.setItem(STORAGE_KEYS.BLOCK_UNTIL, timestamp.toString());
}

/**
 * Remove todos os dados relacionados a erros e bloqueios do localStorage.
 * Chamada após um login bem-sucedido ou quando o bloqueio expira.
 */
function clearBlockData() {
    localStorage.removeItem(STORAGE_KEYS.ERROR_COUNT);
    localStorage.removeItem(STORAGE_KEYS.BLOCK_UNTIL);
}

/**
 * Verifica se o usuário está atualmente sob bloqueio temporal.
 * @returns {Object} Objeto contendo o status de bloqueio e o tempo restante em segundos.
 */
function checkBlockStatus() {
    const blockUntil = getBlockUntil();
    const now = Date.now();
    
    // Se o timestamp de bloqueio for maior que o tempo atual, o usuário ainda está bloqueado
    if (blockUntil > now) {
        return {
            blocked: true,
            remainingTime: Math.ceil((blockUntil - now) / 1000) // Converte milissegundos para segundos
        };
    }
    
    return { blocked: false, remainingTime: 0 };
}

/**
 * Implementa o bloqueio visual e funcional do formulário de login.
 * @param {HTMLButtonElement} button O botão de submissão do formulário.
 * @param {HTMLElement} errorDiv O elemento onde as mensagens de erro são exibidas.
 * @param {number} seconds A duração do bloqueio em segundos.
 */
function blockForm(button, errorDiv, seconds) {
    // Calcula e salva o momento exato em que o bloqueio deve terminar
    const blockUntil = Date.now() + (seconds * 1000);
    setBlockUntil(blockUntil);
    
    // Desabilita o botão para impedir novas tentativas
    button.disabled = true;
    button.textContent = "Bloqueado";
    
    /**
     * Função interna recursiva para atualizar o cronômetro de bloqueio na tela.
     */
    const updateTimer = () => {
        const status = checkBlockStatus();
        
        if (status.blocked) {
            // Atualiza a mensagem com o tempo restante
            errorDiv.textContent = `Você está bloqueado por ${status.remainingTime} segundos!`;
            setTimeout(updateTimer, 1000); // Agenda a próxima atualização para daqui a 1 segundo
        } else {
            // O tempo de bloqueio expirou, restaura o estado original do formulário
            button.disabled = false;
            button.textContent = "Entrar";
            errorDiv.textContent = "Tente novamente a senha correta";
            
            // Limpa a mensagem de instrução após 3 segundos
            setTimeout(() => {
                if (errorDiv.textContent === "Tente novamente a senha correta") {
                    errorDiv.textContent = "";
                }
            }, 3000);
        }
    };
    
    updateTimer(); // Inicia o ciclo de atualização do timer
}

/**
 * Listener executado quando o DOM está totalmente carregado.
 * Verifica se o usuário já estava bloqueado em uma sessão anterior.
 */
window.addEventListener('DOMContentLoaded', () => {
    const errorDiv = document.getElementById("loginError");
    const form = document.getElementById("loginForm");
    const button = form.querySelector("button");
    
    const status = checkBlockStatus();
    
    if (status.blocked) {
        // Se houver um bloqueio ativo persistido, reativa o mecanismo de bloqueio visual
        blockForm(button, errorDiv, status.remainingTime);
    }
});

/**
 * Gerenciador do evento de submissão do formulário de login.
 */
document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // Impede o recarregamento da página padrão do formulário

    // Obtém e limpa os valores digitados pelo usuário
    const userInput = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;

    // Referências aos elementos da interface
    const errorDiv = document.getElementById("loginError");
    const form = document.getElementById("loginForm");
    const button = form.querySelector("button");

    // Verifica se o usuário está bloqueado antes de processar qualquer lógica
    const status = checkBlockStatus();
    if (status.blocked) {
        errorDiv.textContent = `Você está bloqueado por ${status.remainingTime} segundos!`;
        return;
    }

    errorDiv.textContent = ""; // Limpa mensagens de erro anteriores

    // Validação básica de campos vazios
    if (!userInput || !pass) {
        errorDiv.textContent = "Preencha usuário e senha.";
        return;
    }

    try {
        // Busca a lista de usuários autorizados do arquivo JSON
        // 'cache: no-store' garante que sempre buscaremos a versão mais recente do servidor
        const res = await fetch('./login/users.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('Não foi possível carregar usuários.');
        const data = await res.json();

        // Procura o usuário pelo nome de usuário ou pelo e-mail (case-insensitive)
        const found = data.users.find(u =>
            (u.username && u.username.toLowerCase() === userInput.toLowerCase()) ||
            (u.email && u.email.toLowerCase() === userInput.toLowerCase())
        );

        // Verifica se o usuário existe e se a senha coincide exatamente
        if (!found || found.password !== pass) {
            // Lógica de tratamento de erro de autenticação
            let errorCount = getErrorCount();
            errorCount++;
            setErrorCount(errorCount);

            // Se atingir 3 erros, inicia o bloqueio temporal
            if (errorCount >= 3) {
                errorDiv.textContent = "Você será bloqueado por 10 segundos!";
                setTimeout(() => {
                    blockForm(button, errorDiv, 10);
                }, 1000);
            } else if (errorCount === 1) {
                errorDiv.textContent = "Usuário ou senha inválidos! Você terá mais duas tentativas até chegar na última.";
            } else if (errorCount === 2) {
                errorDiv.textContent = "Usuário ou senha inválidos! Você terá mais uma tentativa até chegar na última.";
            } else {
                errorDiv.textContent = "Usuário ou senha inválidos!";
            }

            return;
        }

        // LOGIN BEM-SUCEDIDO
        clearBlockData(); // Limpa qualquer rastro de erros anteriores
        
        // Salva os dados básicos do usuário na sessão (localStorage)
        localStorage.setItem('auth_user', JSON.stringify({ 
            id: found.id, 
            name: found.name, 
            role: found.role 
        }));
        
        // Redireciona o usuário para a página inicial do aplicativo
        window.location.href = "../index.html";

    } catch (err) {
        // Tratamento de erros de rede ou processamento
        console.error('[Login] Erro crítico:', err);
        errorDiv.textContent = 'Erro ao processar login. Tente novamente.';
    }
});
