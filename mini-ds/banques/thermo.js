/* Banque du mini-DS Thermodynamique 1 (chapitres 1 à 5), alignée sur les pages /cours/thermo/… :
   mêmes chapitres, mêmes notations (profil « thermo » de notation.js : indices écrits avec _, sans vecteurs).
   Les données des tables sont écrites dans l'énoncé : aucune question ne demande d'ouvrir les tables.
   Format d'un générateur : voir ds/statique/mini-ds/banque.js. Vérification : node outils/verif-minids.js */
(function(){
const g=9.81;
const H={pos:'un nombre positif',sig:'avec son signe (+ reçu / fourni par le système, selon la convention du cours)',pct:'en %, sans le signe %',x:'entre 0 et 1',coef:'un nombre sans unité'};

window.BANQUE_THERMO=[

/* ---------- Chapitre 1 : concepts et définitions ---------- */

{id:'colonne',chap:'Pression',pts:2,gen(R,F){
  const liq=R.pick([['mercure',13590],['eau',1000],['huile',850],['glycérine',1260]]),p=R.int(90,103);
  const L=p*1000/(liq[1]*g);const mm=liq[0]==='mercure';
  return{v:{rho:liq[1],p},text:`<p>Un baromètre contient du ${liq[0]} (ρ = ${F.n(liq[1])} kg/m³). La pression atmosphérique vaut ${p} kPa, g = 9,81 m/s². Quelle est la hauteur de la colonne ?</p>`,
    fields:[{label:'L',unit:mm?'mm':'m',ans:mm?L*1000:L,d:mm?1:3,hint:mm?'en millimètres (mmHg)':'en mètres'}],
    sol:`En haut du tube : vide. Équilibre : p_atm = ρ g L
L = p_atm / (ρ g) = ${p*1000} / (${F.n(liq[1])} × 9,81) = ${F.n(L,4)} m${mm?` = ${F.n(L*1000,1)} mmHg`:''}`,
    note:`<p class="mds-note">Piège : la pression en Pa (1 kPa = 1000 Pa), pas en kPa ni en bar.</p>`}}},

{id:'piston',chap:'Pression',pts:2,gen(R,F){
  const m=R.int(5,60)*5,D=R.pick([5,8,10,12,15,20]),pa=R.pick([1,1.01,1.013]);
  const A=Math.PI*(D/100)**2/4,p=pa*1e5+m*g/A;
  return{v:{m,D,pa},text:`<p>Un piston de ${m} kg et de ${D} cm de diamètre ferme un cylindre vertical et glisse sans frottement. p<sub>atm</sub> = ${F.n(pa)} bar, g = 9,81 m/s². Pression du gaz à l'équilibre ?</p>`,
    fields:[{label:'p',unit:'bar',ans:p/1e5,d:3,hint:'en bar, pression absolue'}],
    sol:`A = π D²/4 = π × ${F.n(D/100)}² / 4 = ${F.n(A,6)} m²
Équilibre du piston : p A = p_atm A + m g
p = ${F.n(pa*1e5)} + ${m} × 9,81 / ${F.n(A,6)} = ${F.n(p,0)} Pa = ${F.n(p/1e5,3)} bar`}}},

{id:'manometre',chap:'Pression',pts:2,gen(R,F){
  const pa=R.pick([1,1.01,1.013]),rel=R.rnd()<.5,val=rel?R.int(2,60)/10:R.int(5,90)/100;
  const pabs=rel?pa+val:pa-val;
  return{v:{pa,rel,val},text:`<p>${rel?`Un manomètre relié à un réservoir indique une pression relative de ${F.n(val)} bar`:`Un vacuomètre relié à un réservoir indique une pression du vide de ${F.n(val)} bar`}. p<sub>atm</sub> = ${F.n(pa)} bar. Pression absolue dans le réservoir, en kPa ?</p>`,
    fields:[{label:'p(absolue)',unit:'kPa',ans:pabs*100,d:1,hint:'en kPa (1 bar = 100 kPa)'}],
    sol:rel?`p(relative) = p(absolue) − p_atm   →   p(absolue) = ${F.n(val)} + ${F.n(pa)} = ${F.n(pabs,3)} bar = ${F.n(pabs*100,1)} kPa`
           :`p(vide) = p_atm − p(absolue)   →   p(absolue) = ${F.n(pa)} − ${F.n(val)} = ${F.n(pabs,3)} bar = ${F.n(pabs*100,1)} kPa`}}},

{id:'hydraulique',chap:'Pression',pts:2,gen(R,F){
  const M=R.int(8,40)*100,m=R.int(5,40),D1=R.pick([10,15,20,25,30,40]);
  const D2=D1*Math.sqrt(m/M);
  return{v:{M,m,D1},text:`<p>Élévateur hydraulique : une charge de ${M} kg repose sur un piston de ${D1} cm de diamètre. On veut la soulever en posant ${m} kg sur l'autre piston. Diamètre de ce piston ? (p<sub>atm</sub> agit des deux côtés.)</p>`,
    fields:[{label:'D',unit:'cm',ans:D2,d:2,hint:'en centimètres'}],
    sol:`Même pression dans tout le liquide : M g / A_1 = m g / A_2, avec A = π D²/4
D = D_1 √(m / M) = ${D1} × √(${m} / ${M}) = ${F.n(D2,2)} cm`}}},

/* ---------- Chapitre 2 : énergie et premier principe ---------- */

{id:'bilan',chap:'Bilan d\'énergie',pts:3,gen(R,F){
  const cas=R.int(0,3),m=R.int(1,10);let Q,W,txt;
  if(cas===0){Q=R.int(10,90);W=R.int(5,60);txt=`reçoit ${Q} kJ de chaleur et fournit ${W} kJ de travail`}
  else if(cas===1){Q=-R.int(5,40);W=-R.int(10,80);txt=`est comprimé : il reçoit ${-W} kJ de travail et cède ${-Q} kJ de chaleur`}
  else if(cas===2){Q=0;W=-R.int(10,90);txt=`est enfermé dans un réservoir rigide adiabatique et brassé par une hélice qui lui transfère ${-W} kJ`}
  else{Q=-R.int(5,60);W=R.int(5,60);txt=`se détend en fournissant ${W} kJ de travail et cède ${-Q} kJ de chaleur`}
  const dU=Q-W;
  return{v:{Q,W,m},text:`<p>${m} kg de gaz ${txt} (pas de variation d'énergie cinétique ni potentielle). Donne Q, W, ΔU et Δu.</p>`,
    fields:[{label:'Q',unit:'kJ',ans:Q,d:0,tol:0.01,hint:'reçue : +, cédée : −'},{label:'W',unit:'kJ',ans:W,d:0,tol:0.01,hint:'fourni par le gaz : +, reçu : −'},{label:'ΔU',unit:'kJ',ans:dU,d:1,hint:'avec son signe'},{label:'Δu',unit:'kJ/kg',ans:dU/m,d:2,hint:'ΔU / m, avec son signe'}],
    sol:`Conventions : Q &gt; 0 reçue par le système ; W &gt; 0 fourni par le système
Q = ${F.n(Q)} kJ      W = ${F.n(W)} kJ
ΔU = Q − W = ${F.n(Q)} − (${F.n(W)}) = ${F.n(dU)} kJ
Δu = ΔU / m = ${F.n(dU)} / ${m} = ${F.n(dU/m,2)} kJ/kg`,
    note:`<p class="mds-note">Piège : les deux conventions sont opposées. Travail reçu (compression, hélice) : W &lt; 0. Chaleur cédée : Q &lt; 0.</p>`}}},

{id:'energies',chap:'Énergie',pts:2,gen(R,F){
  const m=R.int(5,30)*50,v1=R.int(0,6)*18,v2=v1+R.int(1,6)*18,dz=R.int(2,40);
  const a=v1/3.6,b=v2/3.6,Ec=0.5*m*(b*b-a*a)/1000,Ep=m*g*dz/1000;
  return{v:{m,v1,v2,dz},text:`<p>Un véhicule de ${m} kg passe de ${v1} km/h à ${v2} km/h en montant de ${dz} m (g = 9,81 m/s²). ΔE<sub>c</sub> et ΔE<sub>p</sub> ?</p>`,
    fields:[{label:'ΔE_c',unit:'kJ',ans:Ec,d:2,hint:'en kJ'},{label:'ΔE_p',unit:'kJ',ans:Ep,d:2,hint:'en kJ'}],
    sol:`V_1 = ${v1}/3,6 = ${F.n(a,2)} m/s      V_2 = ${v2}/3,6 = ${F.n(b,2)} m/s
ΔE_c = ½ m (V_2² − V_1²) = 0,5 × ${m} × (${F.n(b*b,2)} − ${F.n(a*a,2)}) = ${F.n(Ec*1000,0)} J = ${F.n(Ec,2)} kJ
ΔE_p = m g (z_2 − z_1) = ${m} × 9,81 × ${dz} = ${F.n(Ep*1000,0)} J = ${F.n(Ep,2)} kJ`,
    note:`<p class="mds-note">Piège : les km/h en m/s (÷ 3,6) avant de mettre au carré.</p>`}}},

{id:'polytropique',chap:'Travail de détente',pts:3,gen(R,F){
  const p1=R.int(10,60)/10,V1=R.int(2,10)/100,k=R.pick([1.5,2,2.5,3]),V2=V1*k,n=R.pick([0,1,1.2,1.3,1.4,1.5,2]);
  const P1=p1*1e5,P2=P1*Math.pow(V1/V2,n);
  const W=n===0?P1*(V2-V1):n===1?P1*V1*Math.log(V2/V1):(P2*V2-P1*V1)/(1-n);
  const how=n===0?`n = 0 (p constante) : W = p (V_2 − V_1) = ${F.n(P1)} × ${F.n(V2-V1,3)}`:n===1?`n = 1 : W = p_1 V_1 ln(V_2/V_1) = ${F.n(P1*V1)} × ln ${F.n(k)}`:`p_2 = p_1 (V_1/V_2)ⁿ = ${F.n(p1)} × (1/${F.n(k)})^${F.n(n)} = ${F.n(P2/1e5,4)} bar
W = (p_2 V_2 − p_1 V_1)/(1 − n) = (${F.n(P2*V2,1)} − ${F.n(P1*V1)}) / ${F.n(1-n)}`;
  return{v:{p1,V1,V2,n},text:`<p>Un gaz se détend dans un piston-cylindre selon p V<sup>n</sup> = constante, avec n = ${F.n(n)}, de p<sub>1</sub> = ${F.n(p1)} bar et V<sub>1</sub> = ${F.n(V1)} m³ jusqu'à V<sub>2</sub> = ${F.n(V2,3)} m³. Travail fourni par le gaz ?</p>`,
    fields:[{label:'W',unit:'kJ',ans:W/1000,d:2,hint:'en kJ (positif : détente)'}],
    sol:`${how} = ${F.n(W,0)} J = ${F.n(W/1000,2)} kJ`,
    note:`<p class="mds-note">Piège : la formule en ln est seulement pour n = 1, et les pressions en Pa (× 10⁵) pour avoir des J.</p>`}}},

{id:'polyq',chap:'Travail de détente',pts:3,gen(R,F){
  const m=R.int(2,10)/10,p1=R.int(20,60)/10,V1=R.int(5,15)/100,V2=V1*2,n=R.pick([1.2,1.3,1.4,1.5]),du=-R.int(10,70);
  const P1=p1*1e5,P2=P1*Math.pow(0.5,n),W=(P2*V2-P1*V1)/(1-n)/1000,Q=m*du+W;
  return{v:{m,p1,V1,V2,n,du},text:`<p>${F.n(m)} kg de gaz se détendent selon p V<sup>${F.n(n)}</sup> = constante, de p<sub>1</sub> = ${F.n(p1)} bar, V<sub>1</sub> = ${F.n(V1)} m³ à V<sub>2</sub> = ${F.n(V2)} m³. u<sub>2</sub> − u<sub>1</sub> = ${F.n(du)} kJ/kg, pas de variation d'énergie cinétique ni potentielle. Travail et chaleur ?</p>`,
    fields:[{label:'W',unit:'kJ',ans:W,d:2,hint:'en kJ'},{label:'Q',unit:'kJ',ans:Q,d:2,hint:'avec son signe : + reçue, − cédée'}],
    sol:`p_2 = ${F.n(p1)} × (1/2)^${F.n(n)} = ${F.n(P2/1e5,4)} bar
W = (p_2 V_2 − p_1 V_1)/(1 − n) = (${F.n(P2*V2,1)} − ${F.n(P1*V1)}) / ${F.n(1-n)} = ${F.n(W,2)} kJ
Bilan : ΔU = Q − W   →   Q = m (u_2 − u_1) + W = ${F.n(m)} × (${F.n(du)}) + ${F.n(W,2)} = ${F.n(Q,2)} kJ`}}},

{id:'conduction',chap:'Transferts de chaleur',pts:2,gen(R,F){
  const k=R.pick([0.04,0.8,1.4,1.7,0.17,45]),L=R.pick([5,10,15,20,25,30]),A=R.int(2,25),T1=R.int(15,25),T2=R.int(-10,10);
  const Q=k*A*(T1-T2)/(L/100);
  return{v:{k,L,A,T1,T2},text:`<p>Un mur de conductivité κ = ${F.n(k)} W/(m·K), d'épaisseur ${L} cm et d'aire ${A} m² a une face à ${T1} °C et l'autre à ${F.n(T2)} °C, en régime permanent. Flux thermique qui le traverse ?</p>`,
    fields:[{label:'Q̇_x',unit:'W',ans:Q,d:1,hint:'intensité du flux, positive'}],
    sol:`Loi de Fourier, mur plan : Q̇_x = −κ A (T_2 − T_1)/L
Q̇_x = ${F.n(k)} × ${A} × (${T1} − (${F.n(T2)})) / ${F.n(L/100)} = ${F.n(Q,1)} W   (de la face chaude vers la face froide)`,
    note:`<p class="mds-note">Ici une différence de températures : °C ou K, c'est pareil. L'épaisseur en mètres.</p>`}}},

{id:'convection',chap:'Transferts de chaleur',pts:2,gen(R,F){
  const P=R.int(5,60)/10,c=R.int(3,10),A=c*c*1e-6*R.pick([1,4,25]),h=R.pick([50,100,150,200,250]),Tf=R.int(15,30);
  const Tb=Tf+P/(h*A);
  return{v:{P,A,h,Tf},text:`<p>Un composant dissipe ${F.n(P)} W en régime permanent, uniquement par convection, par une surface de ${F.n(A*1e4,4)} cm². L'air est à ${Tf} °C, h = ${h} W/(m²·K). Température de la surface ?</p>`,
    fields:[{label:'T_b',unit:'°C',ans:Tb,d:1,hint:'en °C'}],
    sol:`Régime permanent : Φ_conv = ${F.n(P)} W.   A = ${F.n(A,6)} m²
Φ_conv = h A (T_b − T_f)   →   T_b = T_f + Φ_conv/(h A) = ${Tf} + ${F.n(P)}/(${h} × ${F.n(A,6)}) = ${F.n(Tb,1)} °C`,
    note:`<p class="mds-note">Piège : 1 cm² = 10⁻⁴ m² et 1 mm² = 10⁻⁶ m².</p>`}}},

{id:'rayonnement',chap:'Transferts de chaleur',pts:2,gen(R,F){
  const A=R.int(1,20)/10,e=R.int(5,95)/100,Tb=R.int(5,40)*10,Ts=R.int(0,30);
  const Phi=e*5.67e-8*A*((Tb+273.15)**4-(Ts+273.15)**4);
  return{v:{A,e,Tb,Ts},text:`<p>Une surface de ${F.n(A)} m², d'émissivité ${F.n(e)}, à ${Tb} °C, est entourée d'une enceinte beaucoup plus grande à ${Ts} °C. Flux net rayonné ? (σ = 5,67×10⁻⁸ W/(m²·K⁴))</p>`,
    fields:[{label:'Φ',unit:'W',ans:Phi,d:1,hint:'en W'}],
    sol:`T en kelvins : T_b = ${F.n(Tb+273.15,2)} K, T_s = ${F.n(Ts+273.15,2)} K
Φ = ε σ A (T_b⁴ − T_s⁴) = ${F.n(e)} × 5,67×10⁻⁸ × ${F.n(A)} × (${F.n((Tb+273.15)**4,0)} − ${F.n((Ts+273.15)**4,0)}) = ${F.n(Phi,1)} W`,
    note:`<p class="mds-note">Piège des kelvins : avec des °C, le résultat serait complètement faux (T est à la puissance 4).</p>`}}},

{id:'cycles',chap:'Cycles',pts:3,gen(R,F){
  const type=R.int(0,2),Qa=R.int(10,90)*10,Qb=R.int(10,90)*10;
  let Qin,Qout,W,perf,nom,lab,txt;
  if(type===0){Qin=Math.max(Qa,Qb)+100;Qout=Math.min(Qa,Qb);W=Qin-Qout;perf=W/Qin*100;nom='moteur';lab='η';txt=`Un moteur reçoit ${Qin} kJ par cycle de la source chaude et rejette ${Qout} kJ à la source froide.`}
  else if(type===1){Qout=Math.max(Qa,Qb)+100;Qin=Math.min(Qa,Qb);W=Qout-Qin;perf=Qin/W;nom='réfrigérateur';lab='β';txt=`Un réfrigérateur prélève ${Qin} kJ par cycle au compartiment froid et rejette ${Qout} kJ dans la cuisine.`}
  else{Qout=Math.max(Qa,Qb)+100;Qin=Math.min(Qa,Qb);W=Qout-Qin;perf=Qout/W;nom='pompe à chaleur';lab='γ';txt=`Une pompe à chaleur cède ${Qout} kJ par cycle à la maison et prélève ${Qin} kJ à l'air extérieur.`}
  return{v:{type,Qin,Qout},text:`<p>${txt} Donne le travail net du cycle et le ${type===0?'rendement thermique':'coefficient de performance'}.</p>`,
    fields:[{label:'W_cycle',unit:'kJ',ans:W,d:0,tol:0.01,hint:'positif (dans le sens de la flèche)'},{label:lab,unit:type===0?'%':'',ans:perf,d:2,hint:type===0?H.pct:H.coef}],
    sol:type===0?`Moteur : W_cycle = Q_in − Q_out = ${Qin} − ${Qout} = ${W} kJ
η = W_cycle / Q_in = ${W}/${Qin} = ${F.n(perf,2)} %`
      :`${nom} : W_cycle = Q_out − Q_in = ${Qout} − ${Qin} = ${W} kJ
${type===1?`β = Q_in / W_cycle = ${Qin}/${W}`:`γ = Q_out / W_cycle = ${Qout}/${W}`} = ${F.n(perf,2)}`,
    note:`<p class="mds-note">Ce qu'on veut ÷ ce qu'on paie. Moteur : W/Q<sub>in</sub> ; frigo : Q<sub>in</sub>/W ; pompe à chaleur : Q<sub>out</sub>/W.</p>`}}},

/* ---------- Chapitre 3 : propriétés ---------- */

{id:'titre',chap:'Mélange diphasique',pts:3,gen(R,F){
  const S=R.pick([[80,0.0010291,3.407,334.86,2482.2],[100,0.0010435,1.673,418.94,2506.5],[150,0.0010905,0.3928,631.68,2559.5],[170,0.0011143,0.2428,718.33,2576.5],[45,0.0010099,15.258,188.44,2436.8]]);
  const [T,vf,vg,uf,ug]=S;const x=R.int(5,95)/100;const v=Number((vf+x*(vg-vf)).toPrecision(4));const xx=(v-vf)/(vg-vf),u=uf+xx*(ug-uf);
  return{v:{vf,vg,uf,ug,v},text:`<p>De l'eau est à ${T} °C avec v = ${F.n(v)} m³/kg. La table A-2 donne à ${T} °C : v<sub>f</sub> = ${F.n(vf)} m³/kg, v<sub>g</sub> = ${F.n(vg)} m³/kg, u<sub>f</sub> = ${F.n(uf)} kJ/kg, u<sub>g</sub> = ${F.n(ug)} kJ/kg. Titre en vapeur et énergie interne massique ?</p>`,
    fields:[{label:'x',unit:'',ans:xx,d:4,tol:0.002,hint:H.x},{label:'u',unit:'kJ/kg',ans:u,d:1,hint:'en kJ/kg'}],
    sol:`v_f &lt; v &lt; v_g : c'est un mélange diphasique
x = (v − v_f)/(v_g − v_f) = (${F.n(v)} − ${F.n(vf)})/(${F.n(vg)} − ${F.n(vf)}) = ${F.n(xx,4)}
u = u_f + x (u_g − u_f) = ${F.n(uf)} + ${F.n(xx,4)} × (${F.n(ug)} − ${F.n(uf)}) = ${F.n(u,1)} kJ/kg`}}},

{id:'etat',chap:'Trouver l\'état',pts:2,gen(R,F){
  const S=R.pick([[80,0.0010291,3.407],[100,0.0010435,1.673],[150,0.0010905,0.3928],[170,0.0011143,0.2428]]);const [T,vf,vg]=S;
  const k=R.int(0,2);const v=k===0?Number((vf*R.pick([0.97,0.98,0.99])).toPrecision(5)):k===1?Number((vf+R.int(10,90)/100*(vg-vf)).toPrecision(4)):Number((vg*R.pick([1.2,1.5,2])).toPrecision(4));
  const code=v<vf?1:v>vg?3:2;
  return{v:{vf,vg,v},text:`<p>Eau à ${T} °C avec v = ${F.n(v)} m³/kg. Table A-2 à ${T} °C : v<sub>f</sub> = ${F.n(vf)}, v<sub>g</sub> = ${F.n(vg)} m³/kg. Quel est l'état ? Tape <b>1</b> pour liquide comprimé, <b>2</b> pour mélange diphasique, <b>3</b> pour vapeur surchauffée.</p>`,
    fields:[{label:'état',unit:'',ans:code,d:0,tol:0.01,hint:'1, 2 ou 3'}],
    sol:code===1?`v = ${F.n(v)} &lt; v_f = ${F.n(vf)}   →   liquide comprimé (1)`:code===2?`v_f = ${F.n(vf)} &lt; v = ${F.n(v)} &lt; v_g = ${F.n(vg)}   →   mélange diphasique (2)`:`v = ${F.n(v)} &gt; v_g = ${F.n(vg)}   →   vapeur surchauffée (3)`}}},

{id:'interpolation',chap:'Tables',pts:2,gen(R,F){
  const T1=R.pick([200,240,280,320,360]),T2=T1+40,Tq=T1+R.int(1,39);const y1=R.int(2000,3000)/10000,y2=y1+R.int(150,300)/10000;
  const y=y1+(y2-y1)*(Tq-T1)/(T2-T1);
  return{v:{T1,T2,Tq,y1,y2},text:`<p>Table de vapeur surchauffée, à pression fixée : v = ${F.n(y1)} m³/kg à ${T1} °C et v = ${F.n(y2)} m³/kg à ${T2} °C. Volume spécifique à ${Tq} °C par interpolation linéaire ?</p>`,
    fields:[{label:'v',unit:'m³/kg',ans:y,d:4,tol:0.0002,hint:'4 décimales'}],
    sol:`(v − ${F.n(y1)}) / (${Tq} − ${T1}) = (${F.n(y2)} − ${F.n(y1)}) / (${T2} − ${T1})
v = ${F.n(y1)} + ${F.n(y2-y1)} × ${Tq-T1}/${T2-T1} = ${F.n(y,4)} m³/kg`}}},

{id:'gazparfait',chap:'Gaz parfait',pts:2,gen(R,F){
  const gaz=R.pick([['air',28.97],['azote N₂',28.01],['oxygène O₂',32],['CO₂',44.01],['hélium',4.003]]),m=R.int(1,20)/2,T=R.int(280,600),p=R.int(10,100)/10;
  const r=8.314/gaz[1],V=m*r*T/(p*100);
  return{v:{M:gaz[1],m,T,p},text:`<p>${F.n(m)} kg de ${gaz[0]} (M = ${F.n(gaz[1])} g/mol) sont à ${T} K et ${F.n(p)} bar. Modèle du gaz parfait : constante r du gaz et volume occupé ?</p>`,
    fields:[{label:'r',unit:'kJ/(kg·K)',ans:r,d:4,tol:0.0005,hint:'en kJ/(kg·K)'},{label:'V',unit:'m³',ans:V,d:3,hint:'en m³'}],
    sol:`r = R/M = 8,314 / ${F.n(gaz[1])} = ${F.n(r,4)} kJ/(kg·K)
p V = m r T   →   V = m r T / p = ${F.n(m)} × ${F.n(r,4)} × ${T} / ${F.n(p*100)} = ${F.n(V,3)} m³`,
    note:`<p class="mds-note">Piège : avec r en kJ/(kg·K), la pression en kPa (1 bar = 100 kPa) ; T en kelvins.</p>`}}},

{id:'chauffage',chap:'Gaz parfait',pts:2,gen(R,F){
  const gaz=R.pick([['air',0.718],['azote N₂',0.743],['CO',0.744],['oxygène O₂',0.658]]),m=R.int(1,20)/2,T1=R.int(15,40),T2=T1+R.int(10,150);
  const Q=m*gaz[1]*(T2-T1);
  return{v:{cv:gaz[1],m,T1,T2},text:`<p>Un réservoir rigide contient ${F.n(m)} kg de ${gaz[0]} (gaz parfait, c<sub>v</sub> = ${F.n(gaz[1])} kJ/(kg·K) constant), chauffé de ${T1} °C à ${T2} °C. Chaleur reçue ?</p>`,
    fields:[{label:'Q',unit:'kJ',ans:Q,d:1,hint:'en kJ'}],
    sol:`Réservoir rigide : W = 0 ; bilan : Q = ΔU = m (u_2 − u_1)
u(T_2) − u(T_1) = c_v [T_2 − T_1]   (une différence : °C ou K, pareil)
Q = ${F.n(m)} × ${F.n(gaz[1])} × ${T2-T1} = ${F.n(Q,1)} kJ`}}},

/* ---------- Chapitre 4 : volume de contrôle ---------- */

{id:'debit',chap:'Bilan de masse',pts:2,gen(R,F){
  const A=R.int(5,60),V=R.int(2,40)/2,v=R.pick([0.001,0.00101,0.0012,0.85,0.25,1.7]);
  const qm=A*1e-4*V/v;
  return{v:{A,V,v},text:`<p>Un fluide de volume massique v = ${F.n(v)} m³/kg s'écoule à ${F.n(V)} m/s dans une conduite de section ${A} cm². Débit massique ?</p>`,
    fields:[{label:'q_m',unit:'kg/s',ans:qm,d:3,hint:'en kg/s'}],
    sol:`q_m = A V / v = ${F.n(A*1e-4,4)} × ${F.n(V)} / ${F.n(v)} = ${F.n(qm,3)} kg/s`,
    note:`<p class="mds-note">Piège : 1 cm² = 10⁻⁴ m².</p>`}}},

{id:'tuyere',chap:'Appareils',pts:2,gen(R,F){
  const he=R.int(2900,3300),dh=R.int(50,300),Ve=R.int(5,60);
  const Vs=Math.sqrt(Ve*Ve+2*dh*1000);
  return{v:{he,hs:he-dh,Ve},text:`<p>Tuyère en régime permanent, sans échange de chaleur ni variation d'altitude : h<sub>e</sub> = ${he} kJ/kg, V<sub>e</sub> = ${Ve} m/s ; h<sub>s</sub> = ${he-dh} kJ/kg. Vitesse de sortie ?</p>`,
    fields:[{label:'V_s',unit:'m/s',ans:Vs,d:1,hint:'en m/s'}],
    sol:`Eq. 4.21 : 0 = h_e − h_s + (V_e² − V_s²)/2   (h en J/kg !)
V_s = √(V_e² + 2 (h_e − h_s)) = √(${Ve}² + 2 × ${dh*1000}) = ${F.n(Vs,1)} m/s`,
    note:`<p class="mds-note">Piège : h_e − h_s = ${dh} kJ/kg = ${dh*1000} J/kg avant de l'ajouter à V²/2.</p>`}}},

{id:'turbine',chap:'Appareils',pts:3,gen(R,F){
  const qm=R.int(5,60)/2,he=R.int(3000,3500),x=R.int(85,100)/100,hf=191.83,hfg=2392.8,hs=hf+x*hfg;
  const P=qm*(he-hs);
  return{v:{qm,he,x},text:`<p>Turbine à vapeur en régime permanent, ΔE<sub>c</sub>, ΔE<sub>p</sub> et pertes thermiques négligeables. Débit ${F.n(qm)} kg/s, h<sub>e</sub> = ${he} kJ/kg ; sortie à 0,1 bar avec un titre de ${F.n(x)} (A-3 : h<sub>f</sub> = 191,83 ; h<sub>fg</sub> = 2392,8 kJ/kg). Enthalpie de sortie et puissance développée ?</p>`,
    fields:[{label:'h_s',unit:'kJ/kg',ans:hs,d:1,hint:'en kJ/kg'},{label:'P_méca',unit:'kW',ans:P,d:1,hint:'en kW, positive (puissance produite)'}],
    sol:`h_s = h_f + x h_fg = 191,83 + ${F.n(x)} × 2392,8 = ${F.n(hs,1)} kJ/kg
P_méca = q_m (h_e − h_s) = ${F.n(qm)} × (${he} − ${F.n(hs,1)}) = ${F.n(P,1)} kW`}}},

{id:'compresseur',chap:'Appareils',pts:3,gen(R,F){
  const qm=R.int(2,30)/10,he=R.pick([290.16,300.19,310.24]),hs=R.pick([451.80,462.02,472.24]),Pth=-R.int(0,10)/2;
  const P=Pth+qm*(he-hs);
  return{v:{qm,he,hs,Pth},text:`<p>Compresseur d'air en régime permanent, ΔE<sub>c</sub> et ΔE<sub>p</sub> négligeables. Débit ${F.n(qm)} kg/s, h<sub>e</sub> = ${F.n(he)} kJ/kg, h<sub>s</sub> = ${F.n(hs)} kJ/kg, ${Pth===0?'pas de perte thermique':`pertes thermiques de ${F.n(-Pth)} kW`}. Puissance mécanique P<sub>méca</sub> ?</p>`,
    fields:[{label:'P_méca',unit:'kW',ans:P,d:1,hint:'avec son signe (− : puissance fournie au compresseur)'}],
    sol:`Eq. 4.20a : 0 = P_th − P_méca + q_m (h_e − h_s)
P_th = ${F.n(Pth)} kW (chaleur cédée : négative)
P_méca = P_th + q_m (h_e − h_s) = ${F.n(Pth)} + ${F.n(qm)} × (${F.n(he)} − ${F.n(hs)}) = ${F.n(P,1)} kW`,
    note:`<p class="mds-note">Le signe − est normal : la puissance est fournie <b>au</b> fluide.</p>`}}},

{id:'laminage',chap:'Échangeurs et laminage',pts:2,gen(R,F){
  const S=R.pick([['eau',1,417.46,2258.0],['eau',0.1,191.83,2392.8],['ammoniac',1,28.18,1370.23]]),hf=S[2],hfg=S[3];
  const he=Math.round((hf+R.int(5,40)/100*hfg)*10)/10,x=(he-hf)/hfg;
  return{v:{he,hf,hfg},text:`<p>De l'${S[0]} liquide (h<sub>e</sub> = ${F.n(he)} kJ/kg) traverse un détendeur et en sort à ${F.n(S[1])} bar, où h<sub>f</sub> = ${F.n(hf)} et h<sub>fg</sub> = ${F.n(hfg)} kJ/kg. Titre en vapeur à la sortie ?</p>`,
    fields:[{label:'x_s',unit:'',ans:x,d:4,tol:0.002,hint:H.x}],
    sol:`Laminage : h_s = h_e = ${F.n(he)} kJ/kg   (Eq. 4.22)
x_s = (h_s − h_f)/h_fg = (${F.n(he)} − ${F.n(hf)})/${F.n(hfg)} = ${F.n(x,4)}`}}},

{id:'echangeur',chap:'Échangeurs et laminage',pts:3,gen(R,F){
  const x=R.int(85,98)/100,h1=191.83+x*2392.8,h2=R.pick([167.57,188.45,146.68]),T3=R.pick([[15,62.99],[20,83.96]]),T4=R.pick([[30,125.79],[35,146.68]]);
  const ratio=(h1-h2)/(T4[1]-T3[1]);
  return{v:{h1,h2,h3:T3[1],h4:T4[1]},text:`<p>Condenseur en régime permanent : la vapeur entre avec h<sub>1</sub> = ${F.n(h1,1)} kJ/kg et ressort liquide avec h<sub>2</sub> = ${F.n(h2)} kJ/kg. L'eau de refroidissement passe de h<sub>3</sub> = ${F.n(T3[1])} à h<sub>4</sub> = ${F.n(T4[1])} kJ/kg. Rapport q<sub>m,eau</sub> / q<sub>m,vapeur</sub> ?</p>`,
    fields:[{label:'rapport',unit:'',ans:ratio,d:2,hint:H.coef}],
    sol:`Échangeur sans travail ni pertes : 0 = Σ q_m,e h_e − Σ q_m,s h_s
q_m,vap (h_1 − h_2) = q_m,eau (h_4 − h_3)
q_m,eau / q_m,vap = (${F.n(h1,1)} − ${F.n(h2)}) / (${F.n(T4[1])} − ${F.n(T3[1])}) = ${F.n(ratio,2)}`}}},

/* ---------- Chapitre 5 : second principe ---------- */

{id:'rendement',chap:'Second principe',pts:2,gen(R,F){
  const QC=R.int(20,200)*10,eta=R.int(15,60),QF=QC*(1-eta/100),W=QC-QF;
  return{v:{QC,eta},text:`<p>Un moteur fonctionne entre un réservoir chaud et un réservoir froid. Il reçoit Q<sub>C</sub> = ${QC} kJ par cycle avec un rendement de ${eta} %. Travail produit et chaleur rejetée Q<sub>F</sub> ?</p>`,
    fields:[{label:'W_cycle',unit:'kJ',ans:W,d:1,hint:'en kJ'},{label:'Q_F',unit:'kJ',ans:QF,d:1,hint:'en kJ'}],
    sol:`η = W_cycle / Q_C   →   W_cycle = ${eta/100} × ${QC} = ${F.n(W,1)} kJ
W_cycle = Q_C − Q_F   →   Q_F = ${QC} − ${F.n(W,1)} = ${F.n(QF,1)} kJ   (et η = 1 − Q_F/Q_C ✓)`,
    note:`<p class="mds-note">Q<sub>F</sub> ne peut jamais être nul (Kelvin-Planck) : c'est pour ça que η &lt; 100 %.</p>`}}},

{id:'enonces',chap:'Second principe',pts:1,gen(R,F){
  const S=R.pick([
    ['Une machine prend 100 kJ à un seul réservoir et fournit 100 kJ de travail à chaque cycle.',2,'Un seul réservoir et du travail net en cycle : interdit par Kelvin-Planck.'],
    ['Un appareil fait passer de la chaleur d\'un bloc froid vers un bloc chaud sans rien consommer d\'autre.',1,'Le seul résultat serait un transfert du froid vers le chaud : interdit par Clausius.'],
    ['Un système fonctionne de manière à faire diminuer l\'entropie produite en son sein jusqu\'à en détruire.',3,'Détruire de l\'entropie est interdit par l\'énoncé d\'entropie.'],
    ['Un moteur reçoit 500 kJ du chaud et ne rejette rien au froid.',2,'Q_F = 0 revient à travailler avec un seul réservoir : interdit par Kelvin-Planck.']]);
  return{v:{c:S[1]},text:`<p>${S[0]} Quel énoncé du second principe est violé ? Tape <b>1</b> Clausius, <b>2</b> Kelvin-Planck, <b>3</b> entropie.</p>`,
    fields:[{label:'énoncé',unit:'',ans:S[1],d:0,tol:0.01,hint:'1, 2 ou 3'}],
    sol:S[2]}}}

];
})();
