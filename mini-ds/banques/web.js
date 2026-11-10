/* Banque du mini-DS Création de page Web (cours « Développement et Architecture Web » de R. Gosswiller), alignée sur /cours/web/….
   Utilise les cases « choix » (liste déroulante) et « texte » (code à taper) du moteur assets/minids.js.
   Profil de notation « aucun » (le code n'est pas transformé). Vérification : node outils/verif-minids.js 3000 web */
(function(){
const e=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const c=s=>'<code>'+e(s)+'</code>';
const pre=s=>'<pre class="mds-code">'+e(s)+'</pre>';
// choix : bonne réponse + distracteurs, mélangés de façon reproductible ; renvoie {options, ans}
const choix=(R,bonne,autres)=>{const o=R.shuffle([bonne,...autres]);return {options:o,ans:o.indexOf(bonne)}};
const HEX='0123456789ABCDEF',hx=n=>HEX[n>>4]+HEX[n&15];

const BALISES=[['mettre un mot en gras','b'],['mettre un mot en italique','i'],['souligner un mot','u'],['passer à la ligne','br'],['créer un lien','a'],
  ['écrire un paragraphe','p'],['écrire le titre principal de la page','h1'],['faire une liste à puces (sans numéros)','ul'],['faire une liste numérotée','ol'],
  ['écrire un élément de liste','li'],['afficher une image','img'],['créer un bloc de mise en page','div'],['créer une ligne de tableau','tr'],['créer une cellule de tableau','td'],['créer un formulaire','form']];
const SIMPLES=['br','img','input','meta','link','hr'],DOUBLES=['p','b','a','div','table','form','ul','h2','title','label'];
const PARTIES=[['le titre affiché dans l\'onglet du navigateur','head'],['l\'encodage des caractères (charset)','head'],['le lien vers la feuille de style CSS','head'],
  ['les mots-clés pour les moteurs de recherche','head'],['le texte et les images visibles de la page','body'],['les paragraphes et les titres h1, h2…','body'],['les formulaires','body'],
  ['la version du HTML utilisée','doctype']];
const PROPS=[['la couleur du texte','color'],['la couleur de fond','background-color'],['la taille de la police','font-size'],['la police utilisée','font-family'],
  ['mettre le texte en gras','font-weight'],['arrondir les coins','border-radius'],['la marge intérieure (entre contenu et bordure)','padding'],['la marge extérieure','margin'],
  ['la transparence','opacity'],['placer un bloc à gauche ou à droite, le texte coulant autour','float'],['une ombre portée','box-shadow'],['le style de bordure (pleine, pointillée…)','border-style']];
const TYPES=[['un mot de passe (caractères masqués)','password'],['plusieurs choix indépendants à cocher','checkbox'],['un seul choix parmi plusieurs','radio'],
  ['un curseur pour choisir un niveau','range'],['une adresse e-mail','email'],['une couleur','color'],['une date','date'],['un nombre','number'],['un fichier à envoyer','file'],['une ligne de texte libre','text']];
const LAMP=[['L','Linux'],['A','Apache'],['M','MySQL'],['P','PHP']];
const ROLES={Linux:'le système d\'exploitation du serveur',Apache:'le serveur qui envoie le fichier demandé',MySQL:'la base de données qui conserve les informations',PHP:'le langage qui génère la page à la volée'};
const NOMS=['menu','contact','titre','photo','prix','note','intro','footer','alerte','carte','bandeau','avis'];
const PRENOMS=['Lou','Sam','Inès','Noé','Léa','Adam','Zoé','Hugo'];

window.BANQUE_WEB=[

/* ---------- Cours 1 : bases du web et du HTML ---------- */

{id:'balise',chap:'Balises',pts:2,gen(R,F){
  const [quoi,tag]=R.pick(BALISES);
  return{v:{quoi},text:`<p>Quelle balise utilise-t-on pour <b>${quoi}</b> ? Écris seulement son nom, sans chevrons (par exemple : h2).</p>`,
    fields:[{label:'balise',type:'texte',ans:[tag,'<'+tag+'>'],hint:'le nom de la balise'}],
    sol:`&lt;${tag}&gt; : ${quoi}`}}},

{id:'simpledouble',chap:'Balises',pts:2,gen(R,F){
  const simple=R.rnd()<.5,tag=R.pick(simple?SIMPLES:DOUBLES);
  const ch={options:['simple (se ferme elle-même)','double (ouvrante + fermante)'],ans:simple?0:1};
  return{v:{tag},text:`<p>La balise ${c('<'+tag+'>')} est-elle une balise simple ou une balise double ?</p>`,
    fields:[{label:'&lt;'+tag+'&gt;',type:'choix',options:ch.options,ans:ch.ans}],
    sol:simple?`&lt;${tag} /&gt; est une balise simple : elle ne contient rien, elle se ferme elle-même.`:`&lt;${tag}&gt; … &lt;/${tag}&gt; est une balise double : elle encadre un contenu.`}}},

{id:'attribut',chap:'Balises',pts:2,gen(R,F){
  const [tag,att,role]=R.pick([['img','src','le chemin de l\'image'],['a','href','la destination du lien']]);
  const ch=choix(R,att,['alt','class','title','id'].filter(x=>x!==att).slice(0,3));
  return{v:{tag},text:`<p>Quel est l'attribut indispensable de la balise ${c('<'+tag+'>')} ?</p>`,
    fields:[{label:'attribut',type:'choix',options:ch.options,ans:ch.ans}],
    sol:`${att} : ${role}.${tag==='img'?' (alt est aussi demandé par le validateur W3C, mais l\'image s\'affiche sans lui.)':''}`}}},

{id:'lamp',chap:'Le web',pts:2,gen(R,F){
  const [l,nom]=R.pick(LAMP),ch=choix(R,nom,LAMP.map(x=>x[1]).filter(x=>x!==nom));
  const autres=Object.keys(ROLES).filter(k=>k!==nom),ch2=choix(R,ROLES[nom],autres.map(k=>ROLES[k]));
  return{v:{nom},text:`<p>Dans la pile <b>LAMP</b>, que désigne la lettre <b>${l}</b> (la ${'LAMP'.indexOf(l)+1}<sup>e</sup>), et à quoi sert-elle ?</p>`,
    fields:[{label:'lettre '+l,type:'choix',options:ch.options,ans:ch.ans},{label:'rôle',type:'choix',options:ch2.options,ans:ch2.ans}],
    sol:`LAMP = Linux, Apache, MySQL, PHP
${l} = ${nom} : ${ROLES[nom]}`}}},

/* ---------- Cours 2 : structure d'une page ---------- */

{id:'partie',chap:'Structure',pts:2,gen(R,F){
  const [quoi,ou]=R.pick(PARTIES),opts=['doctype','head','body'];
  return{v:{quoi},text:`<p>Dans quelle partie de la page HTML se trouve <b>${quoi}</b> ?</p>`,
    fields:[{label:'partie',type:'choix',options:opts,ans:opts.indexOf(ou)}],
    sol:ou==='head'?`dans le head : c'est une méta-information, elle ne s'affiche pas dans la page`:ou==='body'?`dans le body : c'est du contenu affiché`:`dans le doctype, en tête de fichier : &lt;!DOCTYPE html&gt; en HTML5`}}},

{id:'ancre',chap:'Liens',pts:2,gen(R,F){
  const nom=R.pick(NOMS);
  return{v:{nom},text:`<p>Une section de la page est écrite ${c('<div id="'+nom+'">…</div>')}. Quelle valeur faut-il mettre dans l'attribut href d'un lien pour y sauter ?</p>`,
    fields:[{label:'href',type:'texte',ans:['#'+nom,'"#'+nom+'"'],hint:'la valeur, sans href='}],
    sol:`&lt;a href="#${nom}"&gt;…&lt;/a&gt; : un # devant l'id visé (et pas de # dans id="${nom}")`}}},

{id:'tableau',chap:'Tableaux',pts:2,gen(R,F){
  const L=R.int(2,4),C=R.int(2,4),pied=R.rnd()<.6;
  const row=i=>'  <tr>'+Array.from({length:C},(_,j)=>'<td>'+String.fromCharCode(65+j)+(i+1)+'</td>').join('')+'</tr>';
  const code='<table>\n'+Array.from({length:L},(_,i)=>row(i)).join('\n')+(pied?'\n  <tr><td colspan="'+C+'">Total</td></tr>':'')+'\n</table>';
  const lignes=L+(pied?1:0),cases=L*C+(pied?1:0);
  return{v:{L,C,pied},text:`<p>Combien de lignes et combien de cellules (balises td) contient ce tableau ?</p>${pre(code)}`,
    fields:[{label:'lignes',unit:'',ans:lignes,d:0,tol:0.01,hint:'un nombre entier'},{label:'cellules',unit:'',ans:cases,d:0,tol:0.01,hint:'un nombre entier'}],
    sol:`une ligne par &lt;tr&gt; : ${L}${pied?' + 1 (la ligne du total)':''} = ${lignes}
une cellule par &lt;td&gt; : ${L} × ${C}${pied?' + 1 (colspan="'+C+'" : une seule cellule, large de '+C+' colonnes)':''} = ${cases}`,
    note:pied?`<p class="mds-note">Piège : colspan élargit une cellule, il n'en crée pas plusieurs.</p>`:''}}},

{id:'tablebalise',chap:'Tableaux',pts:2,gen(R,F){
  const T=[['une ligne','tr'],['une cellule','td'],['l\'en-tête du tableau','thead'],['le corps du tableau','tbody'],['le pied du tableau','tfoot']];
  const [quoi,tag]=R.pick(T),ch=choix(R,'<'+tag+'>',T.filter(x=>x[1]!==tag).map(x=>'<'+x[1]+'>').slice(0,3));
  return{v:{quoi},text:`<p>Dans un tableau HTML, quelle balise crée <b>${quoi}</b> ?</p>`,
    fields:[{label:'balise',type:'choix',options:ch.options,ans:ch.ans}],
    sol:`&lt;${tag}&gt; : ${quoi}   (table row = tr, table data = td)`}}},

/* ---------- Cours 3 : CSS ---------- */

{id:'selecteur',chap:'Sélecteurs',pts:2,gen(R,F){
  const k=R.pick(['id','class','tag']),nom=R.pick(NOMS),tag=R.pick(['p','h2','div','li','td','span']);
  const q=k==='id'?`l'élément qui a ${c('id="'+nom+'"')}`:k==='class'?`tous les éléments qui ont ${c('class="'+nom+'"')}`:`toutes les balises ${c('<'+tag+'>')}`;
  const ans=k==='id'?'#'+nom:k==='class'?'.'+nom:tag;
  return{v:{k,nom,tag},text:`<p>Écris le sélecteur CSS qui vise ${q}.</p>`,
    fields:[{label:'sélecteur',type:'texte',ans:[ans],hint:'sans les accolades'}],
    sol:`${ans} { … }   (${k==='id'?'# pour un id':k==='class'?'. pour une classe':'le nom de la balise, sans chevrons'})`}}},

{id:'hexrgb',chap:'Couleurs',pts:2,gen(R,F){
  const r=R.int(0,255),g=R.int(0,255),b=R.int(0,255),hex='#'+hx(r)+hx(g)+hx(b);
  const det=n=>`${hx(n)} = ${n>>4} × 16 + ${n&15} = ${n}`;
  return{v:{hex},text:`<p>Convertis la couleur ${c(hex)} en rgb(R, G, B).</p>`,
    fields:[{label:'R',unit:'',ans:r,d:0,tol:0.01,hint:'de 0 à 255'},{label:'G',unit:'',ans:g,d:0,tol:0.01,hint:'de 0 à 255'},{label:'B',unit:'',ans:b,d:0,tol:0.01,hint:'de 0 à 255'}],
    sol:`A=10, B=11, C=12, D=13, E=14, F=15
R : ${det(r)}
G : ${det(g)}
B : ${det(b)}
→ rgb(${r}, ${g}, ${b})`}}},

{id:'rgbhex',chap:'Couleurs',pts:2,gen(R,F){
  const r=R.int(0,255),g=R.int(0,255),b=R.int(0,255),hex='#'+hx(r)+hx(g)+hx(b);
  const det=n=>`${n} = ${n>>4} × 16 + ${n&15} → ${hx(n)}`;
  return{v:{r,g,b},text:`<p>Écris la couleur ${c('rgb('+r+', '+g+', '+b+')')} en hexadécimal (#RRGGBB).</p>`,
    fields:[{label:'couleur',type:'texte',ans:[hex],hint:'par exemple #0080FF'}],
    sol:`${det(r)}\n${det(g)}\n${det(b)}\n→ ${hex}`}}},

{id:'propriete',chap:'Propriétés',pts:2,gen(R,F){
  const [quoi,p]=R.pick(PROPS),ch=choix(R,p,R.shuffle(PROPS.filter(x=>x[1]!==p)).slice(0,3).map(x=>x[1]));
  return{v:{quoi},text:`<p>Quelle propriété CSS règle <b>${quoi}</b> ?</p>`,
    fields:[{label:'propriété',type:'choix',options:ch.options,ans:ch.ans}],
    sol:`${p} : ${quoi}`}}},

{id:'media',chap:'Responsive',pts:2,gen(R,F){
  const lim=R.pick([480,640,768,900]),mode=R.pick(['max','min']),w1=R.int(70,98),w2=R.int(30,69),ecr=R.pick([360,390,414,600,700,820,1024,1280]);
  const actif=mode==='max'?ecr<=lim:ecr>=lim,ans=actif?w2:w1,ch=choix(R,ans+' %',[(actif?w1:w2)+' %',lim+' px']);
  const code=`#bloc {\n  width: ${w1}%;\n}\n\n@media screen and (${mode}-width: ${lim}px) {\n  #bloc {\n    width: ${w2}%;\n  }\n}`;
  return{v:{lim,mode,w1,w2,ecr},text:`<p>Avec ce CSS, quelle est la largeur de #bloc sur un écran de <b>${ecr} px</b> de large ?</p>${pre(code)}`,
    fields:[{label:'largeur',type:'choix',options:ch.options,ans:ch.ans}],
    sol:`${mode}-width: ${lim}px = « ${mode==='max'?'jusqu\'à':'à partir de'} ${lim} px »
${ecr} px : la condition est ${actif?'vraie, la règle de la media query s\'applique':'fausse, la règle générale s\'applique'} → width: ${ans}%`}}},

{id:'boite',chap:'Propriétés',pts:2,gen(R,F){
  const w=R.int(10,40)*10,p=R.int(1,6)*5,b=R.int(1,5),m=R.int(0,6)*5;
  return{v:{w,p,b,m},text:`<p>Un bloc a ${c('width: '+w+'px; padding: '+p+'px; border: '+b+'px solid black; margin: '+m+'px;')} (même valeur des deux côtés). Quelle largeur occupe-t-il à l'écran, bordure comprise (sans les marges), puis avec les marges ?</p>`,
    fields:[{label:'avec bordure',unit:'px',ans:w+2*p+2*b,d:0,tol:0.01,hint:'en px'},{label:'avec marges',unit:'px',ans:w+2*p+2*b+2*m,d:0,tol:0.01,hint:'en px'}],
    sol:`width ne compte que le contenu ; padding et border s'ajoutent de chaque côté
${w} + 2 × ${p} + 2 × ${b} = ${w+2*p+2*b} px
avec les marges : ${w+2*p+2*b} + 2 × ${m} = ${w+2*p+2*b+2*m} px`,
    note:`<p class="mds-note">Piège : padding = marge intérieure (dans la bordure), margin = marge extérieure.</p>`}}},

{id:'integration',chap:'Le CSS',pts:2,gen(R,F){
  const f=R.pick(['style.css','TD3.css','site.css','theme.css']);
  const bon=`<link rel="stylesheet" href="${f}" />`,ch=choix(R,bon,[`<link rel="${f}" />`,`<style src="${f}"></style>`,`<css href="${f}" />`]);
  return{v:{f},text:`<p>Quelle ligne, placée dans le head, relie correctement la feuille de style ${c(f)} à la page ?</p>`,
    fields:[{label:'ligne',type:'choix',options:ch.options,ans:ch.ans}],
    sol:`${e(bon)}
rel dit le type de lien (stylesheet), href donne le fichier`}}},

/* ---------- Cours 4 : formulaires ---------- */

{id:'methode',chap:'Formulaires',pts:2,gen(R,F){
  const S=[['un formulaire de connexion avec mot de passe','POST'],['une barre de recherche dont on veut partager le lien des résultats','GET'],
    ['l\'envoi de données personnelles (adresse, téléphone)','POST'],['un filtre de produits (couleur, taille) qu\'on veut garder dans l\'adresse','GET'],['un formulaire d\'inscription','POST']];
  const [cas,m]=R.pick(S);
  return{v:{cas},text:`<p>Pour <b>${cas}</b>, quelle méthode d'envoi choisir ?</p>`,
    fields:[{label:'method',type:'choix',options:['GET','POST'],ans:m==='GET'?0:1}],
    sol:m==='GET'?`GET : les données sont dans l'URL, on peut la copier, la partager, la modifier`:`POST : les données ne s'affichent pas dans l'URL (et le https les chiffre)`}}},

{id:'typeinput',chap:'Formulaires',pts:2,gen(R,F){
  const [quoi,t]=R.pick(TYPES),ch=choix(R,t,R.shuffle(TYPES.filter(x=>x[1]!==t)).slice(0,3).map(x=>x[1]));
  return{v:{quoi},text:`<p>Quel type de ${c('<input>')} faut-il pour <b>${quoi}</b> ?</p>`,
    fields:[{label:'type',type:'choix',options:ch.options,ans:ch.ans}],
    sol:`&lt;input type="${t}" … /&gt;`}}},

{id:'urlget',chap:'Formulaires',pts:2,gen(R,F){
  const page=R.pick(['inscription.php','recherche.php','resultat.html','TD3.html']),p=R.pick(PRENOMS),a=R.int(17,25),promo=R.pick(['hei','cpi','adi']);
  const champs=R.shuffle([['prenom',p],['age',String(a)],['promo',promo]]).slice(0,R.int(2,3));
  const url=page+'?'+champs.map(x=>x[0]+'='+x[1]).join('&');
  return{v:{url},text:`<p>Le formulaire ${c('<form method="get" action="'+page+'">')} contient ${champs.map(x=>`le champ ${c('name="'+x[0]+'"')} rempli avec <b>${x[1]}</b>`).join(', puis ')}. Quelle adresse s'affiche après l'envoi ?</p>`,
    fields:[{label:'adresse',type:'texte',ans:[url],hint:'page?nom=valeur&…'}],
    sol:`${e(url)}
? sépare la page des données ; & sépare les champs ; nom = attribut name`}}},

{id:'radio',chap:'Formulaires',pts:2,gen(R,F){
  const k=R.pick(['radio','checkbox']);
  if(k==='radio'){const ch=choix(R,'le même name',['le même id','la même value','la même class']);
    return{v:{k},text:`<p>Pour que trois boutons ${c('type="radio"')} s'excluent (un seul choix possible), ils doivent avoir :</p>`,
      fields:[{label:'il faut',type:'choix',options:ch.options,ans:ch.ans}],sol:`le même name : c'est lui qui forme le groupe ; les id restent différents`}}
  const nom=R.pick(['theme','notifications','newsletter','cgu']);
  return{v:{k,nom},text:`<p>La case ${c('<input type="checkbox" name="'+nom+'" />')} est cochée et n'a pas d'attribut value. Qu'envoie-t-elle au serveur ? (forme nom=valeur)</p>`,
    fields:[{label:'envoi',type:'texte',ans:[nom+'=on'],hint:'nom=valeur'}],sol:`${nom}=on   (une case non cochée n'envoie rien)`}}},

{id:'labelfor',chap:'Formulaires',pts:2,gen(R,F){
  const id=R.pick(['nom','email','age','ville','pseudo']);
  return{v:{id},text:`<p>Le champ s'écrit ${c('<input type="text" id="'+id+'" name="champ1" />')}. Que faut-il mettre dans l'attribut for du label pour qu'il lui soit relié ?</p>`,
    fields:[{label:'for',type:'texte',ans:[id,'"'+id+'"'],hint:'la valeur, sans for='}],
    sol:`&lt;label for="${id}"&gt; : for reprend l'id du champ (pas son name)`}}}

];
})();
