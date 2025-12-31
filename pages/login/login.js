/*
Este arquivo JavaScript (main.js) é responsável pela lógica de autenticação da página de login.
Ele gerencia a validação do usuário e senha, exibe mensagens de erro e implementa um mecanismo de bloqueio
após múltiplas tentativas falhas de login.
*/

let errorCount = 0;

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const userInput = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;

    const errorDiv = document.getElementById("loginError");
    const form = document.getElementById("loginForm");
    const button = form.querySelector("button");

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
            errorCount++;

            if (errorCount >= 3) {
                errorDiv.textContent = "Você será bloqueado por 5 segundos!";
            } else if (errorCount === 1) {
                errorDiv.textContent = "Usuário ou senha inválidos! Você terá mais duas tentativas até chegar na última.";
            } else if (errorCount === 2) {
                errorDiv.textContent = "Usuário ou senha inválidos! Você terá mais uma tentativa até chegar na última.";
            } else {
                errorDiv.textContent = "Usuário ou senha inválidos!";
            }

            if (errorCount >= 3) {
                button.disabled = true;
                setTimeout(() => {
                    button.disabled = false;
                    button.textContent = "Entrar";
                    errorDiv.textContent = "";
                }, 10000);
            }
            return;
        }

        // Autenticação bem-sucedida
        localStorage.setItem('auth_user', JSON.stringify({ id: found.id, name: found.name, role: found.role }));
        // Redireciona para a raiz do site atualizado
        window.location.href = "../index.html";

    } catch (err) {
        console.error(err);
        errorDiv.textContent = 'Erro ao processar login. Tente novamente.';
    }
});

