/* Fiche formulaire par matière : /cours/<dossier>/formulaire/
   Construite à partir des pages chapitre déjà générées : pour chaque section, les blocs
   « formule clé » (.formula.key) et « À retenir » (.retiens), dans l'ordre du cours.
   Appelé par outils/build.js (fonction gen(ALL, ROOT)) ; renvoie la liste des fiches écrites.
   Mise en page imprimable (Imprimer / PDF) : assets/formulaire.css. */
const fs=require('fs'),path=require('path');

// renvoie les éléments <div class="..."> (équilibrés) dont la classe correspond
function divs(html,test){
  const out=[];const re=/<div class="([^"]*)"[^>]*>/g;let m;
  while((m=re.exec(html))){
    if(!test(m[1].split(/\s+/)))continue;
    let depth=1,i=re.lastIndex;const tag=/<\/?div\b[^>]*>/g;tag.lastIndex=i;let t;
    while(depth&&(t=tag.exec(html))){depth+=t[0][1]==='/'?-1:1;if(!depth){out.push({cls:m[1],inner:html.slice(i,t.index),outer:html.slice(m.index,t.index+t[0].length)});re.lastIndex=tag.lastIndex}}
  }
  return out;
}
const strip=s=>s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();

function lire(file){
  const html=fs.readFileSync(file,'utf8');
  const body=(/<body([^>]*)>/.exec(html)||[])[1]||'';
  const head=html.slice(0,html.indexOf('</head>'));
  const topbar=(/<header class="topbar">[\s\S]*?<\/div><\/header>/.exec(html)||[''])[0];
  const titre=strip((/<h1>([\s\S]*?)<\/h1>/.exec(html)||[])[1]||'');
  const credit=(/<p class="credit">([\s\S]*?)<\/p>/.exec(html)||[])[1]||'';
  const sections=[];const re=/<section class="csec" id="(s\d+)"[^>]*>([\s\S]*?)<\/section>/g;let m;
  while((m=re.exec(html))){
    const h2=strip((/<h2>([\s\S]*?)<\/h2>/.exec(m[2])||[])[1]||m[1]);
    // retirer les corrigés (details) : on ne garde que le texte du cours
    const corps=m[2].replace(/<details[\s\S]*?<\/details>/g,'');
    const blocs=divs(corps,c=>(c.includes('formula')&&c.includes('key'))||c.includes('retiens'))
      .map(b=>b.cls.includes('retiens')?b.outer:b.outer.replace(/class="[^"]*"/,'class="formula key"'));
    if(blocs.length)sections.push({id:m[1],h2,blocs});
  }
  return {body,head,topbar,titre,credit,sections};
}

function gen(ALL,ROOT){
  const faites=[];
  for(const mod of ALL){
    const ch=mod.chapitres.filter(c=>c.url&&c.url.startsWith('/cours/'));if(!ch.length)continue;
    const dossier=ch[0].url.split('/')[2];
    const pages=ch.map(c=>({c,p:lire(path.join(ROOT,c.url.replace(/^\//,''),'index.html'))}));
    const P=pages[0].p;if(!P.topbar)continue;
    const matiere=(/data-matiere="([^"]*)"/.exec(P.body)||[])[1]||'';
    const profil=(/data-nota-profil="([^"]*)"/.exec(P.body)||[])[1];
    const credits=[...new Set(pages.map(x=>x.p.credit.replace(/ Cette page[\s\S]*$/,'').trim()).filter(Boolean))];
    const n=pages.reduce((s,x)=>s+x.p.sections.reduce((a,b)=>a+b.blocs.length,0),0);
    const url='/cours/'+dossier+'/formulaire/';
    const head=P.head.replace(/<title>[\s\S]*?<\/title>/,`<title>Fiche formulaire · ${mod.nom} · profbob.fr</title>`)
      .replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${mod.nom} : toutes les formules et les points à retenir du cours sur une fiche, à imprimer ou à garder sur ton téléphone.">`)
      .replace('<link rel="stylesheet" href="/assets/cours.css">','<link rel="stylesheet" href="/assets/cours.css">\n<link rel="stylesheet" href="/assets/formulaire.css">');
    const corps=pages.map(({c,p},i)=>`
<section class="fch">
  <h2><a href="${c.url}">Chapitre ${i+1} · ${p.titre}</a></h2>
${p.sections.length?p.sections.map(s=>`  <div class="fsec"><h3><a href="${c.url}#${s.id}">${s.h2}</a></h3>
    ${s.blocs.join('\n    ')}
  </div>`).join('\n'):'  <p class="vide">Pas de formule à retenir dans ce chapitre : relis le cours.</p>'}
</section>`).join('\n');
    const html=`${head}</head>
<body class="fiche" data-cours="${dossier}-formulaire" data-matiere="${matiere}" data-nota-all${profil?` data-nota-profil="${profil}"`:''}>
${P.topbar}

<div class="wrap">
<header class="chero">
  <div class="eyebrow"><a href="/matieres/${mod.slug}/">← ${mod.nom}</a> · Fiche formulaire</div>
  <h1>Fiche formulaire · ${mod.nom}</h1>
  <p class="lead">Les ${n} formules et points à retenir des ${pages.length} chapitre${pages.length>1?'s':''}, dans l'ordre du cours. Clique sur un titre pour revenir à la section du cours.</p>
  <div class="ctools"><button class="btn" type="button" onclick="window.print()">Imprimer ou enregistrer en PDF</button><a class="btn ghost" href="/flashcards/?m=${matiere}">Flashcards</a><a class="btn ghost" href="/mini-ds/?m=${matiere}">Mini-DS</a></div>
</header>
${corps}

<p class="credit">D'après ${credits.map(x=>x.replace(/^Cours /,'le cours ').replace(/\.$/,'')).join(' ; ')}. Fiche construite automatiquement à partir des pages du site.</p>
<footer class="site">Une formule manque ou est fausse ? <a href="/contact/?type=erreur&amp;matiere=${encodeURIComponent(mod.nom)}%20%C2%B7%20fiche%20formulaire">Signale-la ici</a>.</footer>
</div>
<script src="/assets/stats.js" defer></script>
<script src="/assets/pwa.js" defer></script>
</body>
</html>
`;
    const out=path.join(ROOT,'cours',dossier,'formulaire');fs.mkdirSync(out,{recursive:true});
    fs.writeFileSync(path.join(out,'index.html'),html);
    faites.push({mod,url,n});
  }
  return faites;
}
module.exports={gen};
