/* Service worker de profbob.fr : le site marche hors connexion.
   - pages : réseau d'abord (toujours la dernière version), copie gardée pour le hors-ligne ;
   - fichiers du site (css, js, images) : réseau d'abord aussi, copie en cache pour le hors-ligne ;
   - polices Google : cache d'abord (elles ne changent pas).
   Les compteurs de visites et le formulaire de contact ne passent jamais par le cache.
   Changer VERSION force le renouvellement du cache. */
const VERSION='pb-v13';
const CORE=['/','/matieres/','/mini-ds/','/flashcards/','/recherche/','/flashcards/cartes.js','/assets/recherche-index.js','/assets/progression.js','/notes/','/cours/statique/vecteurs/','/cours/statique/equilibre/','/cours/statique/moments/','/cours/thermo/concepts/','/cours/thermo/premier-principe/','/cours/thermo/proprietes/','/cours/thermo/volume-controle/','/cours/thermo/second-principe/','/mini-ds/banques/thermo.js','/cours/chimie/atome/','/cours/chimie/classification/','/cours/chimie/molecules/','/mini-ds/banques/chimie.js','/contact/','/404.html',
  '/assets/site.css','/assets/matieres.css','/assets/accueil.css','/assets/accueil.js','/assets/minids.css','/assets/notation.css','/assets/cours.css','/assets/cours.js',
  '/assets/minids.js','/assets/notation.js','/assets/notations.js','/assets/stats.js','/assets/pwa.js',
  '/mini-ds/matieres.js','/assets/ue-s1.js','/ds/statique/mini-ds/banque.js','/notes/maquette-s1.js','/assets/favicon.svg','/assets/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  const font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(u.origin!==location.origin&&!font)return; // compteurs, formulaires… : réseau direct
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('/'))));
    return;
  }
  // fichiers du site : réseau d'abord (pour avoir tout de suite les mises à jour), cache si hors connexion ; polices : cache d'abord
  if(font){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));return res})));return}
  e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true})));
});
