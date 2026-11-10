/* Banque du mini-DS Créativité et Innovation (cours de B. Dufossé et F. Lefebvre), alignée sur /cours/crea/….
   Examen sur table : définitions, modèles (Schumpeter, Rogers, Guilford, TRL), méthodes (SONCASE, brainstorming, pitch, publicité).
   Surtout des cases « choix » (une situation tirée au hasard, on reconnaît la notion) et quelques calculs (pourcentages, tableau de tri).
   Les situations sont repérées par leur indice k dans v ; le solveur outils/solveurs/crea.js a sa propre table de réponses.
   Vérification : node outils/verif-minids.js 3000 crea */
(function(){
const choix=(R,bonne,toutes)=>{const o=R.shuffle(toutes.slice());return {options:o,ans:o.indexOf(bonne)}};
const ch=(R,bonne,toutes,label)=>{const c=choix(R,bonne,toutes);return {label:label||'réponse',type:'choix',options:c.options,ans:c.ans}};
const pickK=(R,T)=>R.int(0,T.length-1);

const NIV=['découverte','invention','innovation'];
const T_NIV=[
  ['Des chercheurs observent pour la première fois qu\'une bactérie résiste à un antibiotique.',0],
  ['Un ingénieur met au point un nouveau moteur et dépose un brevet, mais personne ne le fabrique.',1],
  ['Une appli de covoiturage est utilisée chaque jour par des millions de personnes.',2],
  ['Des astronomes repèrent une nouvelle planète autour d\'une étoile.',0],
  ['Un étudiant fabrique dans son garage un prototype de vélo pliant inédit.',1],
  ['Le paquet du Petit Beurre en mono-papier est vendu dans tous les supermarchés.',2],
  ['Un physicien met en évidence un nouveau phénomène magnétique.',0],
  ['Blaise Pascal construit une machine à calculer en 1642, qui n\'est fabriquée qu\'à une vingtaine d\'exemplaires.',1],
  ['Le Post-it est vendu partout dans le monde à partir de 1980.',2]];

const FORMES=['innovation de produits','innovation de procédés','innovation commerciale','nouvelle matière première','nouveau type d\'organisation'];
const T_FORME=[
  ['LU lance une galette au chocolat inspirée d\'un moule de 1905.',0],
  ['Une biscuiterie remplace la cuisson à la main par une ligne de fours automatisés.',1],
  ['Une marque vend ses biscuits existants à une nouvelle clientèle : les sportifs.',2],
  ['Un emballage en papier remplace l\'emballage en plastique.',3],
  ['L\'entreprise passe à des équipes autonomes organisées par projet.',4],
  ['On ajoute un appareil photo à un téléphone existant.',0],
  ['Des robots remplacent les ouvriers sur une chaîne de montage.',1],
  ['Une entreprise découvre un besoin nouveau : des goûters sans sucre pour les seniors.',2],
  ['Une usine utilise une nouvelle fibre végétale à la place du coton.',3],
  ['Le travail est découpé en tâches simples et chronométrées (taylorisme).',1],
  ['Une banque généralise le télétravail et supprime les bureaux attitrés.',4]];

const CAT=[['innovateurs',2.5],['adopteurs précoces',13.5],['majorité précoce',34],['majorité tardive',34],['retardataires',16]];
const T_CAT=[
  ['Ils achètent l\'objet dès sa sortie, par goût du risque et de la nouveauté, même s\'il a encore des défauts.',0],
  ['Respectés dans leur entourage, ils adoptent tôt et servent souvent de leaders d\'opinion.',1],
  ['Ils adoptent un peu avant la moyenne, après avoir vu que ça marche chez les premiers.',2],
  ['Sceptiques, ils adoptent après la moyenne, souvent par nécessité ou pression sociale.',3],
  ['Attachés aux habitudes, ils adoptent en tout dernier, parfois quand l\'ancien produit n\'existe plus.',4]];

const COND=['avantage relatif','compatibilité','complexité','testabilité','observabilité'];
const T_COND=[
  ['On peut goûter gratuitement le nouveau biscuit en magasin avant de l\'acheter.',3],
  ['Les voisins voient les panneaux solaires installés sur le toit.',4],
  ['La nouvelle appli fait gagner 10 minutes par jour par rapport à l\'ancienne méthode.',0],
  ['Le produit correspond aux valeurs et aux habitudes alimentaires de la cible.',1],
  ['L\'appareil demande une heure de lecture du mode d\'emploi avant de servir.',2],
  ['Une version d\'essai gratuite de 30 jours permet d\'utiliser le logiciel.',3],
  ['Les résultats d\'un nouvel engrais se voient dans le champ, d\'une route à l\'autre.',4],
  ['La Pascaline était jugée trop difficile à utiliser et à comprendre.',2]];

const SON=['Sécurité','Orgueil','Nouveauté','Confort','Argent','Sympathie','Environnement'];
const T_SON=[
  ['« Recette sans additifs, contrôlée par nos laboratoires. »',0],
  ['« Édition collector réservée à nos 1 000 premiers clients. »',1],
  ['« Une saveur inédite, jamais vue en rayon. »',2],
  ['« Sachet refermable, à glisser dans la poche. »',3],
  ['« 2 paquets achetés, le 3e offert. »',4],
  ['« La recette de votre enfance, depuis 1886. »',5],
  ['« Emballage 100 % papier, recyclable. »',6],
  ['« Garanti 5 ans, pièces et main-d\'œuvre. »',0],
  ['« Livraison à domicile en 2 heures. »',3],
  ['« Le meilleur rapport qualité-prix du marché. »',4],
  ['« Fabriqué localement, avec 40 % d\'émissions de CO₂ en moins. »',6]];

const INV=[
  ['la Pascaline, 1re machine à calculer (1642)','Blaise Pascal'],
  ['le filtre à café en papier (1908)','Melitta Bentz'],
  ['le condenseur séparé de la machine à vapeur (brevet de 1769)','James Watt'],
  ['le kinétographe, l\'une des premières caméras (années 1890)','William Dickson et Thomas Edison'],
  ['le brevet de saut de fréquence, à la base du Wi-Fi (1942)','Hedy Lamarr et George Antheil'],
  ['le premier programme informatique (1843)','Ada Lovelace'],
  ['La Jamais Contente, voiture électrique qui dépasse 100 km/h (1899)','Camille Jenatzy'],
  ['le Post-it, né d\'une colle trop peu adhésive','3M (Spencer Silver et Arthur Fry)']];
const LECON=['échec de la diffusion : trop complexe et trop cher','détournement d\'usage d\'un objet existant','amélioration d\'une machine existante, grâce à un financeur','un échec qui trouve un autre usage, lancé par la gratuité','une technique simple, mais plus lourde et plus chère que la concurrence'];
const T_LECON=[['de la Pascaline',0],['du filtre Melitta (papier buvard du cahier de son fils)',1],['de la machine à vapeur de Watt et Boulton',2],['du Post-it',3],['de La Jamais Contente',4]];

const GUIL=[['analyser','divergence'],['déstructurer','divergence'],['imaginer','divergence'],['associer','divergence'],['combiner','divergence'],['évaluer','convergence'],['catégoriser','convergence'],['choisir','convergence']];

const REGLES=['suspendre son jugement','privilégier la quantité','farfelu bienvenu','valoriser les différences','être présent ici et maintenant','se poser des questions'];
const T_REGLE=[
  ['Pendant le tour de partage, un membre répond « ça ne marchera jamais ».',0],
  ['L\'animateur demande 50 idées en 10 minutes, même imparfaites.',1],
  ['Une idée absurde (un biscuit qui flotte) est notée sur un post-it sans moquerie.',2],
  ['On écoute en particulier l\'avis de l\'étudiant étranger, qui ne mange pas de biscuits au goûter.',3],
  ['Un participant répond à ses messages pendant la séance.',4],
  ['L\'équipe commence par lister ce qu\'elle sait et ne sait pas du sujet.',5]];

const BS=[['chacun note seul ses idées, même les plus évidentes, une par post-it',1,5],['tour de partage : chacun présente ses idées, on rebondit',2,10],['trier, organiser les idées, chacun en choisit une à explorer',3,5]];

const TRL=['recherche fondamentale','formulation du concept','preuve de concept','prototype en environnement contrôlé','prototype en environnement représentatif','démonstration d\'un prototype en environnement pertinent','prototype opérationnel','système complet qualifié','système commercialisé'];
const T_TRL=[
  ['On identifie les principes scientifiques de base.',1],
  ['On pose les premiers modèles théoriques et hypothèses.',2],
  ['Des expériences en laboratoire valident la faisabilité.',3],
  ['Le premier prototype est testé en laboratoire.',4],
  ['Le prototype passe des expérimentations plus avancées, en environnement représentatif.',5],
  ['Le prototype est testé dans des conditions proches des conditions réelles.',6],
  ['Le prototype est intégré et validé dans un environnement réel.',7],
  ['Le système complet passe le test final avant commercialisation.',8],
  ['Le produit est disponible sur le marché.',9]];
const PHASE=['Recherche','Développement','Déploiement'];

const ETAPE=['Recherche et Développement','Commercialisation','Diffusion'];
const T_ETAPE=[['la recherche appliquée, qui donne des inventions et du design',0],['le développement de prototypes et de versions bêta',0],['l\'investissement qui met l\'innovation sur le marché',1],['l\'adoption par le consommateur et la pénétration du marché',2],['l\'adaptation et l\'amélioration du produit après les retours clients',2],['la recherche, qui donne des découvertes et des idées',0]];

const DIFF=['modèle de l\'aiguille hypodermique','modèle du flux en deux étapes','homophilie'];
const T_DIFF=[
  ['Les médias de masse touchent chaque individu directement, sans effet de réseau.',0],
  ['Les médias touchent des leaders d\'opinion, qui influencent à leur tour les autres.',1],
  ['Les idées passent plus facilement entre personnes de même éducation et de même statut social.',2],
  ['Un modèle jugé erroné, car il ignore l\'influence des individus les uns sur les autres.',0],
  ['Un étudiant convainc plus facilement d\'autres étudiants qu\'un expert en costume.',2],
  ['Une marque envoie ses produits à des influenceurs plutôt que d\'acheter des spots télé.',1]];

const STRAT=['cibler les individus les plus respectés','suggérer que l\'adoption est inévitable ou désirable','introduire l\'innovation dans les groupes les plus innovatifs','inciter à l\'adoption précoce (gratuité…)'];
const T_STRAT=[
  ['3M distribue des Post-it gratuitement à toute une ville.',3],
  ['La pub annonce : « Bientôt, tout le monde roulera électrique. »',1],
  ['Une marque fait d\'abord tester son appli aux étudiants d\'une école d\'ingénieurs férus de nouveautés.',2],
  ['Le nouveau matériel est d\'abord confié au chef de service le plus écouté de l\'hôpital.',0],
  ['Le premier mois d\'abonnement est offert jusqu\'à atteindre 100 000 utilisateurs.',3]];

const PITCH=['pitch investisseur','pitch entrepreneur','pitch commercial','pitch interne'];
const T_PITCH=[
  ['Convaincre des business angels de financer le projet.',0],
  ['Présenter sa startup lors d\'un salon de jeunes entreprises.',1],
  ['Convaincre un supermarché de référencer le nouveau biscuit.',2],
  ['Rallier les équipes de l\'usine au changement de recette.',3],
  ['Lever des fonds sur une plateforme de crowdfunding.',0]];
const PART=['accroche','contexte','problème','bénéfices','solution','appel à l\'action'];

const PUB=['suggestion (émotion)','mécanisation (répétition)','intégration (appartenance)','publicité informative'];
const T_PUB=[
  ['Une musique émouvante et des retrouvailles en famille, le produit n\'apparaît qu\'à la fin.',0],
  ['Le même slogan répété dans chaque spot depuis 20 ans.',1],
  ['« Rejoins la communauté des vrais gamers. »',2],
  ['Un spot qui donne le prix, la composition et le magasin où acheter.',3],
  ['Le jingle passe trois fois dans la même page de pub.',1],
  ['Des amis rient ensemble, une bouteille à la main : être de la bande.',2]];

const FA=['fonctionnalité','avantage'];
const T_FA=[['« Sachet refermable de 4 biscuits. »',0],['« Ton goûter reste croustillant jusqu\'au soir. »',1],['« Farine 100 % bio. »',0],['« Un goûter que les parents achètent sans hésiter. »',1],['« Batterie de 5 000 mAh. »',0],['« Tu tiens deux jours sans recharger. »',1]];

window.BANQUE_CREA=[

/* ---------- Partie I : explorer et s'inspirer ---------- */

{id:'niveau',chap:'Définitions',pts:2,gen(R,F){
  const k=pickK(R,T_NIV),[s,a]=T_NIV[k];
  return{v:{k},text:`<p>${s} Est-ce une découverte, une invention ou une innovation ?</p>`,
    fields:[ch(R,NIV[a],NIV)],
    sol:`découverte : connaissances, sciences ; invention : moyen technique nouveau ; innovation : mise sur le marché, diffusion
→ ${NIV[a]}`}}},

{id:'schumpeter',chap:'Schumpeter',pts:2,gen(R,F){
  const k=pickK(R,T_FORME),[s,a]=T_FORME[k];
  return{v:{k},text:`<p>${s} Selon Schumpeter (1939), de quelle forme d'innovation s'agit-il ?</p>`,
    fields:[ch(R,FORMES[a],FORMES,'forme')],
    sol:`5 formes : produits, procédés, commerciale, matière première, organisation
→ ${FORMES[a]}`}}},

{id:'rogers_cat',chap:'Diffusion',pts:2,gen(R,F){
  const k=pickK(R,T_CAT),[s,a]=T_CAT[k],noms=CAT.map(x=>x[0]);
  return{v:{k},text:`<p>${s} Dans quelle catégorie d'adoptants de Rogers sont-ils, et quelle part de la population représente-t-elle ?</p>`,
    fields:[ch(R,noms[a],noms,'catégorie'),{label:'part',unit:'%',ans:CAT[a][1],d:1,tol:0.01,hint:'en %, ex. 13,5'}],
    sol:`innovateurs 2,5 % · adopteurs précoces 13,5 % · majorité précoce 34 % · majorité tardive 34 % · retardataires 16 %
→ ${noms[a]}, ${F.n(CAT[a][1],1)} %`}}},

{id:'rogers_cumul',chap:'Diffusion',pts:2,gen(R,F){
  const k=R.int(0,3);let c=0;for(let i=0;i<=k;i++)c+=CAT[i][1];
  return{v:{k},text:`<p>Selon la courbe de Rogers, quelle part de la population a adopté l'innovation à la fin de la catégorie « ${CAT[k][0]} » ? Et quelle part n'a pas encore adopté ?</p>`,
    fields:[{label:'ont adopté',unit:'%',ans:c,d:1,tol:0.01,hint:'en %'},{label:'pas encore',unit:'%',ans:100-c,d:1,tol:0.01,hint:'en %'}],
    sol:`on additionne : ${CAT.slice(0,k+1).map(x=>F.n(x[1],1)).join(' + ')} = ${F.n(c,1)} %
reste : 100 − ${F.n(c,1)} = ${F.n(100-c,1)} %`}}},

{id:'conditions',chap:'Diffusion',pts:2,gen(R,F){
  const k=pickK(R,T_COND),[s,a]=T_COND[k];
  return{v:{k},text:`<p>${s} Quelle condition d'adoption de Rogers est en jeu ?</p>`,
    fields:[ch(R,COND[a],COND,'condition')],
    sol:`→ ${COND[a]}${a===2?'\n(la complexité freine l\'adoption ; les 4 autres conditions l\'aident)':''}`}}},

{id:'soncase',chap:'Cible',pts:2,gen(R,F){
  const k=pickK(R,T_SON),[s,a]=T_SON[k];
  return{v:{k},text:`<p>Sur un emballage : ${s} Quel levier de motivation SONCASE est utilisé ?</p>`,
    fields:[ch(R,SON[a],SON,'levier')],
    sol:`SONCASE : Sécurité, Orgueil, Nouveauté, Confort, Argent, Sympathie, Environnement
→ ${SON[a]}`}}},

/* ---------- Partie II : imaginer ---------- */

{id:'inventeur',chap:'Inventions',pts:2,gen(R,F){
  const k=pickK(R,INV),[s,a]=INV[k],toutes=INV.map(x=>x[1]);
  const autres=R.shuffle(toutes.filter(x=>x!==a)).slice(0,3);
  return{v:{k},text:`<p>Qui est à l'origine de ${s} ?</p>`,
    fields:[ch(R,a,[a,...autres],'origine')],
    sol:`${s} : ${a}`}}},

{id:'lecon',chap:'Inventions',pts:2,gen(R,F){
  const k=pickK(R,T_LECON),[s,a]=T_LECON[k];
  return{v:{k},text:`<p>Quelle leçon pour l'innovation retenir de l'histoire ${s} ?</p>`,
    fields:[ch(R,LECON[a],LECON,'leçon')],
    sol:`l'histoire ${s} → ${LECON[a]}`}}},

{id:'guilford',chap:'Créativité',pts:2,gen(R,F){
  const i=R.int(0,GUIL.length-1),j=(i+R.int(1,GUIL.length-1))%GUIL.length,[a,pa]=GUIL[i],[b,pb]=GUIL[j],O=['divergence','convergence'];
  return{v:{i,j},text:`<p>Dans le modèle de Guilford (1956), à quelle phase appartiennent les actions « ${a} » et « ${b} » ?</p>`,
    fields:[ch(R,pa,O,a),ch(R,pb,O,b)],
    sol:`divergence : analyser, déstructurer, imaginer, associer, combiner
convergence : évaluer, catégoriser, choisir
→ ${a} : ${pa} ; ${b} : ${pb}`}}},

{id:'regles',chap:'Intelligence collective',pts:2,gen(R,F){
  const k=pickK(R,T_REGLE),[s,a]=T_REGLE[k];
  return{v:{k},text:`<p>Séance de créativité : ${s} Quelle règle d'une séance réussie est en jeu ?</p>`,
    fields:[ch(R,REGLES[a],REGLES,'règle')],
    sol:`→ ${REGLES[a]}`}}},

{id:'brainstorming',chap:'Intelligence collective',pts:2,gen(R,F){
  const k=R.int(0,2),[s,n,d]=BS[k];
  return{v:{k},text:`<p>Brainstorming du cours : « ${s} ». C'est la phase numéro combien, et combien de minutes dure-t-elle ?</p>`,
    fields:[{label:'phase',unit:'',ans:n,d:0,tol:0.01,hint:'1, 2 ou 3'},{label:'durée',unit:'min',ans:d,d:0,tol:0.01,hint:'en min'}],
    sol:`① individuel, 5 min : chacun note ses idées
② en groupe, 10 min : tour de partage
③ en groupe, 5 min : trier et choisir
→ phase ${n}, ${d} min`}}},

{id:'tri',chap:'Trier ses idées',pts:2,gen(R,F){
  const P=[R.int(1,3),R.int(1,3),R.int(1,3)],C=['coût','faisabilité','originalité'];
  let A,B;do{A=[R.int(0,3),R.int(0,3),R.int(0,3)];B=[R.int(0,3),R.int(0,3),R.int(0,3)]}while(A.reduce((s,x,i)=>s+x*P[i],0)===B.reduce((s,x,i)=>s+x*P[i],0));
  const sA=A.reduce((s,x,i)=>s+x*P[i],0),sB=B.reduce((s,x,i)=>s+x*P[i],0);
  return{v:{P,A,B},text:`<p>Tableau de tri, notes de 0 à 3 et score = somme des (note × poids). Poids : ${C.map((c,i)=>c+' '+P[i]).join(', ')}. Idée A : ${A.join(', ')}. Idée B : ${B.join(', ')}. Scores, et idée retenue ?</p>`,
    fields:[{label:'score A',unit:'',ans:sA,d:0,tol:0.01,hint:'un entier'},{label:'score B',unit:'',ans:sB,d:0,tol:0.01,hint:'un entier'},ch(R,sA>sB?'idée A':'idée B',['idée A','idée B'],'retenue')],
    sol:`A : ${A.map((x,i)=>x+'×'+P[i]).join(' + ')} = ${sA}
B : ${B.map((x,i)=>x+'×'+P[i]).join(' + ')} = ${sB}
→ idée ${sA>sB?'A':'B'} retenue`}}},

/* ---------- Partie III : innover ---------- */

{id:'trl',chap:'TRL',pts:2,gen(R,F){
  const k=pickK(R,T_TRL),[s,n]=T_TRL[k],ph=n<=3?0:n<=6?1:2;
  return{v:{k},text:`<p>${s} Quel niveau TRL, et dans quelle grande phase ?</p>`,
    fields:[{label:'TRL',unit:'',ans:n,d:0,tol:0.01,hint:'de 1 à 9'},ch(R,PHASE[ph],PHASE,'phase')],
    sol:`TRL ${n} : ${TRL[n-1]}
1-3 Recherche · 4-6 Développement · 7-9 Déploiement → ${PHASE[ph]}`}}},

{id:'etapes',chap:'Processus',pts:2,gen(R,F){
  const k=pickK(R,T_ETAPE),[s,a]=T_ETAPE[k];
  return{v:{k},text:`<p>Dans le processus d'innovation (Martin-Bariteau), à quelle grande étape appartient ${s} ?</p>`,
    fields:[ch(R,ETAPE[a],ETAPE,'étape')],
    sol:`1 à 3 Recherche et Développement (la firme) · 4 Commercialisation · 5 Diffusion (le marché)
→ ${ETAPE[a]}`}}},

{id:'modeles',chap:'Diffusion médias',pts:2,gen(R,F){
  const k=pickK(R,T_DIFF),[s,a]=T_DIFF[k];
  return{v:{k},text:`<p>${s} De quelle notion du cours s'agit-il ?</p>`,
    fields:[ch(R,DIFF[a],DIFF,'notion')],
    sol:`aiguille hypodermique : médias → individus, sans réseau (modèle erroné)
flux en deux étapes : médias → leaders d'opinion → individus
homophilie : les idées passent mieux entre personnes semblables
→ ${DIFF[a]}`}}},

{id:'strategies',chap:'Diffusion médias',pts:2,gen(R,F){
  const k=pickK(R,T_STRAT),[s,a]=T_STRAT[k];
  return{v:{k},text:`<p>${s} Quelle stratégie pour accélérer la diffusion est utilisée ?</p>`,
    fields:[ch(R,STRAT[a],STRAT,'stratégie')],
    sol:`→ ${STRAT[a]}`}}},

{id:'pitch_format',chap:'Pitch',pts:2,gen(R,F){
  const k=pickK(R,T_PITCH),[s,a]=T_PITCH[k];
  return{v:{k},text:`<p>Objectif : ${s} Quel format de pitch ?</p>`,
    fields:[ch(R,PITCH[a],PITCH,'format')],
    sol:`investisseur : financeurs · entrepreneur : présenter sa startup · commercial : clients · interne : collaborateurs
→ ${PITCH[a]}`}}},

{id:'pitch_ordre',chap:'Pitch',pts:2,gen(R,F){
  const i=R.int(0,5);let j;do{j=R.int(0,5)}while(j===i);
  return{v:{i,j},text:`<p>Dans la structure du pitch de 3 minutes vue en cours (6 parties), en quelle position viennent « ${PART[i]} » et « ${PART[j]} » ?</p>`,
    fields:[{label:PART[i],unit:'',ans:i+1,d:0,tol:0.01,hint:'de 1 à 6'},{label:PART[j],unit:'',ans:j+1,d:0,tol:0.01,hint:'de 1 à 6'}],
    sol:`${PART.map((p,n)=>(n+1)+' '+p).join(' → ')}`}}},

{id:'fonction_avantage',chap:'Pitch',pts:2,gen(R,F){
  const k=pickK(R,T_FA),[s,a]=T_FA[k];
  return{v:{k},text:`<p>Dans un pitch : ${s} Est-ce une fonctionnalité ou un avantage ?</p>`,
    fields:[ch(R,FA[a],FA,'type')],
    sol:`fonctionnalité : ce qu'est le produit ; avantage : ce qu'il change pour le client
→ ${FA[a]}${a===0?' (le cours conseille de mettre l\'accent sur les avantages)':''}`}}},

{id:'publicite',chap:'Publicité',pts:2,gen(R,F){
  const k=pickK(R,T_PUB),[s,a]=T_PUB[k];
  return{v:{k},text:`<p>${s} Quel type de publicité ?</p>`,
    fields:[ch(R,PUB[a],PUB,'type')],
    sol:`informative : des faits, la raison
persuasive : suggestion (émotion), mécanisation (répétition), intégration (appartenance)
→ ${PUB[a]}`}}}

];
})();
