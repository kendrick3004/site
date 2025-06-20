/*
Este arquivo JavaScript (main.js) é responsável pela lógica de autenticação da página de login.
Ele gerencia a validação do usuário e senha, exibe mensagens de erro e implementa um mecanismo de bloqueio
após múltiplas tentativas falhas de login.
*/

let errorCount = 0; // Variável para contar o número de tentativas de login falhas

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault(); // Previne o comportamento padrão de submissão do formulário (recarregar a página)

    // Obtém os valores dos campos de usuário e senha, removendo espaços em branco extras
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    // Obtém os elementos HTML para exibir mensagens de erro e o formulário/botão
    const errorDiv = document.getElementById("loginError");
    const form = document.getElementById("loginForm");
    const button = form.querySelector("button");

    // Exemplo de validação: usuário e senha fixos (deve ser substituído por uma lógica de backend real)
    if (user === "admin" && pass === "1234") {
        button.disabled = true; // Desabilita o botão para evitar múltiplas submissões
        button.textContent = "Aguarde..."; // Altera o texto do botão para indicar processamento
        localStorage.setItem("loggedIn", "true"); // Armazena um status de login no localStorage
        
        // Redireciona para a página inicial após um pequeno atraso
        setTimeout(() => {
            window.location.href = "../../index.html";
        }, 1000); // 1000 ms = 1 segundo de atraso
    } else {
        errorCount++; // Incrementa o contador de erros

        // Lógica para exibir mensagens de erro diferentes com base no número de tentativas
        if (errorCount >= 3) {
            errorDiv.textContent = "Você será bloqueado por 5 segundos!";
        } else if (errorCount === 1) {
            errorDiv.textContent = "Usuário ou senha inválidos! Você terá mais duas tentativas até chegar na última.";
        } else if (errorCount === 2) {
            errorDiv.textContent = "Usuário ou senha inválidos! Você terá mais uma tentativa até chegar na última.";
        } else {
            errorDiv.textContent = "Usuário ou senha inválidos!";
        }

        // Bloqueia o formulário por 10 segundos a partir da terceira tentativa
        if (errorCount >= 3) {
            button.disabled = true; // Desabilita o botão
            
            // Reabilita o botão e limpa a mensagem de erro após 10 segundos
            setTimeout(() => {
                button.disabled = false; // Reabilita o botão
                button.textContent = "Entrar"; // Restaura o texto original do botão
                errorDiv.textContent = ""; // Limpa a mensagem de erro
            }, 10000); // 10000 ms = 10 segundos de bloqueio
        }
    }
});

