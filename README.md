📘 Diário de Bordo — PWA

Um aplicativo simples de diário desenvolvido em HTML, CSS e JavaScript, com suporte a PWA (Progressive Web App) para permitir instalação e funcionamento offline via Service Worker.

🚀 Tecnologias Utilizadas

HTML5 — estrutura da aplicação

CSS3 — estilização

JavaScript Vanilla — lógica e funcionalidades

LocalStorage — persistência local de dados

PWA (Manifest + Service Worker) — instalação e funcionamento offline

HTTP-Server — utilizado para rodar o projeto localmente (necessário para PWA funcionar)  

📦 Como Rodar o Projeto Localmente  
✔ 1. Clone o repositório  
git clone https://github.com/BigodeMarine/pwa-project.git  

Entre na pasta
cd pwa-project  

✔ 2. Instale o http-server (caso ainda não tenha)  
npm install -g http-server  

obs:O PWA não funciona abrindo direto o index.html, precisa ser servido por um servidor local.  

✔ 3. Rode o servidor  
npx http-server . -c-1  

Abra no navegador:

👉 ```http://127.0.0.1:8080```  

📱 Como Instalar o App (PWA)

Após abrir no navegador:

Acesse pelo Chrome

Aguarde o Service Worker registrar

O botão “Instalar” aparece no topo

Clique e confirme a instalação  

🧹 Como desinstalar o app

No navegador (Chrome):

Vá na barra de endereços → ícone de instalação (ou PWA)

Clique em Desinstalar
