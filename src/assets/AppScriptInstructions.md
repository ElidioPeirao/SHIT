#  Configurando o Google Sheets como Banco de Dados

Para que o sistema EPROJECTS funcione corretamente, você precisa configurar um Google Sheets com Apps Script para servir como banco de dados.

## Passo 1: Criar a planilha no Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com) e crie uma nova planilha
2. Renomeie a planilha principal para "EPROJECTS Database"
3. Crie 3 abas com os seguintes nomes:
   - users
   - tools
   - promoCodes

## Passo 2: Configurar o Apps Script

1. No Google Sheets, clique em Extensões > Apps Script
2. Apague todo o código que aparecer no editor
3. Cole o código do arquivo `public/google-sheets-app-script.js` no editor
4. Salve o projeto com o nome "EPROJECTS API"

## Passo 3: Publicar o Web App

1. Clique no botão "Deploy" > "New deployment"
2. Selecione "Web app" como tipo
3. Configure:
   - Description: "EPROJECTS API"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Clique em "Deploy"
5. Copie a URL gerada (será algo como `https://script.google.com/macros/s/XXXXXX/exec`)
6. Extraia o ID do script da URL (é a parte XXXXXX)

## Passo 4: Configurar o ID no Aplicativo

1. Abra o arquivo `src/utils/db.ts` no código do EPROJECTS
2. Substitua `YOUR_SCRIPT_ID_HERE` pelo ID do script que você copiou

## Passo 5: Conceder Permissões

1. Acesse a URL do Web App que você recebeu
2. Faça login com sua conta Google se solicitado
3. Conceda as permissões necessárias para o Apps Script acessar suas planilhas

Pronto! Seu banco de dados está configurado e o aplicativo EPROJECTS poderá se comunicar com ele.
 