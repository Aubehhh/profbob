#!/usr/bin/env node
/* Vérification de la banque du mini-DS Statique (agent « tests »).
   Pour chaque question et N sujets tirés au hasard :
   1. aucune valeur NaN/undefined dans l'énoncé, les cases ou la correction ;
   2. la réponse attendue est recalculée par une méthode indépendante (solveurs ci-dessous, à partir de q.v) ;
   3. « copie parfaite » : la valeur affichée par le corrigé, et la même arrondie à 3 chiffres significatifs,
      tapées à la française (virgule), sont acceptées par le moteur de correction (assets/minids.js) → 20/20 ;
   4. chaque question est déclarée une fois dans mini-ds/matieres.js (nom lisible + chapitre).
   Usage : node outils/verif-minids.js [N=2000] */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.join(__dirname,'..');
const ctx={window:{},Math,console};ctx.window.window=ctx.window;vm.createContext(ctx);
for(const f of ['assets/minids.js','ds/statique/mini-ds/banque.js','mini-ds/matieres.js'])vm.runInContext(fs.readFileSync(path.join(ROOT,f),'utf8').replace(/\bwindow\./g,'window.'),ctx,{filename:f});
const W=ctx.window,{F,makeR,_test:{parse,correct}}=W.MiniDS,BANK=W.BANQUE_STATIQUE,M=W.MINIDS_MATIERES.find(m=>m.id==='meca');
const N=+process.argv[2]||2000;
const rad=x=>x*Math.PI/180,deg=x=>x*180/Math.PI,g=9.81;
const sub=(a,b)=>a.map((x,i)=>x-b[i]),add=(a,b)=>a.map((x,i)=>x+b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),nrm=a=>Math.sqrt(dot(a,a));
// produit vectoriel par la règle cyclique (ε de Levi-Civita), indépendante de la formule du déterminant de la banque
const crs=(a,b)=>[0,1,2].map(i=>{const j=(i+1)%3,k=(i+2)%3;return a[j]*b[k]-a[k]*b[j]});
// résolution d'un système linéaire (Gauss) pour les équilibres
function solve(A,b){const n=b.length,m=A.map((r,i)=>[...r,b[i]]);
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(m[r][c])>Math.abs(m[p][c]))p=r;[m[c],m[p]]=[m[p],m[c]];
    for(let r=0;r<n;r++)if(r!==c){const f=m[r][c]/m[c][c];for(let k=c;k<=n;k++)m[r][k]-=f*m[c][k]}}
  return m.map((r,i)=>r[n]/r[i])}
const pol=(Fm,t)=>[Fm*Math.cos(rad(t)),Fm*Math.sin(rad(t)),0];
const dirA=v=>[0,1,2].map(i=>deg(Math.acos(v[i]/nrm(v))));

const SOLVE={
  cosinus:({F1,F2,phi})=>{const S=add(pol(F1,0),pol(F2,phi));return [nrm(S),deg(Math.atan2(S[1],S[0]))]},
  pente:({Fm,a,b,c,sx,sy})=>{const u=[sx*a,sy*b];const L=Math.hypot(...u);return [Fm*u[0]/L,Fm*u[1]/L]},
  resultante:({F1,t1,F2,t2})=>{const S=add(pol(F1,t1),pol(F2,t2));return [nrm(S),(deg(Math.atan2(S[1],S[0]))+360)%360]},
  angles:({A})=>{const a=dirA(A);return [nrm(A),a[0],a[2]]},
  gamma:({a,b,down,Fm})=>{const cg=Math.sqrt(1-Math.cos(rad(a))**2-Math.cos(rad(b))**2)*(down?-1:1);const v=[Math.cos(rad(a)),Math.cos(rad(b)),cg].map(x=>x*Fm);return [dirA(v)[2],v[2]]},
  thetaphi:({A,phi,th})=>{const u=[Math.sin(rad(phi))*Math.cos(rad(th)),Math.sin(rad(phi))*Math.sin(rad(th)),Math.cos(rad(phi))];return u.map(x=>x*A)},
  cable:({A,B,Fm})=>{const r=sub(B,A);return r.map(x=>Fm*x/nrm(r))},
  longueur:({A,B})=>{const r=sub(B,A);return [nrm(r),dirA(r)[2]]},
  angle2:({a,b})=>[dot(a,b),deg(Math.acos(dot(a,b)/nrm(a)/nrm(b)))],
  projection:({Fv,d})=>{const u=d.map(x=>x/nrm(d)),p=dot(Fv,u);const perp=nrm(sub(Fv,u.map(x=>x*p)));return [p,perp]},
  equilibre:({m,a,b})=>solve([[-Math.cos(rad(a)),Math.cos(rad(b))],[Math.sin(rad(a)),Math.sin(rad(b))]],[0,m*g]),
  ressort:({m,a,k,l0})=>{const [T,Fs]=solve([[Math.cos(rad(a)),-1],[Math.sin(rad(a)),0]],[0,m*g]);return [T,Fs,l0+Fs/k]},
  chargemax:({a,b,Tmax})=>{const [tg,td]=solve([[-Math.cos(rad(a)),Math.cos(rad(b))],[Math.sin(rad(a)),Math.sin(rad(b))]],[0,1]);const W=Tmax/Math.max(tg,td);return [W,W/g]},
  equi3d:({a,b,c,W})=>{const uB=[-a,-b,c].map(x=>x/Math.hypot(a,b,c)),uC=[-a,b,c].map(x=>x/Math.hypot(a,b,c));
    const s=solve([[uB[0],uC[0],1],[uB[1],uC[1],0],[uB[2],uC[2],0]],[0,0,W]);return [s[0],s[2]]},
  momentfd:({Fm,L,t})=>{const r=[L,0,0],Fv=pol(Fm,t);const Mz=crs(r,Fv)[2];return [Math.abs(Mz)/Fm,Math.abs(Mz)]},
  vectoriel:({A,B})=>crs(A,B),
  varignon:({x,y,Fm,t})=>[-crs([x,y,0],pol(Fm,t))[2]], // cours : + = horaire = −Mz
  moment3d:({P,Fv})=>{const m=crs(P,Fv);return [...m,nrm(m)]},
  momentres:({P,F1,F2})=>add(crs(P,F1),crs(P,F2)),
  momentaxe:({P,Fv,d})=>[dot(d.map(x=>x/nrm(d)),crs(P,Fv))]
};
const sig3=x=>{if(x===0)return 0;const e=Math.floor(Math.log10(Math.abs(x)))-2;return Math.round(x/10**e)*10**e};
const frStr=x=>String(x).replace('.',',').replace('-','−');

let err=0;const fail=(m)=>{if(err<40)console.log('  ✗ '+m);err++};
const declared=M.chapitres.flatMap(c=>c.q);
for(const q of BANK){
  if(!M.noms[q.id])fail(q.id+' : pas de nom lisible dans mini-ds/matieres.js');
  const n=declared.filter(x=>x===q.id).length;if(n!==1)fail(q.id+' : déclarée '+n+' fois dans les chapitres');
  if(!SOLVE[q.id]){fail(q.id+' : pas de solveur indépendant dans verif-minids.js');continue}
  let worst=0;
  for(let s=1;s<=N;s++){
    const o=q.gen(makeR(s*7919+q.id.length),F);
    const blob=o.text+o.sol+(o.note||'')+o.fields.map(f=>f.label+f.unit+(f.hint||'')).join('');
    if(/NaN|undefined|Infinity/.test(blob)){fail(q.id+' sujet '+s+' : NaN/undefined dans le texte');break}
    const exp=SOLVE[q.id](o.v);
    o.fields.forEach((f,i)=>{
      if(!isFinite(f.ans))return fail(q.id+' sujet '+s+' : réponse non finie ('+f.label+')');
      const d=f.type==='angle'?Math.abs(((f.ans-exp[i])%360+540)%360-180):Math.abs(f.ans-exp[i]);
      const rel=d/Math.max(1,Math.abs(exp[i]));worst=Math.max(worst,rel);
      if(rel>1e-6)fail(`${q.id} sujet ${s} : ${f.label} = ${f.ans} mais le recalcul donne ${exp[i]}`);
      for(const typed of [F.n(f.ans,f.d??2),frStr(sig3(f.ans))]){
        if(!correct(f,parse(typed)))fail(`${q.id} sujet ${s} : « ${typed} » refusé pour ${f.label} (attendu ${f.ans})`);
      }
    });
  }
  console.log(`${err?'·':'✓'} ${q.id.padEnd(11)} ${String(q.chap).padEnd(18)} ${N} sujets, écart max au recalcul ${worst.toExponential(1)}`);
}
for(const id of declared)if(!BANK.find(q=>q.id===id))fail('mini-ds/matieres.js déclare '+id+' qui n\'existe pas dans la banque');
// une copie entière : chaque DS de 8 questions, toutes cases justes → 20/20
let copies=0;for(let s=1;s<=200;s++){const R=makeR(s);const idx=R.shuffle(BANK.map((_,i)=>i)).slice(0,8);
  let e=0,t=0;idx.forEach(i=>{const q=BANK[i],o=q.gen(makeR(s+i),F);const ok=o.fields.filter(f=>correct(f,parse(F.n(f.ans,f.d??2)))).length;e+=q.pts*ok/o.fields.length;t+=q.pts});
  if(Math.round(e/t*20*2)/2===20)copies++;else fail('copie '+s+' : note '+(e/t*20))}
console.log(`Copies parfaites notées 20/20 : ${copies}/200`);
console.log(err?`\n${err} problème(s).`:`\nTout est bon : ${BANK.length} questions, ${BANK.length*N} sujets vérifiés.`);
process.exit(err?1:0);
