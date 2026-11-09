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
p_1 = ${F.n(p)} / (2 × cos ${F.n(a/2)}°) = ${F.n(p1,3)} D`}}}

];
})();
