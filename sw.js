/* Service worker de profbob.fr : le site marche hors connexion.
   - pages : réseau d'abord (toujours la dernière version), copie gardée pour le hors-ligne ;
   - fichiers du site (css, js, images) et polices : copie en cache, mise à jour en arrière-plan.
   Les compteurs de visites et le formulaire de contact ne passent jamais par le cache.
   Changer VERSION force le renouvellement du cache. */
const VERSION='pb-v3';
const CORE=['/','/matieres/','/mini-ds/','/notes/','/ds/statique/','/contact/','/404.html',
  '/assets/site.css','/assets/matieres.css','/assets/minids.css','/assets/notation.css',
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
  e.respondWith(caches.match(r).then(m=>{
    const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}return res}).catch(()=>m);
    return m||net;
  }));
});
