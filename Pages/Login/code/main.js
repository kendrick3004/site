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
        localStorage.setItem('loggedIn', 'true');
        window.location.href = '../../index.html';
    } else {
        errorCount++;
        if (errorCount >= 2) {
            errorDiv.textContent = 'Você será bloqueado por 5 segundos!';
        } else {
            errorDiv.textContent = 'Usuário ou senha inválidos!';
        }
        // Bloqueia o formulário por 5 segundos
        button.disabled = true;
        button.textContent = 'Aguarde...';
        setTimeout(() => {
            button.disabled = false;
            button.textContent = 'Entrar';
            errorDiv.textContent = '';
        }, 5000);
    }
});

