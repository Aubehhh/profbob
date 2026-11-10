/* Solveurs indépendants du mini-DS Électricité (outils/verif-minids.js).
   Les calculs en sinusoïdal passent par une petite arithmétique complexe (forme algébrique) au lieu des formules
   en module/argument de la banque ; les circuits continus sont résolus par conductances et lois de Kirchhoff. */
'use strict';
const C=(re,im=0)=>({re,im});
const add=(a,b)=>C(a.re+b.re,a.im+b.im),sub=(a,b)=>C(a.re-b.re,a.im-b.im);
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const div=(a,b)=>{const d=b.re*b.re+b.im*b.im;return C((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)};
const mod=a=>Math.sqrt(a.re*a.re+a.im*a.im),arg=a=>Math.atan2(a.im,a.re)*180/Math.PI;
const pol=(m,deg)=>C(m*Math.cos(deg*Math.PI/180),m*Math.sin(deg*Math.PI/180));
const W=f=>2*Math.PI*f;
// nœud unique : tension u d'un nœud relié à la masse par des branches (E, R) — théorème de Millman écrit en conductances
const noeud=br=>{let n=0,d=0;for(const [E,R] of br){n+=E/R;d+=1/R}return n/d};

/* chapitre 5 : par les complexes (v = Im(√2 V e^{jωt})) au lieu des sinus de la banque */
const VPH={v_1:0,v_2:-120,v_3:120};
const tsimple=(V,th)=>[0,1,2].map(k=>{const z=mul(pol(V*Math.SQRT2,-120*k),pol(1,th));return z.im});
const FILREP=['fil de phase','fil de protection (PE)','fil de neutre','fil de phase','fil de neutre','fil de protection (PE)','fil de phase','fil de neutre'];
const PH=(n)=>{const [t,i,j]=[n[0],n[2],n[3]];const z=t==='v'?pol(1,-120*(+i-1)):sub(pol(1,-120*(+i-1)),pol(1,-120*(+j-1)));return arg(z)};
module.exports={
  charge:({Q,t})=>[Q/t],
  energie:({P,m})=>{const J=P*m*60;return [J/1e3,J/3600/1000]},
  pmoy:({P1,t1,P2,t2})=>{const J=P1*t1*60+P2*t2*60;return [J/1e3,J/(60*(t1+t2))]},
  resfil:({rho,L,S})=>[rho*L/S*1e6],
  temperature:({a,R1,t1,t2})=>{const k=R1/(1+a*t1);return [k,k+k*a*t2]},
  tempfinale:({a,R1,t1,R2})=>[((R2*(1+a*t1)/R1)-1)/a],
  association:({R1,R2,R3,U})=>{const g=1/R2+1/R3,Rs=R1+1/g;return [1/g,Rs,U/Rs]},
  divtension:({Ve,R1,R2,Rc})=>{const i0=Ve/(R1+R2);const u=noeud([[Ve,R1],[0,R2],[0,Rc]]);return [i0*R2,u]},
  divcourant:({I,R1,R2})=>{const u=I/(1/R1+1/R2);return [u/R1,u/R2]},
  maille:({E1,E2,E3,S})=>[(E1-(E2+E3))/S],
  theveninessai:({E,u,i})=>{const r=(E-u)/i;return [r,i*E/(E-u)]},
  theveninch:({E,r,Rc})=>{const u=E*Rc/(r+Rc);return [u/Rc,u]},
  norton:({Icc,RN,Rc})=>{const u=Icc/1000/(1/RN+1/Rc);return [u/Rc*1000,u,Icc*RN/1000]},
  deuxgen:({E1,E2,R1,R2,Rc})=>{const ET=noeud([[E1,R1],[E2,R2]]),RT=1/(1/R1+1/R2);const u=noeud([[E1,R1],[E2,R2],[0,Rc]]);return [ET,RT,u/Rc]},
  superposition:({E2,E3,R1,R2,R3})=>{
    // tension du nœud A (B à la masse) pour chaque source seule, puis courant dans R1
    const a=noeud([[E2,R2],[0,R3],[0,R1]])/R1,b=noeud([[0,R2],[E3,R3],[0,R1]])/R1,t=noeud([[E2,R2],[E3,R3],[0,R1]])/R1;
    return [a,b,t]},
  efficace:({Vm,f})=>[Math.sqrt(Vm*Vm/2),W(f),1000/f],
  complexe:({V1,V2,t2,op})=>{const z=op==='+'?add(C(V1),pol(V2,t2)):sub(C(V1),pol(V2,t2));return [z.re,z.im,mod(z),arg(z)]},
  bobine:({L,U,f})=>{const Z=C(0,L*W(f)),I=div(C(U),Z);return [mod(Z),mod(I),arg(I),mul(C(U),C(I.re,-I.im)).im]},
  condensateur:({C:Cu,U,f})=>{const Z=div(C(1),C(0,Cu*1e-6*W(f))),I=div(C(U),Z);return [mod(Z),mod(I),arg(I),mul(C(U),C(I.re,-I.im)).im]},
  rlserie:({R,L,U,f})=>{const Z=C(R,L*W(f)),I=div(C(U),Z);return [mod(Z),arg(Z),mod(I),mod(mul(C(R),I)),mod(mul(C(0,L*W(f)),I))]},
  rlc:({R,L,C:Cu})=>{const w=W(50),Z=add(add(C(R),C(0,L*w)),div(C(1),C(0,Cu*1e-6*w))),I=div(C(230),Z);return [mod(Z),arg(Z),mod(I)]},
  puissances:({U,I,c})=>{const Iz=pol(I,-Math.acos(c)*180/Math.PI),S=mul(C(U),C(Iz.re,-Iz.im));return [mod(S),S.re,S.im]},
  boucherot:({U,P1,c1,P2,Q2})=>{const S1=pol(P1/c1,Math.acos(c1)*180/Math.PI),S=add(S1,C(P2,Q2));return [S.re,S.im,mod(S),mod(S)/U]},
  releve:({P,c,c2})=>{const U=230,w=W(50),Q1=P*Math.sqrt(1-c*c)/c,Q2=P*Math.sqrt(1-c2*c2)/c2;return [P/c/U,(Q1-Q2)/(U*U*w)*1e6,P/c2/U]},
  stockage:({typ,x,y})=>[typ==='L'?x*y*y/2:x*1e-6*y*y/2],
  fils:({k})=>[FILREP[k]],
  vsimple:({V,th})=>tsimple(V,th),
  vcomplexe:({V,k})=>{const z=pol(V,120*(k===2?2:1));return [z.re,z.im]},
  ucompose:({V,th})=>{const v=tsimple(V,th);return [v[0]-v[2],v[1]-v[0],v[2]-v[1]]},
  ueff:({V})=>{const u=mod(sub(pol(V,0),pol(V,120)));return [u,u*Math.SQRT2]},
  dephasage:({a,b})=>{let d=PH(a)-PH(b);while(d>180)d-=360;while(d<=-180)d+=360;return [d]}
};
