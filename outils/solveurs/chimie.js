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
  polarite:({p,a})=>[p/2/Math.cos(a*Math.PI/360)]
};
