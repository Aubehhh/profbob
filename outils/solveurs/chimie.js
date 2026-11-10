/* Solveurs indépendants du mini-DS Chimie (outils/verif-minids.js).
   La configuration électronique est recalculée en triant les sous-couches par (n + l, n) — règle de Klechkowski —
   au lieu de l'ordre écrit à la main dans la banque ; le reste est recalculé avec d'autres écritures des formules. */
'use strict';
const h=6.626e-34,c=3.00e8,eV=1.60e-19;
const SUB=[];for(let n=1;n<=7;n++)for(let l=0;l<n&&l<4;l++)SUB.push({n,l});
SUB.sort((a,b)=>(a.n+a.l)-(b.n+b.l)||a.n-b.n);
function remplir(Z){const o=[];let r=Z;for(const s of SUB){if(!r)break;const k=Math.min(r,2*(2*s.l+1));o.push({...s,k});r-=k}return o}
function infos(Z){const o=remplir(Z),nmax=Math.max(...o.map(s=>s.n));
  const val=o.filter(s=>s.n===nmax||s.k<2*(2*s.l+1)).reduce((a,s)=>a+s.k,0);
  const cel=o.reduce((a,s)=>{const orb=2*s.l+1;return a+Math.min(s.k,2*orb-s.k)},0);
  const ext=o.filter(s=>s.n===nmax);const p=ext.find(s=>s.l===1),d=o.find(s=>s.n===nmax-1&&s.l===2&&o.indexOf(s)===o.length-1);
  let col;if(p)col=12+p.k;else if(d)col=2+d.k;else{const d2=o.find(s=>s.n===nmax-1&&s.l===2);col=(d2&&o[o.length-1]===d2)?2+d2.k:ext.find(s=>s.l===0).k}
  return{nmax,val,cel,col}}

/* --- chapitres 3 et 4 : écrits à part, à partir du cours --- */
function familleDe(f){ // reconnaissance par motifs, du plus spécifique au plus général
  if(f.includes('CO–O–CO'))return 'anhydride';
  if(f.includes('COOH'))return 'acide carboxylique';
  if(f.includes('COO'))return 'ester';
  if(f.includes('CO–NH₂'))return 'amide';
  if(f.includes('CO–Cl'))return 'chlorure d\'acyle';
  if(f.includes('CHO'))return 'aldéhyde';
  if(/–CO–/.test(f))return 'cétone';
  if(f.includes('C≡N'))return 'nitrile';
  if(f.includes('NO₂'))return 'nitroalcane';
  if(f.includes('NH₂'))return 'amine';
  if(f.includes('OH'))return 'alcool';
  if(/Cl|Br|I/.test(f))return 'halogénoalcane';
  if(f.includes('–O–'))return 'étheroxyde';
  if(f.includes('≡'))return 'alcyne';
  if(f.includes('='))return 'alcène';
  return '?'}
const VAL={1:['alcool','amine','halogénoalcane','alcène','étheroxyde','nitroalcane'],2:['aldéhyde','cétone','alcyne'],3:['acide carboxylique','ester','amide','anhydride','chlorure d\'acyle','nitrile']};
const VALNOM={1:'monovalente',2:'divalente',3:'trivalente'};
const valence=fam=>VALNOM[Object.keys(VAL).find(k=>VAL[k].includes(fam))];
const SUBD='₀₁₂₃₄₅₆₇₈₉';
function compter(f){ // compte C, H, O d'une formule semi-développée (groupes entre parenthèses avec indice)
  const tok=f.replace(/[–=≡]/g,'');let i=0;
  function bloc(){const c={C:0,H:0,O:0,N:0,Cl:0,Br:0};
    while(i<tok.length&&tok[i]!==')'){
      let part;if(tok[i]==='('){i++;part=bloc();i++}else{const m=/^(Cl|Br|[A-Z])/.exec(tok.slice(i));part={C:0,H:0,O:0,N:0,Cl:0,Br:0};part[m[1]]=1;i+=m[1].length}
      let n='';while(i<tok.length&&SUBD.includes(tok[i])){n+=SUBD.indexOf(tok[i]);i++}
      const k=n?+n:1;for(const e in part)c[e]+=k*part[e]}
    return c}
  return bloc()}
const Zat={H:1,C:6,N:7,O:8,F:9,Cl:17,Br:35,I:53};
// groupement → [atome lié au C*, atomes qui lui sont liés (doubles liaisons dupliquées)]
const SPH={'–H':['H',[]],'–CH₃':['C',['H','H','H']],'–CH₂–CH₃':['C',['C','H','H']],'–CH(CH₃)₂':['C',['C','C','H']],'–C(CH₃)₃':['C',['C','C','C']],
  '–CH₂–OH':['C',['O','H','H']],'–CHO':['C',['O','O','H']],'–COOH':['C',['O','O','O']],'–NH₂':['N',['H','H']],'–OH':['O',['H']],'–F':['F',[]],'–Cl':['Cl',[]],'–Br':['Br',[]],'–I':['I',[]]};
function cmpCIP(a,b){const A=SPH[a],B=SPH[b];if(Zat[A[0]]!==Zat[B[0]])return Zat[A[0]]-Zat[B[0]];
  const x=A[1].map(e=>Zat[e]).sort((p,q)=>q-p),y=B[1].map(e=>Zat[e]).sort((p,q)=>q-p);
  for(let i=0;i<Math.max(x.length,y.length);i++){const d=(x[i]||0)-(y[i]||0);if(d)return d}return 0}
const ROLE=['nucléophile','électrophile','catalyseur','base','acide','intermédiaire réactionnel','nucléophile','électrophile','acide','base','catalyseur','intermédiaire réactionnel'];
const STE=[[1,false],[1,false],[2,false],[2,true],[2,true],[2,false],[2,false],[4,false],[2,true],[0,false],[3,false]];
const ISO=['chaîne','chaîne','chaîne','position','position','position','fonction','fonction','fonction','fonction','conf','conf','conf','enan','enan','enan','dia','dia','dia'];
const ISONOM={chaîne:'isomérie de chaîne',position:'isomérie de position',fonction:'isomérie de fonction',conf:'conformation',enan:'énantiomérie',dia:'diastéréoisomérie'};
const CONF=['décalée','éclipsée','anti','chaise','demi-chaise','substituant en équatorial','substituant en axial'];
const SEL=['régiosélective','régiosélective','régiospécifique','stéréosélective','énantiosélective','diastéréosélective','stéréospécifique','énantiospécifique','diastéréospécifique'];
module.exports={
  composition:({Z,A,q})=>[Z,A-Z,Z-q],
  massemoy:({L})=>{let s=0,t=0;for(const [m,n] of L){s+=n;t+=n*m}return [t/s]},
  abondance:({m1,m2,M})=>[100*(M-m2)/(m1-m2)],
  photon:({lam})=>{const E=h*c/(lam*1e-9);return [E*1e19,E/eV]},
  raie:({nb,nh})=>{const E=n=>-13.6/(n*n);const d=E(nh)-E(nb);return [d,h*c/(d*eV)/1e-9]},
  quantique:({n,l})=>{let orb=0;for(let m=-l;m<=l;m++)orb++;let tot=0;for(let k=0;k<n;k++)tot+=2*(2*k+1);return [orb,2*orb,tot]},
  quadruplet:({n,l,m,s})=>[(l>=0&&l<n&&m>=-l&&m<=l&&(s==='+1/2'||s==='−1/2'))?1:0],
  config:({Z})=>{const i=infos(Z);return [i.val,i.cel]},
  position:({Z})=>{const i=infos(Z);return [i.nmax,i.col]},
  ion:({Z})=>{const col=infos(Z).col;return [col===1?1:col===2?2:col===13?3:col===15?-3:col===16?-2:-1]},
  mulliken:({E1,AE,k})=>[k*E1/2+k*AE/2],
  pauling:({Dab,Daa,Dbb})=>[0.102*Math.pow(Dab-Math.pow(Daa*Dbb,0.5),0.5)],
  electrons:({at,z})=>{let s=-z;for(const [,v,k] of at)for(let i=0;i<k;i++)s+=v;return [s,s/2]},
  chargef:({NV,nl,li})=>[NV-(nl*2+li)],
  dipole:({dpm,del})=>{const q=del*1.602e-19,d=dpm*1e-12,p=q*d;return [p/(1.602e-28/48)/1,48*del*dpm/1000*3.33]},
  ionique:({d,pr})=>{const pion=1.602e-19*d*1e-12/(1.602e-28/48);return [pion,100*pr/pion]},
  vsepr:({n,m,a})=>[n,m,{2:180,3:120,4:109.5,6:90}[n+m]],
  polarite:({p,a})=>[p/2/Math.cos(a*Math.PI/360)],
  famille:({f})=>{const fam=familleDe(f);return [fam,valence(fam)]},
  rendement:({na,nb,ne})=>{const x=na<nb?na:nb;return [x,100*ne/x,na-ne]},
  classe:({f,n0})=>{const c=/CH₂–OH/.test(f)?'primaire':/CH\(OH\)/.test(f)?'secondaire':'tertiaire';return [c,{primaire:67,secondaire:60,tertiaire:5}[c]/100*n0]},
  mecanisme:({k})=>[ROLE[k]],
  chargeo:({nl,li})=>{const NA=nl*2+li;return [nl,li,6-NA]},
  brute:({f})=>{const c=compter(f);return [c.C,c.H,c.O]},
  cip:({g})=>{const t=g.slice().sort(cmpCIP);return [t[3],t[0]]},
  rs:({pos,devant})=>{ // angles sur l'horloge, produit vectoriel de (2−1) et (3−1) : négatif = sens horaire (y vers le haut)
    const P=h=>[Math.sin(h*Math.PI/6),Math.cos(h*Math.PI/6)];const [a,b,c]=pos.map(P);
    const z=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);let r=z<0?'R':'S';if(devant)r=r==='R'?'S':'R';return [r]},
  stereo:({k})=>{const [n,m]=STE[k];return [n,(1<<n)-(m?1:0)]},
  purete:({a,a0})=>{const p=a/a0;return [p,p*100,(p+1)/2*100]},
  ze:({haut1,bas1,haut2,bas2})=>{const u1=cmpCIP(haut1,bas1)>0,u2=cmpCIP(haut2,bas2)>0;return [u1===u2?'Z':'E']},
  relation:({ident,a,b})=>{const n=[0,1].filter(i=>a[i]!==b[i]).length;
    if(n===0)return ['identiques'];if(ident&&a[0]!==a[1]&&b[0]!==b[1])return ['identiques'];return [n===2?'énantiomères':'diastéréoisomères']},
  isomerie:({k})=>[ISONOM[ISO[k]]],
  conformation:({k})=>[CONF[k]],
  selectivite:({k})=>[SEL[k]]
};
