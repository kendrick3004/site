/**
 * ARQUIVO: santo-do-dia.js
 * DESCRIÇÃO: Script para carregar e exibir o Santo do Dia com atualização automática.
 * FUNCIONALIDADES: Lê um arquivo JSON local, identifica o santo da data atual e atualiza o card na interface.
 */

// Variável global que armazena a data da última atualização bem-sucedida.
// Serve para evitar requisições desnecessárias ao servidor se o dia ainda for o mesmo.
let lastProcessedDate = "";

/**
 * FUNÇÃO: updateSaintDisplay
 * OBJETIVO: Manipular o DOM (Document Object Model) para mostrar os dados do santo na tela.
 * @param {object | null} saint - Objeto contendo os dados (name, type, description, color).
 */
function updateSaintDisplay(saint) {
    // Seleciona os elementos HTML onde as informações serão inseridas dinamicamente.
    const nameElement = document.querySelector('.santo-name'); // Elemento que exibe o nome do santo
    const typeElement = document.querySelector('.santo-type'); // Elemento que exibe o tipo (ex: Festa, Memória)
    const descriptionElement = document.querySelector('.santo-description'); // Elemento que exibe a biografia/descrição
    const ribbonElement = document.querySelector('.santo-ribbon'); // Elemento visual da fitinha colorida

    // Verifica se todos os elementos existem na página antes de tentar alterá-los para evitar erros de JS.
    if (!nameElement || !typeElement || !descriptionElement || !ribbonElement) return;

    // Se o parâmetro 'saint' for nulo (não encontrado no JSON), exibe uma mensagem de erro amigável ao usuário.
    if (!saint) {
        nameElement.textContent = 'Santo do Dia não encontrado';
        typeElement.textContent = '--';
        descriptionElement.textContent = 'Verifique o calendário litúrgico';
        ribbonElement.style.backgroundColor = '#9370DB'; // Define cor roxa como padrão de erro/indisponível
        return;
    }

    // Preenche os textos dos elementos com os dados vindos do arquivo JSON.
    nameElement.textContent = saint.name || 'Desconhecido'; // Define o nome do santo
    typeElement.textContent = saint.type || '--'; // Define o tipo de celebração litúrgica
    descriptionElement.textContent = saint.description || 'Celebração litúrgica'; // Define a descrição breve
    
    // Define a cor de fundo da fitinha usando o código hexadecimal vindo diretamente do JSON.
    // Caso a cor não exista no JSON, usa o roxo (#9370DB) como fallback (cor de segurança).
    ribbonElement.style.backgroundColor = saint.color || '#9370DB';
}

/**
 * FUNÇÃO: refreshSaintOfDay
 * OBJETIVO: Obter a data atual, verificar se o dia mudou e buscar novos dados no arquivo JSON.
 */
function refreshSaintOfDay() {
    // Cria um novo objeto de data representando o momento atual do sistema.
    let displayDate = new Date();

    /**
     * LÓGICA LITÚRGICA BRASILEIRA:
     * Aos sábados (getDay() === 6), a partir das 15h (getHours() >= 15),
     * o calendário litúrgico católico já considera a celebração do dia seguinte (domingo).
     * Esta lógica ajusta a exibição para acompanhar a liturgia da Igreja.
     */
    if (displayDate.getDay() === 6 && displayDate.getHours() >= 15) {
        displayDate.setDate(displayDate.getDate() + 1);
        console.log("Lógica Litúrgica: Sábado após 15h, avançando para o Domingo.");
    }
    
    // Extrai o ano, mês e dia para formatar como YYYY-MM-DD (padrão usado no JSON).
    const year = displayDate.getFullYear();
    const month = String(displayDate.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se for menor que 10
    const day = String(displayDate.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se for menor que 10
    
    // Monta a string de data formatada para comparação.
    const todayFormatted = `${year}-${month}-${day}`;

    // Lógica de Otimização: Se a data atual for igual à última data que processamos com sucesso,
    // significa que o dia ainda não mudou, então interrompemos a função para economizar recursos.
    if (todayFormatted === lastProcessedDate) {
        return;
    }

    // Faz uma requisição assíncrona (fetch) para ler o arquivo JSON do calendário localizado na pasta database.
    fetch('./database/calendario.json')
        .then(response => {
            // Se a resposta não for OK (ex: arquivo deletado ou erro de rede), lança um erro para o catch.
            if (!response.ok) throw new Error('Erro ao carregar o arquivo calendario.json');
            return response.json(); // Converte o conteúdo bruto do arquivo para um objeto JavaScript.
        })
        .then(calendar => {
            // Procura dentro da lista do calendário a entrada que tenha a mesma data formatada de hoje.
            const entry = calendar.find(item => item.date === todayFormatted);
            
            // Se encontrar a entrada correspondente e ela contiver os dados do santo.
            if (entry && entry.saint) {
                updateSaintDisplay(entry.saint); // Atualiza a interface visual com os novos dados.
                lastProcessedDate = todayFormatted; // Atualiza a variável de controle para evitar reprocessamento.
                console.log("Interface atualizada automaticamente para o dia:", todayFormatted);
            } else {
                // Se não encontrar dados para a data específica no JSON.
                updateSaintDisplay(null);
            }
        })
        .catch(error => {
            // Captura e exibe erros no console do navegador para facilitar a depuração técnica.
            console.error('Erro ao atualizar o santo do dia:', error);
            updateSaintDisplay(null);
        });
}

/**
 * FUNÇÃO: init
 * OBJETIVO: Iniciar o processo de exibição e configurar o temporizador de atualização automática.
 */
function init() {
    // Executa a busca imediatamente assim que o site abre para o usuário não ver o card vazio.
    refreshSaintOfDay();

    // Configura um intervalo para executar a função 'refreshSaintOfDay' a cada 60.000 milissegundos (1 minuto).
    // Isso garante que, se o usuário deixar a página aberta por muito tempo, ela mude sozinha à meia-noite.
    setInterval(refreshSaintOfDay, 60000);
}

// Verifica se o documento HTML já terminou de carregar na memória do navegador.
if (document.readyState === 'loading') {
    // Se ainda estiver carregando, espera o evento 'DOMContentLoaded' para disparar o init.
    document.addEventListener('DOMContentLoaded', init);
} else {
    // Se o navegador já terminou de carregar tudo, inicia o processo imediatamente.
    init();
}
