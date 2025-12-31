/*
Este arquivo JavaScript (login.js) é responsável pela lógica de autenticação da página de login.
Ele gerencia a validação do usuário e senha, exibe mensagens de erro e implementa um mecanismo de bloqueio
após múltiplas tentativas falhas de login com persistência usando localStorage.
*/

// Chaves do localStorage
const STORAGE_KEYS = {
    ERROR_COUNT: 'login_error_count',
    BLOCK_UNTIL: 'login_block_until'
};

// Função para obter o contador de erros do localStorage
function getErrorCount() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.ERROR_COUNT) || '0');
}

// Função para salvar o contador de erros no localStorage
function setErrorCount(count) {
    localStorage.setItem(STORAGE_KEYS.ERROR_COUNT, count.toString());
}

// Função para obter o timestamp de bloqueio do localStorage
function getBlockUntil() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.BLOCK_UNTIL) || '0');
}

// Função para salvar o timestamp de bloqueio no localStorage
function setBlockUntil(timestamp) {
    localStorage.setItem(STORAGE_KEYS.BLOCK_UNTIL, timestamp.toString());
}

// Função para limpar os dados de bloqueio
function clearBlockData() {
    localStorage.removeItem(STORAGE_KEYS.ERROR_COUNT);
    localStorage.removeItem(STORAGE_KEYS.BLOCK_UNTIL);
}

// Função para verificar se está bloqueado
function checkBlockStatus() {
    const blockUntil = getBlockUntil();
    const now = Date.now();
    
    if (blockUntil > now) {
        return {
            blocked: true,
            remainingTime: Math.ceil((blockUntil - now) / 1000)
        };
    }
    
    return { blocked: false, remainingTime: 0 };
}

// Função para bloquear o formulário
function blockForm(button, errorDiv, seconds) {
    const blockUntil = Date.now() + (seconds * 1000);
    setBlockUntil(blockUntil);
    
    button.disabled = true;
    button.textContent = "Bloqueado";
    
    const updateTimer = () => {
        const status = checkBlockStatus();
        
        if (status.blocked) {
            errorDiv.textContent = `Você está bloqueado por ${status.remainingTime} segundos!`;
            setTimeout(updateTimer, 1000);
        } else {
            button.disabled = false;
            button.textContent = "Entrar";
            errorDiv.textContent = "Tente novamente a senha correta";
            // Limpa a mensagem após 3 segundos
            setTimeout(() => {
                if (errorDiv.textContent === "Tente novamente a senha correta") {
                    errorDiv.textContent = "";
                }
            }, 3000);
        }
    };
    
    updateTimer();
}

// Verificar bloqueio ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const errorDiv = document.getElementById("loginError");
    const form = document.getElementById("loginForm");
    const button = form.querySelector("button");
    
    const status = checkBlockStatus();
    
    if (status.blocked) {
        // Se ainda está bloqueado, reativa o timer
        blockForm(button, errorDiv, status.remainingTime);
    }
});

// Evento de submissão do formulário
document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const userInput = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;

    const errorDiv = document.getElementById("loginError");
    const form = document.getElementById("loginForm");
    const button = form.querySelector("button");

    // Verificar se está bloqueado
    const status = checkBlockStatus();
    if (status.blocked) {
        errorDiv.textContent = `Você está bloqueado por ${status.remainingTime} segundos!`;
        return;
    }

    errorDiv.textContent = "";

    if (!userInput || !pass) {
        errorDiv.textContent = "Preencha usuário e senha.";
        return;
    }

    try {
        const res = await fetch('./login/users.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('Não foi possível carregar usuários.');
        const data = await res.json();

        const found = data.users.find(u =>
            (u.username && u.username.toLowerCase() === userInput.toLowerCase()) ||
            (u.email && u.email.toLowerCase() === userInput.toLowerCase())
        );

        if (!found || found.password !== pass) {
            // Incrementa o contador de erros
            let errorCount = getErrorCount();
            errorCount++;
            setErrorCount(errorCount);

            if (errorCount >= 3) {
                errorDiv.textContent = "Você será bloqueado por 10 segundos!";
                // Bloqueia por 10 segundos
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

        // Autenticação bem-sucedida - limpa os dados de bloqueio
        clearBlockData();
        localStorage.setItem('auth_user', JSON.stringify({ id: found.id, name: found.name, role: found.role }));
        // Redireciona para a raiz do site atualizado
        window.location.href = "../index.html";

    } catch (err) {
        console.error(err);
        errorDiv.textContent = 'Erro ao processar login. Tente novamente.';
    }
});
