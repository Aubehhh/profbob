/* Banque du mini-DS Outils mathématiques (cours de N. Coupier, chapitres 1 à 4), alignée sur /cours/maths/….
   Profil de notation « thermo » (indices seulement). Format d'un générateur : voir ds/statique/mini-ds/banque.js.
   Vérification : node outils/verif-minids.js 3000 outils */
(function(){
const H={pos:'un nombre positif',sig:'avec son signe (+ ou −)',ent:'un nombre entier',deg:'en degrés, avec son signe'};
const D=180/Math.PI;
const cx=(a,b)=>{let s=F0(a);if(b===0)return s;const m=Math.abs(b);return (a===0?'':s+(b<0?' − ':' + '))+(a===0&&b<0?'−':'')+(m===1?'':F0(m))+'i'};
const F0=x=>String(x).replace('.',',').replace('-','−');
const sgn=(x,s='+')=>x<0?'− '+F0(-x):s+' '+F0(x);
const poly=cs=>{const deg=cs.length-1;let out='';cs.forEach((c,i)=>{const p=deg-i;if(c===0)return;const m=Math.abs(c),co=(m===1&&p>0)?'':F0(m),x=p===0?'':p===1?'x':'x'+(p===2?'²':p===3?'³':'^'+p);
  out+=out===''?(c<0?'−':'')+co+x:(c<0?' − ':' + ')+co+x});return out||'0'};

window.BANQUE_OUTILS=[

/* ---------- Chapitre 1 : nombres complexes ---------- */

{id:'produit',chap:'Opérations',pts:2,gen(R,F){
  const a=R.nz(-6,6),b=R.nz(-6,6),c=R.nz(-6,6),d=R.nz(-6,6);
  return{v:{a,b,c,d},text:`<p>z₁ = ${cx(a,b)} et z₂ = ${cx(c,d)}. Écris z₁ × z₂ sous forme algébrique.</p>`,
    fields:[{label:'Re(z₁z₂)',unit:'',ans:a*c-b*d,d:0,tol:0.01,s:1,hint:H.sig},{label:'Im(z₁z₂)',unit:'',ans:a*d+b*c,d:0,tol:0.01,s:1,hint:H.sig}],
    sol:`z₁z₂ = (${F0(a)})(${F0(c)}) + (${F0(a)})(${F0(d)})i + (${F0(b)})(${F0(c)})i + (${F0(b)})(${F0(d)})i²
     = (${F0(a*c)} − (${F0(b*d)})) + (${F0(a*d)} + (${F0(b*c)}))i = ${cx(a*c-b*d,a*d+b*c)}`,
    note:`<p class="mds-note">Piège : i² = −1 change le signe du produit des parties imaginaires.</p>`}}},

{id:'quotient',chap:'Opérations',pts:2,gen(R,F){
  const a=R.nz(-6,6),b=R.nz(-6,6),c=R.nz(-5,5),d=R.nz(-5,5),den=c*c+d*d;
  const re=(a*c+b*d)/den,im=(b*c-a*d)/den;
  return{v:{a,b,c,d},text:`<p>Calcule z₁/z₂ avec z₁ = ${cx(a,b)} et z₂ = ${cx(c,d)}.</p>`,
    fields:[{label:'Re(z₁/z₂)',unit:'',ans:re,d:4,tol:0.002,s:1,hint:H.sig+', décimal'},{label:'Im(z₁/z₂)',unit:'',ans:im,d:4,tol:0.002,s:1,hint:H.sig+', décimal'}],
    sol:`on multiplie en haut et en bas par le conjugué ${cx(c,-d)} :
z₁/z₂ = (${cx(a,b)})(${cx(c,-d)}) / (${F0(c)}² + ${F0(d)}²) = (${F0(a*c+b*d)} ${sgn(b*c-a*d)}i) / ${den}
     = ${F.n(re,4)} ${im<0?'−':'+'} ${F.n(Math.abs(im),4)}i`}}},

{id:'modarg',chap:'Module et argument',pts:2,gen(R,F){
  const a=R.nz(-6,6),b=R.nz(-6,6),m=Math.hypot(a,b),t=Math.atan2(b,a)*D;
  return{v:{a,b},text:`<p>Module et argument (en degrés, dans ]−180°, 180°]) de z = ${cx(a,b)} ?</p>`,
    fields:[{label:'|z|',unit:'',ans:m,d:3,tol:0,hint:H.pos},{label:'arg z',unit:'°',ans:t,type:'angle',d:1,hint:H.deg}],
    sol:`|z| = √(${F0(a)}² + ${F0(b)}²) = √${a*a+b*b} = ${F.n(m,3)}
α = arctan(|${F0(b)}/${F0(a)}|) = ${F.n(Math.atan(Math.abs(b/a))*D,1)}°
quadrant ${a>0?(b>0?'I : θ = α':'IV : θ = −α'):(b>0?'II : θ = 180° − α':'III : θ = α − 180°')}  →  arg z = ${F.n(t,1)}°`,
    note:a<0?`<p class="mds-note">Piège : partie réelle négative, arctan(b/a) seul donnerait un angle faux.</p>`:''}}},

{id:'trigalg',chap:'Module et argument',pts:2,gen(R,F){
  const r=R.int(2,10),t=R.pick([30,45,60,120,135,150,-30,-45,-60,-120,-135,-150]);
  return{v:{r,t},text:`<p>z = ${r}(cos(${t}°) + i sin(${t}°)). Partie réelle et partie imaginaire ?</p>`,
    fields:[{label:'Re z',unit:'',ans:r*Math.cos(t/D),d:3,tol:0.005,s:1,hint:H.sig},{label:'Im z',unit:'',ans:r*Math.sin(t/D),d:3,tol:0.005,s:1,hint:H.sig}],
    sol:`a = r cos θ = ${r} cos(${t}°) = ${F.n(r*Math.cos(t/D),3)}
b = r sin θ = ${r} sin(${t}°) = ${F.n(r*Math.sin(t/D),3)}`}}},

{id:'moivre',chap:'Forme exponentielle',pts:2,gen(R,F){
  const [a,b,r,t]=R.pick([[1,1,Math.SQRT2,45],[1,-1,Math.SQRT2,-45],[-1,1,Math.SQRT2,135],[1,Math.sqrt(3),2,60],[Math.sqrt(3),1,2,30],[-1,Math.sqrt(3),2,120]]),n=R.int(3,8);
  const lab=a===1&&b===1?'1 + i':a===1&&b===-1?'1 − i':a===-1&&b===1?'−1 + i':a===1?'1 + i√3':a===-1?'−1 + i√3':'√3 + i';
  const m=Math.pow(r,n),arg=((t*n%360)+540)%360-180,z=[m*Math.cos(arg/D),m*Math.sin(arg/D)];
  return{v:{r,t,n},text:`<p>Avec la forme exponentielle, calcule z<sup>${n}</sup> pour z = ${lab} : module, argument (dans ]−180°, 180°]) et partie réelle.</p>`,
    fields:[{label:'|zⁿ|',unit:'',ans:m,d:3,tol:0,hint:H.pos},{label:'arg zⁿ',unit:'°',ans:arg,type:'angle',d:0,hint:H.deg},{label:'Re zⁿ',unit:'',ans:z[0],d:3,tol:0.01,s:1,hint:H.sig}],
    sol:`z = ${F.n(r,4)} e^(i(${F0(t)}°))
zⁿ = ${F.n(r,4)}^${n} e^(i × ${n} × (${F0(t)}°)) = ${F.n(m,3)} e^(i(${F0(t*n)}°)) = ${F.n(m,3)} e^(i(${F0(arg)}°))
Re zⁿ = ${F.n(m,3)} cos(${F0(arg)}°) = ${F.n(z[0],3)}`}}},

{id:'racinecarree',chap:'Racines',pts:2,gen(R,F){
  const A=R.int(1,7),B=R.nz(-7,7),a=A*A-B*B,b=2*A*B;
  return{v:{a,b},text:`<p>Trouve la racine carrée Z = A + iB de z = ${cx(a,b)} dont la partie réelle A est positive.</p>`,
    fields:[{label:'A',unit:'',ans:A,d:0,tol:0.01,hint:'positif'},{label:'B',unit:'',ans:B,d:0,tol:0.01,s:1,hint:H.sig}],
    sol:`A² + B² = |z| = √(${F0(a)}² + ${F0(b)}²) = ${A*A+B*B}
A² − B² = ${F0(a)}
→ A² = ${A*A}, B² = ${B*B} ;  AB du signe de Im z (${b>0?'positif':'négatif'})
A = ${A}, B = ${F0(B)}   (l'autre racine est −Z)`}}},

{id:'racinesn',chap:'Racines',pts:2,gen(R,F){
  const n=R.pick([3,4,5,6]),r=R.pick([8,16,27,32,64,81]),t=R.pick([0,30,45,60,90,120,180]);
  return{v:{n,r,t},text:`<p>Racines ${n}-ièmes de ω = ${r} e^(i${t}°). Module commun des racines, argument de la racine z₀ (k = 0) et écart angulaire entre deux racines voisines ?</p>`,
    fields:[{label:'|z_k|',unit:'',ans:Math.pow(r,1/n),d:4,tol:0,hint:H.pos},{label:'arg z₀',unit:'°',ans:t/n,type:'angle',d:2,hint:'en degrés'},{label:'écart',unit:'°',ans:360/n,d:1,tol:0.1,hint:'en degrés'}],
    sol:`z_k = r^(1/n) e^(i(θ + 2kπ)/n)
|z_k| = ${r}^(1/${n}) = ${F.n(Math.pow(r,1/n),4)}
arg z₀ = ${t}°/${n} = ${F.n(t/n,2)}° ;  écart = 360°/${n} = ${F.n(360/n,1)}°`}}},

{id:'second',chap:'Équations',pts:2,gen(R,F){
  const al=R.nz(-6,6),be=R.int(1,7),p=-2*al,q=al*al+be*be;
  return{v:{p,q},text:`<p>Résous z² ${sgn(p)}z ${sgn(q)} = 0 dans ℂ. Les solutions s'écrivent α ± iβ avec β &gt; 0 : donne Δ, α et β.</p>`,
    fields:[{label:'Δ',unit:'',ans:p*p-4*q,d:0,tol:0.01,s:1,hint:H.sig},{label:'α',unit:'',ans:al,d:2,tol:0.01,s:1,hint:H.sig},{label:'β',unit:'',ans:be,d:2,tol:0.01,hint:H.pos}],
    sol:`Δ = ${F0(p)}² − 4 × ${q} = ${p*p-4*q} = (${2*be}i)²
z = (${F0(-p)} ± ${2*be}i)/2 = ${F0(al)} ± ${be}i`}}},

{id:'horner',chap:'Équations',pts:2,gen(R,F){
  const rs=R.shuffle([-4,-3,-2,-1,1,2,3,4,5]).slice(0,3),[r1,r2,r3]=rs;
  const b=-(r1+r2+r3),c=r1*r2+r1*r3+r2*r3,d=-r1*r2*r3;
  const lo=Math.min(r2,r3),hi=Math.max(r2,r3);
  return{v:{b,c,d,r1},text:`<p>P(x) = ${poly([1,b,c,d])} admet la racine évidente ${F0(r1)}. Avec le tableau de Hörner, factorise P et donne les deux autres racines.</p>`,
    fields:[{label:'plus petite',unit:'',ans:lo,d:0,tol:0.01,s:1,hint:H.sig},{label:'plus grande',unit:'',ans:hi,d:0,tol:0.01,s:1,hint:H.sig}],
    sol:`Hörner avec r = ${F0(r1)} :  1   ${F0(b)}   ${F0(c)}   ${F0(d)}
ligne du bas :              1   ${F0(b+r1)}   ${F0(c+r1*(b+r1))}   0
P(x) = (x − (${F0(r1)}))(x² ${sgn(b+r1)}x ${sgn(c+r1*(b+r1))})
racines du second facteur : ${F0(lo)} et ${F0(hi)}`}}},

{id:'phaseur',chap:'Circuits',pts:2,gen(R,F){
  const Rr=R.int(1,10)*10,L=R.pick([10,20,50,100,200]),w=R.pick([100,500,1000,2000]),Vm=R.pick([10,20,50,100]);
  const X=L/1000*w,Z=Math.hypot(Rr,X),ph=Math.atan2(X,Rr)*D;
  return{v:{R:Rr,L,w,Vm},text:`<p>R = ${Rr} Ω et L = ${L} mH en série, v(t) = ${Vm} cos(${w}t). Module et argument de l'impédance, puis amplitude I<sub>m</sub> du courant ?</p>`,
    fields:[{label:'|Z|',unit:'Ω',ans:Z,d:2,tol:0,hint:H.pos},{label:'arg Z',unit:'°',ans:ph,type:'angle',d:1,hint:'en degrés'},{label:'I_m',unit:'A',ans:Vm/Z,d:4,tol:0,hint:H.pos}],
    sol:`Z = R + jLω = ${Rr} + j × ${F.n(L/1000,3)} × ${w} = ${Rr} + ${F.n(X,2)}j
|Z| = ${F.n(Z,2)} Ω ;  arg Z = arctan(${F.n(X,2)}/${Rr}) = ${F.n(ph,1)}°
I_m = V_m/|Z| = ${Vm}/${F.n(Z,2)} = ${F.n(Vm/Z,4)} A  →  i(t) = ${F.n(Vm/Z,4)} cos(${w}t − ${F.n(ph/D,3)})`}}},

/* ---------- Chapitre 2 : calcul différentiel ---------- */

{id:'chaine',chap:'Règles de dérivation',pts:2,gen(R,F){
  const a=R.nz(-3,3),n=R.int(2,5),x=R.nz(-2,2);let b=R.nz(-5,5);if(a*x*x+b===0)b+=1;
  const u=a*x*x+b,d=n*Math.pow(u,n-1)*2*a*x;
  return{v:{a,b,n,x},text:`<p>f(x) = (${a===1?'':a===-1?'−':F0(a)}x² ${sgn(b)})<sup>${n}</sup>. Calcule f'(${F0(x)}).</p>`,
    fields:[{label:"f'("+F0(x)+')',unit:'',ans:d,d:0,tol:0.01,s:1,hint:H.sig}],
    sol:`f'(x) = ${n}(${F0(a)}x² ${sgn(b)})^${n-1} × ${F0(2*a)}x
f'(${F0(x)}) = ${n} × (${F0(u)})^${n-1} × ${F0(2*a*x)} = ${F0(d)}`}}},

{id:'produitexp',chap:'Règles de dérivation',pts:2,gen(R,F){
  const k=R.int(1,3),a=R.nz(-2,2),x=R.pick([0.5,1,1.5,2,-1]);
  const d=Math.exp(a*x)*(k*Math.pow(x,k-1)+a*Math.pow(x,k));
  return{v:{k,a,x},text:`<p>f(x) = x${k>1?'<sup>'+k+'</sup>':''} e^(${a===1?'':a===-1?'−':F0(a)}x). Calcule f'(${F0(x)}).</p>`,
    fields:[{label:"f'("+F0(x)+')',unit:'',ans:d,d:4,tol:0,s:1,hint:H.sig+', décimal'}],
    sol:`(uv)' = u'v + uv' :  f'(x) = ${k>1?k+'x^'+(k-1):'1'} e^(${F0(a)}x) + x${k>1?'^'+k:''} × ${F0(a)} e^(${F0(a)}x)
f'(${F0(x)}) = e^(${F0(a*x)}) × (${F.n(k*Math.pow(x,k-1),4)} ${sgn(Math.round(a*Math.pow(x,k)*1e4)/1e4)}) = ${F.n(d,4)}`}}},

{id:'leibniz',chap:'Dérivées n-ièmes',pts:2,gen(R,F){
  const n=R.int(2,7),x=R.int(-2,2);
  const v=Math.exp(x)*(x*x+2*n*x+n*(n-1));
  return{v:{n,x},text:`<p>f(x) = x² eˣ. Avec la formule de Leibniz, calcule f<sup>(${n})</sup>(${F0(x)}).</p>`,
    fields:[{label:'f^('+n+')('+F0(x)+')',unit:'',ans:v,d:4,tol:0,s:1,hint:H.sig+', décimal'}],
    sol:`f⁽ⁿ⁾ = Σ C(n,k) (x²)⁽ᵏ⁾ (eˣ)⁽ⁿ⁻ᵏ⁾ ;  seuls k = 0, 1, 2 comptent
f⁽ⁿ⁾(x) = eˣ (x² + 2nx + n(n − 1))
f^(${n})(${F0(x)}) = e^${F0(x)} × (${x*x} ${sgn(2*n*x)} ${sgn(n*(n-1))}) = ${F.n(v,4)}`}}},

{id:'lineaire',chap:'Approximation linéaire',pts:2,gen(R,F){
  const a=R.pick([4,9,16,25,36,49,64,81,100]),h=R.pick([-0.3,-0.2,-0.1,0.1,0.2,0.3,0.5]),s=Math.sqrt(a);
  return{v:{a,h},text:`<p>Approxime √${F.n(a+h,1)} par la linéarisation de f(x) = √x en a = ${a}. Donne f'(${a}) puis la valeur approchée.</p>`,
    fields:[{label:"f'("+a+')',unit:'',ans:1/(2*s),d:4,tol:0,hint:H.pos},{label:'√'+F.n(a+h,1),unit:'',ans:s+h/(2*s),d:4,tol:0.0002,hint:'4 décimales'}],
    sol:`f'(x) = 1/(2√x)  →  f'(${a}) = 1/${2*s} = ${F.n(1/(2*s),4)}
√${F.n(a+h,1)} ≈ f(${a}) + f'(${a}) × (${F.n(h,1)}) = ${s} ${sgn(Math.round(h/(2*s)*1e4)/1e4)} = ${F.n(s+h/(2*s),4)}`,
    note:`<p class="mds-note">La vraie valeur est ${F.n(Math.sqrt(a+h),5)} : l'approximation est d'autant meilleure que l'écart est petit.</p>`}}},

{id:'extremum',chap:'Étude de fonction',pts:2,gen(R,F){
  const s=R.int(1,5),a=s*s;
  return{v:{a},text:`<p>f(x) = x³ − ${3*a}x. Point critique positif et valeur du minimum local ?</p>`,
    fields:[{label:'x',unit:'',ans:s,d:2,tol:0.01,hint:H.pos},{label:'f(x)',unit:'',ans:-2*a*s,d:2,tol:0.01,s:1,hint:H.sig}],
    sol:`f'(x) = 3x² − ${3*a} = 3(x² − ${a}) = 0  →  x = ±${s}
f' &lt; 0 entre −${s} et ${s}, f' &gt; 0 après : minimum local en x = ${s}
f(${s}) = ${s*s*s} − ${3*a*s} = ${F0(-2*a*s)}`}}},

{id:'erreur',chap:'Approximation linéaire',pts:2,gen(R,F){
  const U=R.pick([6,9,12,15,24,48]),I=R.pick([0.5,1,1.5,2,3,4]),dU=R.pick([0.1,0.2,0.5]),dI=R.pick([0.01,0.02,0.05]);
  const Rr=U/I,dR=dU/I+U*dI/(I*I);
  return{v:{U,I,dU,dI},text:`<p>R = U/I avec U = ${F.n(U,1)} V (ΔU = ${F.n(dU,1)} V) et I = ${F.n(I,2)} A (ΔI = ${F.n(dI,2)} A). Valeur de R et erreur absolue ΔR (majoration par la différentielle) ?</p>`,
    fields:[{label:'R',unit:'Ω',ans:Rr,d:3,tol:0,hint:H.pos},{label:'ΔR',unit:'Ω',ans:dR,d:4,tol:0,hint:H.pos}],
    sol:`R = ${F.n(U,1)} / ${F.n(I,2)} = ${F.n(Rr,3)} Ω
dR = dU/I − U dI/I²  →  ΔR ≈ ΔU/I + U ΔI/I² = ${F.n(dU/I,4)} + ${F.n(U*dI/(I*I),4)} = ${F.n(dR,4)} Ω`}}},

{id:'cylindre',chap:'Optimisation',pts:2,gen(R,F){
  const V=R.pick([250,330,500,750,1000,1500,2000]),r=Math.cbrt(V/(2*Math.PI));
  return{v:{V},text:`<p>Boîte cylindrique fermée de volume ${V} cm³. Rayon r et hauteur h qui minimisent la surface de métal ?</p>`,
    fields:[{label:'r',unit:'cm',ans:r,d:3,tol:0,hint:H.pos},{label:'h',unit:'cm',ans:2*r,d:3,tol:0,hint:H.pos}],
    sol:`h = V/(πr²) ;  S(r) = 2πr² + 2V/r
S'(r) = 4πr − 2V/r² = 0  →  r³ = V/(2π) = ${F.n(V/(2*Math.PI),3)}
r = ${F.n(r,3)} cm ;  h = V/(πr²) = 2r = ${F.n(2*r,3)} cm`}}},

/* ---------- Chapitre 3 : calcul intégral ---------- */

{id:'integrale',chap:'Intégrale définie',pts:2,gen(R,F){
  const p=R.nz(-4,4),q=R.int(-5,5),c=R.int(-6,6),a=R.int(-2,1),b=a+R.int(1,3);
  const P=x=>p*x*x*x/3+q*x*x/2+c*x,I=P(b)-P(a);
  return{v:{p,q,c,a,b},text:`<p>Calcule ∫ de ${F0(a)} à ${F0(b)} de (${F0(p)}x² ${sgn(q)}x ${sgn(c)}) dx.</p>`,
    fields:[{label:'I',unit:'',ans:I,d:4,tol:0.002,s:1,hint:H.sig+', décimal'}],
    sol:`F(x) = ${F0(p)}x³/3 ${sgn(q)}x²/2 ${sgn(c)}x
I = F(${F0(b)}) − F(${F0(a)}) = ${F.n(P(b),4)} − (${F.n(P(a),4)}) = ${F.n(I,4)}`}}},

{id:'riemann',chap:'Sommes de Riemann',pts:2,gen(R,F){
  const k=R.pick([2,3]),a=R.int(0,2),b=a+R.int(1,3),n=R.pick([4,5,6,8]),dx=(b-a)/n;
  let S=0;for(let i=1;i<=n;i++)S+=Math.pow(a+i*dx,k);S*=dx;
  const I=(Math.pow(b,k+1)-Math.pow(a,k+1))/(k+1);
  return{v:{k,a,b,n},text:`<p>f(x) = x${k===2?'²':'³'} sur [${a}, ${b}]. Somme de Riemann par la droite avec n = ${n} sous-intervalles, puis valeur exacte de l'intégrale.</p>`,
    fields:[{label:'S_'+n,unit:'',ans:S,d:4,tol:0.002,hint:H.pos},{label:'I',unit:'',ans:I,d:4,tol:0.002,hint:H.pos}],
    sol:`Δx = (${b} − ${a})/${n} = ${F.n(dx,4)} ;  points ${Array.from({length:n},(_,i)=>F.n(a+(i+1)*dx,3)).join(' ; ')}
S = Δx × Σ f(a + kΔx) = ${F.n(S,4)}
I = [x^${k+1}/${k+1}] de ${a} à ${b} = ${F.n(I,4)}  (la somme par la droite surestime : f croissante)`}}},

{id:'ipp',chap:'Intégration par parties',pts:2,gen(R,F){
  const a=R.pick([1,2,3,0.5,1.5]);
  const I=(a-1)*Math.exp(a)+1;
  return{v:{a},text:`<p>Calcule ∫ de 0 à ${F.n(a,1)} de x eˣ dx par intégration par parties.</p>`,
    fields:[{label:'I',unit:'',ans:I,d:4,tol:0,hint:'décimal'}],
    sol:`u = x (on dérive), dv = eˣ dx  →  du = dx, v = eˣ
I = [x eˣ] − ∫ eˣ dx = [(x − 1) eˣ] de 0 à ${F.n(a,1)} = (${F.n(a-1,1)}) e^${F.n(a,1)} − (−1) = ${F.n(I,4)}`}}},

{id:'simples',chap:'Éléments simples',pts:2,gen(R,F){
  const p=R.int(1,4),q=p+R.int(1,4),A=1/(q-p),I=A*(Math.log((1+p)/p)-Math.log((1+q)/q));
  return{v:{p,q},text:`<p>Décompose 1/((x + ${p})(x + ${q})) = A/(x + ${p}) + B/(x + ${q}), puis calcule son intégrale de 0 à 1.</p>`,
    fields:[{label:'A',unit:'',ans:A,d:4,tol:0,s:1,hint:H.sig},{label:'B',unit:'',ans:-A,d:4,tol:0,s:1,hint:H.sig},{label:'I',unit:'',ans:I,d:4,tol:0,hint:'décimal'}],
    sol:`1 = A(x + ${q}) + B(x + ${p}) ;  x = −${p} : A = 1/${q-p} ;  x = −${q} : B = −1/${q-p}
I = (1/${q-p}) [ln(x + ${p}) − ln(x + ${q})] de 0 à 1 = (1/${q-p})(ln(${1+p}/${p}) − ln(${1+q}/${q})) = ${F.n(I,4)}`}}},

{id:'moyenne',chap:'Intégrale définie',pts:2,gen(R,F){
  const a=R.nz(-3,3),b=R.int(-5,5),c=R.int(1,4);
  const m=(a*c*c*c/3+b*c)/c;
  return{v:{a,b,c},text:`<p>Valeur moyenne de f(x) = ${F0(a)}x² ${sgn(b)} sur [0, ${c}] ?</p>`,
    fields:[{label:'moyenne',unit:'',ans:m,d:4,tol:0.002,s:1,hint:H.sig}],
    sol:`f̄ = (1/${c}) ∫₀^${c} (${F0(a)}x² ${sgn(b)}) dx = (1/${c}) [${F0(a)}x³/3 ${sgn(b)}x]₀^${c} = (1/${c}) × ${F.n(a*c*c*c/3+b*c,4)} = ${F.n(m,4)}`}}},

/* ---------- Chapitre 4 : trigonométrie et fonctions usuelles ---------- */

{id:'valexacte',chap:'Formules',pts:2,gen(R,F){
  const [t,how]=R.pick([[15,'45° − 30°'],[75,'45° + 30°'],[105,'60° + 45°'],[165,'120° + 45°'],[22.5,'45°/2 (angle moitié)'],[67.5,'135°/2 (angle moitié)']]);
  return{v:{t},text:`<p>Valeurs de sin(${F.n(t,1)}°) et cos(${F.n(t,1)}°) à 4 décimales, en écrivant ${F.n(t,1)}° = ${how}.</p>`,
    fields:[{label:'sin',unit:'',ans:Math.sin(t/D),d:4,tol:0.0002,s:1,hint:H.sig},{label:'cos',unit:'',ans:Math.cos(t/D),d:4,tol:0.0002,s:1,hint:H.sig}],
    sol:`${how.includes('moitié')?`sin(θ/2) = √((1 − cos θ)/2), cos(θ/2) = √((1 + cos θ)/2)`:`sin(A ± B) = sin A cos B ± cos A sin B ;  cos(A ± B) = cos A cos B ∓ sin A sin B`}
sin(${F.n(t,1)}°) = ${F.n(Math.sin(t/D),4)} ;  cos(${F.n(t,1)}°) = ${F.n(Math.cos(t/D),4)}`}}},

{id:'equation',chap:'Équations trigonométriques',pts:2,gen(R,F){
  const f=R.pick(['cos','sin']),c=R.pick([0.5,-0.5,0.2,0.3,-0.4,0.8,-0.7]);
  let s;if(f==='cos'){const a=Math.acos(c);s=[a,2*Math.PI-a]}else{const a=Math.asin(c);s=[a<0?a+2*Math.PI:a,Math.PI-a]}
  s.sort((x,y)=>x-y);
  return{v:{f,c},text:`<p>Résous ${f} x = ${F0(c)} dans [0, 2π]. Donne les deux solutions en radians (4 décimales).</p>`,
    fields:[{label:'x₁ (plus petite)',unit:'rad',ans:s[0],d:4,tol:0.002,hint:H.pos},{label:'x₂ (plus grande)',unit:'rad',ans:s[1],d:4,tol:0.002,hint:H.pos}],
    sol:f==='cos'?`a = arccos(${F0(c)}) = ${F.n(Math.acos(c),4)}
cos x = cos a ⇔ x = a + 2kπ ou x = −a + 2kπ ;  dans [0, 2π] : a et 2π − a
S = {${F.n(s[0],4)} ; ${F.n(s[1],4)}}`:`a = arcsin(${F0(c)}) = ${F.n(Math.asin(c),4)}
sin x = sin a ⇔ x = a + 2kπ ou x = π − a + 2kπ ;  ramené dans [0, 2π]
S = {${F.n(s[0],4)} ; ${F.n(s[1],4)}}`,
    note:`<p class="mds-note">Piège : ne pas oublier la seconde famille de solutions${f==='sin'&&c<0?', et ramener la solution négative dans [0, 2π] en ajoutant 2π':''}.</p>`}}},

{id:'logderivee',chap:'Exponentielle et logarithme',pts:2,gen(R,F){
  const b=R.pick([2,3,10]),x=R.pick([1,2,3]);
  const v=(3*x*x+1)/((x*x*x+x)*Math.log(b));
  return{v:{b,x},text:`<p>f(x) = log<sub>${b}</sub>(x³ + x). Calcule f'(${x}).</p>`,
    fields:[{label:"f'("+x+')',unit:'',ans:v,d:4,tol:0,hint:H.pos}],
    sol:`log_b(u) = ln u / ln b  →  f'(x) = (3x² + 1) / ((x³ + x) ln ${b})
f'(${x}) = ${3*x*x+1} / (${x*x*x+x} × ${F.n(Math.log(b),4)}) = ${F.n(v,4)}`}}},

{id:'hyperbolique',chap:'Fonctions hyperboliques',pts:2,gen(R,F){
  const x=R.pick([0.5,1,1.5,2,-1,-0.5]),k=R.int(2,4);
  return{v:{x,k},text:`<p>Calcule sinh(${F0(x)}) et cosh(${F0(x)}) avec les exponentielles, puis la dérivée de g(t) = cosh(${k}t) en t = ${F0(x)}.</p>`,
    fields:[{label:'sinh',unit:'',ans:Math.sinh(x),d:4,tol:0,s:1,hint:H.sig},{label:'cosh',unit:'',ans:Math.cosh(x),d:4,tol:0,hint:H.pos},{label:"g'",unit:'',ans:k*Math.sinh(k*x),d:3,tol:0,s:1,hint:H.sig}],
    sol:`sinh x = (eˣ − e⁻ˣ)/2 = ${F.n(Math.sinh(x),4)} ;  cosh x = (eˣ + e⁻ˣ)/2 = ${F.n(Math.cosh(x),4)}
(vérification : cosh² − sinh² = 1)
g'(t) = ${k} sinh(${k}t)  →  g'(${F0(x)}) = ${k} sinh(${F0(k*x)}) = ${F.n(k*Math.sinh(k*x),3)}`}}}

];
})();
