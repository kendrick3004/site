# Correções Realizadas no PWA "Suite"

## Problema Identificado

O ícone do aplicativo estava sendo cortado e distorcido no Android devido à falta de margens de segurança adequadas para ícones maskable. A imagem original do ostensório ocupava toda a área do ícone, fazendo com que a cruz superior e a base inferior fossem cortadas quando o sistema aplicava máscaras circulares ou arredondadas.

## Soluções Implementadas

### 1. Criação de Novos Ícones

Foram criados quatro novos arquivos de ícone otimizados:

- **icon-192.png**: Ícone padrão 192x192px (purpose: any)
- **icon-512.png**: Ícone padrão 512x512px (purpose: any)
- **icon-192-maskable.png**: Ícone 192x192px com padding de 20% (purpose: maskable)
- **icon-512-maskable.png**: Ícone 512x512px com padding de 20% (purpose: maskable)

Os ícones maskable possuem margens de segurança de aproximadamente 20% em todos os lados, garantindo que o ostensório completo (incluindo a cruz no topo e a base) fique visível mesmo quando o Android aplicar máscaras circulares ou de formato adaptativo.

### 2. Atualização do manifest.json

O arquivo manifest.json foi atualizado com as seguintes melhorias:

- Nome do aplicativo alterado de "Suite - Kendrick Nicoleti" para apenas "Suite"
- Configuração correta de múltiplos tamanhos de ícones
- Separação adequada entre ícones "any" e "maskable"
- Caminhos corretos para os novos arquivos de ícone

### 3. Especificações Técnicas

**Ícones "any" (padrão):**
- Utilizam a imagem original redimensionada
- Ocupam toda a área disponível
- Ideais para contextos onde não há corte ou máscara

**Ícones "maskable":**
- Possuem fundo branco sólido
- Imagem do ostensório reduzida para 80% do tamanho total
- Centralizada com margens de 20% em todos os lados
- Garantem que todo o conteúdo importante fique na "safe zone"

## Arquivos Modificados

1. `/manifest.json` - Atualizado com novas configurações
2. `/database/favicon/icon-192.png` - Novo arquivo criado
3. `/database/favicon/icon-512.png` - Novo arquivo criado
4. `/database/favicon/icon-192-maskable.png` - Novo arquivo criado
5. `/database/favicon/icon-512-maskable.png` - Novo arquivo criado

## Arquivos Originais Preservados

Os arquivos originais foram mantidos intactos:
- `Favicon.png` (original)
- `Favicon.ico` (original)
- `Favicon_R.png` (original)

## Resultado Esperado

Após fazer o deploy das alterações:

1. **Ícone na tela inicial**: O ostensório aparecerá completo, sem cortes na cruz ou na base
2. **Splash screen**: A imagem será exibida corretamente centralizada com margens adequadas
3. **Compatibilidade**: Funciona corretamente em todos os formatos de ícone do Android (círculo, quadrado arredondado, squircle, etc.)
4. **Design preservado**: Nenhuma modificação foi feita no design original do ostensório

## Instruções de Deploy

1. Substitua o arquivo `manifest.json` na raiz do projeto
2. Adicione os novos arquivos de ícone na pasta `/database/favicon/`
3. Limpe o cache do navegador ou reinstale o PWA para ver as alterações
4. Teste em diferentes dispositivos Android para confirmar que os ícones aparecem corretamente
