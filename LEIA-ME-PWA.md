# 📱 Como transformar o Sistema de Escala em aplicativo (PWA)

Este guia explica, passo a passo, como deixar o **Sistema de Escala de
Audiências** instalável como um aplicativo no celular e no computador.

> **PWA** = *Progressive Web App*. É um site que pode ser **instalado** na tela
> inicial, abre **em tela cheia** (sem a barra do navegador) e funciona mesmo
> **sem internet** (a parte visual). Os dados continuam vindo do Firebase em
> tempo real, como sempre.

---

## ✅ 1. Arquivos que devem ficar na MESMA pasta do `index.html`

```
📁 sua-pasta-do-site
 ├── index.html              (seu sistema — com o bloco novo no <head>)
 ├── manifest.webmanifest    ← identidade do app (nome, cor, ícones)
 ├── sw.js                   ← service worker (deixa o app instalável/offline)
 │
 ├── icon-192.png            ← ícone do app (Android)
 ├── icon-512.png            ← ícone do app (alta resolução / splash)
 ├── maskable-192.png        ← versão que o Android recorta sem cortar o desenho
 ├── maskable-512.png
 │
 ├── apple-touch-icon.png    ← ícone do iPhone / iPad
 ├── favicon.ico             ← ícone da aba do navegador
 ├── favicon-16.png
 ├── favicon-32.png
 │
 └── LEIA-ME-PWA.md          ← este guia
```

**Todos juntos, na mesma pasta.** É isso que faz os caminhos relativos
(`manifest.webmanifest`, `sw.js`, `favicon.ico`...) funcionarem.

---

## ✅ 2. Requisito importante: precisa estar em **HTTPS**

Um PWA **só instala** se o site for aberto por:

- **`https://...`** (com cadeado), **ou**
- **`http://localhost`** (apenas para testar no seu próprio computador).

Abrir o arquivo direto (clicando duas vezes, com endereço `file:///...`)
**não funciona** para PWA. Se você hospeda em algum servidor/painel com HTTPS,
está tudo certo.

---

## ✅ 3. Como instalar no celular

### Android (Chrome)
1. Abra o site no **Chrome**.
2. Toque no menu **⋮** (três pontinhos) no canto superior direito.
3. Toque em **"Instalar aplicativo"** (ou "Adicionar à tela inicial").
4. Pronto: o ícone do calendário aparece na tela inicial.

### iPhone / iPad (Safari)
1. Abra o site no **Safari**.
2. Toque no botão **Compartilhar** (quadrado com seta para cima).
3. Escolha **"Adicionar à Tela de Início"**.
4. Confirme. O ícone aparece na tela inicial.

### Computador (Chrome / Edge)
- Aparece um **ícone de instalar** na barra de endereço (um monitor com uma seta),
  ou em **⋮ → Instalar Escala Admin*.

---

## ✅ 4. Como atualizar o app depois (quando mexer no código)

O navegador guarda uma cópia da casca do app. Para garantir que todos vejam a
versão nova depois de uma alteração:

1. Abra o arquivo **`sw.js`**.
2. Na linha do topo, troque a versão do cache:
   ```js
   const CACHE = 'escala-Admin-v1';   // mude para v2, v3, ...
   ```
3. Salve e publique. No próximo acesso, o app se atualiza sozinho.

---

## 🔒 Sobre seus dados (Firebase)

O service worker foi feito com cuidado para **nunca interferir no Firebase**.
Ele guarda apenas a aparência do app (HTML e ícones). Tudo que vem do Firebase
(login, pautas, presença, tempo real) passa direto pela internet, sem cache.
