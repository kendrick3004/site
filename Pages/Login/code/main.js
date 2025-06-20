let errorCount = 0;

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('loginError');
    const form = document.getElementById('loginForm');
    const button = form.querySelector('button');

    // Exemplo: usuário e senha fixos (ajuste conforme sua lógica do Base)
    if (user === 'admin' && pass === '1234') {
        button.disabled = true;
        button.textContent = 'Aguarde...';
        localStorage.setItem('loggedIn', 'true');
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 1000); // Pequeno delay para mostrar o "Aguarde..."
    } else {
        errorCount++;
        if (errorCount >= 3) {
            errorDiv.textContent = 'Você será bloqueado por 5 segundos!';
        } else if (errorCount === 1) {
            errorDiv.textContent = 'Usuário ou senha inválidos! Você terá mais duas tentativas até chegar na última.';
        } else if (errorCount === 2) {
            errorDiv.textContent = 'Usuário ou senha inválidos! Você terá mais uma tentativa até chegar na última.';
        } else {
            errorDiv.textContent = 'Usuário ou senha inválidos!';
        }
        // Bloqueia o formulário por 10 segundos a partir da terceira tentativa
        if (errorCount >= 3) {
            button.disabled = true;
            setTimeout(() => {
                button.disabled = false;
                button.textContent = 'Entrar';
                errorDiv.textContent = '';
            }, 10000); // 10000 ms = 10 segundos
        }
    }
});

