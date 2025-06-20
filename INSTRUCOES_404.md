# Configuração de Página 404 Personalizada (HTML, CSS, JS)

Este documento explica como configurar um servidor web para usar a página 404 personalizada fornecida, que foi desenvolvida apenas com HTML, CSS e JavaScript, sem a necessidade de Python ou Flask.

## Estrutura do Projeto

Certifique-se de que a estrutura dos seus arquivos seja semelhante a esta:

```
site/
├── index.html
├── Pages/
│   ├── Error404/
│   │   ├── index.html
│   │   └── styles.css
│   └── Suite/
│       ├── script.js
│       └── styles.css
└── src/
    ├── code/
    │   ├── css/
    │   │   └── modes.css
    │   └── js/
    │       └── favicon.js
    ├── icon/
    │   ├── avatar.jpg
    │   └── ... (outros ícones)
    └── templates/
        ├── dark_mode.jpg
        └── light_mode.jpg
```

## Configuração do Servidor Web

Para que a página 404 personalizada funcione, você precisará configurar seu servidor web para redirecionar erros 404 para o arquivo `Pages/Error404/index.html`.

### Opção 1: Servidor Apache

Se você estiver usando o Apache, adicione a seguinte linha ao seu arquivo `.htaccess` (localizado na raiz do seu site) ou ao arquivo de configuração do seu Virtual Host:

```apache
ErrorDocument 404 /Pages/Error404/index.html
```

Certifique-se de que o módulo `mod_rewrite` esteja ativado no Apache.

### Opção 2: Servidor Nginx

Se você estiver usando o Nginx, adicione as seguintes linhas ao bloco `server` do arquivo de configuração do seu site (geralmente em `/etc/nginx/sites-available/seusite`):

```nginx
error_page 404 /Pages/Error404/index.html;
location = /Pages/Error404/index.html {
    internal;
}
```

Após fazer as alterações, recarregue a configuração do Nginx:

```bash
sudo systemctl reload nginx
```

### Opção 3: Servidor de Desenvolvimento Simples (Ex: `http-server` do Node.js)

Para testar localmente, você pode usar um servidor HTTP simples como o `http-server` do Node.js. Primeiro, instale-o globalmente:

```bash
npm install -g http-server
```

Em seguida, navegue até a raiz do seu projeto (`site/`) e inicie o servidor com a opção `--proxy` para redirecionar erros 404:

```bash
cd site/
http-server . -p 8080 --proxy http://localhost:8080?index.html
```

Neste caso, o `http-server` tentará servir `index.html` para qualquer rota não encontrada. No entanto, para uma página 404 personalizada como a sua, a configuração de um servidor como Apache ou Nginx é mais robusta.

## Testando a Página 404

Após configurar seu servidor web, você pode testar a página 404 acessando uma URL que não existe em seu site (ex: `http://seusite.com/pagina-que-nao-existe`). Você deverá ver a página 404 personalizada.

Esta abordagem é leve e não requer dependências de backend, sendo ideal para sites estáticos ou onde o controle do servidor web é direto.

