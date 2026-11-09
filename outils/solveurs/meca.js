/* Solveurs indépendants du mini-DS Statique (outils/verif-minids.js) : chaque réponse est recalculée par une
   autre méthode que celle de la banque (système linéaire, produit vectoriel par la règle cyclique…), à partir de q.v. */
'use strict';
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
module.exports=SOLVE;
