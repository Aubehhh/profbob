/* Banque du mini-DS Électricité (cours « Les bases de l'électricité », chapitres 1 à 4), alignée sur /cours/elec/….
   Profil de notation « thermo » (indices seulement). Format d'un générateur : voir ds/statique/mini-ds/banque.js.
   Vérification : node outils/verif-minids.js 3000 elec */
(function(){
const H={pos:'un nombre positif',sig:'avec son signe (+ ou −)',ent:'un nombre entier'};
const MAT=[['cuivre',1.6e-8,4e-3],['aluminium',2.6e-8,4.5e-3],['argent',1.5e-8,4.5e-3],['fer',8.5e-8,7e-3],['tungstène',5e-8,5e-3]];
const sci=(x,d=2)=>{if(x===0)return '0';const e=Math.floor(Math.log10(Math.abs(x)));const m=x/Math.pow(10,e);return (m<0?'−':'')+String(Math.round(Math.abs(m)*Math.pow(10,d))/Math.pow(10,d)).replace('.',',')+'×10'+String(e).split('').map(c=>c==='-'?'⁻':'⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('')};
const par=(a,b)=>a*b/(a+b);
const deg=Math.PI/180;

const FILS=['fil de phase','fil de neutre','fil de protection (PE)'];
const T_FIL=[['Fil noté L2 sur le schéma du réseau.','fil de phase'],['Fil relié à la terre, qui protège les personnes contre les chocs électriques.','fil de protection (PE)'],
  ['Fil commun qui sert de référence aux trois tensions simples v_1N, v_2N, v_3N.','fil de neutre'],['Une tension composée se mesure entre deux de ces fils.','fil de phase'],
  ['Fil noté N sur le schéma.','fil de neutre'],['Fil noté PE sur le schéma.','fil de protection (PE)'],['Il y en a trois dans un réseau triphasé.','fil de phase'],
  ['Une tension simple se mesure entre un fil de phase et ce fil.','fil de neutre']];
window.BANQUE_ELEC=[

/* ---------- Chapitre 1 : notions de base ---------- */

{id:'charge',chap:'Tension et courant',pts:2,gen(R,F){
  const Q=R.int(6,60)*5,t=R.pick([10,20,30,40,60,90,120]);
  return{v:{Q,t},text:`<p>Une charge de ${Q} C traverse un conducteur en ${t} s, avec un débit constant. Intensité du courant ?</p>`,
    fields:[{label:'I',unit:'A',ans:Q/t,d:3,tol:0,hint:H.pos}],
    sol:`I = Q / t = ${Q} / ${t} = ${F.n(Q/t,3)} A`}}},

{id:'energie',chap:'Puissance et énergie',pts:2,gen(R,F){
  const P=R.pick([60,100,500,750,1000,1200,1500,2000,2500]),m=R.pick([15,20,30,45,50,90,120,150]);
  const w=P*m*60;
  return{v:{P,m},text:`<p>Un récepteur de puissance constante P = ${P} W fonctionne pendant ${m} min. Énergie consommée, en kJ puis en kWh ?</p>`,
    fields:[{label:'w',unit:'kJ',ans:w/1000,d:1,tol:0,hint:'en kilojoules'},{label:'w',unit:'kWh',ans:w/3.6e6,d:3,tol:0,hint:'en kilowattheures'}],
    sol:`w = P × T = ${P} × ${m}×60 = ${F.n(w/1000,1)}×10³ J = ${F.n(w/1000,1)} kJ
w = ${F.n(w/1000,1)}×10³ / 3,6×10⁶ = ${F.n(w/3.6e6,3)} kWh`,
    note:`<p class="mds-note">Piège : la durée doit être en secondes pour avoir des joules (1 kWh = 3,6×10⁶ J).</p>`}}},

{id:'pmoy',chap:'Puissance et énergie',pts:2,gen(R,F){
  const P1=R.pick([800,1000,1200,1500,2000]),t1=R.pick([10,15,20,30,35]),P2=R.pick([40,60,100,150,300]),t2=R.pick([30,40,50,60]);
  const w=P1*t1*60+P2*t2*60,pm=w/((t1+t2)*60);
  return{v:{P1,t1,P2,t2},text:`<p>Un réseau alimente l'un après l'autre un récepteur de ${P1} W pendant ${t1} min, puis un récepteur de ${P2} W pendant ${t2} min. Énergie totale et puissance moyenne sur toute la durée ?</p>`,
    fields:[{label:'w',unit:'kJ',ans:w/1000,d:1,tol:0,hint:'en kilojoules'},{label:'&lt;p&gt;',unit:'W',ans:pm,d:1,tol:0,hint:H.pos}],
    sol:`w = P₁T₁ + P₂T₂ = ${P1}×${t1*60} + ${P2}×${t2*60} = ${F.n(w/1000,1)} kJ
&lt;p&gt; = w / T = ${F.n(w,0)} / ${(t1+t2)*60} = ${F.n(pm,1)} W`}}},

/* ---------- Chapitre 2 : tension continue ---------- */

{id:'resfil',chap:'Résistance d\'un fil',pts:2,gen(R,F){
  const [nom,rho]=R.pick(MAT),l=R.pick([20,50,80,100,150,200,250]),S=R.pick([1.5,2.5,4,6,10,16]),bi=R.pick([true,false]);
  const L=bi?2*l:l,Rr=rho*L/(S*1e-6);
  return{v:{rho,L,S},text:`<p>${bi?`Une ligne <b>bifilaire</b> en ${nom} a une longueur de ${l} m`:`Un fil de ${nom} a une longueur de ${l} m`} et une section de ${F.n(S)} mm² (ρ = ${sci(rho,1)} Ω·m). Résistance ${bi?'de la ligne':'du fil'} ?</p>`,
    fields:[{label:'R',unit:'Ω',ans:Rr,d:4,tol:0,hint:'en ohms, ex. 0,2133'}],
    sol:`${bi?`ligne bifilaire : l = 2 × ${l} = ${L} m\n`:''}R = ρ l / S = ${sci(rho,1)} × ${L} / ${F.n(S)}×10⁻⁶ = ${F.n(Rr,4)} Ω`,
    note:bi?`<p class="mds-note">Piège : une ligne bifilaire a deux fils, aller et retour.</p>`:''}}},

{id:'temperature',chap:'Résistance d\'un fil',pts:2,gen(R,F){
  const a=R.pick([0.004,0.0045,0.005]),R0=R.int(20,800)/2,t1=R.pick([10,15,20,25]),t2=R.pick([50,60,70,80,90,100]);
  const R1=Math.round(R0*(1+a*t1)*1000)/1000,R0b=R1/(1+a*t1),R2=R0b*(1+a*t2);
  return{v:{a,R1,t1,t2},text:`<p>Une résistance vaut ${F.n(R1,3)} Ω à ${t1} °C. Coefficient de température a₀ = ${F.n(a,4)} °C⁻¹. Résistance à 0 °C, puis à ${t2} °C ?</p>`,
    fields:[{label:'R_0',unit:'Ω',ans:R0b,d:2,tol:0,hint:H.pos},{label:'R_'+t2,unit:'Ω',ans:R2,d:2,tol:0,hint:'à '+t2+' °C'}],
    sol:`R₀ = R_${t1} / (1 + a₀ × ${t1}) = ${F.n(R1,3)} / ${F.n(1+a*t1,4)} = ${F.n(R0b,2)} Ω
R_${t2} = R₀ (1 + a₀ × ${t2}) = ${F.n(R0b,2)} × ${F.n(1+a*t2,4)} = ${F.n(R2,2)} Ω`,
    note:`<p class="mds-note">Piège : on repasse toujours par 0 °C, on n'écrit pas R_${t2} = R_${t1} (1 + a₀ × ${t2-t1}).</p>`}}},

{id:'tempfinale',chap:'Résistance d\'un fil',pts:2,gen(R,F){
  const a=0.004,t1=R.pick([15,20,25]),t2=R.int(8,24)*5,R0=R.int(100,600)/1000;
  const R1=Math.round(R0*(1+a*t1)*1000)/1000,R2=Math.round(R0*(1+a*t2)*1000)/1000;
  const R0b=R1/(1+a*t1),th=(R2/R0b-1)/a;
  return{v:{a,R1,t1,R2},text:`<p>L'enroulement d'une machine a une résistance de ${F.n(R1,3)} Ω à ${t1} °C. Après fonctionnement, elle vaut ${F.n(R2,3)} Ω. a₀ = 0,004 °C⁻¹. Température de l'enroulement ?</p>`,
    fields:[{label:'θ',unit:'°C',ans:th,d:1,tol:0.6,hint:'en °C'}],
    sol:`R₀ = ${F.n(R1,3)} / (1 + 0,004 × ${t1}) = ${F.n(R0b,4)} Ω
${F.n(R2,3)} = R₀ (1 + 0,004 θ)  →  θ = (${F.n(R2,3)} / ${F.n(R0b,4)} − 1) / 0,004 = ${F.n(th,1)} °C`}}},

{id:'association',chap:'Ohm et associations',pts:2,gen(R,F){
  const R1=R.int(2,40)*5,R2=R.int(2,30)*10,R3=R.int(2,30)*5,U=R.pick([12,24,48,100,230]);
  const Rp=par(R2,R3),Rs=R1+Rp,I=U/Rs;
  return{v:{R1,R2,R3,U},text:`<p>R₁ = ${R1} Ω est en série avec l'ensemble (R₂ = ${R2} Ω en parallèle avec R₃ = ${R3} Ω). Le groupement est alimenté sous U = ${U} V. Résistance R<sub>péq</sub> de R₂ ∥ R₃, résistance équivalente totale, courant fourni ?</p>`,
    fields:[{label:'R_péq',unit:'Ω',ans:Rp,d:2,tol:0,hint:H.pos},{label:'R_séq',unit:'Ω',ans:Rs,d:2,tol:0,hint:H.pos},{label:'I',unit:'A',ans:I,d:3,tol:0,hint:H.pos}],
    sol:`R_péq = R₂R₃ / (R₂ + R₃) = ${R2} × ${R3} / ${R2+R3} = ${F.n(Rp,2)} Ω
R_séq = R₁ + R_péq = ${R1} + ${F.n(Rp,2)} = ${F.n(Rs,2)} Ω
I = U / R_séq = ${U} / ${F.n(Rs,2)} = ${F.n(I,3)} A`}}},

{id:'divtension',chap:'Diviseurs',pts:2,gen(R,F){
  const Ve=R.pick([5,9,12,15,24,30]),R1=R.int(1,20)*100,R2=R.int(1,20)*100,Rc=R.int(1,20)*200;
  const Vs=Ve*R2/(R1+R2),R2c=par(R2,Rc),Vc=Ve*R2c/(R1+R2c);
  return{v:{Ve,R1,R2,Rc},text:`<p>Diviseur de tension : V<sub>e</sub> = ${Ve} V, R₁ = ${R1} Ω (en haut), R₂ = ${R2} Ω (en bas, sortie V<sub>s</sub> à ses bornes). V<sub>s</sub> à vide, puis quand on branche une charge R<sub>c</sub> = ${Rc} Ω sur la sortie ?</p>`,
    fields:[{label:'V_s à vide',unit:'V',ans:Vs,d:3,tol:0,hint:H.pos},{label:'V_s en charge',unit:'V',ans:Vc,d:3,tol:0,hint:H.pos}],
    sol:`à vide : V_s = V_e R₂ / (R₁ + R₂) = ${Ve} × ${R2} / ${R1+R2} = ${F.n(Vs,3)} V
en charge : R₂ ∥ R_c = ${F.n(R2c,2)} Ω  →  V_s = ${Ve} × ${F.n(R2c,2)} / (${R1} + ${F.n(R2c,2)}) = ${F.n(Vc,3)} V`,
    note:`<p class="mds-note">Piège : la formule du diviseur suppose I<sub>s</sub> = 0 ; avec une charge, R₂ devient R₂ ∥ R<sub>c</sub>.</p>`}}},

{id:'divcourant',chap:'Diviseurs',pts:2,gen(R,F){
  const I=R.int(4,40)/2,R1=R.int(2,30),R2=R.int(2,30);
  return{v:{I,R1,R2},text:`<p>Un courant I = ${F.n(I)} A se partage entre R₁ = ${R1} Ω et R₂ = ${R2} Ω en parallèle. Courants i₁ dans R₁ et i₂ dans R₂ ?</p>`,
    fields:[{label:'i_1',unit:'A',ans:I*R2/(R1+R2),d:3,tol:0,hint:H.pos},{label:'i_2',unit:'A',ans:I*R1/(R1+R2),d:3,tol:0,hint:H.pos}],
    sol:`i₁ = I R₂ / (R₁ + R₂) = ${F.n(I)} × ${R2} / ${R1+R2} = ${F.n(I*R2/(R1+R2),3)} A
i₂ = I R₁ / (R₁ + R₂) = ${F.n(I)} × ${R1} / ${R1+R2} = ${F.n(I*R1/(R1+R2),3)} A`,
    note:`<p class="mds-note">Piège : pour le courant dans R₁, c'est R₂ (l'autre résistance) au numérateur.</p>`}}},

{id:'maille',chap:'Lois de Kirchhoff',pts:2,gen(R,F){
  const E1=R.int(6,30),E2=R.int(2,20),E3=R.int(2,20),Rs=[R.int(1,8),R.int(1,8),R.int(1,8)].map(x=>x/2);
  const S=Rs[0]+Rs[1]+Rs[2],i=(E1-E2-E3)/S;
  return{v:{E1,E2,E3,S},text:`<p>Une maille comporte trois sources et trois résistances en série : R₁ = ${F.n(Rs[0])} Ω, R₂ = ${F.n(Rs[1])} Ω, R₃ = ${F.n(Rs[2])} Ω. En parcourant la maille dans le sens de la flèche du courant i, on rencontre E₁ = ${E1} V dans le sens de parcours, E₂ = ${E2} V et E₃ = ${E3} V contre le sens de parcours (toutes les résistances sont en convention récepteur). Courant i, avec son signe ?</p>`,
    fields:[{label:'i',unit:'A',ans:i,d:3,tol:0.002,s:1,hint:H.sig}],
    sol:`loi des mailles (flèche dans le sens de parcours : +) :
E₁ − E₂ − E₃ − (R₁ + R₂ + R₃) i = 0
i = (E₁ − E₂ − E₃) / (R₁ + R₂ + R₃) = (${E1} − ${E2} − ${E3}) / ${F.n(S)} = ${F.n(i,3)} A`,
    note:i<0?`<p class="mds-note">i &lt; 0 : le courant réel circule dans l'autre sens, E₁ fonctionne alors en récepteur.</p>`:''}}},

/* ---------- Chapitre 3 : modèles équivalents ---------- */

{id:'theveninessai',chap:'Thévenin',pts:2,gen(R,F){
  const E=R.pick([6,9,12,24,48,100,240]),r=R.int(1,40)/20,i=R.int(2,Math.max(3,Math.floor(E/r*0.6)));
  const u=Math.round((E-r*i)*1000)/1000,rr=(E-u)/i;
  return{v:{E,u,i},text:`<p>Une source continue réelle a une tension à vide de ${E} V. Quand elle débite ${i} A, la tension à ses bornes vaut ${F.n(u,3)} V. Résistance R<sub>T</sub> du modèle de Thévenin et courant de court-circuit ?</p>`,
    fields:[{label:'R_T',unit:'Ω',ans:rr,d:3,tol:0,hint:H.pos},{label:'I_cc',unit:'A',ans:E/rr,d:2,tol:0,hint:H.pos}],
    sol:`u = E_T − R_T i  →  R_T = (E_T − u) / i = (${E} − ${F.n(u,3)}) / ${i} = ${F.n(rr,3)} Ω
I_cc = E_T / R_T = ${E} / ${F.n(rr,3)} = ${F.n(E/rr,2)} A`}}},

{id:'theveninch',chap:'Thévenin',pts:2,gen(R,F){
  const E=R.pick([12,24,48,110,120,240]),r=R.int(1,30)/10,Rc=R.int(2,60)/2;
  const i=E/(r+Rc);
  return{v:{E,r,Rc},text:`<p>Un générateur de modèle de Thévenin E<sub>T</sub> = ${E} V, R<sub>T</sub> = ${F.n(r)} Ω alimente une résistance R<sub>c</sub> = ${F.n(Rc)} Ω. Courant débité et tension aux bornes de la charge ?</p>`,
    fields:[{label:'i',unit:'A',ans:i,d:3,tol:0,hint:H.pos},{label:'u',unit:'V',ans:Rc*i,d:2,tol:0,hint:H.pos}],
    sol:`i = E_T / (R_T + R_c) = ${E} / ${F.n(r+Rc)} = ${F.n(i,3)} A
u = R_c i = ${F.n(Rc)} × ${F.n(i,3)} = ${F.n(Rc*i,2)} V   (ou u = E_T − R_T i)`}}},

{id:'norton',chap:'Norton',pts:2,gen(R,F){
  const Icc=R.int(5,50),RN=R.int(2,20)*50,Rc=R.int(2,20)*50;
  const i=Icc*RN/(RN+Rc);
  return{v:{Icc,RN,Rc},text:`<p>Une source de modèle de Norton I<sub>CC</sub> = ${Icc} mA, R<sub>N</sub> = ${RN} Ω alimente une charge R<sub>C</sub> = ${Rc} Ω. Courant dans la charge, tension u, puis tension à vide E<sub>T</sub> du modèle de Thévenin équivalent ?</p>`,
    fields:[{label:'i',unit:'mA',ans:i,d:3,tol:0,hint:'en mA'},{label:'u',unit:'V',ans:Rc*i/1000,d:3,tol:0,hint:'en V'},{label:'E_T',unit:'V',ans:RN*Icc/1000,d:2,tol:0,hint:'en V'}],
    sol:`i = I_CC R_N / (R_N + R_C) = ${Icc} × ${RN} / ${RN+Rc} = ${F.n(i,3)} mA
u = R_C i = ${Rc} × ${F.n(i/1000,6)} = ${F.n(Rc*i/1000,3)} V
E_T = R_N I_CC = ${RN} × ${F.n(Icc/1000,3)} = ${F.n(RN*Icc/1000,2)} V`}}},

{id:'deuxgen',chap:'Thévenin',pts:2,gen(R,F){
  const E1=R.int(100,130),E2=R.int(100,140),R1=R.int(1,4),R2=R.int(1,4),Rc=R.int(3,12);
  const ET=(E1/R1+E2/R2)/(1/R1+1/R2),RT=par(R1,R2),ic=ET/(RT+Rc);
  return{v:{E1,E2,R1,R2,Rc},text:`<p>Deux générateurs {E₁ = ${E1} V ; R₁ = ${R1} Ω} et {E₂ = ${E2} V ; R₂ = ${R2} Ω} sont en parallèle (même sens) et alimentent R<sub>C</sub> = ${Rc} Ω. Par Thévenin vu de R<sub>C</sub> : E<sub>T</sub>, R<sub>T</sub>, puis le courant i<sub>C</sub> ?</p>`,
    fields:[{label:'E_T',unit:'V',ans:ET,d:2,tol:0,hint:H.pos},{label:'R_T',unit:'Ω',ans:RT,d:3,tol:0,hint:H.pos},{label:'i_C',unit:'A',ans:ic,d:2,tol:0,hint:H.pos}],
    sol:`R_C débranchée : un courant i = (E₁ − E₂)/(R₁ + R₂) circule dans la maille
E_T = (E₁/R₁ + E₂/R₂) / (1/R₁ + 1/R₂) = ${F.n(ET,2)} V
sources éteintes : R_T = R₁ ∥ R₂ = ${R1} × ${R2} / ${R1+R2} = ${F.n(RT,3)} Ω
i_C = E_T / (R_T + R_C) = ${F.n(ET,2)} / ${F.n(RT+Rc,3)} = ${F.n(ic,2)} A`}}},

{id:'superposition',chap:'Superposition',pts:2,gen(R,F){
  const E2=R.int(2,20),E3=R.int(5,40),R1=R.int(2,20),R2=R.int(1,10)/2,R3=R.int(2,12);
  const a=E2/(R2+par(R1,R3))*R3/(R1+R3),b=E3/(R3+par(R1,R2))*R2/(R1+R2);
  return{v:{E2,E3,R1,R2,R3},text:`<p>Circuit à 2 nœuds A et B et 3 branches : R₁ = ${R1} Ω seule ; (E₂ = ${E2} V, R₂ = ${F.n(R2)} Ω) ; (E₃ = ${E3} V, R₃ = ${R3} Ω), les deux sources ayant leur borne + du côté de A. Par superposition, courant dans R₁ (de A vers B) dû à E₂ seule, à E₃ seule, puis total ?</p>`,
    fields:[{label:'i_1E2',unit:'A',ans:a,d:4,tol:0,hint:H.pos},{label:'i_1E3',unit:'A',ans:b,d:4,tol:0,hint:H.pos},{label:'i_1',unit:'A',ans:a+b,d:3,tol:0,hint:H.pos}],
    sol:`E₂ seule (E₃ → fil) : R_éq = R₂ + R₁∥R₃ = ${F.n(R2)} + ${F.n(par(R1,R3),3)} = ${F.n(R2+par(R1,R3),3)} Ω
   courant de E₂ : ${E2} / ${F.n(R2+par(R1,R3),3)} = ${F.n(E2/(R2+par(R1,R3)),3)} A ;  i₁E₂ = × R₃/(R₁+R₃) = ${F.n(a,4)} A
E₃ seule (E₂ → fil) : R_éq = R₃ + R₁∥R₂ = ${F.n(R3+par(R1,R2),3)} Ω
   courant de E₃ : ${F.n(E3/(R3+par(R1,R2)),3)} A ;  i₁E₃ = × R₂/(R₁+R₂) = ${F.n(b,4)} A
i₁ = i₁E₂ + i₁E₃ = ${F.n(a+b,3)} A`}}},

/* ---------- Chapitre 4 : sinusoïdal monophasé ---------- */

{id:'efficace',chap:'Signal sinusoïdal',pts:2,gen(R,F){
  const Vm=R.pick([10,24,50,100,170,311,325,400,565]),f=R.pick([50,60,100,400,1000]);
  return{v:{Vm,f},text:`<p>v(t) = ${Vm} sin(ωt), de fréquence f = ${f} Hz. Valeur efficace, pulsation et période ?</p>`,
    fields:[{label:'V',unit:'V',ans:Vm/Math.SQRT2,d:2,tol:0,hint:H.pos},{label:'ω',unit:'rad/s',ans:2*Math.PI*f,d:1,tol:0,hint:'en rad·s⁻¹'},{label:'T',unit:'ms',ans:1000/f,d:3,tol:0,hint:'en millisecondes'}],
    sol:`V = V̂ / √2 = ${Vm} / √2 = ${F.n(Vm/Math.SQRT2,2)} V
ω = 2πf = 2π × ${f} = ${F.n(2*Math.PI*f,1)} rad·s⁻¹
T = 1/f = ${F.n(1000/f,3)} ms`}}},

{id:'complexe',chap:'Nombres complexes',pts:2,gen(R,F){
  const V1=R.pick([100,120,150,200,230]),V2=R.pick([100,120,150,200,230]),t2=R.pick([-120,-90,-60,-45,45,60,90,120]),op=R.pick(['+','−']);
  const a=V1+(op==='+'?1:-1)*V2*Math.cos(t2*deg),b=(op==='+'?1:-1)*V2*Math.sin(t2*deg),m=Math.hypot(a,b),ar=Math.atan2(b,a)/deg;
  return{v:{V1,V2,t2,op},text:`<p><u>V</u>₁ = [${V1} V ; 0°] et <u>V</u>₂ = [${V2} V ; ${t2}°]. Calcule <u>U</u> = <u>V</u>₁ ${op} <u>V</u>₂ : partie réelle, partie imaginaire, module et argument.</p>`,
    fields:[{label:'Re(U)',unit:'V',ans:a,d:2,tol:0.05,s:1,hint:H.sig},{label:'Im(U)',unit:'V',ans:b,d:2,tol:0.05,s:1,hint:H.sig},{label:'|U|',unit:'V',ans:m,d:2,tol:0,hint:H.pos},{label:'arg U',unit:'°',ans:ar,type:'angle',d:1,hint:'en degrés, avec son signe'}],
    sol:`V₂ = ${V2} cos(${t2}°) + j ${V2} sin(${t2}°) = ${F.n(V2*Math.cos(t2*deg),2)} + j(${F.n(V2*Math.sin(t2*deg),2)})
U = ${F.n(a,2)} + j(${F.n(b,2)})
|U| = √(${F.n(a,2)}² + ${F.n(b,2)}²) = ${F.n(m,2)} V
arg U = ${F.n(ar,1)}°${a<0?'  (partie réelle négative : arctan + 180°)':''}`}}},

{id:'bobine',chap:'Bobine',pts:2,gen(R,F){
  const L=R.pick([0.1,0.2,0.3,0.5,0.7,0.9,1.2]),U=R.pick([24,48,110,230]),f=R.pick([50,60]);
  const w=2*Math.PI*f,Z=L*w,I=U/Z;
  return{v:{L,U,f},text:`<p>Une inductance pure L = ${F.n(L)} H est alimentée sous U = ${U} V efficace, f = ${f} Hz. Module de l'impédance, courant efficace (et son argument, la tension étant à l'origine), puissance réactive ?</p>`,
    fields:[{label:'Z_L',unit:'Ω',ans:Z,d:2,tol:0,hint:H.pos},{label:'I_L',unit:'A',ans:I,d:4,tol:0,hint:H.pos},{label:'arg I_L',unit:'°',ans:-90,type:'angle',d:0,hint:'en degrés, avec son signe'},{label:'Q_L',unit:'VAR',ans:U*I,d:2,tol:0,s:1,hint:H.sig}],
    sol:`Z_L = jLω = [${F.n(L)} × ${F.n(w,2)} ; 90°] = [${F.n(Z,2)} Ω ; 90°]
I_L = U_L / Z_L = [${U} / ${F.n(Z,2)} ; 0 − 90°] = [${F.n(I,4)} A ; −90°]
Q_L = U_L I_L = ${U} × ${F.n(I,4)} = ${F.n(U*I,2)} VAR (&gt; 0 : la bobine consomme du réactif)`}}},

{id:'condensateur',chap:'Condensateur',pts:2,gen(R,F){
  const C=R.pick([2,4,5,10,12,20,47,100]),U=R.pick([24,48,110,230]),f=R.pick([50,60]);
  const w=2*Math.PI*f,Z=1/(C*1e-6*w),I=U/Z;
  return{v:{C,U,f},text:`<p>Un condensateur C = ${C} µF est alimenté sous U = ${U} V efficace, f = ${f} Hz. Module de l'impédance, courant efficace (et son argument, la tension étant à l'origine), puissance réactive ?</p>`,
    fields:[{label:'Z_C',unit:'Ω',ans:Z,d:2,tol:0,hint:H.pos},{label:'I_C',unit:'A',ans:I,d:4,tol:0,hint:H.pos},{label:'arg I_C',unit:'°',ans:90,type:'angle',d:0,hint:'en degrés, avec son signe'},{label:'Q_C',unit:'VAR',ans:-U*I,d:2,tol:0,s:1,hint:H.sig}],
    sol:`Z_C = 1/(jCω) = [1/(${C}×10⁻⁶ × ${F.n(w,2)}) ; −90°] = [${F.n(Z,2)} Ω ; −90°]
I_C = U_C / Z_C = [${U} / ${F.n(Z,2)} ; 0 + 90°] = [${F.n(I,4)} A ; 90°]
Q_C = −U_C I_C = ${F.n(-U*I,2)} VAR (&lt; 0 : le condensateur fournit du réactif)`,
    note:`<p class="mds-note">Piège : la puissance réactive d'un condensateur est négative.</p>`}}},

{id:'rlserie',chap:'Impédances',pts:2,gen(R,F){
  const Rr=R.int(5,40)*5,L=R.pick([0.1,0.2,0.3,0.5,0.7,1]),U=R.pick([110,230]),f=50;
  const X=L*2*Math.PI*f,Z=Math.hypot(Rr,X),ph=Math.atan2(X,Rr)/deg,I=U/Z;
  return{v:{R:Rr,L,U,f},text:`<p>Une résistance R = ${Rr} Ω et une inductance L = ${F.n(L)} H sont en série sous U = ${U} V, ${f} Hz. Module et argument de l'impédance, courant, tensions U<sub>R</sub> et U<sub>L</sub> ?</p>`,
    fields:[{label:'Z',unit:'Ω',ans:Z,d:2,tol:0,hint:H.pos},{label:'φ',unit:'°',ans:ph,type:'angle',d:1,hint:'arg Z, en degrés'},{label:'I',unit:'A',ans:I,d:4,tol:0,hint:H.pos},{label:'U_R',unit:'V',ans:Rr*I,d:2,tol:0,hint:H.pos},{label:'U_L',unit:'V',ans:X*I,d:2,tol:0,hint:H.pos}],
    sol:`Lω = ${F.n(L)} × 314,16 = ${F.n(X,2)} Ω
Z = R + jLω = ${Rr} + j ${F.n(X,2)} = [${F.n(Z,2)} Ω ; ${F.n(ph,1)}°]
I = U / Z = ${U} / ${F.n(Z,2)} = ${F.n(I,4)} A
U_R = R I = ${F.n(Rr*I,2)} V ;  U_L = Lω I = ${F.n(X*I,2)} V`,
    note:`<p class="mds-note">Piège : U<sub>R</sub> + U<sub>L</sub> ≠ U, les valeurs efficaces ne s'ajoutent pas (seulement les vecteurs).</p>`}}},

{id:'rlc',chap:'Impédances',pts:2,gen(R,F){
  const Rr=R.int(4,40)*10,L=R.pick([0.5,1,1.5,2]),C=R.pick([5,10,15,20,47]),U=230,w=2*Math.PI*50;
  const X=L*w-1/(C*1e-6*w),Z=Math.hypot(Rr,X),ph=Math.atan2(X,Rr)/deg,I=U/Z;
  return{v:{R:Rr,L,C},text:`<p>Un circuit RLC série (R = ${Rr} Ω, L = ${F.n(L)} H, C = ${C} µF) est alimenté sous E = 230 V, 50 Hz. Module et argument de Z<sub>s</sub>, puis courant efficace ?</p>`,
    fields:[{label:'Z_s',unit:'Ω',ans:Z,d:2,tol:0,hint:H.pos},{label:'φ',unit:'°',ans:ph,type:'angle',d:1,hint:'arg Z_s, en degrés, avec son signe'},{label:'I',unit:'A',ans:I,d:4,tol:0,hint:H.pos}],
    sol:`Lω = ${F.n(L*w,2)} Ω ;  1/(Cω) = ${F.n(1/(C*1e-6*w),2)} Ω
Z_s = R + j(Lω − 1/(Cω)) = ${Rr} + j(${F.n(X,2)})
|Z_s| = ${F.n(Z,2)} Ω ;  arg Z_s = arctan(${F.n(X,2)} / ${Rr}) = ${F.n(ph,1)}°
I = E / |Z_s| = 230 / ${F.n(Z,2)} = ${F.n(I,4)} A`,
    note:X<0?`<p class="mds-note">Ici Lω &lt; 1/(Cω) : le circuit est capacitif, φ est négatif.</p>`:''}}},

{id:'puissances',chap:'Puissances',pts:2,gen(R,F){
  const U=R.pick([110,230,400]),I=R.int(2,60)/2,c=R.int(50,98)/100;
  const S=U*I,P=S*c,Q=S*Math.sqrt(1-c*c);
  return{v:{U,I,c},text:`<p>Un récepteur inductif est alimenté sous U = ${U} V et absorbe I = ${F.n(I)} A avec un facteur de puissance cos φ = ${F.n(c)}. Puissances apparente, active et réactive ?</p>`,
    fields:[{label:'S',unit:'VA',ans:S,d:1,tol:0,hint:H.pos},{label:'P',unit:'W',ans:P,d:1,tol:0,hint:H.pos},{label:'Q',unit:'VAR',ans:Q,d:1,tol:0,s:1,hint:H.sig}],
    sol:`S = U I = ${U} × ${F.n(I)} = ${F.n(S,1)} VA
P = S cos φ = ${F.n(P,1)} W
Q = S sin φ = ${F.n(S,1)} × √(1 − ${F.n(c)}²) = ${F.n(Q,1)} VAR (inductif : Q &gt; 0)`}}},

{id:'boucherot',chap:'Puissances',pts:2,gen(R,F){
  const U=230,P1=R.int(5,40)*100,c1=R.int(60,90)/100,P2=R.int(5,40)*100,Q2=-R.int(2,30)*100;
  const Q1=P1*Math.tan(Math.acos(c1)),PT=P1+P2,QT=Q1+Q2,ST=Math.hypot(PT,QT);
  return{v:{U,P1,c1,P2,Q2},text:`<p>Sous U = 230 V, on alimente en parallèle un moteur (P₁ = ${P1} W, cos φ₁ = ${F.n(c1)}, inductif) et un récepteur (P₂ = ${P2} W, Q₂ = ${F.n(Q2)} VAR). Par la méthode de Boucherot : P<sub>T</sub>, Q<sub>T</sub>, S<sub>T</sub> et I<sub>T</sub> ?</p>`,
    fields:[{label:'P_T',unit:'W',ans:PT,d:1,tol:0,hint:H.pos},{label:'Q_T',unit:'VAR',ans:QT,d:1,tol:0.5,s:1,hint:H.sig},{label:'S_T',unit:'VA',ans:ST,d:1,tol:0,hint:H.pos},{label:'I_T',unit:'A',ans:ST/U,d:3,tol:0,hint:H.pos}],
    sol:`Q₁ = P₁ tan φ₁ = ${P1} × ${F.n(Math.tan(Math.acos(c1)),4)} = ${F.n(Q1,1)} VAR
P_T = P₁ + P₂ = ${PT} W
Q_T = Q₁ + Q₂ = ${F.n(Q1,1)} + (${F.n(Q2)}) = ${F.n(QT,1)} VAR
S_T = √(P_T² + Q_T²) = ${F.n(ST,1)} VA ;  I_T = S_T / U = ${F.n(ST/U,3)} A`,
    note:`<p class="mds-note">Piège : on n'additionne jamais les puissances apparentes S.</p>`}}},

{id:'releve',chap:'Facteur de puissance',pts:2,gen(R,F){
  const U=230,w=2*Math.PI*50,P=R.int(10,100)*100,c=R.int(55,78)/100,c2=R.pick([0.85,0.9,0.93,0.95]);
  const t1=Math.tan(Math.acos(c)),t2=Math.tan(Math.acos(c2)),C=P*(t1-t2)/(U*U*w);
  return{v:{P,c,c2},text:`<p>Une installation absorbe P = ${P} W sous U = 230 V, 50 Hz, avec cos φ = ${F.n(c)}. On veut relever le facteur de puissance à cos φ' = ${F.n(c2)} avec un condensateur en parallèle. Courant avant, capacité nécessaire et courant après ?</p>`,
    fields:[{label:'I',unit:'A',ans:P/(U*c),d:3,tol:0,hint:'avant le condensateur'},{label:'C',unit:'µF',ans:C*1e6,d:2,tol:0,hint:'en microfarads'},{label:"I'",unit:'A',ans:P/(U*c2),d:3,tol:0,hint:'après le condensateur'}],
    sol:`I = P / (U cos φ) = ${P} / (230 × ${F.n(c)}) = ${F.n(P/(U*c),3)} A
tan φ = ${F.n(t1,4)} ;  tan φ' = ${F.n(t2,4)}
C = P (tan φ − tan φ') / (U² ω) = ${P} × ${F.n(t1-t2,4)} / (230² × 314,16) = ${F.n(C*1e6,2)} µF
I' = P / (U cos φ') = ${F.n(P/(U*c2),3)} A`}}},

{id:'stockage',chap:'Condensateur',pts:2,gen(R,F){
  const typ=R.pick(['L','C']);
  if(typ==='L'){const L=R.pick([0.05,0.1,0.2,0.5,0.7,1]),i=R.int(1,20);const w=0.5*L*i*i;
    return{v:{typ,x:L,y:i},text:`<p>Une inductance L = ${F.n(L)} H est parcourue par un courant de ${i} A. Énergie stockée ?</p>`,
      fields:[{label:'w_L',unit:'J',ans:w,d:4,tol:0,hint:H.pos}],sol:`w_L = ½ L i² = 0,5 × ${F.n(L)} × ${i}² = ${F.n(w,4)} J`}}
  const C=R.pick([100,470,1000,2200,4700]),u=R.pick([12,24,48,63,100,400]);const w=0.5*C*1e-6*u*u;
  return{v:{typ,x:C,y:u},text:`<p>Un condensateur C = ${C} µF est chargé sous ${u} V. Énergie stockée ?</p>`,
    fields:[{label:'w_C',unit:'J',ans:w,d:4,tol:0,hint:H.pos}],sol:`w_C = ½ C u² = 0,5 × ${C}×10⁻⁶ × ${u}² = ${F.n(w,4)} J`}}},

/* ---------- Chapitre 5 : réseau triphasé (parties 5.1 à 5.3) ---------- */

{id:'fils',chap:'Structure',pts:1,gen(R,F){
  const k=R.int(0,T_FIL.length-1),[s,rep]=T_FIL[k],o=FILS.slice();
  return{v:{k},text:`<p>${s}</p>`,
    fields:[{label:'fil',type:'choix',options:o,ans:o.indexOf(rep)}],
    sol:`Réseau triphasé : 3 fils de phase (L1, L2, L3) et le neutre N alimentent les récepteurs ; le PE, relié à la terre, protège les personnes
réponse : ${rep}`}}},

{id:'vsimple',chap:'Tensions simples',pts:3,gen(R,F){
  const V=R.pick([127,220,230,240]),th=R.int(0,23)*15;
  const z=x=>Math.abs(x)<1e-9?0:x;
  const v=[0,120,240].map(d=>z(V*Math.SQRT2*Math.sin((th-d)*deg)));
  return{v:{V,th},text:`<p>Réseau triphasé de tension simple efficace V = ${V} V. Valeurs instantanées v<sub>1</sub>, v<sub>2</sub>, v<sub>3</sub> pour θ = ωt = ${th}° ?</p>`,
    fields:[{label:'v_1',unit:'V',ans:v[0],d:1,tol:0.6,hint:H.sig},{label:'v_2',unit:'V',ans:v[1],d:1,tol:0.6,hint:H.sig},{label:'v_3',unit:'V',ans:v[2],d:1,tol:0.6,hint:H.sig}],
    sol:`V √2 = ${V} × √2 = ${F.n(V*Math.SQRT2,1)} V
v_1 = V √2 sin ωt = ${F.n(V*Math.SQRT2,1)} × sin ${th}° = ${F.n(v[0],1)} V
v_2 = V √2 sin(ωt − 2π/3) = ${F.n(V*Math.SQRT2,1)} × sin(${F.n(th-120)}°) = ${F.n(v[1],1)} V
v_3 = V √2 sin(ωt − 4π/3) = ${F.n(V*Math.SQRT2,1)} × sin(${F.n(th-240)}°) = ${F.n(v[2],1)} V
contrôle : v_1 + v_2 + v_3 = 0`,
    note:`<p class="mds-note">Piège : V est la valeur efficace ; l'amplitude est V√2.</p>`}}},

{id:'vcomplexe',chap:'Tensions simples',pts:2,gen(R,F){
  const V=R.pick([127,220,230,240,400]),k=R.pick([2,3]),a=-120*(k-1);
  const z=x=>Math.abs(x)<1e-9?0:x,re=z(V*Math.cos(a*deg)),im=z(V*Math.sin(a*deg));
  return{v:{V,k},text:`<p>Tension simple efficace V = ${V} V. Écris <u>V</u><sub>${k}</sub> = [V ; ${F.n(a)}°] sous forme algébrique a + jb.</p>`,
    fields:[{label:'a',unit:'V',ans:re,d:1,tol:0.3,hint:'partie réelle, avec son signe'},{label:'b',unit:'V',ans:im,d:1,tol:0.3,hint:'partie imaginaire, avec son signe'}],
    sol:`<u>V</u>${k===2?'₂':'₃'} = [${V} ; ${F.n(a)}°] = ${V} cos(${F.n(a)}°) + j ${V} sin(${F.n(a)}°)
= ${F.n(re,1)} ${im<0?'−':'+'} j ${F.n(Math.abs(im),1)} V`,
    note:`<p class="mds-note">Rappel : −240° et +120° désignent le même angle.</p>`}}},

{id:'ucompose',chap:'Tensions composées',pts:3,gen(R,F){
  const V=R.pick([127,230,240]),th=R.int(0,23)*15,U=Math.sqrt(3)*V,A=U*Math.SQRT2;
  const z=x=>Math.abs(x)<1e-9?0:x;
  const u=[[30,'u_13','π/6'],[150,'u_21','5π/6'],[270,'u_32','3π/2']].map(([d,n,t])=>[z(A*Math.sin((th-d)*deg)),n,t,d]);
  return{v:{V,th},text:`<p>Réseau de tension simple V = ${V} V, donc de tension composée U = √3 V = ${F.n(U,1)} V. Valeurs de u<sub>13</sub>, u<sub>21</sub> et u<sub>32</sub> pour θ = ωt = ${th}° ?</p>`,
    fields:u.map(([x,n])=>({label:n,unit:'V',ans:x,d:1,tol:0.8,hint:H.sig})),
    sol:`U √2 = ${F.n(U,1)} × √2 = ${F.n(A,1)} V
`+u.map(([x,n,t,d])=>`${n} = U √2 sin(ωt − ${t}) = ${F.n(A,1)} × sin(${F.n(th-d)}°) = ${F.n(x,1)} V`).join('\n')+`
contrôle : u_13 = v_1 − v_3, u_21 = v_2 − v_1, u_32 = v_3 − v_2`}}},

{id:'ueff',chap:'Tensions composées',pts:2,gen(R,F){
  const V=R.pick([127,220,230,240,400]),U=Math.sqrt(3)*V;
  return{v:{V},text:`<p>Tension simple efficace V = ${V} V. En calculant <u>U</u><sub>13</sub> = <u>V</u><sub>1</sub> − <u>V</u><sub>3</sub>, trouve la valeur efficace U d'une tension composée, puis son amplitude.</p>`,
    fields:[{label:'U',unit:'V',ans:U,d:1,hint:H.pos},{label:'U√2',unit:'V',ans:U*Math.SQRT2,d:1,hint:'amplitude'}],
    sol:`<u>V</u>₁ − <u>V</u>₃ = V [(1 − cos 120°) − j sin 120°] = V (3/2 − j √3/2)
module : V √(9/4 + 3/4) = √3 V
U = √3 × ${V} = ${F.n(U,1)} V ;  amplitude U √2 = ${F.n(U*Math.SQRT2,1)} V`}}},

{id:'dephasage',chap:'Tensions composées',pts:2,gen(R,F){
  const T=[['v_1',0],['v_2',-120],['v_3',-240],['u_13',-30],['u_21',-150],['u_32',-270]];
  const ij=R.shuffle([0,1,2,3,4,5]).slice(0,2),A=T[ij[0]],B=T[ij[1]];
  let d=((A[1]-B[1])%360+540)%360-180;
  return{v:{a:A[0],b:B[0]},text:`<p>Déphasage de ${A[0]} par rapport à ${B[0]} ? (positif si ${A[0]} est en avance)</p>`,
    fields:[{label:'déphasage',unit:'°',ans:d,type:'angle',d:0,hint:'en degrés, entre −180 et 180'}],
    sol:`phase de ${A[0]} : ${F.n(A[1])}° ;  phase de ${B[0]} : ${F.n(B[1])}°
déphasage = ${F.n(A[1])}° − (${F.n(B[1])}°) = ${F.n(A[1]-B[1])}°  →  ${F.n(d)}° (ramené entre −180° et 180°)
${d<0?A[0]+' est en retard sur '+B[0]:A[0]+' est en avance sur '+B[0]}`}}}


];
})();
