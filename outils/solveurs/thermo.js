/* Solveurs indépendants du mini-DS Thermodynamique (outils/verif-minids.js).
   Chaque réponse est recalculée autrement que dans la banque : travail par intégration numérique de p dV,
   équilibres écrits en forces, bilans écrits dans l'autre sens, etc. Entrée : les données tirées q.v. */
'use strict';
const g=9.81,sigma=5.67e-8;
// intégrale de p dV par la méthode de Simpson (1000 pas), indépendante des formules fermées
function travail(p1,V1,V2,n){const N=1000,h=(V2-V1)/N,p=V=>p1*Math.pow(V1/V,n);let s=p(V1)+p(V2);
  for(let i=1;i<N;i++)s+=(i%2?4:2)*p(V1+i*h);return s*h/3}
module.exports={
  colonne:({rho,p})=>{const L=p*1000/(rho*g);return [rho===13590?L*1000:L]},
  piston:({m,D,pa})=>{const A=Math.PI*Math.pow(D/200,2);const F=pa*1e5*A+m*g;return [F/A/1e5]},
  manometre:({pa,rel,val})=>[(rel?pa+val:pa-val)*100],
  hydraulique:({M,m,D1})=>{const A1=Math.PI*D1*D1/4,A2=A1*m/M;return [Math.sqrt(4*A2/Math.PI)]},
  bilan:({Q,W,m})=>[Q,W,Q-W,(Q-W)/m],
  energies:({m,v1,v2,dz})=>[(m*Math.pow(v2/3.6,2)/2-m*Math.pow(v1/3.6,2)/2)/1000,m*g*dz/1000],
  polytropique:({p1,V1,V2,n})=>[travail(p1*1e5,V1,V2,n)/1000],
  polyq:({m,p1,V1,V2,n,du})=>{const W=travail(p1*1e5,V1,V2,n)/1000;return [W,W+m*du]},
  conduction:({k,L,A,T1,T2})=>[Math.abs(-k*A*((T2+273.15)-(T1+273.15))/(L/100))],
  convection:({P,A,h,Tf})=>[(Tf+273.15+P/(h*A))-273.15],
  rayonnement:({A,e,Tb,Ts})=>{const a=Tb+273.15,b=Ts+273.15;return [e*sigma*A*(a*a-b*b)*(a*a+b*b)]},
  cycles:({type,Qin,Qout})=>{if(type===0){const W=Qin-Qout;return [W,(1-Qout/Qin)*100]}const W=Qout-Qin;return [W,type===1?Qin/(Qout-Qin):1+Qin/W]},
  titre:({vf,vg,uf,ug,v})=>{const x=(v-vf)/(vg-vf);return [x,(1-x)*uf+x*ug]},
  etat:({vf,vg,v})=>[v<vf?1:(v<=vg?2:3)],
  interpolation:({T1,T2,Tq,y1,y2})=>{const t=(Tq-T1)/(T2-T1);return [(1-t)*y1+t*y2]},
  gazparfait:({M,m,T,p})=>{const r=8314/M;return [r/1000,(m/(M/1000))*8.314*T/(p*1e5)]},
  chauffage:({cv,m,T1,T2})=>[m*(cv*(T2+273.15)-cv*(T1+273.15))],
  debit:({A,V,v})=>[(1/v)*(A/1e4)*V],
  tuyere:({he,hs,Ve})=>[Math.sqrt(2*((he-hs)*1000+Ve*Ve/2))],
  turbine:({qm,he,x})=>{const hs=(1-x)*191.83+x*(191.83+2392.8);return [hs,qm*he-qm*hs]},
  compresseur:({qm,he,hs,Pth})=>[-(qm*(hs-he)-Pth)],
  laminage:({he,hf,hfg})=>[(he-hf)/hfg],
  echangeur:({h1,h2,h3,h4})=>[(h1-h2)/(h4-h3)],
  rendement:({QC,eta})=>{const QF=QC-QC*eta/100;return [QC-QF,QF]},
  enonces:({c})=>[c]
};
