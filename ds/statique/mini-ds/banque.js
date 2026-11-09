/* Banque de questions du mini-DS Statique (chapitres 1 à 3), alignée sur les pages /cours/statique/… :
   mêmes chapitres, mêmes notations que le cours du prof (F = k s, (F_R)x, M_O = F d, M_O = r × F…).
   Chaque générateur tire ses valeurs au hasard (R) et renvoie :
     text   énoncé HTML         fields  cases réponse {label, unit, ans, d (décimales affichées), tol/rel, type:'angle', s:1 (signe), hint (« quoi taper »)}
     sol    correction pas à pas (une ligne par étape)       note  remarque HTML facultative
     v      les données tirées, pour la vérification automatique (outils/verif-minids.js)
   Pour ajouter une question : copier un bloc, changer id/chap/pts et gen, puis la déclarer dans mini-ds/matieres.js
   (noms + chapitres) et lancer `node outils/verif-minids.js`. */
(function(){
const g=9.81;
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const norm=a=>Math.hypot(a[0],a[1],a[2]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],-(a[0]*b[2]-a[2]*b[0]),a[0]*b[1]-a[1]*b[0]];
const deg=x=>x*180/Math.PI, rad=x=>x*Math.PI/180;
// directions de longueur entière (√ tombe juste) : pratique pour les câbles et les axes
const QUADS=[[2,3,6],[1,2,2],[2,6,9],[4,4,7],[1,4,8],[3,4,12],[2,10,11],[6,6,7],[2,2,1],[3,4,0]];
function dirEntiere(R,list){const q=R.shuffle(R.pick(list||QUADS));return q.map(c=>c===0?0:c*R.sign())}
function vecInt(R,a,b,mult){let v;do{v=[R.int(a,b),R.int(a,b),R.int(a,b)].map(x=>x*(mult||1))}while(norm(v)===0||v.filter(x=>x===0).length>1);return v}
const H={sig:'avec son signe (− si la composante va dans le sens négatif de l\'axe)',pos:'intensité : toujours positive',ang180:'en degrés, entre 0 et 180°',l3:'3 chiffres significatifs suffisent'};

window.BANQUE_STATIQUE=[

/* ---------- Chapitre 1 : principes généraux et outils mathématiques ---------- */

{id:'cosinus',chap:'Parallélogramme',pts:3,gen(R,F){
  const F1=R.int(8,40)*10,F2=R.int(8,40)*10,phi=R.pick([30,40,45,50,60,70,75,80,100,110,120,130]);
  const c=180-phi,FR=Math.sqrt(F1*F1+F2*F2-2*F1*F2*Math.cos(rad(c)));
  // angle entre F1 et FR par la loi des cosinus (la loi des sinus est ambiguë si l'angle dépasse 90°)
  const ca=Math.max(-1,Math.min(1,(F1*F1+FR*FR-F2*F2)/(2*F1*FR))),a=deg(Math.acos(ca)),sinOK=a<85;
  return{v:{F1,F2,phi},text:`<p>Deux forces partent du même point : F<sub>1</sub> = ${F1} N et F<sub>2</sub> = ${F2} N, avec un angle de ${phi}° entre elles. Avec la méthode du triangle (loi des cosinus, loi des sinus), calcule l'intensité de la résultante et l'angle qu'elle fait avec F<sub>1</sub>.</p>`,
    fields:[{label:'FR',unit:'N',ans:FR,d:1,hint:H.pos},{label:'angle (F<sub>1</sub>, F<sub>R</sub>)',unit:'°',ans:a,type:'angle',d:1,hint:'en degrés, entre 0 et '+phi+'°'}],
    sol:`Triangle tête-à-queue : l'angle en face de FR vaut c = 180° − ${phi}° = ${c}°
FR = √(${F1}² + ${F2}² − 2·${F1}·${F2}·cos ${c}°) = ${F.n(FR,1)} N
${sinOK?`Loi des sinus : sin a / ${F2} = sin ${c}° / ${F.n(FR,1)}   →   a = ${F.n(a,1)}°`
  :`L'angle cherché peut dépasser 90° : on reprend la loi des cosinus (la loi des sinus donnerait aussi 180° − a)
cos a = (${F1}² + ${F.n(FR,1)}² − ${F2}²) / (2 · ${F1} · ${F.n(FR,1)}) = ${F.n(ca,4)}   →   a = ${F.n(a,1)}°`}`,
    note:`<p class="mds-note">Piège : ne mets pas ${phi}° dans la loi des cosinus. C'est l'angle intérieur du triangle, 180° − ${phi}°, qui est en face de la résultante.${sinOK?'':' Et sin⁻¹ ne donne jamais plus de 90° : si l\'angle peut être obtus, passe par la loi des cosinus.'}</p>`}}},

{id:'pente',chap:'Composantes 2D',pts:2,gen(R,F){
  const T=R.pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]),Fm=R.int(5,60)*10;
  const hz=R.rnd()<.5,sx=R.sign(),sy=R.sign();
  const a=hz?T[1]:T[0],b=hz?T[0]:T[1],c=T[2];
  const Fx=sx*Fm*a/c,Fy=sy*Fm*b/c;
  const dir=(sy>0?'monte':'descend')+' vers la '+(sx>0?'droite':'gauche');
  return{v:{Fm,a,b,c,sx,sy},text:`<p>Une force F = ${Fm} N ${dir}. Sa direction est donnée par un petit triangle de pente : ${a} à l'horizontale, ${b} à la verticale, ${c} sur l'hypoténuse. Donne ses composantes (axe x vers la droite, y vers le haut).</p>`,
    fields:[{label:'Fx',unit:'N',ans:Fx,d:1,s:1,hint:H.sig},{label:'Fy',unit:'N',ans:Fy,d:1,s:1,hint:H.sig}],
    sol:`Fx = ${sx<0?'−':''}F (a / c) = ${sx<0?'−':''}${Fm} × ${a}/${c} = ${F.n(Fx,1)} N
Fy = ${sy<0?'−':''}F (b / c) = ${sy<0?'−':''}${Fm} × ${b}/${c} = ${F.n(Fy,1)} N
Les signes viennent du sens de la flèche : la force ${dir}.`}}},

{id:'resultante',chap:'Résultante 2D',pts:3,gen(R,F){
  let F1,t1,F2,t2,Rx,Ry,FR;
  do{F1=R.int(10,40)*10;t1=R.pick([10,15,20,25,30,35,40,45,50,55,60,65,70]);
     F2=R.int(8,30)*10;t2=R.pick([100,110,120,130,135,140,150,160,200,210,225,240]);
     Rx=F1*Math.cos(rad(t1))+F2*Math.cos(rad(t2));Ry=F1*Math.sin(rad(t1))+F2*Math.sin(rad(t2));FR=Math.hypot(Rx,Ry)}while(FR<40||Math.abs(Rx)<5);
  const th=(deg(Math.atan2(Ry,Rx))+360)%360;
  return{v:{F1,t1,F2,t2},text:`<p>Deux forces agissent sur une cheville : F<sub>1</sub> = ${F1} N à ${t1}° de l'axe +x, et F<sub>2</sub> = ${F2} N à ${t2}° de l'axe +x (angles comptés dans le sens anti-horaire depuis +x). Donne l'intensité de la résultante et sa direction.</p>`,
    fields:[{label:'FR',unit:'N',ans:FR,d:1,hint:H.pos},{label:'θ',unit:'°',ans:th,type:'angle',d:1,hint:'de 0 à 360°, depuis +x, sens anti-horaire'}],
    sol:`F1x = ${F1} cos ${t1}° = ${F.n(F1*Math.cos(rad(t1)),1)} N     F1y = ${F1} sin ${t1}° = ${F.n(F1*Math.sin(rad(t1)),1)} N
F2x = ${F2} cos ${t2}° = ${F.n(F2*Math.cos(rad(t2)),1)} N     F2y = ${F2} sin ${t2}° = ${F.n(F2*Math.sin(rad(t2)),1)} N
(F_R)x = ΣFx = ${F.n(Rx,1)} N      (F_R)y = ΣFy = ${F.n(Ry,1)} N
F_R = √((F_R)x² + (F_R)y²) = ${F.n(FR,1)} N
tan⁻¹ |(F_R)y / (F_R)x| = ${F.n(deg(Math.atan(Math.abs(Ry/Rx))),1)}°, puis on place l'angle dans le bon quadrant
θ = ${F.n(th,1)}° depuis +x`,
    note:`<p class="mds-note">Piège : tan⁻¹ donne un angle aigu. Regarde les signes de (F<sub>R</sub>)<sub>x</sub> et (F<sub>R</sub>)<sub>y</sub> pour savoir dans quel quadrant est la résultante.</p>`}}},

{id:'angles',chap:'Vecteurs 3D',pts:3,gen(R,F){
  const A=[R.nz(-6,6),R.nz(-6,6),R.int(-6,6)];const n=norm(A);
  const a=deg(Math.acos(A[0]/n)),b=deg(Math.acos(A[1]/n)),c=deg(Math.acos(A[2]/n));
  return{v:{A},text:`<p>Soit <span class="v">A</span> = ${F.vec(A)} N. Calcule son intensité et ses angles directeurs α et γ.</p>`,
    fields:[{label:'A',unit:'N',ans:n,d:2,hint:H.pos},{label:'α',unit:'°',ans:a,type:'angle',d:1,hint:H.ang180},{label:'γ',unit:'°',ans:c,type:'angle',d:1,hint:H.ang180}],
    sol:`A = √(${A.map(x=>x<0?'('+F.n(x)+')²':x+'²').join(' + ')}) = √${dot(A,A)} = ${F.n(n,3)} N
cos α = Ax / A = ${F.n(A[0])}/${F.n(n,3)}  →  α = ${F.n(a,1)}°
cos β = Ay / A = ${F.n(A[1])}/${F.n(n,3)}  →  β = ${F.n(b,1)}°
cos γ = Az / A = ${F.n(A[2])}/${F.n(n,3)}  →  γ = ${F.n(c,1)}°
Vérif : cos² α + cos² β + cos² γ = 1`}}},

{id:'gamma',chap:'Vecteurs 3D',pts:3,gen(R,F){
  let a,b,s;do{a=R.pick([45,50,60,65,70,75,80,100,110,120,135]);b=R.pick([30,40,45,50,60,70,110,120,135]);s=1-Math.cos(rad(a))**2-Math.cos(rad(b))**2}while(s<0.05);
  const down=R.rnd()<.5,cg=(down?-1:1)*Math.sqrt(s),gm=deg(Math.acos(cg)),Fm=R.int(5,40)*10;
  return{v:{a,b,down,Fm},text:`<p>Une force de ${Fm} N a pour angles directeurs α = ${a}° et β = ${b}°, et elle ${down?'descend (composante z négative)':'monte (composante z positive)'}. Trouve γ puis la composante F<sub>z</sub>.</p>`,
    fields:[{label:'γ',unit:'°',ans:gm,type:'angle',d:1,hint:H.ang180},{label:'Fz',unit:'N',ans:Fm*cg,d:1,s:1,hint:H.sig}],
    sol:`cos² γ = 1 − cos² ${a}° − cos² ${b}° = ${F.n(s,4)}   →   cos γ = ±${F.n(Math.sqrt(s),4)}
La force ${down?'descend : cos γ < 0':'monte : cos γ > 0'}   →   γ = ${F.n(gm,1)}°
Fz = F cos γ = ${Fm} × (${F.n(cg,4)}) = ${F.n(Fm*cg,1)} N`,
    note:`<p class="mds-note">Deux solutions possibles pour γ (γ et 180° − γ) : c'est le sens de la force sur le dessin qui tranche.</p>`}}},

{id:'thetaphi',chap:'Vecteurs 3D',pts:3,gen(R,F){
  const A=R.int(5,60)*10,phi=R.pick([20,30,35,40,45,50,60,70,120,135]),th=R.pick([15,20,30,40,45,50,60,70,120,150,210,240,300]);
  const Ap=A*Math.sin(rad(phi)),c=[Ap*Math.cos(rad(th)),Ap*Math.sin(rad(th)),A*Math.cos(rad(phi))];
  return{v:{A,phi,th},text:`<p>Une force de ${A} N fait un angle φ = ${phi}° avec l'axe +z. Sa projection dans le plan xy fait un angle θ = ${th}° avec l'axe +x (sens de x vers y). Écris la force en vecteur cartésien.</p>`,
    fields:[{label:'Fx',unit:'N',ans:c[0],d:1,s:1,hint:H.sig},{label:'Fy',unit:'N',ans:c[1],d:1,s:1,hint:H.sig},{label:'Fz',unit:'N',ans:c[2],d:1,s:1,hint:H.sig}],
    sol:`Fz = F cos φ = ${A} cos ${phi}° = ${F.n(c[2],1)} N
F' = F sin φ = ${A} sin ${phi}° = ${F.n(Ap,1)} N   (projection dans le plan xy)
Fx = F' cos θ = ${F.n(Ap,1)} cos ${th}° = ${F.n(c[0],1)} N
Fy = F' sin θ = ${F.n(Ap,1)} sin ${th}° = ${F.n(c[1],1)} N
F = ${F.vec(c,1)} N`}}},

{id:'cable',chap:'Vecteur position',pts:3,gen(R,F){
  const d=dirEntiere(R,QUADS.filter(q=>q[2]!==0&&q[0]!==q[2]));
  const A=[R.int(-3,4),R.int(-3,4),R.int(0,3)];const B=A.map((a,i)=>a+d[i]);
  const L=norm(d),Fm=R.int(3,16)*50,Fv=d.map(c=>Fm*c/L);
  return{v:{A,B,Fm},text:`<p>Un câble exerce sur le point A${F.pt(A)} m une force de ${Fm} N, dirigée de A vers B${F.pt(B)} m. Écris cette force en vecteur cartésien.</p>`,
    fields:[{label:'Fx',unit:'N',ans:Fv[0],d:1,s:1,hint:H.sig},{label:'Fy',unit:'N',ans:Fv[1],d:1,s:1,hint:H.sig},{label:'Fz',unit:'N',ans:Fv[2],d:1,s:1,hint:H.sig}],
    sol:`r = r_B − r_A = ${F.vec(d)} m      (tête moins queue)
r = √(${d.map(c=>c*c).join(' + ')}) = ${F.n(L,3)} m
u = r / r = ${F.vec(d.map(c=>c/L),3)}
F = F u = ${Fm} u = ${F.vec(Fv,1)} N`}}},

{id:'longueur',chap:'Vecteur position',pts:2,gen(R,F){
  const d=dirEntiere(R,QUADS.filter(q=>q[2]!==0));
  const A=[R.int(-4,4),R.int(-4,4),R.int(-2,4)],B=A.map((a,i)=>a+d[i]),L=norm(d),gm=deg(Math.acos(d[2]/L));
  return{v:{A,B},text:`<p>Un élastique est tendu entre A${F.pt(A)} m et B${F.pt(B)} m. Donne sa longueur et l'angle γ que fait la direction de A vers B avec l'axe +z.</p>`,
    fields:[{label:'longueur',unit:'m',ans:L,d:2,hint:H.pos},{label:'γ',unit:'°',ans:gm,type:'angle',d:1,hint:H.ang180}],
    sol:`r = (xB − xA) i + (yB − yA) j + (zB − zA) k = ${F.vec(d)} m
r = √(${d.map(c=>c*c).join(' + ')}) = ${F.n(L,2)} m
cos γ = (zB − zA) / r = ${F.n(d[2])}/${F.n(L,2)}   →   γ = ${F.n(gm,1)}°`}}},

{id:'angle2',chap:'Produit scalaire',pts:2,gen(R,F){
  let a,b,c;do{a=vecInt(R,-5,6);b=vecInt(R,-5,6);c=dot(a,b)/(norm(a)*norm(b))}while(Math.abs(c)>0.97);
  const th=deg(Math.acos(c));
  return{v:{a,b},text:`<p>Calcule le produit scalaire et l'angle entre <span class="v">A</span> = ${F.vec(a)} et <span class="v">B</span> = ${F.vec(b)}.</p>`,
    fields:[{label:'A · B',unit:'',ans:dot(a,b),tol:0.01,d:0,s:1,hint:'un nombre entier, avec son signe'},{label:'θ',unit:'°',ans:th,type:'angle',d:1,hint:H.ang180}],
    sol:`A · B = Ax Bx + Ay By + Az Bz = ${a.map((x,i)=>'('+F.n(x)+')('+F.n(b[i])+')').join(' + ')} = ${dot(a,b)}
A = √${dot(a,a)} = ${F.n(norm(a),3)}     B = √${dot(b,b)} = ${F.n(norm(b),3)}
θ = cos⁻¹( A · B / (A B) ) = cos⁻¹(${dot(a,b)} / ${F.n(norm(a)*norm(b),3)}) = ${F.n(th,1)}°`}}},

{id:'projection',chap:'Produit scalaire',pts:3,gen(R,F){
  const Fv=vecInt(R,-6,6,10);const d=dirEntiere(R);const L=norm(d),u=d.map(c=>c/L);
  const par=dot(Fv,u),perp=Math.sqrt(Math.max(0,dot(Fv,Fv)-par*par));
  return{v:{Fv,d},text:`<p>La force <span class="v">F</span> = ${F.vec(Fv)} N agit en O. Calcule sa composante parallèle à la droite OA, avec A${F.pt(d)} m, puis sa composante perpendiculaire.</p>`,
    fields:[{label:'F_a',unit:'N',ans:par,d:1,s:1,hint:'avec son signe (− si F pointe à l\'opposé de A)'},{label:'F_⊥',unit:'N',ans:perp,d:1,hint:H.pos}],
    sol:`u_a = ${F.vec(d)} / ${F.n(L,3)} = ${F.vec(u,3)}
F_a = F · u_a = ${F.n(par,2)} N${par<0?'   (négatif : F pointe dans le sens opposé à u_a)':''}
F = √${dot(Fv,Fv)} = ${F.n(norm(Fv),2)} N
F_⊥ = √(F² − F_a²) = ${F.n(perp,1)} N`}}},

/* ---------- Chapitre 2 : équilibre statique ---------- */

{id:'equilibre',chap:'Équilibre 2D',pts:4,gen(R,F){
  const m=R.int(5,40),a=R.pick([20,25,30,35,40,45,50,55,60,65]),b=R.pick([20,25,30,35,40,45,50,55,60,65,70]);
  const W=m*g,s=Math.sin(rad(a+b)),TG=W*Math.cos(rad(b))/s,TD=W*Math.cos(rad(a))/s;
  return{v:{m,a,b},text:`<p>Un sac de ${m} kg pend à un nœud. Le câble gauche monte vers la gauche à ${a}° de l'horizontale, le câble droit monte vers la droite à ${b}° de l'horizontale. Fais le DCL du nœud et calcule les deux tensions (g = 9,81 m/s²).</p>`,
    fields:[{label:'T gauche',unit:'N',ans:TG,d:1,hint:H.pos},{label:'T droit',unit:'N',ans:TD,d:1,hint:H.pos}],
    sol:`W = m g = ${m} × 9,81 = ${F.n(W,1)} N
ΣFx = 0 :  −T_G cos ${a}° + T_D cos ${b}° = 0
ΣFy = 0 :   T_G sin ${a}° + T_D sin ${b}° − ${F.n(W,1)} = 0
De la 1ʳᵉ : T_D = T_G · cos ${a}° / cos ${b}°, on remplace dans la 2ᵉ :
T_G = ${F.n(TG,1)} N      T_D = ${F.n(TD,1)} N`}}},

{id:'ressort',chap:'Équilibre 2D',pts:3,gen(R,F){
  const m=R.int(4,25),a=R.pick([30,35,40,45,50,55,60]),k=R.pick([200,250,300,400,500,600,800]),l0=R.pick([0.3,0.4,0.5,0.6]);
  const W=m*g,T=W/Math.sin(rad(a)),Fs=W/Math.tan(rad(a)),s=Fs/k,l=l0+s;
  return{v:{m,a,k,l0},text:`<p>Une masse de ${m} kg est suspendue en un point A. A est retenu par un câble qui monte vers la droite à ${a}° de l'horizontale et par un ressort horizontal qui tire vers la gauche (k = ${k} N/m, longueur à vide l<sub>0</sub> = ${F.n(l0)} m). Calcule la tension du câble, la force du ressort et sa longueur l.</p>`,
    fields:[{label:'T',unit:'N',ans:T,d:1,hint:H.pos},{label:'F ressort',unit:'N',ans:Fs,d:1,hint:H.pos},{label:'l',unit:'m',ans:l,d:3,tol:0.005,hint:'en mètres, 3 décimales'}],
    sol:`W = ${m} × 9,81 = ${F.n(W,1)} N
ΣFy = 0 :  T sin ${a}° − W = 0      →  T = ${F.n(T,1)} N
ΣFx = 0 :  T cos ${a}° − F = 0      →  F = ${F.n(Fs,1)} N
Ressort : F = k s   →   s = ${F.n(Fs,1)} / ${k} = ${F.n(s,3)} m
s = l − l0   →   l = ${F.n(l0)} + ${F.n(s,3)} = ${F.n(l,3)} m`,
    note:`<p class="mds-note">Piège : F = k s utilise la déflexion s, pas la longueur l. Ici le ressort est étiré (s &gt; 0), il tire.</p>`}}},

{id:'chargemax',chap:'Équilibre 2D',pts:3,gen(R,F){
  let a,b,Tmax,cG,cD;do{a=R.pick([25,30,35,40,45,50,55,60]);b=R.pick([25,30,35,40,45,50,55,60]);}while(a===b);
  Tmax=R.pick([500,600,800,1000,1200,1500,2000]);
  const s=Math.sin(rad(a+b));cG=Math.cos(rad(b))/s;cD=Math.cos(rad(a))/s;
  const Wmax=Tmax/Math.max(cG,cD),mmax=Wmax/g;
  return{v:{a,b,Tmax},text:`<p>Une charge pend à un nœud tenu par deux câbles : à gauche à ${a}° de l'horizontale, à droite à ${b}° de l'horizontale. Chaque câble casse au-delà de ${Tmax} N. Quel est le poids maximal, et la masse correspondante (g = 9,81 m/s²) ?</p>`,
    fields:[{label:'W max',unit:'N',ans:Wmax,d:1,hint:H.pos},{label:'m max',unit:'kg',ans:mmax,d:1,hint:H.pos}],
    sol:`Équilibre avec W en lettre :
ΣFx = 0 :  −T_G cos ${a}° + T_D cos ${b}° = 0
ΣFy = 0 :   T_G sin ${a}° + T_D sin ${b}° − W = 0
→  T_G = ${F.n(cG,4)} W      T_D = ${F.n(cD,4)} W
Le câble le plus chargé est ${cG>cD?'le gauche':'le droit'} : ${F.n(Math.max(cG,cD),4)} W = ${Tmax} N
W max = ${F.n(Wmax,1)} N      m max = W / g = ${F.n(mmax,1)} kg`,
    note:`<p class="mds-note">Méthode : garde W en lettre, chaque tension devient (un nombre) × W, et c'est le plus grand coefficient qui atteint la limite en premier.</p>`}}},

{id:'equi3d',chap:'Équilibre 3D',pts:4,gen(R,F){
  const a=R.int(2,5),b=R.int(2,6),c=R.int(4,10),W=R.int(4,40)*10;
  const L=Math.hypot(a,b,c),FB=W*L/(2*c),FD=2*a*FB/L;
  return{v:{a,b,c,W},text:`<p>Une charge de ${W} N pend au nœud A, placé à l'origine. Trois câbles la retiennent : AB vers B(−${a} ; −${b} ; ${c}) m, AC vers C(−${a} ; ${b} ; ${c}) m et AD horizontal selon +x. Calcule la force dans AB (égale à celle dans AC) et dans AD.</p>`,
    fields:[{label:'F_B = F_C',unit:'N',ans:FB,d:1,hint:H.pos},{label:'F_D',unit:'N',ans:FD,d:1,hint:H.pos}],
    sol:`r_AB = {−${a} i − ${b} j + ${c} k},  r_AC = {−${a} i + ${b} j + ${c} k},  longueur √${a*a+b*b+c*c} = ${F.n(L,3)} m
F_B = F_B (−${a} i − ${b} j + ${c} k) / ${F.n(L,3)}      F_C = F_C (−${a} i + ${b} j + ${c} k) / ${F.n(L,3)}
F_D = F_D i        W = −${W} k
ΣFy = 0 :  −${b} F_B / ${F.n(L,3)} + ${b} F_C / ${F.n(L,3)} = 0   →   F_B = F_C
ΣFz = 0 :  2 × ${c} F_B / ${F.n(L,3)} − ${W} = 0   →   F_B = F_C = ${F.n(FB,1)} N
ΣFx = 0 :  −2 × ${a} F_B / ${F.n(L,3)} + F_D = 0   →   F_D = ${F.n(FD,1)} N`}}},

/* ---------- Chapitre 3 : moment d'une force ---------- */

{id:'momentfd',chap:'Moment scalaire',pts:2,gen(R,F){
  const Fm=R.int(4,40)*10,L=R.pick([0.25,0.3,0.4,0.5,0.6,0.75,0.8,1.2,1.5,2]),t=R.pick([30,35,40,45,50,60,70,75]);
  const d=L*Math.sin(rad(t)),M=Fm*d;
  return{v:{Fm,L,t},text:`<p>Une clé de longueur ${F.n(L)} m est fixée en O. À son bout, on tire avec F = ${Fm} N, dans le plan de rotation, avec un angle de ${t}° entre la clé et la force. Donne le bras de levier et l'intensité du moment par rapport à O.</p>`,
    fields:[{label:'d',unit:'m',ans:d,d:3,tol:0.002,hint:'en mètres, 3 décimales'},{label:'M_O',unit:'N·m',ans:M,d:1,hint:H.pos}],
    sol:`Bras de levier = distance perpendiculaire de O à la ligne d'action :
d = ${F.n(L)} sin ${t}° = ${F.n(d,3)} m
M_O = F d = ${Fm} × ${F.n(d,3)} = ${F.n(M,1)} N·m`,
    note:`<p class="mds-note">Si la force était perpendiculaire à la clé (90°), le bras de levier serait la longueur entière : c'est le maximum.</p>`}}},

{id:'vectoriel',chap:'Produit vectoriel',pts:2,gen(R,F){
  let A,B,C;do{A=vecInt(R,-4,5);B=vecInt(R,-4,5);C=cross(A,B)}while(norm(C)===0);
  return{v:{A,B},text:`<p>Calcule <span class="v">A</span> × <span class="v">B</span> avec <span class="v">A</span> = ${F.vec(A)} et <span class="v">B</span> = ${F.vec(B)}.</p>`,
    fields:[{label:'sur <span class="vec">i</span>',unit:'',ans:C[0],tol:0.01,d:0,s:1,hint:'un entier, avec son signe'},{label:'sur <span class="vec">j</span>',unit:'',ans:C[1],tol:0.01,d:0,s:1,hint:'un entier, avec son signe'},{label:'sur <span class="vec">k</span>',unit:'',ans:C[2],tol:0.01,d:0,s:1,hint:'un entier, avec son signe'}],
    sol:`i :   Ay Bz − Az By = (${F.n(A[1])})(${F.n(B[2])}) − (${F.n(A[2])})(${F.n(B[1])}) = ${F.n(C[0])}
j : −(Ax Bz − Az Bx) = −[(${F.n(A[0])})(${F.n(B[2])}) − (${F.n(A[2])})(${F.n(B[0])})] = ${F.n(C[1])}
k :   Ax By − Ay Bx = (${F.n(A[0])})(${F.n(B[1])}) − (${F.n(A[1])})(${F.n(B[0])}) = ${F.n(C[2])}
A × B = ${F.vec(C)}
Vérif : (A × B) · A = ${dot(C,A)} et (A × B) · B = ${dot(C,B)}`,
    note:`<p class="mds-note">Piège classique : oublier le signe moins devant la composante j.</p>`}}},

{id:'varignon',chap:'Varignon',pts:2,gen(R,F){
  let x,y,Fm,t,Fx,Fy,M;
  do{x=R.int(-4,5);y=R.int(-3,4);Fm=R.int(5,30)*10;t=R.pick([20,30,40,45,50,60,120,135,150,210,240,300,315]);
     Fx=Fm*Math.cos(rad(t));Fy=Fm*Math.sin(rad(t));M=Fx*y-Fy*x}while((x===0&&y===0)||Math.abs(M)<5);
  return{v:{x,y,Fm,t},text:`<p>Une force de ${Fm} N, orientée à ${t}° de l'axe +x (sens anti-horaire), s'applique au point P(${F.n(x)} ; ${F.n(y)}) m. Avec le théorème de Varignon et la formule du cours <span class="m">M_O = F_x y − F_y x</span>, calcule son moment par rapport à O.</p>`,
    fields:[{label:'M_O',unit:'N·m',ans:M,d:1,tol:0.5,hint:'avec son signe : + = sens horaire dans la formule du cours'}],
    sol:`Fx = ${Fm} cos ${t}° = ${F.n(Fx,2)} N      Fy = ${Fm} sin ${t}° = ${F.n(Fy,2)} N
M_O = F_x y − F_y x = (${F.n(Fx,2)})(${F.n(y)}) − (${F.n(Fy,2)})(${F.n(x)})
M_O = ${F.n(M,1)} N·m   →   ${F.n(Math.abs(M),1)} N·m dans le sens ${M>0?'horaire':'anti-horaire'}`,
    note:`<p class="mds-note">Dans l'écriture du cours, positif = horaire. Si tu comptes l'anti-horaire positif, c'est x F<sub>y</sub> − y F<sub>x</sub> : même valeur, signe opposé.</p>`}}},

{id:'moment3d',chap:'Moment r × F',pts:4,gen(R,F){
  let P,Fv,M;do{P=vecInt(R,-3,4);Fv=vecInt(R,-6,6,10);M=cross(P,Fv)}while(norm(M)<1);
  return{v:{P,Fv},text:`<p>La force <span class="v">F</span> = ${F.vec(Fv)} N s'applique au point P${F.pt(P)} m. Calcule le moment <span class="v">M</span><sub>O</sub> = <span class="v">r</span> × <span class="v">F</span> par rapport à l'origine, et son intensité.</p>`,
    fields:[{label:'M_x',unit:'N·m',ans:M[0],tol:0.05,d:1,s:1,hint:H.sig},{label:'M_y',unit:'N·m',ans:M[1],tol:0.05,d:1,s:1,hint:H.sig},{label:'M_z',unit:'N·m',ans:M[2],tol:0.05,d:1,s:1,hint:H.sig},{label:'M_O',unit:'N·m',ans:norm(M),d:1,hint:H.pos}],
    sol:`r = OP = ${F.vec(P)} m,  M_O = r × F  (dans cet ordre)
M_x = ry F_z − rz F_y = (${F.n(P[1])})(${F.n(Fv[2])}) − (${F.n(P[2])})(${F.n(Fv[1])}) = ${F.n(M[0])}
M_y = rz F_x − rx F_z = (${F.n(P[2])})(${F.n(Fv[0])}) − (${F.n(P[0])})(${F.n(Fv[2])}) = ${F.n(M[1])}
M_z = rx F_y − ry F_x = (${F.n(P[0])})(${F.n(Fv[1])}) − (${F.n(P[1])})(${F.n(Fv[0])}) = ${F.n(M[2])}
M_O = ${F.vec(M)} N·m
M_O = √${dot(M,M)} = ${F.n(norm(M),1)} N·m
Vérif : M_O · r = ${dot(M,P)} ✓`}}},

{id:'momentres',chap:'Moment r × F',pts:3,gen(R,F){
  let P,F1,F2,S,M;do{P=vecInt(R,-3,4);F1=vecInt(R,-5,5,10);F2=vecInt(R,-5,5,10);S=F1.map((c,i)=>c+F2[i]);M=cross(P,S)}while(norm(M)<1||norm(S)===0);
  return{v:{P,F1,F2},text:`<p>Deux forces s'appliquent au même point A${F.pt(P)} m : <span class="v">F</span><sub>1</sub> = ${F.vec(F1)} N et <span class="v">F</span><sub>2</sub> = ${F.vec(F2)} N. Calcule le moment résultant <span class="v">M</span><sub>R</sub> par rapport à O.</p>`,
    fields:[{label:'M_Rx',unit:'N·m',ans:M[0],tol:0.05,d:1,s:1,hint:H.sig},{label:'M_Ry',unit:'N·m',ans:M[1],tol:0.05,d:1,s:1,hint:H.sig},{label:'M_Rz',unit:'N·m',ans:M[2],tol:0.05,d:1,s:1,hint:H.sig}],
    sol:`Même point d'application : on additionne d'abord les forces (distributivité)
F1 + F2 = ${F.vec(S)} N        r = ${F.vec(P)} m
M_R = r × (F1 + F2) :
M_Rx = (${F.n(P[1])})(${F.n(S[2])}) − (${F.n(P[2])})(${F.n(S[1])}) = ${F.n(M[0])}
M_Ry = (${F.n(P[2])})(${F.n(S[0])}) − (${F.n(P[0])})(${F.n(S[2])}) = ${F.n(M[1])}
M_Rz = (${F.n(P[0])})(${F.n(S[1])}) − (${F.n(P[1])})(${F.n(S[0])}) = ${F.n(M[2])}
M_R = ${F.vec(M)} N·m`}}},

{id:'momentaxe',chap:'Moment / axe',pts:3,gen(R,F){
  let P,Fv,d,L,M,Ma;
  do{P=vecInt(R,-3,4);Fv=vecInt(R,-6,6,10);d=dirEntiere(R,[[3,4,0],[1,2,2],[2,1,2],[2,3,6],[0,3,4],[4,4,7]]);L=norm(d);M=cross(P,Fv);Ma=dot(M,d)/L}while(Math.abs(Ma)<1);
  const frac=d.map((c,i)=>c===0?'':(c<0?'− ':(d.slice(0,i).some(x=>x!==0)?'+ ':''))+'('+Math.abs(c)+'/'+L+') '+'ijk'[i]).filter(Boolean).join(' ');
  return{v:{P,Fv,d},text:`<p>La force <span class="v">F</span> = ${F.vec(Fv)} N s'applique au point P${F.pt(P)} m. Calcule le moment de F par rapport à l'axe passant par O et dirigé par <span class="v">u</span><sub>a</sub> = ${frac}.</p>`,
    fields:[{label:'M_a',unit:'N·m',ans:Ma,d:2,tol:0.05,s:1,hint:'avec son signe (main droite autour de u_a)'}],
    sol:`M_O = r × F = ${F.vec(M)} N·m
M_a = u_a · (r × F) = ${d.map((c,i)=>'('+F.n(c)+'/'+L+')('+F.n(M[i])+')').join(' + ')}
M_a = ${F.n(Ma,2)} N·m${Ma<0?'   (négatif : le moment tourne dans le sens opposé à u_a, règle de la main droite)':''}`}}}

];
})();
