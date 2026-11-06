/* Banque de questions du mini-DS Statique (chapitres 1 à 3).
   Chaque générateur tire ses valeurs au hasard (R) et renvoie énoncé, cases réponse et correction.
   Pour ajouter une question : copier un bloc, changer id/chap/pts et la fonction gen. */
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

window.BANQUE_STATIQUE=[

{id:'resultante',chap:'Forces 2D',pts:3,gen(R,F){
  let F1,t1,F2,t2,Rx,Ry,FR;
  do{F1=R.int(10,40)*10;t1=R.pick([10,15,20,25,30,35,40,45,50,55,60,65,70]);
     F2=R.int(8,30)*10;t2=R.pick([100,110,120,130,135,140,150,160,200,210,225,240]);
     Rx=F1*Math.cos(rad(t1))+F2*Math.cos(rad(t2));Ry=F1*Math.sin(rad(t1))+F2*Math.sin(rad(t2));FR=Math.hypot(Rx,Ry)}while(FR<40);
  const th=(deg(Math.atan2(Ry,Rx))+360)%360;
  return{text:`<p>Deux forces agissent sur une cheville : <span class="v">F₁</span> = ${F1} N à ${t1}° de l'axe +x, et <span class="v">F₂</span> = ${F2} N à ${t2}° de l'axe +x (angles comptés dans le sens anti-horaire depuis +x). Donne l'intensité de la résultante et sa direction.</p>`,
    fields:[{label:'FR',unit:'N',ans:FR,d:1},{label:'θ depuis +x (0 à 360°)',unit:'°',ans:th,type:'angle',d:1}],
    sol:`F₁x = ${F1} cos ${t1}° = ${F.n(F1*Math.cos(rad(t1)),1)} N     F₁y = ${F1} sin ${t1}° = ${F.n(F1*Math.sin(rad(t1)),1)} N
F₂x = ${F2} cos ${t2}° = ${F.n(F2*Math.cos(rad(t2)),1)} N     F₂y = ${F2} sin ${t2}° = ${F.n(F2*Math.sin(rad(t2)),1)} N
FRx = ${F.n(Rx,1)} N      FRy = ${F.n(Ry,1)} N
FR = √(FRx² + FRy²) = ${F.n(FR,1)} N
arctan(|FRy| / |FRx|) = ${F.n(deg(Math.atan(Math.abs(Ry/Rx))),1)}°, puis on place l'angle dans le bon quadrant
θ = ${F.n(th,1)}° depuis +x`,
    note:`<p class="mds-note">Piège : la calculatrice donne arctan entre −90° et 90°. Regarde les signes de FRx et FRy pour savoir dans quel quadrant est la résultante.</p>`}}},

{id:'cable',chap:'Vecteur position',pts:3,gen(R,F){
  const d=dirEntiere(R,QUADS.filter(q=>q[2]!==0&&q[0]!==q[2]));
  const A=[R.int(-3,4),R.int(-3,4),R.int(0,3)];const B=A.map((a,i)=>a+d[i]);
  const L=norm(d),Fm=R.int(3,16)*50,Fv=d.map(c=>Fm*c/L);
  return{text:`<p>Un câble exerce sur le point A${F.pt(A)} m une force de ${Fm} N, dirigée de A vers B${F.pt(B)} m. Écris cette force en vecteur cartésien.</p>`,
    fields:[{label:'Fx',unit:'N',ans:Fv[0],d:1},{label:'Fy',unit:'N',ans:Fv[1],d:1},{label:'Fz',unit:'N',ans:Fv[2],d:1}],
    sol:`r_AB = B − A = ${F.vec(d)} m
|r_AB| = √(${d.map(c=>c*c).join(' + ')}) = ${F.n(L,3)} m
u_AB = r_AB / |r_AB| = ${F.vec(d.map(c=>c/L),3)}
F = ${Fm} · u_AB = ${F.vec(Fv,1)} N`}}},

{id:'angles',chap:'Vecteurs 3D',pts:3,gen(R,F){
  const A=[R.nz(-6,6),R.nz(-6,6),R.int(-6,6)];const n=norm(A);
  const a=deg(Math.acos(A[0]/n)),b=deg(Math.acos(A[1]/n)),c=deg(Math.acos(A[2]/n));
  return{text:`<p>Soit <span class="v">A</span> = ${F.vec(A)} N. Calcule sa norme et ses angles directeurs α et γ.</p>`,
    fields:[{label:'|A|',unit:'N',ans:n,d:2},{label:'α',unit:'°',ans:a,type:'angle',d:1},{label:'γ',unit:'°',ans:c,type:'angle',d:1}],
    sol:`|A| = √(${A.map(x=>x<0?'('+F.n(x)+')²':x+'²').join(' + ')}) = √${dot(A,A)} = ${F.n(n,3)} N
cos α = ${F.n(A[0])}/${F.n(n,3)}  →  α = ${F.n(a,1)}°
cos β = ${F.n(A[1])}/${F.n(n,3)}  →  β = ${F.n(b,1)}°
cos γ = ${F.n(A[2])}/${F.n(n,3)}  →  γ = ${F.n(c,1)}°
Vérif : cos²α + cos²β + cos²γ = 1`}}},

{id:'angle2',chap:'Produit scalaire',pts:2,gen(R,F){
  let a,b,c;do{a=vecInt(R,-5,6);b=vecInt(R,-5,6);c=dot(a,b)/(norm(a)*norm(b))}while(Math.abs(c)>0.97);
  const th=deg(Math.acos(c));
  return{text:`<p>Calcule le produit scalaire et l'angle entre <span class="v">a</span> = ${F.vec(a)} et <span class="v">b</span> = ${F.vec(b)}.</p>`,
    fields:[{label:'a · b',unit:'',ans:dot(a,b),tol:0.01,d:0},{label:'θ',unit:'°',ans:th,type:'angle',d:1}],
    sol:`a · b = ${a.map((x,i)=>'('+F.n(x)+')('+F.n(b[i])+')').join(' + ')} = ${dot(a,b)}
|a| = √${dot(a,a)} = ${F.n(norm(a),3)}     |b| = √${dot(b,b)} = ${F.n(norm(b),3)}
θ = arccos(${dot(a,b)} / ${F.n(norm(a)*norm(b),3)}) = ${F.n(th,1)}°`}}},

{id:'projection',chap:'Produit scalaire',pts:3,gen(R,F){
  const Fv=vecInt(R,-6,6,10);const d=dirEntiere(R);const L=norm(d),u=d.map(c=>c/L);
  const par=dot(Fv,u),perp=Math.sqrt(Math.max(0,dot(Fv,Fv)-par*par));
  return{text:`<p>La force <span class="v">F</span> = ${F.vec(Fv)} N agit en O. Calcule la composante de F parallèle à la droite OA, avec A${F.pt(d)} m, puis la composante perpendiculaire.</p>`,
    fields:[{label:'F∥',unit:'N',ans:par,d:1},{label:'F⊥',unit:'N',ans:perp,d:1}],
    sol:`u_OA = ${F.vec(d)} / ${F.n(L,3)} = ${F.vec(u,3)}
F∥ = F · u_OA = ${F.n(par,2)} N${par<0?'   (négatif : F pointe dans le sens opposé à u)':''}
|F| = √${dot(Fv,Fv)} = ${F.n(norm(Fv),2)} N
F⊥ = √(F² − F∥²) = ${F.n(perp,1)} N`}}},

{id:'equilibre',chap:'Équilibre',pts:4,gen(R,F){
  const m=R.int(5,40),a=R.pick([20,25,30,35,40,45,50,55,60,65]),b=R.pick([20,25,30,35,40,45,50,55,60,65,70]);
  const W=m*g,s=Math.sin(rad(a+b)),TG=W*Math.cos(rad(b))/s,TD=W*Math.cos(rad(a))/s;
  return{text:`<p>Un sac de ${m} kg pend à un nœud. Le câble gauche monte vers la gauche à ${a}° de l'horizontale, le câble droit monte vers la droite à ${b}° de l'horizontale. Fais le DCL du nœud et calcule les deux tensions (g = 9,81 m/s²).</p>`,
    fields:[{label:'T gauche',unit:'N',ans:TG,d:1},{label:'T droit',unit:'N',ans:TD,d:1}],
    sol:`W = ${m} × 9,81 = ${F.n(W,1)} N
ΣFx = 0 :  −T_G cos ${a}° + T_D cos ${b}° = 0
ΣFy = 0 :   T_G sin ${a}° + T_D sin ${b}° − ${F.n(W,1)} = 0
De la 1ʳᵉ : T_D = T_G · cos ${a}° / cos ${b}°, on remplace dans la 2ᵉ :
T_G = ${F.n(TG,1)} N      T_D = ${F.n(TD,1)} N`}}},

{id:'ressort',chap:'Équilibre',pts:3,gen(R,F){
  const m=R.int(4,25),a=R.pick([30,35,40,45,50,55,60]),k=R.pick([200,250,300,400,500,600,800]),l0=R.pick([0.3,0.4,0.5,0.6]);
  const W=m*g,T=W/Math.sin(rad(a)),Fs=W/Math.tan(rad(a)),l=l0+Fs/k;
  return{text:`<p>Une masse de ${m} kg est suspendue en un point A. A est retenu par un câble qui monte vers la droite à ${a}° de l'horizontale et par un ressort horizontal qui tire vers la gauche (k = ${k} N/m, longueur à vide ${F.n(l0)} m). Calcule la tension du câble, la force du ressort et la longueur du ressort.</p>`,
    fields:[{label:'T câble',unit:'N',ans:T,d:1},{label:'F ressort',unit:'N',ans:Fs,d:1},{label:'longueur l',unit:'m',ans:l,d:3,tol:0.005}],
    sol:`W = ${m} × 9,81 = ${F.n(W,1)} N
ΣFy = 0 :  T sin ${a}° − W = 0      →  T = ${F.n(T,1)} N
ΣFx = 0 :  T cos ${a}° − F_s = 0    →  F_s = ${F.n(Fs,1)} N
F_s = k (l − l₀)  →  l = ${F.n(l0)} + ${F.n(Fs,1)}/${k} = ${F.n(l,3)} m`}}},

{id:'vectoriel',chap:'Produit vectoriel',pts:2,gen(R,F){
  let A,B,C;do{A=vecInt(R,-4,5);B=vecInt(R,-4,5);C=cross(A,B)}while(norm(C)===0);
  return{text:`<p>Calcule <span class="v">A</span> × <span class="v">B</span> avec A = ${F.vec(A)} et B = ${F.vec(B)}.</p>`,
    fields:[{label:'composante i',unit:'',ans:C[0],tol:0.01,d:0},{label:'composante j',unit:'',ans:C[1],tol:0.01,d:0},{label:'composante k',unit:'',ans:C[2],tol:0.01,d:0}],
    sol:`i :   (${F.n(A[1])})(${F.n(B[2])}) − (${F.n(A[2])})(${F.n(B[1])}) = ${F.n(C[0])}
j : −[(${F.n(A[0])})(${F.n(B[2])}) − (${F.n(A[2])})(${F.n(B[0])})] = ${F.n(C[1])}
k :   (${F.n(A[0])})(${F.n(B[1])}) − (${F.n(A[1])})(${F.n(B[0])}) = ${F.n(C[2])}
A × B = ${F.vec(C)}
Vérif : (A×B)·A = ${dot(C,A)} et (A×B)·B = ${dot(C,B)}`,
    note:`<p class="mds-note">Piège classique : oublier le signe moins devant la composante j.</p>`}}},

{id:'varignon',chap:'Moment 2D',pts:2,gen(R,F){
  let x,y,Fm,t,Fx,Fy,M;
  do{x=R.int(-4,5);y=R.int(-3,4);Fm=R.int(5,30)*10;t=R.pick([20,30,40,45,50,60,120,135,150,210,240,300,315]);
     Fx=Fm*Math.cos(rad(t));Fy=Fm*Math.sin(rad(t));M=x*Fy-y*Fx}while((x===0&&y===0)||Math.abs(M)<5);
  return{text:`<p>Une force de ${Fm} N, orientée à ${t}° de l'axe +x (sens anti-horaire), s'applique au point P(${F.n(x)} ; ${F.n(y)}) m. Calcule son moment par rapport à O, compté positif dans le sens anti-horaire.</p>`,
    fields:[{label:'M_O',unit:'N·m',ans:M,d:1,tol:0.5}],
    sol:`Fx = ${Fm} cos ${t}° = ${F.n(Fx,2)} N      Fy = ${Fm} sin ${t}° = ${F.n(Fy,2)} N
Varignon : M_O = x Fy − y Fx = (${F.n(x)})(${F.n(Fy,2)}) − (${F.n(y)})(${F.n(Fx,2)})
M_O = ${F.n(M,1)} N·m   (${M>0?'anti-horaire':'horaire'})`}}},

{id:'moment3d',chap:'Moment 3D',pts:4,gen(R,F){
  let P,Fv,M;do{P=vecInt(R,-3,4);Fv=vecInt(R,-6,6,10);M=cross(P,Fv)}while(norm(M)<1);
  return{text:`<p>La force <span class="v">F</span> = ${F.vec(Fv)} N s'applique au point P${F.pt(P)} m. Calcule le moment <span class="v">M</span><sub>O</sub> par rapport à l'origine et sa norme.</p>`,
    fields:[{label:'M_x',unit:'N·m',ans:M[0],tol:0.05,d:1},{label:'M_y',unit:'N·m',ans:M[1],tol:0.05,d:1},{label:'M_z',unit:'N·m',ans:M[2],tol:0.05,d:1},{label:'|M_O|',unit:'N·m',ans:norm(M),d:1}],
    sol:`r = OP = ${F.vec(P)} m,  M_O = r × F  (dans cet ordre)
i :   (${F.n(P[1])})(${F.n(Fv[2])}) − (${F.n(P[2])})(${F.n(Fv[1])}) = ${F.n(M[0])}
j : −[(${F.n(P[0])})(${F.n(Fv[2])}) − (${F.n(P[2])})(${F.n(Fv[0])})] = ${F.n(M[1])}
k :   (${F.n(P[0])})(${F.n(Fv[1])}) − (${F.n(P[1])})(${F.n(Fv[0])}) = ${F.n(M[2])}
M_O = ${F.vec(M)} N·m
|M_O| = √${dot(M,M)} = ${F.n(norm(M),1)} N·m
Vérif : M_O · r = ${dot(M,P)} ✓`}}},

{id:'momentaxe',chap:'Moment / axe',pts:3,gen(R,F){
  let P,Fv,d,L,M,Ma;
  do{P=vecInt(R,-3,4);Fv=vecInt(R,-6,6,10);d=dirEntiere(R,[[3,4,0],[1,2,2],[2,1,2],[2,3,6],[0,3,4],[4,4,7]]);L=norm(d);M=cross(P,Fv);Ma=dot(M,d)/L}while(Math.abs(Ma)<1);
  const frac=d.map((c,i)=>c===0?'':(c<0?'− ':(d.slice(0,i).some(x=>x!==0)?'+ ':''))+'('+Math.abs(c)+'/'+L+') '+'ijk'[i]).filter(Boolean).join(' ');
  return{text:`<p>La force <span class="v">F</span> = ${F.vec(Fv)} N s'applique au point P${F.pt(P)} m. Calcule le moment de F par rapport à l'axe passant par O et dirigé par <span class="v">u</span> = ${frac}.</p>`,
    fields:[{label:'M_a',unit:'N·m',ans:Ma,d:2,tol:0.05}],
    sol:`M_O = r × F = ${F.vec(M)} N·m
M_a = u · M_O = ${d.map((c,i)=>'('+F.n(c)+'/'+L+')('+F.n(M[i])+')').join(' + ')}
M_a = ${F.n(Ma,2)} N·m${Ma<0?'   (négatif : le moment tourne dans le sens opposé à u, règle de la main droite)':''}`}}}

];
})();
