/* Banque du mini-DS Chimie (chapitre 1 : atome et classification ; chapitre 2 : molécules), alignée sur /cours/chimie/….
   Profil de notation « thermo » (indices seulement). Format d'un générateur : voir ds/statique/mini-ds/banque.js.
   Vérification : node outils/verif-minids.js 3000 chimie */
(function(){
const h=6.626e-34,c=3.00e8,eV=1.60e-19;
const SYM={1:'H',2:'He',3:'Li',4:'Be',5:'B',6:'C',7:'N',8:'O',9:'F',10:'Ne',11:'Na',12:'Mg',13:'Al',14:'Si',15:'P',16:'S',17:'Cl',18:'Ar',19:'K',20:'Ca',21:'Sc',22:'Ti',23:'V',25:'Mn',26:'Fe',27:'Co',28:'Ni',30:'Zn',31:'Ga',32:'Ge',33:'As',34:'Se',35:'Br',36:'Kr',37:'Rb',38:'Sr',49:'In',50:'Sn',51:'Sb',52:'Te',53:'I',54:'Xe',55:'Cs',56:'Ba'};
const NOM={1:'hydrogène',3:'lithium',4:'béryllium',5:'bore',6:'carbone',7:'azote',8:'oxygène',9:'fluor',11:'sodium',12:'magnésium',13:'aluminium',14:'silicium',15:'phosphore',16:'soufre',17:'chlore',19:'potassium',20:'calcium',21:'scandium',22:'titane',23:'vanadium',25:'manganèse',26:'fer',27:'cobalt',28:'nickel',30:'zinc',31:'gallium',32:'germanium',33:'arsenic',34:'sélénium',35:'brome',37:'rubidium',38:'strontium',49:'indium',50:'étain',51:'antimoine',52:'tellure',53:'iode',55:'césium',56:'baryum'};
// ordre de Klechkowski écrit à la main (le solveur, lui, le recalcule par n + l)
const ORDRE=['1s','2s','2p','3s','3p','4s','3d','4p','5s','4d','5p','6s','4f','5d','6p','7s'];
const CAP={s:2,p:6,d:10,f:14};
function config(Z){const out=[];let r=Z;for(const sc of ORDRE){if(r<=0)break;const k=Math.min(r,CAP[sc[1]]);out.push([sc,k]);r-=k}return out}
const sup=k=>String(k).split('').map(d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
const ecrire=cf=>cf.map(([s,k])=>s+sup(k)).join(' ');
function analyse(Z){const cf=config(Z);const nmax=Math.max(...cf.map(([s])=>+s[0]));
  const val=cf.filter(([s,k])=>+s[0]===nmax||(k<CAP[s[1]]));const nval=val.reduce((a,[,k])=>a+k,0);
  const celib=cf.reduce((a,[s,k])=>{const o=CAP[s[1]]/2;return a+(k<=o?k:2*o-k)},0);
  const last=cf[cf.length-1][0];const bloc=last[1];const ns=cf.find(([s])=>s===nmax+'s')[1];
  const col=bloc==='s'?ns:bloc==='p'?12+cf.find(([s])=>s===nmax+'p')[1]:2+cf.find(([s])=>s===(nmax-1)+'d')[1];
  return{cf,nmax,nval,celib,col,bloc}}
const ZCONF=[5,6,7,8,9,11,12,13,14,15,16,17,19,20,21,22,23,25,26,27,28,31,32,33,34,35,37,38,49,50,51,52,53,55,56];
const H={ent:'un nombre entier',pos:'un nombre positif'};

/* --- tables des chapitres 3 et 4 (chimie organique, isomérie) --- */
const FAMILLES=['alcool','aldéhyde','cétone','acide carboxylique','ester','amide','amine','halogénoalcane','étheroxyde','nitrile','chlorure d\'acyle','nitroalcane','alcène','alcyne','anhydride'];
const VALENCES=['monovalente','divalente','trivalente','tétravalente'];
const VAL_N={monovalente:1,divalente:2,trivalente:3,'tétravalente':4};
const VAL_FAM={alcool:'monovalente',amine:'monovalente',halogénoalcane:'monovalente',alcène:'monovalente',étheroxyde:'monovalente',nitroalcane:'monovalente',aldéhyde:'divalente',cétone:'divalente',alcyne:'divalente','acide carboxylique':'trivalente',ester:'trivalente',amide:'trivalente',anhydride:'trivalente','chlorure d\'acyle':'trivalente',nitrile:'trivalente'};
const GROUPE={alcool:'–OH sur un carbone sans C=O',aldéhyde:'–CHO (C=O en bout de chaîne, lié à un H)',cétone:'C=O entre deux carbones',
  'acide carboxylique':'–COOH (C=O lié à un OH)',ester:'–COO–C (C=O lié à un O lui-même lié à un C)',amide:'–CO–N (C=O lié à un N)',amine:'–NH₂ sur un carbone',
  halogénoalcane:'C–X (X = Cl, Br, I)',étheroxyde:'C–O–C',nitrile:'–C≡N','chlorure d\'acyle':'–COCl',nitroalcane:'C–NO₂',alcène:'C=C',alcyne:'C≡C',anhydride:'–CO–O–CO–'};
const T_FAM=[['CH₃–CH₂–CH₂–OH','alcool'],['CH₃–CH(OH)–CH₃','alcool'],['CH₃–CH₂–CHO','aldéhyde'],['CH₃–CH₂–CH₂–CHO','aldéhyde'],['CH₃–CO–CH₂–CH₃','cétone'],['CH₃–CH₂–CH₂–CO–CH₃','cétone'],
  ['CH₃–CH₂–COOH','acide carboxylique'],['CH₃–COOH','acide carboxylique'],['CH₃–COO–CH₂–CH₃','ester'],['H–COO–CH₃','ester'],['CH₃–CO–NH₂','amide'],['CH₃–CH₂–NH₂','amine'],
  ['CH₃–CH₂–Br','halogénoalcane'],['CH₃–CHCl–CH₃','halogénoalcane'],['CH₃–O–CH₂–CH₃','étheroxyde'],['CH₃–C≡N','nitrile'],['CH₃–CO–Cl','chlorure d\'acyle'],['CH₃–CH₂–NO₂','nitroalcane'],
  ['CH₂=CH–CH₃','alcène'],['CH₃–C≡C–CH₃','alcyne'],['CH₃–CO–O–CO–CH₃','anhydride']];
const T_ALC=[['éthanol','CH₃–CH₂–OH','primaire'],['propan-1-ol','CH₃–CH₂–CH₂–OH','primaire'],['butan-1-ol','CH₃–(CH₂)₂–CH₂–OH','primaire'],['2-méthylpropan-1-ol','(CH₃)₂CH–CH₂–OH','primaire'],
  ['propan-2-ol','CH₃–CH(OH)–CH₃','secondaire'],['butan-2-ol','CH₃–CH(OH)–CH₂–CH₃','secondaire'],['pentan-3-ol','CH₃–CH₂–CH(OH)–CH₂–CH₃','secondaire'],
  ['2-méthylpropan-2-ol','(CH₃)₃C–OH','tertiaire'],['2-méthylbutan-2-ol','CH₃–CH₂–C(CH₃)₂–OH','tertiaire']];
const RDT={primaire:0.67,secondaire:0.60,tertiaire:0.05};
const ROLES=['nucléophile','électrophile','acide','base','catalyseur','intermédiaire réactionnel'];
const T_MECA=[['Lors de l\'addition, l\'oxygène de l\'alcool R′–OH donne un doublet non liant au carbone fonctionnel.','nucléophile'],
  ['Après protonation, le carbone fonctionnel de l\'acide reçoit le doublet de l\'alcool.','électrophile'],
  ['H⁺ est consommé à la première étape de l\'estérification et régénéré à la dernière.','catalyseur'],
  ['Pendant la protonation, l\'oxygène du C=O de l\'acide carboxylique capte le proton H⁺.','base'],
  ['Pendant la protonation, H₃O⁺ cède un proton à l\'acide carboxylique.','acide'],
  ['L\'espèce R–C(OH)₂–O⁺(H)–R′ est formée à l\'addition puis consommée à l\'étape suivante.','intermédiaire réactionnel'],
  ['Dans l\'hydratation de l\'éthanal, l\'oxygène de HO⁻ donne un doublet au carbone du C=O.','nucléophile'],
  ['Dans l\'hydratation de l\'éthanal, le carbone du C=O reçoit le doublet de HO⁻.','électrophile'],
  ['Dans l\'hydratation de l\'éthanal, l\'eau cède un proton à CH₃–CH(OH)–O⁻.','acide'],
  ['Dans l\'hydratation de l\'éthanal, CH₃–CH(OH)–O⁻ capte un proton de l\'eau.','base'],
  ['Dans l\'hydratation de l\'éthanal, HO⁻ est consommé à l\'étape 1 et reformé à l\'étape 2.','catalyseur'],
  ['Dans l\'hydratation de l\'éthanal, CH₃–CH(OH)–O⁻ est formé à l\'étape 1 puis consommé à l\'étape 2.','intermédiaire réactionnel']];
const EXPL_ROLE={nucléophile:'Il donne un doublet pour créer une liaison : nucléophile.',électrophile:'Il reçoit un doublet (il est pauvre en électrons) : électrophile.',acide:'Il cède un proton H⁺ : acide (de Brønsted).',base:'Il capte un proton H⁺ : base.',catalyseur:'Il intervient dans le mécanisme et est régénéré : il n\'apparaît pas dans le bilan, c\'est un catalyseur.','intermédiaire réactionnel':'Il est formé puis consommé : intermédiaire réactionnel (absent du bilan).'};
const T_O=[['Dans l\'acide protoné R–C(=OH⁺)–OH, l\'oxygène qui a capté H⁺ est lié au carbone par une double liaison et à un H.',1,3],
  ['Dans l\'intermédiaire R–C(OH)₂–O⁺(H)–R′, l\'oxygène venu de l\'alcool est lié au carbone fonctionnel, à un H et à R′.',1,3],
  ['Dans un ester neutre R–CO–O–R′, l\'oxygène du C=O est lié au carbone par une double liaison.',2,2],
  ['Dans un alcool R–OH, l\'oxygène est lié à un carbone et à un H.',2,2],
  ['Dans l\'intermédiaire CH₃–CH(OH)–O⁻, l\'oxygène qui portait le C=O n\'est plus lié qu\'au carbone, par une liaison simple.',3,1],
  ['Dans l\'ion hydroxyde HO⁻, l\'oxygène est lié seulement à un H.',3,1],
  ['Dans l\'ion oxonium H₃O⁺, l\'oxygène est lié à trois H.',1,3],
  ['Le groupe partant –OH₂⁺ : l\'oxygène est lié au carbone et à deux H.',1,3],
  ['Dans une molécule d\'eau H₂O, l\'oxygène est lié à deux H.',2,2]];
// groupements classés par priorité CIP croissante (écrit à la main ; le solveur, lui, recalcule par numéros atomiques)
const GR=['–H','–CH₃','–CH₂–CH₃','–CH(CH₃)₂','–C(CH₃)₃','–CH₂–OH','–CHO','–COOH','–NH₂','–OH','–F','–Cl','–Br','–I'];
const GR2=['–H','–CH₃','–CH₂–CH₃','–CH₂–OH','–CHO','–OH','–F','–Cl','–Br'];
const T_STE=[['Le butan-2-ol CH₃–CH(OH)–CH₂–CH₃',1,0],['Le 2-bromobutane CH₃–CHBr–CH₂–CH₃',1,0],['Le pentane-2,3-diol CH₃–CH(OH)–CH(OH)–CH₂–CH₃',2,0],
  ['Le 2,3-dibromobutane CH₃–CHBr–CHBr–CH₃',2,1],['L\'acide tartrique HOOC–CH(OH)–CH(OH)–COOH',2,1],['Le 2,3,4-trihydroxybutanal HOCH₂–CH(OH)–CH(OH)–CHO',2,0],
  ['Le 3-bromo-2-chloropentane CH₃–CHCl–CHBr–CH₂–CH₃',2,0],['Le glucose (forme linéaire) HOCH₂–CH(OH)–CH(OH)–CH(OH)–CH(OH)–CHO',4,0],
  ['Le butane-2,3-diol CH₃–CH(OH)–CH(OH)–CH₃',2,1],['Le propan-2-ol CH₃–CH(OH)–CH₃',0,0],['Le 2,3,4-trihydroxypentanal CH₃–CH(OH)–CH(OH)–CH(OH)–CHO',3,0]];
const T_DEUX=[['Le pentane-2,3-diol',0],['Le 3-bromo-2-chloropentane',0],['L\'acide tartrique',1],['Le 2,3-dibromobutane',1],['Le butane-2,3-diol',1],['Le 2,3,4-trihydroxybutanal',0]];
const TYPES_ISO=['isomérie de chaîne','isomérie de position','isomérie de fonction','conformation','énantiomérie','diastéréoisomérie'];
const T_ISO=[['le butane','le méthylpropane','isomérie de chaîne'],['le pentane','le 2,2-diméthylpropane','isomérie de chaîne'],['le butan-1-ol','le 2-méthylpropan-1-ol','isomérie de chaîne'],
  ['le propan-1-ol','le propan-2-ol','isomérie de position'],['le but-1-ène','le but-2-ène','isomérie de position'],['la pentan-2-one','la pentan-3-one','isomérie de position'],
  ['l\'éthanol','le méthoxyméthane','isomérie de fonction'],['le glucose','le fructose','isomérie de fonction'],['le propanal','la propanone','isomérie de fonction'],['l\'acide propanoïque','l\'éthanoate de méthyle','isomérie de fonction'],
  ['l\'éthane en conformation décalée','l\'éthane en conformation éclipsée','conformation'],['le cyclohexane en chaise','sa chaise inverse','conformation'],['le butane anti','le butane décalé gauche','conformation'],
  ['le (R)-butan-2-ol','le (S)-butan-2-ol','énantiomérie'],['le (R)-limonène','le (S)-limonène','énantiomérie'],['l\'acide (2R,3R)-tartrique','l\'acide (2S,3S)-tartrique','énantiomérie'],
  ['le (Z)-but-2-ène','le (E)-but-2-ène','diastéréoisomérie'],['le (2R,3R)-pentane-2,3-diol','le (2R,3S)-pentane-2,3-diol','diastéréoisomérie'],['l\'acide (2R,3R)-tartrique','l\'acide tartrique méso','diastéréoisomérie']];
const EXPL_ISO={'isomérie de chaîne':'Même formule brute, squelettes carbonés différents.','isomérie de position':'Même formule brute, même fonction, placée sur un autre carbone.','isomérie de fonction':'Même formule brute, fonctions (donc familles) différentes.',
  conformation:'On passe de l\'une à l\'autre par simple rotation autour de liaisons simples : même molécule, deux conformations.',énantiomérie:'Images l\'une de l\'autre dans un miroir, non superposables : énantiomères.',diastéréoisomérie:'Stéréoisomères de configuration qui ne sont pas images miroir : diastéréoisomères.'};
const CONFS=['décalée','éclipsée','anti','décalée gauche','chaise','bateau','demi-chaise','substituant en équatorial','substituant en axial'];
const T_CONF=[['Conformation la plus stable de l\'éthane ?','décalée'],['Conformation la moins stable de l\'éthane ?','éclipsée'],['Conformation la plus stable du butane, celle qui explique le zig-zag des chaînes carbonées ?','anti'],
  ['Conformation la plus stable du cyclohexane ?','chaise'],['Conformation la moins stable du cyclohexane (sommet de la barrière d\'énergie, ≈ 11 kcal/mol) ?','demi-chaise'],
  ['Dans la chaise du méthylcyclohexane, où le groupe CH₃ est-il le plus stable ?','substituant en équatorial'],['Le cyclohexanol a son OH en équatorial. En passant à la chaise inverse, le OH devient…','substituant en axial']];
const EXPL_CONF=['Les H de devant sont entre ceux de derrière : interactions minimales.','Les H de devant cachent ceux de derrière : interactions maximales.','Les deux CH₃ sont opposés (180°), le plus loin possible.','La chaise est la plus stable de toutes les conformations du cycle.','La demi-chaise est au sommet du profil d\'énergie entre chaise et bateau croisé.','En équatorial, le groupe est éloigné du cycle : moins d\'interactions.','Chaise ⇌ chaise inverse : chaque position équatoriale devient axiale.'];
const SELS=['régiosélective','régiospécifique','stéréosélective','stéréospécifique','énantiosélective','diastéréosélective','énantiospécifique','diastéréospécifique'];
const SEL3=['stéréosélective','énantiosélective','diastéréosélective'],SPE3=['stéréospécifique','énantiospécifique','diastéréospécifique'];
const T_SEL=[['À partir d\'un réactif, il se forme plusieurs isomères dont l\'un est majoritaire (addition sur un alcène selon la règle de Markovnikov).','régiosélective',[]],
  ['La formation d\'un alcène à partir d\'un halogénoalcane donne surtout l\'alcène prévu par la règle de Saïtzev.','régiosélective',[]],
  ['La réaction se déroule suivant une seule direction de l\'espace (hydrogénation catalytique en syn).','régiospécifique',[]],
  ['Elle produit majoritairement un stéréoisomère parmi tous les stéréoisomères possibles.','stéréosélective',SEL3],
  ['Le stéréoisomère majoritaire est un énantiomère parmi tous les énantiomères possibles.','énantiosélective',SEL3],
  ['Le stéréoisomère majoritaire est un diastéréoisomère parmi tous les diastéréoisomères possibles.','diastéréosélective',SEL3],
  ['Partant de deux stéréoisomères différents, elle aboutit à deux produits stéréoisomères entre eux.','stéréospécifique',[...SEL3,...SPE3]],
  ['Partant de deux stéréoisomères différents, elle aboutit à deux produits énantiomères entre eux.','énantiospécifique',[...SEL3,'stéréospécifique']],
  ['Partant de deux stéréoisomères différents, elle aboutit à deux produits diastéréoisomères entre eux.','diastéréospécifique',[...SEL3,'stéréospécifique']]];
const DEF_SEL={régiosélective:'plusieurs isomères (de position) se forment, l\'un est majoritaire.',régiospécifique:'la réaction se déroule suivant une seule direction de l\'espace.',stéréosélective:'un stéréoisomère est formé majoritairement parmi tous ceux possibles.',stéréospécifique:'deux réactifs stéréoisomères donnent deux produits stéréoisomères entre eux.',énantiosélective:'stéréosélective, et le produit majoritaire est un énantiomère.',diastéréosélective:'stéréosélective, et le produit majoritaire est un diastéréoisomère.',énantiospécifique:'stéréospécifique, et les deux produits sont énantiomères.',diastéréospécifique:'stéréospécifique, et les deux produits sont diastéréoisomères.'};

window.BANQUE_CHIMIE=[

/* ---------- Chapitre 1, partie 1 : l'atome ---------- */

{id:'composition',chap:'Constitution',pts:2,gen(R,F){
  const Z=R.pick([6,7,8,9,11,12,13,16,17,19,20,26,29,30,35,53]),A=Z+R.int(Math.round(Z*0.95),Math.round(Z*1.35)+1),q=R.pick([0,0,1,2,-1,-2,3]);
  const ion=q===0?'':(Math.abs(q)>1?Math.abs(q):'')+(q>0?'+':'−');
  return{v:{Z,A,q},text:`<p>Pour l'entité <sup>${A}</sup><sub>${Z}</sub>X<sup>${ion}</sup>, donne le nombre de protons, de neutrons et d'électrons.</p>`,
    fields:[{label:'protons',unit:'',ans:Z,d:0,tol:0.01,hint:H.ent},{label:'neutrons',unit:'',ans:A-Z,d:0,tol:0.01,hint:H.ent},{label:'électrons',unit:'',ans:Z-q,d:0,tol:0.01,hint:H.ent}],
    sol:`protons = Z = ${Z}
neutrons N = A − Z = ${A} − ${Z} = ${A-Z}
électrons = Z − charge = ${Z} − ${q<0?'('+F.n(q)+')':F.n(q)} = ${Z-q}`,
    note:q?`<p class="mds-note">Piège : c'est un ion, le nombre d'électrons n'est pas Z.</p>`:''}}},

{id:'massemoy',chap:'Masse et mole',pts:2,gen(R,F){
  const E=R.pick([['chlore',[[34.969,75.8],[36.966,24.2]]],['bore',[[10.013,19.9],[11.009,80.1]]],['cuivre',[[62.930,69.2],[64.928,30.8]]],['magnésium',[[23.985,79.0],[24.986,10.0],[25.983,11.0]]],['brome',[[78.918,50.7],[80.916,49.3]]],['silicium',[[27.977,92.2],[28.976,4.7],[29.974,3.1]]]]);
  const L=E[1],S=L.reduce((a,[m,n])=>a+n,0),M=L.reduce((a,[m,n])=>a+m*n,0)/S;
  return{v:{L},text:`<p>Le ${E[0]} naturel contient ${L.map(([m,n])=>`un isotope de masse ${F.n(m)} u.m.a. à ${F.n(n)} %`).join(', ')}. Masse atomique moyenne ?</p>`,
    fields:[{label:'m',unit:'u.m.a.',ans:M,d:3,tol:0.005,hint:'3 décimales'}],
    sol:`m = Σ n_i m_i / Σ n_i = (${L.map(([m,n])=>F.n(m)+' × '+F.n(n)).join(' + ')}) / ${F.n(S)} = ${F.n(M,3)} u.m.a.`}}},

{id:'abondance',chap:'Masse et mole',pts:2,gen(R,F){
  const E=R.pick([['chlore',35,37],['bore',10,11],['cuivre',63,65],['brome',79,81],['gallium',69,71],['lithium',6,7]]);
  const x=R.int(20,90)/100,M=Math.round((x*E[1]+(1-x)*E[2])*1000)/1000,xx=(E[2]-M)/(E[2]-E[1]);
  return{v:{m1:E[1],m2:E[2],M},text:`<p>Le ${E[0]} a deux isotopes de masses molaires ${E[1]} et ${E[2]} g·mol⁻¹. Sa masse molaire vaut ${F.n(M)} g·mol⁻¹. Proportion (en %) de l'isotope ${E[1]} ?</p>`,
    fields:[{label:'x',unit:'%',ans:xx*100,d:1,tol:0.2,hint:'en %, sans le signe %'}],
    sol:`x × ${E[1]} + (1 − x) × ${E[2]} = ${F.n(M)}
x = (${E[2]} − ${F.n(M)}) / (${E[2]} − ${E[1]}) = ${F.n(xx,4)}  →  ${F.n(xx*100,1)} %`}}},

{id:'photon',chap:'Spectre de H',pts:2,gen(R,F){
  const lam=R.int(25,180)*5;const E=h*c/(lam*1e-9);
  return{v:{lam},text:`<p>Énergie d'un photon de longueur d'onde ${lam} nm, en joules puis en eV ? (h = 6,626×10⁻³⁴ J·s ; c = 3,00×10⁸ m/s ; 1 eV = 1,60×10⁻¹⁹ J)</p>`,
    fields:[{label:'E',unit:'×10⁻¹⁹ J',ans:E/1e-19,d:3,hint:'la valeur devant ×10⁻¹⁹'},{label:'E',unit:'eV',ans:E/eV,d:3,hint:'en eV'}],
    sol:`E = h c / λ = 6,626×10⁻³⁴ × 3,00×10⁸ / ${lam}×10⁻⁹ = ${F.n(E/1e-19,3)}×10⁻¹⁹ J
E = ${F.n(E/1e-19,3)}×10⁻¹⁹ / 1,60×10⁻¹⁹ = ${F.n(E/eV,3)} eV`,
    note:`<p class="mds-note">Piège : λ en mètres (1 nm = 10⁻⁹ m).</p>`}}},

{id:'raie',chap:'Spectre de H',pts:3,gen(R,F){
  const nb=R.pick([1,2,3]),nh=nb+R.int(1,4);const dE=13.6*(1/(nb*nb)-1/(nh*nh)),lam=h*c/(dE*eV)*1e9;
  const serie={1:'Lyman',2:'Balmer',3:'Paschen'}[nb];
  return{v:{nb,nh},text:`<p>Dans l'atome d'hydrogène (E<sub>n</sub> = −13,6/n² eV), l'électron passe du niveau n = ${nh} au niveau n = ${nb}. Énergie du photon émis et longueur d'onde ? (h = 6,626×10⁻³⁴ J·s ; c = 3,00×10⁸ m/s ; 1 eV = 1,60×10⁻¹⁹ J)</p>`,
    fields:[{label:'ΔE',unit:'eV',ans:dE,d:3,hint:'en eV, positif'},{label:'λ',unit:'nm',ans:lam,d:1,hint:'en nm'}],
    sol:`E_${nh} = −13,6/${nh*nh} = ${F.n(-13.6/(nh*nh),4)} eV      E_${nb} = −13,6/${nb*nb} = ${F.n(-13.6/(nb*nb),4)} eV
ΔE = E_${nh} − E_${nb} = ${F.n(dE,4)} eV = ${F.n(dE*eV,4)} J
λ = h c / ΔE = ${F.n(lam,1)} nm   (série de ${serie})`}}},

{id:'quantique',chap:'Nombres quantiques',pts:2,gen(R,F){
  const n=R.int(1,5),l=R.int(0,Math.min(n-1,3));const sc=n+'spdf'[l];
  return{v:{n,l},text:`<p>Pour la sous-couche ${sc} (n = ${n}, l = ${l}) : combien de cases quantiques (OA) contient-elle, combien d'électrons au maximum, et combien d'électrons au maximum dans toute la couche n = ${n} ?</p>`,
    fields:[{label:'OA de '+sc,unit:'',ans:2*l+1,d:0,tol:0.01,hint:H.ent},{label:'électrons max dans '+sc,unit:'',ans:2*(2*l+1),d:0,tol:0.01,hint:H.ent},{label:'électrons max couche n',unit:'',ans:2*n*n,d:0,tol:0.01,hint:H.ent}],
    sol:`m_l va de −${l} à +${l} : ${2*l+1} OA
Pauli : 2 électrons par OA  →  ${2*(2*l+1)} électrons
Couche n = ${n} : 2n² = ${2*n*n} électrons`}}},

{id:'quadruplet',chap:'Nombres quantiques',pts:1,gen(R,F){
  const ok=R.rnd()<.5;let n,l,m,s,why='';
  n=R.int(1,6);l=R.int(0,n-1);m=R.int(-l,l);s=R.pick(['+1/2','−1/2']);
  if(!ok){const k=R.int(0,3);
    if(k===0){l=n;why=`l doit être ≤ n − 1 = ${n-1}`}
    else if(k===1){l=Math.max(0,l);m=l+1;why=`m_l doit être entre −${l} et +${l}`}
    else if(k===2){s=R.pick(['0','1']);why='m_s vaut +1/2 ou −1/2'}
    else{l=-1;m=0;why='l ne peut pas être négatif'}}
  const val=(l>=0&&l<=n-1&&Math.abs(m)<=l&&(s==='+1/2'||s==='−1/2'))?1:0;
  return{v:{n,l,m,s},text:`<p>Le quadruplet (n, l, m<sub>l</sub>, m<sub>s</sub>) = (${n}, ${F.n(l)}, ${F.n(m)}, ${s}) peut-il décrire un électron ? Tape <b>1</b> pour oui, <b>0</b> pour non.</p>`,
    fields:[{label:'possible',unit:'',ans:val,d:0,tol:0.01,hint:'1 ou 0'}],
    sol:val?`Possible : 0 ≤ l ≤ n − 1, −l ≤ m_l ≤ l et m_s = ±1/2 (orbitale ${n}${'spdfgh'[l]})`:`Impossible : ${why}`}}},

{id:'config',chap:'Configuration',pts:3,gen(R,F){
  const Z=R.pick(ZCONF),a=analyse(Z);
  return{v:{Z},text:`<p>Configuration électronique du ${NOM[Z]} (Z = ${Z}) dans son état fondamental : combien d'électrons de valence et d'électrons célibataires possède-t-il ?</p>`,
    fields:[{label:'valence',unit:'',ans:a.nval,d:0,tol:0.01,hint:H.ent},{label:'célibataires',unit:'',ans:a.celib,d:0,tol:0.01,hint:H.ent}],
    sol:`Klechkowski : ${ecrire(a.cf)}
Valence = couche n = ${a.nmax} + sous-couches incomplètes : ${a.nval} électrons
Hund : ${a.celib} électron(s) célibataire(s)`}}},

/* ---------- Chapitre 1, partie 2 : classification ---------- */

{id:'position',chap:'Tableau actuel',pts:2,gen(R,F){
  const Z=R.pick(ZCONF),a=analyse(Z);
  return{v:{Z},text:`<p>Élément de numéro atomique Z = ${Z}. Dans quelle période et quelle colonne (1 à 18) se trouve-t-il ?</p>`,
    fields:[{label:'période',unit:'',ans:a.nmax,d:0,tol:0.01,hint:H.ent},{label:'colonne',unit:'',ans:a.col,d:0,tol:0.01,hint:'de 1 à 18'}],
    sol:`${ecrire(a.cf)}
Période = plus grand n = ${a.nmax} ; bloc ${a.bloc}  →  colonne ${a.col} (${SYM[Z]})`}}},

{id:'ion',chap:'Tableau actuel',pts:1,gen(R,F){
  const Z=R.pick([3,4,8,9,11,12,13,15,16,17,19,20,34,35,37,38,53,55,56]);const a=analyse(Z);
  const q=a.col<=2?a.col:a.col===13?3:a.col-18;
  return{v:{Z},text:`<p>Quel ion monoatomique le ${NOM[Z]} (Z = ${Z}) forme-t-il le plus probablement ? Donne sa charge (par exemple 2 pour X²⁺, −1 pour X⁻).</p>`,
    fields:[{label:'charge',unit:'',ans:q,d:0,tol:0.01,s:1,hint:'un entier avec son signe'}],
    sol:`${ecrire(a.cf)} : colonne ${a.col}
${q>0?`Il perd ses ${q} électron(s) externe(s) pour avoir la configuration du gaz rare précédent`:`Il gagne ${-q} électron(s) pour avoir la configuration du gaz rare suivant`}  →  ${SYM[Z]}${Math.abs(q)>1?Math.abs(q):''}${q>0?'⁺':'⁻'}`}}},

{id:'mulliken',chap:'Électronégativité',pts:2,gen(R,F){
  const E1=R.int(50,200)/10,AE=R.int(0,40)/10,k=R.pick([1,1,0.5]);const chi=k*(E1+AE)/2;
  return{v:{E1,AE,k},text:`<p>Un élément a une énergie de 1ʳᵉ ionisation de ${F.n(E1)} eV et une affinité électronique de ${F.n(AE)} eV. Électronégativité de Mulliken, avec k<sub>M</sub> = ${F.n(k)} eV⁻¹ ?</p>`,
    fields:[{label:'χ_M',unit:'',ans:chi,d:3,tol:0.01,hint:'sans unité'}],
    sol:`χ_M = k_M (E_1 + A_E)/2 = ${F.n(k)} × (${F.n(E1)} + ${F.n(AE)})/2 = ${F.n(chi,3)}`}}},

{id:'pauling',chap:'Électronégativité',pts:2,gen(R,F){
  const L=R.pick([['H','Cl',431,436,242],['H','Br',366,436,193],['H','F',568,436,158],['H','I',299,436,151],['C','O',358,346,146],['C','Cl',339,346,242]]);
  const d=0.102*Math.sqrt(L[2]-Math.sqrt(L[3]*L[4]));
  return{v:{Dab:L[2],Daa:L[3],Dbb:L[4]},text:`<p>Énergies de liaison : D<sub>${L[0]}${L[1]}</sub> = ${L[2]}, D<sub>${L[0]}${L[0]}</sub> = ${L[3]}, D<sub>${L[1]}${L[1]}</sub> = ${L[4]} kJ·mol⁻¹. Avec l'échelle de Pauling et k<sub>p</sub> = 0,102, différence d'électronégativité |χ<sub>${L[0]}</sub> − χ<sub>${L[1]}</sub>| ?</p>`,
    fields:[{label:'|Δ|',unit:'',ans:d,d:3,tol:0.01,hint:'sans unité'}],
    sol:`|Δ| = k_p √( D_AB − √(D_AA × D_BB) ) = 0,102 × √(${L[2]} − √(${L[3]} × ${L[4]}))
√(${L[3]} × ${L[4]}) = ${F.n(Math.sqrt(L[3]*L[4]),2)}   →   |Δ| = 0,102 × √${F.n(L[2]-Math.sqrt(L[3]*L[4]),2)} = ${F.n(d,3)}`}}},

/* ---------- Chapitre 2 : molécules ---------- */

{id:'electrons',chap:'Lewis',pts:2,gen(R,F){
  const S=R.pick([['CO₂',[['C',4,1],['O',6,2]],0],['H₂O',[['O',6,1],['H',1,2]],0],['NH₃',[['N',5,1],['H',1,3]],0],['NH₄⁺',[['N',5,1],['H',1,4]],1],['NO₃⁻',[['N',5,1],['O',6,3]],-1],['CO₃²⁻',[['C',4,1],['O',6,3]],-2],['SO₄²⁻',[['S',6,1],['O',6,4]],-2],['BH₄⁻',[['B',3,1],['H',1,4]],-1],['PCl₅',[['P',5,1],['Cl',7,5]],0],['O₃',[['O',6,3]],0],['IF₄⁺',[['I',7,1],['F',7,4]],1],['HCN',[['H',1,1],['C',4,1],['N',5,1]],0],['SCN⁻',[['S',6,1],['C',4,1],['N',5,1]],-1],['SO₂',[['S',6,1],['O',6,2]],0]]);
  const sum=S[1].reduce((a,[,v,k])=>a+v*k,0),Ne=sum-S[2];
  return{v:{at:S[1],z:S[2]},text:`<p>${S[0]} : nombre total d'électrons de valence N<sub>e</sub> et nombre de doublets à placer ?</p>`,
    fields:[{label:'N_e',unit:'',ans:Ne,d:0,tol:0.01,hint:H.ent},{label:'doublets',unit:'',ans:Ne/2,d:1,tol:0.01,hint:'N_e / 2'}],
    sol:`N_e = (Σ N_V) − z = ${S[1].map(([e,v,k])=>(k>1?k+' × ':'')+v+' ('+e+')').join(' + ')} − ${S[2]<0?'('+F.n(S[2])+')':F.n(S[2])} = ${Ne}
doublets = ${Ne}/2 = ${F.n(Ne/2)}`,
    note:`<p class="mds-note">Piège : un ion négatif apporte des électrons en plus (z &lt; 0), un ion positif en retire.</p>`}}},

{id:'chargef',chap:'Lewis',pts:2,gen(R,F){
  const at=R.pick([['N',5],['O',6],['C',4],['S',6],['Cl',7],['B',3],['P',5]]),nl=R.int(0,3),li=R.int(1,4);
  const NA=2*nl+li,z=at[1]-NA;
  return{v:{NV:at[1],nl,li},text:`<p>Dans un édifice, un atome de ${at[0]} (${at[1]} électrons de valence) porte ${nl} doublet(s) non liant(s) et est engagé dans ${li} liaison(s) (un doublet chacune). Sa charge formelle ?</p>`,
    fields:[{label:'z_F',unit:'',ans:z,d:0,tol:0.01,s:1,hint:'un entier avec son signe'}],
    sol:`N_A = 2 × ${nl} (non liants) + ${li} (moitié des électrons des liaisons) = ${NA}
z_F = N_V − N_A = ${at[1]} − ${NA} = ${F.n(z)}`}}},

{id:'dipole',chap:'Liaisons polarisées',pts:2,gen(R,F){
  const dpm=R.int(80,250),del=R.int(5,60)/100;const pD=48*del*dpm/1000,pCm=pD*3.33e-30;
  return{v:{dpm,del},text:`<p>Une liaison de longueur ${dpm} pm porte des charges partielles ±${F.n(del)} e. Moment dipolaire en debye, puis en C·m ? (p<sub>D</sub> = 48 · (q/e) · d, d en nm ; 1 D = 3,33×10⁻³⁰ C·m)</p>`,
    fields:[{label:'p',unit:'D',ans:pD,d:3,hint:'en debye'},{label:'p',unit:'×10⁻³⁰ C·m',ans:pCm/1e-30,d:3,hint:'la valeur devant ×10⁻³⁰'}],
    sol:`d = ${dpm} pm = ${F.n(dpm/1000,3)} nm
p_D = 48 × ${F.n(del)} × ${F.n(dpm/1000,3)} = ${F.n(pD,3)} D
p = ${F.n(pD,3)} × 3,33×10⁻³⁰ = ${F.n(pCm/1e-30,3)}×10⁻³⁰ C·m`}}},

{id:'ionique',chap:'Liaisons polarisées',pts:2,gen(R,F){
  const L=R.pick([['HF',91.7,1.82],['HCl',127.4,1.07],['HBr',141.4,0.79],['HI',160.9,0.38],['NaCl',236,9.0],['KF',217,8.6]]);
  const pion=48*L[1]/1000,I=L[2]/pion*100;
  return{v:{d:L[1],pr:L[2]},text:`<p>${L[0]} : longueur de liaison ${F.n(L[1])} pm, moment dipolaire réel ${F.n(L[2])} D. Moment dipolaire si la liaison était totalement ionique, puis caractère ionique ?</p>`,
    fields:[{label:'p_ion',unit:'D',ans:pion,d:2,hint:'en debye'},{label:'I',unit:'%',ans:I,d:1,hint:'en %, sans le signe %'}],
    sol:`Totalement ionique : q = e  →  p_ion = 48 × 1 × ${F.n(L[1]/1000,4)} = ${F.n(pion,2)} D
I = p_réel / p_ion × 100 = ${F.n(L[2])} / ${F.n(pion,2)} × 100 = ${F.n(I,1)} %`}}},

{id:'vsepr',chap:'VSEPR',pts:2,gen(R,F){
  const S=R.pick([['CO₂',2,0,180],['BeH₂',2,0,180],['BF₃',3,0,120],['SO₃',3,0,120],['CH₄',4,0,109.5],['NH₄⁺',4,0,109.5],['NH₃',3,1,109.5],['H₂O',2,2,109.5],['SO₂',2,1,120],['O₃',2,1,120],['SF₆',6,0,90],['XeF₄',4,2,90],['BrF₅',5,1,90]]);
  return{v:{n:S[1],m:S[2],a:S[3]},text:`<p>${S[0]} : donne n et m dans AX<sub>n</sub>E<sub>m</sub>, puis l'angle théorique de la figure des doublets (avant les effets du second ordre).</p>`,
    fields:[{label:'n',unit:'',ans:S[1],d:0,tol:0.01,hint:'atomes liés'},{label:'m',unit:'',ans:S[2],d:0,tol:0.01,hint:'doublets non liants'},{label:'angle',unit:'°',ans:S[3],d:1,tol:0.3,hint:'180, 120, 109,5 ou 90'}],
    sol:`${S[0]} : AX${S[1]>1?'_'+S[1]:''}${S[2]?'E'+(S[2]>1?'_'+S[2]:''):''}  →  n + m = ${S[1]+S[2]} doublets
${{2:'segment : 180°',3:'triangle : 120°',4:'tétraèdre : 109,5°',6:'octaèdre : 90°'}[S[1]+S[2]]}${S[2]?' (le doublet non liant ferme un peu les angles réels)':''}`}}},

{id:'polarite',chap:'VSEPR',pts:2,gen(R,F){
  const p=R.int(100,250)/100,a=R.pick([92,104.5,106.7,107,110,117]);const p1=p/(2*Math.cos(a/2*Math.PI/180));
  return{v:{p,a},text:`<p>Une molécule coudée AX<sub>2</sub> a un moment dipolaire de ${F.n(p)} D et un angle X–A–X de ${F.n(a)}°. Moment de chaque liaison A–X ?</p>`,
    fields:[{label:'p_1',unit:'D',ans:p1,d:3,hint:'en debye'}],
    sol:`Somme des deux moments :  p = 2 p_1 cos(α/2)
p_1 = ${F.n(p)} / (2 × cos ${F.n(a/2)}°) = ${F.n(p1,3)} D`}}},

/* ---------- Chapitre 3 : introduction à la chimie organique ---------- */

{id:'famille',chap:'Groupes fonctionnels',pts:2,gen(R,F){
  const k=R.int(0,T_FAM.length-1),[f,fam]=T_FAM[k];
  const autres=R.shuffle(FAMILLES.filter(x=>x!==fam)).slice(0,3);
  const c1=R.shuffle([fam,...autres]),c2=VALENCES.slice();
  return{v:{k,f},text:`<p>À quelle famille appartient la molécule <b>${f}</b> ? Quelle est la valence de sa fonction ?</p>`,
    fields:[{label:'famille',type:'choix',options:c1,ans:c1.indexOf(fam)},{label:'valence',type:'choix',options:c2,ans:c2.indexOf(VAL_FAM[fam])}],
    sol:`Groupe fonctionnel : ${GROUPE[fam]}
famille : ${fam}
valence : ${VAL_FAM[fam]} (${VAL_N[VAL_FAM[fam]]} H de l'alcane remplacé${VAL_N[VAL_FAM[fam]]>1?'s':''} sur un même carbone)`,
    note:`<p class="mds-note">Piège : regarde les voisins du C=O. Avec un H : aldéhyde ; entre deux C : cétone ; avec OH : acide ; avec O–C : ester ; avec N : amide.</p>`}}},

{id:'rendement',chap:'Estérification',pts:3,gen(R,F){
  const na=R.int(5,40)/100,nb=R.int(5,40)/100,xm=Math.min(na,nb),eta=R.int(30,90)/100,ne=Math.round(eta*xm*1000)/1000;
  const E=R.pick([['acide éthanoïque','éthanol','éthanoate d\'éthyle'],['acide méthanoïque','éthanol','méthanoate d\'éthyle'],['acide éthanoïque','propan-1-ol','éthanoate de propyle'],['acide propanoïque','méthanol','propanoate de méthyle'],['acide éthanoïque','butan-1-ol','éthanoate de butyle']]);
  const eff=ne/xm*100;
  return{v:{na,nb,ne},text:`<p>On mélange ${F.n(na,2)} mol d'${E[0]} et ${F.n(nb,2)} mol d'${E[1]}. À l'équilibre, on obtient ${F.n(ne,3)} mol d'${E[2]}. Avancement maximal, rendement, et quantité d'acide restant à l'équilibre ?</p>`,
    fields:[{label:'x_max',unit:'mol',ans:xm,d:3,tol:0.0005,hint:'en mol'},{label:'η',unit:'%',ans:eff,d:1,tol:0.2,hint:'en %, sans le signe %'},{label:'n(acide)',unit:'mol',ans:na-ne,d:3,tol:0.0005,hint:'à l\'équilibre, en mol'}],
    sol:`acide + alcool ⇌ ester + eau  (coefficients 1)
x_max = min(${F.n(na,2)} ; ${F.n(nb,2)}) = ${F.n(xm,3)} mol
η = n(ester) / n_max(ester) = ${F.n(ne,3)} / ${F.n(xm,3)} = ${F.n(eff,1)} %
x_éq = n(ester) = ${F.n(ne,3)} mol  →  n(acide) = ${F.n(na,2)} − ${F.n(ne,3)} = ${F.n(na-ne,3)} mol`,
    note:`<p class="mds-note">Piège : le rendement se calcule par rapport à la quantité maximale (réactif limitant), pas par rapport à l'autre réactif.</p>`}}},

{id:'classe',chap:'Estérification',pts:2,gen(R,F){
  const k=R.int(0,T_ALC.length-1),[nom,f,cl]=T_ALC[k],n0=R.int(5,50)/100;
  const c=['primaire','secondaire','tertiaire'],r=RDT[cl];
  return{v:{f,n0},text:`<p>On fait réagir ${F.n(n0,2)} mol d'acide éthanoïque avec ${F.n(n0,2)} mol de ${nom} ${f}. Classe de l'alcool, et quantité d'ester attendue d'après le cours ?</p>`,
    fields:[{label:'classe',type:'choix',options:c,ans:c.indexOf(cl)},{label:'n(ester)',unit:'mol',ans:r*n0,d:4,tol:0.0005,hint:'en mol'}],
    sol:`Le carbone qui porte OH est lié à ${{primaire:'un seul',secondaire:'deux',tertiaire:'trois'}[cl]} carbone${cl==='primaire'?'':'s'} : alcool ${cl}
mélange équimolaire : rendement ${F.n(r*100)} % (cours)
n(ester) = ${F.n(r,2)} × ${F.n(n0,2)} = ${F.n(r*n0,4)} mol`}}},

{id:'mecanisme',chap:'Mécanisme',pts:2,gen(R,F){
  const k=R.int(0,T_MECA.length-1),[s,role]=T_MECA[k];
  const o=R.shuffle(ROLES.slice());
  return{v:{k},text:`<p>${s} Quel rôle joue-t-il ?</p>`,
    fields:[{label:'rôle',type:'choix',options:o,ans:o.indexOf(role)}],
    sol:`${EXPL_ROLE[role]}
réponse : ${role}`}}},

{id:'chargeo',chap:'Mécanisme',pts:2,gen(R,F){
  const k=R.int(0,T_O.length-1),[s,nl,li]=T_O[k],z=6-(2*nl+li);
  return{v:{nl,li},text:`<p>${s} Compte ses doublets non liants et ses liaisons, puis donne sa charge formelle.</p>`,
    fields:[{label:'doublets non liants',unit:'',ans:nl,d:0,tol:0.01,hint:'un entier'},{label:'liaisons',unit:'',ans:li,d:0,tol:0.01,hint:'une double liaison compte pour 2'},{label:'z_F',unit:'',ans:z,d:0,tol:0.01,hint:'un entier avec son signe'}],
    sol:`z_F = 6 − (électrons des doublets non liants + nombre de liaisons)
z_F = 6 − (2 × ${nl} + ${li}) = ${F.n(z)}`}}},

/* ---------- Chapitre 4 : description des molécules organiques ---------- */

{id:'brute',chap:'Représentations',pts:2,gen(R,F){
  const t=R.int(0,5),a=R.int(0,4),b=R.int(0,3);
  const idx=n=>String(n).split('').map(d=>'₀₁₂₃₄₅₆₇₈₉'[d]).join('');
  const ch=n=>n===0?'':n===1?'CH₂–':'(CH₂)'+'₀₁₂₃₄₅₆₇₈₉'[n]+'–';
  const L=[['un alcane',`CH₃–${ch(a+1)}CH₃`],['un alcool',`CH₃–${ch(a)}CH₂–OH`],['un aldéhyde',`CH₃–${ch(a)}CHO`],['une cétone',`CH₃–CO–${ch(a)}CH₃`],['un acide carboxylique',`CH₃–${ch(a)}COOH`],['un ester',`CH₃–${ch(a)}COO–${ch(b)}CH₃`]];
  const f=L[t][1],nC=[a+3,a+2,a+2,a+3,a+2,a+b+3][t],nH=[2*a+8,2*a+6,2*a+4,2*a+6,2*a+4,2*(a+b)+6][t],nO=[0,1,1,1,2,2][t];
  return{v:{f},text:`<p>Formule brute d'${L[t][0]} de formule semi-développée <b>${f}</b> ? Donne le nombre d'atomes de chaque élément.</p>`,
    fields:[{label:'C',unit:'',ans:nC,d:0,tol:0.01,hint:'un entier'},{label:'H',unit:'',ans:nH,d:0,tol:0.01,hint:'un entier'},{label:'O',unit:'',ans:nO,d:0,tol:0.01,hint:'un entier (0 s\'il n\'y en a pas)'}],
    sol:`On compte chaque groupe : (CH₂)ₙ apporte n carbones et 2n hydrogènes
C${idx(nC)}H${idx(nH)}${nO?'O'+(nO>1?idx(nO):''):''}  →  C : ${nC}, H : ${nH}, O : ${nO}`}}},

{id:'cip',chap:'Énantiomérie',pts:2,gen(R,F){
  const idx=R.shuffle(GR.map((_,i)=>i)).slice(0,4),g=idx.map(i=>GR[i]);
  const tri=idx.slice().sort((x,y)=>y-x).map(i=>GR[i]);
  const o=R.shuffle(g);
  return{v:{g},text:`<p>Un carbone asymétrique porte les groupements ${g.join(' ; ')}. Selon les règles CIP, quel est le groupement n° 1 (prioritaire) et le n° 4 (minoritaire) ?</p>`,
    fields:[{label:'n° 1',type:'choix',options:o,ans:o.indexOf(tri[0])},{label:'n° 4',type:'choix',options:o.slice(),ans:o.indexOf(tri[3])}],
    sol:`On compare d'abord le numéro atomique de l'atome lié au C* (H 1 < C 6 < N 7 < O 8 < F 9 < Cl 17 < Br 35 < I 53),
puis, en cas d'égalité, les atomes qui lui sont liés (règle 2 ; une double liaison compte double, règle 3)
classement : ${tri.join(' > ')}`}}},

{id:'rs',chap:'Énantiomérie',pts:2,gen(R,F){
  const pos=R.shuffle([12,4,8]),devant=R.int(0,3)===0;
  const horaire=(pos[1]-pos[0]+12)%12===4;
  const vu=horaire?'horaire':'anti-horaire',conf=(horaire!==devant)?'R':'S';
  return{v:{pos,devant},text:`<p>Les groupements d'un C* sont classés 1 > 2 > 3 > 4. Le groupement n° 4 pointe ${devant?'<b>vers toi</b> (triangle plein)':'vers l\'arrière (pointillé)'}. Vus de face, les groupements 1, 2 et 3 sont placés comme les heures d'une horloge : 1 à ${pos[0]} h, 2 à ${pos[1]} h, 3 à ${pos[2]} h. Configuration du C* ?</p>`,
    fields:[{label:'configuration',type:'choix',options:['R','S'],ans:conf==='R'?0:1}],
    sol:`1 → 2 → 3 : de ${pos[0]} h à ${pos[1]} h puis ${pos[2]} h, sens ${vu}
${devant?`le n° 4 est vers l'observateur : on inverse (${vu==='horaire'?'R devient S':'S devient R'})`:'le n° 4 est derrière : on lit directement'}
configuration ${conf}`,
    note:`<p class="mds-note">Piège : la règle « sens horaire = R » ne vaut que si le groupement n° 4 est derrière.</p>`}}},

{id:'stereo',chap:'Diastéréoisomérie',pts:2,gen(R,F){
  const k=R.int(0,T_STE.length-1),[nom,n,meso]=T_STE[k],N=Math.pow(2,n)-(meso?1:0);
  return{v:{k},text:`<p>${nom} : nombre de carbones asymétriques, puis nombre de stéréoisomères de configuration ?</p>`,
    fields:[{label:'C*',unit:'',ans:n,d:0,tol:0.01,hint:'un entier'},{label:'stéréoisomères',unit:'',ans:N,d:0,tol:0.01,hint:'un entier'}],
    sol:`${n} carbone${n>1?'s':''} asymétrique${n>1?'s':''} : au maximum 2^${n} = ${Math.pow(2,n)} stéréoisomères
${meso?'les deux C* sont identiquement substitués : RS et SR sont la même molécule (méso, achirale)  →  '+N:'aucun composé méso  →  '+N}`}}},

{id:'purete',chap:'Énantiomérie',pts:3,gen(R,F){
  const a0=R.int(5,60)*R.pick([1,-1]),x=R.int(11,19)*5/100,a=Math.round(a0*(2*x-1)*100)/100;
  const p=a/a0;
  return{v:{a,a0},text:`<p>Un mélange de deux énantiomères A<sub>1</sub> et A<sub>2</sub> a un pouvoir rotatoire α = ${F.n(a)}°. L'énantiomère A<sub>1</sub> pur, à la même concentration, a α<sub>0</sub> = ${F.n(a0)}°. Pureté optique, excès énantiomérique, et pourcentage de A<sub>1</sub> dans le mélange ?</p>`,
    fields:[{label:'p_0',unit:'',ans:p,d:3,tol:0.002,hint:'sans unité, entre 0 et 1'},{label:'ee',unit:'%',ans:100*p,d:1,tol:0.2,hint:'en %, sans le signe %'},{label:'A₁',unit:'%',ans:50*(1+p),d:1,tol:0.2,hint:'en % du mélange'}],
    sol:`p_0 = α / α_0 = ${F.n(a)} / ${F.n(a0)} = ${F.n(p,3)}
ee = 100 p = ${F.n(100*p,1)} %
C_1 − C_2 = p C_0 et C_1 + C_2 = C_0  →  C_1 = (1 + p) C_0 / 2 = ${F.n(50*(1+p),1)} % de C_0`}}},

{id:'ze',chap:'Diastéréoisomérie',pts:2,gen(R,F){
  const i=R.shuffle(GR2.map((_,j)=>j)),p1=[i[0],i[1]],q=R.shuffle(GR2.map((_,j)=>j)).slice(0,2),p2=[q[0],q[1]];
  const h1=R.int(0,1),h2=R.int(0,1);
  const haut1=GR2[p1[h1]],bas1=GR2[p1[1-h1]],haut2=GR2[p2[h2]],bas2=GR2[p2[1-h2]];
  const prio1=p1[0]>p1[1]?GR2[p1[0]]:GR2[p1[1]],prio2=p2[0]>p2[1]?GR2[p2[0]]:GR2[p2[1]];
  const Z=(prio1===haut1)===(prio2===haut2);
  return{v:{haut1,bas1,haut2,bas2},text:`<p>Une double liaison C=C porte, sur le premier carbone, ${haut1} en haut et ${bas1} en bas ; sur le second, ${haut2} en haut et ${bas2} en bas. Configuration ?</p>`,
    fields:[{label:'configuration',type:'choix',options:['Z','E'],ans:Z?0:1}],
    sol:`premier carbone : ${prio1} est prioritaire (${prio1===haut1?'en haut':'en bas'})
second carbone : ${prio2} est prioritaire (${prio2===haut2?'en haut':'en bas'})
${Z?'du même côté : Z (zusammen)':'de part et d\'autre : E (entgegen)'}`}}},

{id:'relation',chap:'Diastéréoisomérie',pts:2,gen(R,F){
  const k=R.int(0,T_DEUX.length-1),[mol,ident]=T_DEUX[k];
  const c=['RR','SS','RS','SR'],a=R.pick(c),b=R.pick(c.filter(x=>x!==a));
  const flip=s=>s.split('').map(x=>x==='R'?'S':'R').join('');
  const same=x=>ident&&(x==='RS'||x==='SR')?'méso':x;
  let rel;if(same(a)===same(b))rel='identiques';else if(flip(a)===b)rel='énantiomères';else rel='diastéréoisomères';
  const o=['énantiomères','diastéréoisomères','identiques'];
  return{v:{ident,a,b},text:`<p>${mol} : quelle relation y a-t-il entre le (2${a[0]},3${a[1]}) et le (2${b[0]},3${b[1]}) ?</p>`,
    fields:[{label:'relation',type:'choix',options:o,ans:o.indexOf(rel)}],
    sol:`${ident?'Les deux C* sont identiquement substitués : RS et SR sont la même molécule (méso)\n':''}${rel==='identiques'?'même configuration'+(a!==b?' (méso)':'')+' : identiques':rel==='énantiomères'?'tous les C* sont inversés : images dans un miroir, énantiomères':'un seul C* est inversé : diastéréoisomères'}`}}},

{id:'isomerie',chap:'Isoméries',pts:2,gen(R,F){
  const k=R.int(0,T_ISO.length-1),[a,b,t]=T_ISO[k];
  const o=R.shuffle(TYPES_ISO.slice());
  return{v:{k},text:`<p>Quelle relation d'isomérie y a-t-il entre ${a} et ${b} ?</p>`,
    fields:[{label:'isomérie',type:'choix',options:o,ans:o.indexOf(t)}],
    sol:`${EXPL_ISO[t]}
réponse : ${t}`}}},

{id:'conformation',chap:'Conformations',pts:2,gen(R,F){
  const k=R.int(0,T_CONF.length-1),[q,rep]=T_CONF[k];
  const o=R.shuffle([rep,...R.shuffle(CONFS.filter(x=>x!==rep)).slice(0,3)]);
  return{v:{k},text:`<p>${q}</p>`,
    fields:[{label:'conformation',type:'choix',options:o,ans:o.indexOf(rep)}],
    sol:`${EXPL_CONF[k]}
réponse : ${rep}`}}},

{id:'selectivite',chap:'Réactions',pts:2,gen(R,F){
  const k=R.int(0,T_SEL.length-1),[s,rep,ex]=T_SEL[k];
  const o=R.shuffle([rep,...R.shuffle(SELS.filter(x=>x!==rep&&!ex.includes(x))).slice(0,3)]);
  return{v:{k},text:`<p>${s} La réaction est…</p>`,
    fields:[{label:'réaction',type:'choix',options:o,ans:o.indexOf(rep)}],
    sol:`Définition du cours : ${DEF_SEL[rep]}
réponse : ${rep}`}}}


];
})();
