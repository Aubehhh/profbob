/* Solveurs indépendants du mini-DS Outils mathématiques (outils/verif-minids.js).
   Calculs refaits autrement : arithmétique complexe générique, dérivées par différences finies centrées,
   intégrales par la méthode de Simpson, racines par recherche numérique. */
'use strict';
const C=(re,im=0)=>({re,im}),mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const div=(a,b)=>{const d=b.re*b.re+b.im*b.im;return C((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)};
const D=180/Math.PI,ang=z=>Math.atan2(z.im,z.re)*D,mod=z=>Math.hypot(z.re,z.im);
const der=(f,x,h=1e-3)=>(-f(x+2*h)+8*f(x+h)-8*f(x-h)+f(x-2*h))/(12*h); // différences finies à 5 points
const golden=(f,a,b)=>{const g=(Math.sqrt(5)-1)/2;let c=b-g*(b-a),d=a+g*(b-a);for(let i=0;i<200;i++){if(f(c)<f(d))b=d;else a=c;c=b-g*(b-a);d=a+g*(b-a)}return (a+b)/2};
const simpson=(f,a,b,n=2000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3};
const derN=(f,x,n)=>{ // dérivée n-ième par différences finies (pas adapté), assez précise pour n ≤ 7 sur ces fonctions
  const h=0.02;let s=0;const fact=k=>k<2?1:k*fact(k-1);for(let k=0;k<=n;k++)s+=((n-k)%2?-1:1)*fact(n)/(fact(k)*fact(n-k))*f(x+(k-n/2)*h);return s/Math.pow(h,n)};
module.exports={
  produit:({a,b,c,d})=>{const z=mul(C(a,b),C(c,d));return [z.re,z.im]},
  quotient:({a,b,c,d})=>{const z=div(C(a,b),C(c,d));return [z.re,z.im]},
  modarg:({a,b})=>[mod(C(a,b)),ang(C(a,b))],
  trigalg:({r,t})=>{const z=C(r*Math.cos(t/D),r*Math.sin(t/D));return [z.re,z.im]},
  moivre:({r,t,n})=>{let z=C(r*Math.cos(t/D),r*Math.sin(t/D)),p=C(1);for(let i=0;i<n;i++)p=mul(p,z);return [mod(p),ang(p),p.re]},
  racinecarree:({a,b})=>{ // Newton complexe sur Z² − z = 0 depuis un point du demi-plan Re > 0
    let Z=C(Math.sqrt(Math.hypot(a,b)),0.5);for(let i=0;i<60;i++){Z=C(Z.re-(div(C(Z.re*Z.re-Z.im*Z.im-a,2*Z.re*Z.im-b),C(2*Z.re,2*Z.im))).re,Z.im-(div(C(Z.re*Z.re-Z.im*Z.im-a,2*Z.re*Z.im-b),C(2*Z.re,2*Z.im))).im)}
    if(Z.re<0)Z=C(-Z.re,-Z.im);return [Z.re,Z.im]},
  racinesn:({n,r,t})=>{const m=Math.exp(Math.log(r)/n);return [m,t/n,360/n]},
  second:({p,q})=>{const d=p*p-4*q;return [d,-p/2,Math.sqrt(-d)/2]},
  horner:({b,c,d,r1})=>{const P=x=>((x+b)*x+c)*x+d,roots=[];for(let x=-10;x<=10;x++)if(P(x)===0&&x!==r1)roots.push(x);
    if(roots.length===1)roots.push(roots[0]);return [Math.min(...roots),Math.max(...roots)]},
  phaseur:({R,L,w,Vm})=>{const Z=C(R,L*w/1000);return [mod(Z),ang(Z),Vm/mod(Z)]},
  chaine:({a,b,n,x})=>[der(t=>Math.pow(a*t*t+b,n),x)],
  produitexp:({k,a,x})=>[der(t=>Math.pow(t,k)*Math.exp(a*t),x)],
  leibniz:({n,x})=>{let s=0;const fact=k=>k<2?1:k*fact(k-1);for(let k=0;k<=Math.min(2,n);k++){const dk=k===0?x*x:k===1?2*x:2;s+=fact(n)/(fact(k)*fact(n-k))*dk*Math.exp(x)}return [s]},
  lineaire:({a,h})=>{const d=der(Math.sqrt,a);return [d,Math.sqrt(a)+d*h]},
  extremum:({a})=>{const xb=golden(x=>x*x*x-3*a*x,0,10);return [xb,xb*xb*xb-3*a*xb]},
  erreur:({U,I,dU,dI})=>{const f=(u,i)=>u/i;return [f(U,I),Math.abs(der(u=>f(u,I),U))*dU+Math.abs(der(i=>f(U,i),I))*dI]},
  cylindre:({V})=>{const rb=golden(r=>2*Math.PI*r*r+2*V/r,0.5,30);return [rb,V/(Math.PI*rb*rb)]},
  integrale:({p,q,c,a,b})=>[simpson(x=>p*x*x+q*x+c,a,b)],
  riemann:({k,a,b,n})=>{let S=0;const dx=(b-a)/n;for(let i=n;i>=1;i--)S+=dx*Math.pow(b-(n-i)*dx,k);return [S,simpson(x=>Math.pow(x,k),a,b)]},
  ipp:({a})=>[simpson(x=>x*Math.exp(x),0,a)],
  simples:({p,q})=>{const A=1/(q-p);return [A,-A,simpson(x=>1/((x+p)*(x+q)),0,1)]},
  moyenne:({a,b,c})=>[simpson(x=>a*x*x+b,0,c)/c],
  valexacte:({t})=>{const z=C(Math.cos(t/D),Math.sin(t/D));return [z.im,z.re]},
  equation:({f,c})=>{const g=f==='cos'?Math.cos:Math.sin,sol=[];const N=200000;
    for(let i=0;i<N;i++){const x0=2*Math.PI*i/N,x1=2*Math.PI*(i+1)/N;if((g(x0)-c)*(g(x1)-c)<=0){let lo=x0,hi=x1;for(let k=0;k<50;k++){const m=(lo+hi)/2;if((g(lo)-c)*(g(m)-c)<=0)hi=m;else lo=m}const r=(lo+hi)/2;if(!sol.length||r-sol[sol.length-1]>1e-6)sol.push(r)}}
    return [sol[0],sol[sol.length-1]]},
  logderivee:({b,x})=>[der(t=>Math.log(t*t*t+t)/Math.log(b),x)],
  hyperbolique:({x,k})=>[(Math.exp(x)-Math.exp(-x))/2,(Math.exp(x)+Math.exp(-x))/2,der(t=>Math.cosh(k*t),x)]
};
