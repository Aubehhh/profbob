#!/usr/bin/env node
/* Générateur des pages « matières » de profbob.fr.
   Lit outils/catalogue.js (UE → modules → chapitres/DS) et notes/maquette-s1.js (noms, ECTS, poids, épreuves),
   puis écrit :
   - /matieres/<slug>/index.html pour chaque module,
   - la grille des UE et le « Dernier DS ajouté » de l'accueil (entre les marqueurs <!-- MATIERES:debut/fin -->),
   - la liste des pages suivies par l'admin (entre les marqueurs PAGES:debut et PAGES:fin).
   Usage : node outils/build.js */
'use strict';
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
global.window={};require(path.join(ROOT,'notes/maquette-s1.js'));
const MAQ=window.MAQUETTE_S1;
const CAT=require('./catalogue.js');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fr=x=>String(x).replace('.',',');

// fusion catalogue + maquette
const UES=CAT.ue.map(u=>{const mu=MAQ.ue.find(x=>x.id===u.id);if(!mu)throw new Error('UE inconnue '+u.id);
  return Object.assign({},u,{nom:mu.nom,ects:mu.ects,modules:u.modules.map(m=>{const mm=mu.modules.find(x=>x.id===m.id);if(!mm)throw new Error('module inconnu '+m.id);
    return Object.assign({},m,{nom:mm.nom,poids:mm.poids,ep:mm.ep,ue:u.id,couleur:u.couleur})})})});
const ALL=UES.flatMap(u=>u.modules);

const HEAD=(title,desc)=>`<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#2453b8">
<link rel="apple-touch-icon" href="/assets/icon-192.png">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=JetBrains+Mono:wght@400;600&display=swap">
<link rel="stylesheet" href="/assets/site.css">
<link rel="stylesheet" href="/assets/matieres.css">
</head>`;
const TOPBAR=cur=>`<header class="topbar"><div class="in">
  <a class="brand" href="/"><i>p</i>profbob</a>
  <nav aria-label="Navigation du site">
    ${[['Accueil','/','home',''],['Matières','/matieres/','matieres',''],['Notes','/notes/','notes',''],['Mini-DS','/mini-ds/','minids','opt'],['Contact','/contact/','contact','']]
      .map(([t,h,k,c])=>`<a${c?` class="${c}"`:''} href="${h}"${k===cur?' aria-current="page"':''}>${t}</a>`).join('\n    ')}
  </nav>
</div></header>`;
const FOOT=`<script src="/assets/stats.js" defer></script>
<script src="/assets/pwa.js" defer></script>
</body>
</html>
`;
const mono=(m,size)=>`<span class="mono" style="--c:${m.couleur}${size?`;width:${size}px;height:${size}px`:''}">${esc(m.mono)}</span>`;
const statut=m=>{const c=m.chapitres.filter(x=>x.url).length,d=m.ds.length;const p=[];if(c)p.push(c+' chapitre'+(c>1?'s':''));if(d)p.push(d+' DS');return p.join(' · ')||'Bientôt'};
const mcard=m=>`<a class="mcard${statut(m)==='Bientôt'?' empty':''}" href="/matieres/${m.slug}/">${mono(m,40)}<span class="t"><b>${esc(m.nom)}</b><small>${statut(m)}</small></span><span class="go">▸</span></a>`;
const dscard=d=>`<div class="dscard">
      <div class="eyebrow">DS · ${esc(d.quand||'')}</div>
      <h3><a href="${d.url}">${esc(d.titre)}</a></h3>
      ${d.desc?`<p>${esc(d.desc)}</p>`:''}
      <div class="links">
        ${(d.liens||[]).map(([t,u])=>`<a href="${u}">${esc(t)}</a>`).join('\n        ')}${d.minids?`\n        <a class="hot" href="${esc(d.minids)}">Mini-DS corrigé ▸</a>`:''}
      </div>
    </div>`;

// --- pages module ---
for(const u of UES)for(const m of u.modules){
  const others=u.modules.filter(x=>x!==m);
  const notes=m.poids?`<div class="poids"><span class="pill strong">${fr(m.poids)} % de l'UE</span>${m.ep.map(([k,lab,w])=>`<span class="pill">${esc(lab)} · ${fr(w)} %</span>`).join('')}<a class="pill link" href="/notes/#ue-${u.id}">Simuler mes notes ▸</a></div>`:'<div class="poids"><span class="pill">Module non noté</span></div>';
  const chap=m.chapitres.length?`<ol class="chaps">${m.chapitres.map((c,i)=>c.url?`<li><a href="${c.url}"><span class="n">${i+1}</span><span class="tt">${esc(c.titre)}</span><span class="go">▸</span></a></li>`:`<li class="soon"><span class="n">${i+1}</span><span class="tt">${esc(c.titre)}</span><span class="tag">bientôt</span></li>`).join('')}</ol>`
    :`<div class="empty-state"><b>Les chapitres arrivent bientôt.</b><p>Le cours de ${esc(m.nom)} sera ajouté chapitre par chapitre.</p><a class="btn ghost" href="/contact/?type=chapitre&amp;matiere=${encodeURIComponent(m.nom)}%20%C2%B7%20">Proposer un chapitre ou envoyer un cours</a></div>`;
  const ds=m.ds.length?`<div class="list">\n    ${m.ds.map(dscard).join('\n    ')}\n  </div>`:`<p class="soon">Pas encore de DS pour ce module.</p>`;
  const html=`${HEAD(m.nom+' · profbob.fr','Révisions de '+m.nom+' : cours chapitre par chapitre, DS, exercices corrigés et mini-DS.')}
<body>
${TOPBAR('matieres')}
<div class="wrap">
  <div class="eyebrow" style="margin-top:28px"><a href="/matieres/">← Toutes les matières</a></div>
  <header class="mhero">${mono(m,60)}<div><div class="eyebrow">UE ${esc(u.nom)} · ${u.ects} ECTS</div><h1>${esc(m.nom)}</h1></div></header>
  ${notes}

  <h2>Chapitres</h2>
  ${chap}

  <h2>DS</h2>
  ${ds}
${others.length?`
  <h2>Dans la même UE</h2>
  <div class="mgrid">
    ${others.map(mcard).join('\n    ')}
  </div>
`:''}
  <footer class="site">Une erreur, une idée ? <a href="/contact/">Écris-nous via le formulaire</a>.</footer>
</div>
${FOOT}`;
  const dir=path.join(ROOT,'matieres',m.slug);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);
}

// --- page /matieres/ ---
const SEM=MAQ.semestre||'Semestre 1';
const ueCard=u=>`<section class="uecard" style="--c:${u.couleur}">
      <div class="ueh"><h2>${esc(u.nom)}</h2><span>${u.ects} ECTS</span></div>
      <ul class="mods">
        ${u.modules.map(m=>`<li><a href="/matieres/${m.slug}/"${statut(m)==='Bientôt'?' class="empty"':''}>${mono(m,30)}<span class="nm">${esc(m.nom)}</span><span class="st">${statut(m)}</span><span class="go">▸</span></a></li>`).join('\n        ')}
      </ul>
    </section>`;
const idx=`${HEAD('Matières · '+SEM+' · profbob.fr','Toutes les matières du '+SEM.toLowerCase()+' de HEI 1, rangées par UE.')}
<body>
${TOPBAR('matieres')}
<div class="wrap wide">
  <header class="hero" style="padding-top:32px">
    <div class="eyebrow">HEI 1 · ${esc(SEM)}</div>
    <h1>Matières</h1>
    <div class="sems"><span class="pill strong">${esc(SEM)}</span><span class="pill off">Semestre 2 · bientôt</span></div>
  </header>
  <div class="uegrid">
    ${UES.map(ueCard).join('\n    ')}
  </div>
  <footer class="site">Il manque un chapitre ? <a href="/contact/?type=chapitre">Propose-le ici</a>.</footer>
</div>
${FOOT}`;
fs.writeFileSync(path.join(ROOT,'matieres','index.html'),idx);

// --- accueil (page entièrement générée) ---
const now=ALL.find(m=>m.ds.length);const latest=now&&now.ds[0];
const short={'outils':'Outils maths','elec':'Électricité','statique':'Statique','embarque':'Info embarquée','web':'Page Web','relation':'Comp. relationnelles','crea':'Créativité','bureau':'Bureautique'};
const tagMod=m=>{const c=m.chapitres.filter(x=>x.url).length,d=m.ds.length;return d?d+' DS':c?c+' chap.':''};
const home=`${HEAD('profbob · Révisions de zgeg','Le site de révision de la classe HEI 1 : cours expliqués, exercices corrigés, mini-DS corrigés automatiquement et simulateur de notes.').replace('<link rel="stylesheet" href="/assets/matieres.css">','<link rel="stylesheet" href="/assets/matieres.css">\n<link rel="stylesheet" href="/assets/accueil.css">')}
<body>
${TOPBAR('home')}
<div class="wrap home">
  <header class="hero">
    <div class="eyebrow">HEI 1 · ${esc(SEM)}</div>
    <h1>Révisions de zgeg</h1>
    ${CAT.dedicace?`<p class="dedi">${CAT.dedicace}</p>`:''}
  </header>
${latest?`
  <div class="banner">
    <div class="t"><div class="eyebrow">En ce moment · DS de ${esc(latest.quand||'')}</div><h3><a href="${latest.url}">${esc(latest.titre)}</a></h3>${latest.desc?`<p>${esc(latest.desc)}</p>`:''}</div>
    <div class="row">${(latest.liens||[]).map(([t,u])=>`<a class="chip" href="${u}">${esc(t)}</a>`).join('')}${latest.minids?`<a class="chip hot" href="${esc(latest.minids)}">Mini-DS ▸</a>`:''}</div>
  </div>`:''}

  <div class="install" id="install" hidden><span data-txt><b>Installe profbob sur ton téléphone</b> : il s'ouvre comme une appli et marche même sans réseau.</span><button class="btn" type="button">Installer l'appli</button></div>

  <h2 class="sec">Ton tableau de bord <small>calculé avec tes résultats sur ce navigateur</small></h2>
  <div class="stats">
    <a class="st" id="st-notes" href="/notes/"><div class="l">Moyenne simulée</div><div class="v empty">—</div></a>
    <a class="st" id="st-ds" href="/mini-ds/"><div class="l">Dernier mini-DS</div><div class="v empty">—</div></a>
    <a class="st" id="st-err" href="/mini-ds/"><div class="l">À retravailler</div><div class="v empty">—</div></a>
  </div>

  <h2 class="sec">Matières <small><a href="/matieres/">tout voir ▸</a></small></h2>
  <div class="uerows">
    ${UES.map(u=>`<div class="uer" style="--c:${u.couleur}"><div class="n"><b>${esc(u.nom.replace('Organisation et Management des Entreprises','OME'))}</b><span>${u.ects} ECTS</span></div><div class="ms">${u.modules.map(m=>{const t=tagMod(m);return `<a href="/matieres/${m.slug}/"${t?' class="on"':''}>${esc(short[m.id]||m.nom)}${t?` <em>${t}</em>`:''}</a>`}).join('')}</div></div>`).join('\n    ')}
  </div>
${(CAT.nouveautes||[]).length?`
  <h2 class="sec">Nouveautés</h2>
  <div class="news">
    ${CAT.nouveautes.slice(0,4).map(n=>`<a href="${n.url}"><time>${esc(n.date)}</time>${esc(n.texte)}${n.nouveau?'<span class="tag">nouveau</span>':''}<span class="go">▸</span></a>`).join('\n    ')}
  </div>`:''}

  <footer class="site">Une erreur, une idée, une question ? <a href="/contact/">Écris-nous via le formulaire</a>.</footer>
</div>
<script src="/notes/maquette-s1.js"></script>
<script src="/mini-ds/matieres.js"></script>
<script src="/assets/accueil.js"></script>
${FOOT}`;
fs.writeFileSync(path.join(ROOT,'index.html'),home);

// --- liste UE/modules pour le mini-DS ---
fs.writeFileSync(path.join(ROOT,'assets','ue-s1.js'),'/* Généré par outils/build.js : UE et modules du semestre (utilisé par le mini-DS). */\nwindow.UE_S1='+JSON.stringify(UES.map(u=>({id:u.id,nom:u.nom,ects:u.ects,couleur:u.couleur,modules:u.modules.map(m=>({id:m.id,slug:m.slug,nom:m.nom,mono:m.mono}))})))+';\n');

// --- admin : pages suivies ---
const ap=path.join(ROOT,'admin/index.html');let ad=fs.readFileSync(ap,'utf8');
const base=[['p-accueil','Accueil'],['p-matieres','Matières (liste)'],['p-mini_ds','Mini-DS'],['p-notes','Simulateur de notes'],['p-ds_statique','DS Statique (cours)'],['p-contact','Contact'],['p-404','Page introuvable (404)']];
const pages=base.concat(ALL.map(m=>['p-matieres_'+m.slug.replace(/[^a-z0-9]+/g,'_'),m.nom]));
const pa=ad.indexOf('/*PAGES:debut*/'),pb=ad.indexOf('/*PAGES:fin*/');
if(pa>=0&&pb>=0){ad=ad.slice(0,pa)+'/*PAGES:debut*/'+JSON.stringify(pages)+ad.slice(pb);fs.writeFileSync(ap,ad)}
console.log('ok :',ALL.length,'modules,',UES.length,'UE');
