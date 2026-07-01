/* ============================================================
   SERVICE WORKER — Sistema de Escala
   ------------------------------------------------------------
   Responsável por: deixar o site instalável como aplicativo e
   abrir mesmo sem internet (guarda apenas a "casca" visual).

   IMPORTANTE: este arquivo NÃO interfere nos dados do Firebase.
   Tudo que não for do próprio site (Firebase, Google, CDNs)
   passa direto pela internet, em tempo real, como sempre.
   ============================================================ */

// Troque a versão (v1 -> v2 ...) sempre que quiser forçar atualização.
const CACHE = 'escala-Admin-v1.1.13';

// Arquivos da "casca" do app que ficam guardados para abrir offline.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png',
  './favicon-16.png',
  './favicon.ico'
];

// Instalação: guarda a casca do app.
self.addEventListener('install', (event) => {
  self.skipWaiting(); // ativa a nova versão sem esperar
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL).catch(() => {}))
  );
});

// Ativação: limpa versões antigas do cache.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Intercepta as requisições.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1) Só tratamos GET. Envios (POST/PUT etc.) passam direto.
  if (req.method !== 'GET') return;

  // 2) PROTEÇÃO DOS DADOS: qualquer coisa que NÃO seja do próprio site
  //    (Firebase, Google APIs, CDNs) passa direto, sem cache. Tempo real intacto.
  if (url.origin !== self.location.origin) return;

  // 3) Abrir a página (navegação): tenta a internet primeiro;
  //    se estiver offline, abre a versão guardada.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return resp;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // 4) Demais arquivos do site (ícones, manifesto):
  //    usa o que está guardado e atualiza em segundo plano.
  event.respondWith(
    caches.match(req).then((cached) => {
      const fromNetwork = fetch(req)
        .then((resp) => {
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || fromNetwork;
    })
  );
});
