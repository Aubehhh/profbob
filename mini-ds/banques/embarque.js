/* Banque du mini-DS Informatique embarquée (cours « Systèmes embarqués » de D. Gheysens), alignée sur /cours/embarque/….
   L'examen final porte sur les concepts et la lecture de code : beaucoup de questions donnent un extrait de programme.
   Cases nombre, « choix » et « texte » (voir assets/minids.js). Profil de notation « aucun ».
   Vérification : node outils/verif-minids.js 3000 embarque */
(function(){
const e=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const c=s=>'<code>'+e(s)+'</code>';
const pre=s=>'<pre class="mds-code">'+e(s)+'</pre>';
const choix=(R,bonne,autres)=>{const o=R.shuffle([bonne,...autres]);return {options:o,ans:o.indexOf(bonne)}};
const bin8=n=>(n&255).toString(2).padStart(8,'0');
const POIDS=[128,64,32,16,8,4,2,1];
const detail=b=>b.split('').map((x,i)=>x==='1'?POIDS[i]:0).filter(Boolean).join(' + ')||'0';
const H={ent:'un nombre entier',sig:'avec son signe',bin:'8 chiffres, ex. 00101100'};

window.BANQUE_EMBARQUE=[

/* ---------- Cours 1 : systèmes embarqués et binaire ---------- */

{id:'bin2dec',chap:'Binaire',pts:2,gen(R,F){
  const n=R.int(1,255),b=bin8(n);
  return{v:{b},text:`<p>Convertis l'octet ${c(b)} en décimal (sans signe).</p>`,
    fields:[{label:'décimal',unit:'',ans:n,d:0,tol:0.01,hint:H.ent}],
    sol:`poids : 128 64 32 16 8 4 2 1
${b} = ${detail(b)} = ${n}`}}},

{id:'dec2bin',chap:'Binaire',pts:2,gen(R,F){
  const n=R.int(1,255),b=bin8(n);
  return{v:{n},text:`<p>Écris ${n} en binaire sur 8 bits.</p>`,
    fields:[{label:'binaire',type:'texte',ans:[b,b.replace(/^0+/,'')],hint:H.bin}],
    sol:`${n} = ${detail(b)}
→ ${b}`}}},

{id:'signe',chap:'Nombres négatifs',pts:2,gen(R,F){
  const n=R.int(128,255),b=bin8(n);
  return{v:{b},text:`<p>Que vaut l'octet ${c(b)} en décimal, sans signe puis en complément à 2 (avec signe) ?</p>`,
    fields:[{label:'sans signe',unit:'',ans:n,d:0,tol:0.01,hint:H.ent},{label:'avec signe',unit:'',ans:n-256,d:0,tol:0.01,s:1,hint:H.sig}],
    sol:`sans signe : ${detail(b)} = ${n}
avec signe : le bit de gauche vaut −128  →  −128 + ${n-128} = ${n-256}   (= ${n} − 256)`}}},

{id:'complement',chap:'Nombres négatifs',pts:2,gen(R,F){
  const n=R.int(1,127),b=bin8(n),inv=b.split('').map(x=>x==='1'?'0':'1').join(''),res=bin8(256-n);
  return{v:{n},text:`<p>Écris −${n} en binaire sur 8 bits, en complément à 2.</p>`,
    fields:[{label:'binaire',type:'texte',ans:[res],hint:H.bin}],
    sol:`${n} = ${b}
inverser chaque bit : ${inv}
ajouter 1 : ${res}
vérification : −128 + ${256-n-128} = −${n}`}}},

{id:'plage',chap:'Binaire',pts:2,gen(R,F){
  const n=R.pick([4,6,8,10,12,16]);
  return{v:{n},text:`<p>Sur un mot de ${n} bits : combien de valeurs différentes peut-on coder, quelle est la plus grande valeur sans signe, et la plus petite en complément à 2 ?</p>`,
    fields:[{label:'valeurs',unit:'',ans:2**n,d:0,tol:0.01,hint:H.ent},{label:'max sans signe',unit:'',ans:2**n-1,d:0,tol:0.01,hint:H.ent},{label:'min signé',unit:'',ans:-(2**(n-1)),d:0,tol:0.01,s:1,hint:H.sig}],
    sol:`2^${n} = ${2**n} valeurs
sans signe : de 0 à 2^${n} − 1 = ${2**n-1}
avec signe : de −2^${n-1} = ${-(2**(n-1))} à 2^${n-1} − 1 = ${2**(n-1)-1}`}}},

{id:'portes',chap:'Portes logiques',pts:2,gen(R,F){
  const A=R.int(0,1),B=R.int(0,1),C=R.int(0,1),g1=R.pick(['ET','OU','XOR']),g2=R.pick(['ET','OU','XOR']),neg=R.rnd()<.4;
  const op=(g,x,y)=>g==='ET'?x&y:g==='OU'?x|y:x^y,s1=op(g1,A,B),s1b=neg?1-s1:s1,s=op(g2,s1b,C);
  return{v:{A,B,C,g1,g2,neg},text:`<p>A = ${A}, B = ${B}, C = ${C}. On calcule S = ( ${neg?'NON ':''}(A ${g1} B) ) ${g2} C. Que valent la sortie intermédiaire ${neg?'NON ':''}(A ${g1} B) et S ?</p>`,
    fields:[{label:'intermédiaire',unit:'',ans:s1b,d:0,tol:0.01,hint:'0 ou 1'},{label:'S',unit:'',ans:s,d:0,tol:0.01,hint:'0 ou 1'}],
    sol:`A ${g1} B = ${A} ${g1} ${B} = ${s1}${neg?`\nNON ${s1} = ${s1b}`:''}
S = ${s1b} ${g2} ${C} = ${s}
(ET : 1 si les deux à 1 ; OU : 1 si au moins un ; XOR : 1 si exactement un)`}}},

{id:'ascii',chap:'ASCII',pts:2,gen(R,F){
  const [base,code0,nom]=R.pick([['a',97,'minuscule'],['A',65,'majuscule']]),k=R.int(0,25),ch=String.fromCharCode(code0+k);
  return{v:{ch},text:`<p>En ASCII, « ${base} » vaut ${code0} et les lettres se suivent. Quel est le code décimal de la lettre ${nom} « ${ch} », et son écriture binaire sur 8 bits ?</p>`,
    fields:[{label:'code',unit:'',ans:code0+k,d:0,tol:0.01,hint:H.ent},{label:'binaire',type:'texte',ans:[bin8(code0+k)],hint:H.bin}],
    sol:`« ${ch} » est la ${k+1}ᵉ lettre : ${code0} + ${k} = ${code0+k}
${code0+k} = ${detail(bin8(code0+k))} → ${bin8(code0+k)}`}}},

/* ---------- Cours 1 suite : premiers programmes Arduino ---------- */

{id:'fonction',chap:'Arduino',pts:2,gen(R,F){
  const T=[['déclarer le port 9 comme sortie','pinMode'],['mettre une sortie à 5 V','digitalWrite'],['lire l\'état d\'un bouton','digitalRead'],['mettre le programme en pause','delay'],
    ['afficher une valeur sur le moniteur série','Serial.println'],['ouvrir la liaison avec le moniteur série','Serial.begin'],['lire une tension sur A0','analogRead'],['envoyer un signal PWM à un moteur','analogWrite'],
    ['connaître le temps écoulé depuis le démarrage','millis'],['déclencher une fonction quand un bouton change d\'état','attachInterrupt']];
  const [quoi,f]=R.pick(T),ch=choix(R,f,R.shuffle(T.filter(x=>x[1]!==f)).slice(0,3).map(x=>x[1]));
  return{v:{quoi},text:`<p>Quelle fonction Arduino sert à <b>${quoi}</b> ?</p>`,
    fields:[{label:'fonction',type:'choix',options:ch.options,ans:ch.ans}],
    sol:`${f}() : ${quoi}`}}},

{id:'blink',chap:'Arduino',pts:2,gen(R,F){
  const on=R.pick([100,200,250,300,400,500,750,1000,1500,2000]),off=R.pick([100,200,250,300,500,1000,1500,2000]),P=on+off;
  const code=`void loop() {\n  digitalWrite(led, HIGH);\n  delay(${on});\n  digitalWrite(led, LOW);\n  delay(${off});\n}`;
  return{v:{on,off},text:`<p>Avec ce programme, quelle est la période du clignotement, sa fréquence, et combien de fois la LED s'allume-t-elle en une minute ?</p>${pre(code)}`,
    fields:[{label:'période',unit:'ms',ans:P,d:0,tol:0.01,hint:'en ms'},{label:'fréquence',unit:'Hz',ans:1000/P,d:3,tol:0,hint:'en Hz'},{label:'par minute',unit:'',ans:60000/P,d:2,tol:0,hint:'nombre de clignotements'}],
    sol:`période = ${on} + ${off} = ${P} ms
fréquence = 1 / ${F.n(P/1000,3)} s = ${F.n(1000/P,3)} Hz
en une minute : 60 000 / ${P} = ${F.n(60000/P,2)} clignotements`}}},

{id:'type',chap:'Arduino',pts:2,gen(R,F){
  const T=[['byte',8,'0 à 255'],['int',16,'−32 768 à 32 767'],['unsigned long',32,'0 à 4 294 967 295'],['bool',8,'true ou false']];
  const [t,b,pl]=R.pick(T);
  return{v:{t},text:`<p>Sur l'Arduino Uno, combien de bits occupe une variable de type ${c(t)} en mémoire ?</p>`,
    fields:[{label:'taille',unit:'bits',ans:b,d:0,tol:0.01,hint:H.ent}],
    sol:`${t} : ${b} bits (${b/8} octet${b>8?'s':''}), valeurs ${pl}${t==='bool'?'\nle cours dit « 1 bit », mais un bool occupe 1 octet en mémoire':''}`}}},

{id:'serie',chap:'Arduino',pts:2,gen(R,F){
  const k=R.pick([5,8,10,12]),t=R.int(k+1,4*k+3);
  const code=`int compteur = 0;\n\nvoid loop() {\n  compteur = compteur + 1;\n  delay(1000);\n  Serial.print("*");\n  if (compteur == ${k}) {\n    compteur = 0;\n    Serial.println("");\n  }\n}`;
  const lignes=Math.floor(t/k),reste=t%k;
  return{v:{k,t},text:`<p>Ce programme tourne depuis ${t} s (on néglige le temps d'exécution hors delay). Combien de lignes complètes d'étoiles sont affichées, et combien d'étoiles y a-t-il sur la ligne en cours ?</p>${pre(code)}`,
    fields:[{label:'lignes complètes',unit:'',ans:lignes,d:0,tol:0.01,hint:H.ent},{label:'étoiles en cours',unit:'',ans:reste,d:0,tol:0.01,hint:H.ent}],
    sol:`une étoile par seconde, retour à la ligne toutes les ${k} étoiles
${t} = ${lignes} × ${k} + ${reste}  →  ${lignes} ligne${lignes>1?'s':''} complète${lignes>1?'s':''}, ${reste} étoile${reste>1?'s':''} sur la ligne en cours`}}},

/* ---------- Cours 2 : fonctions et structures de contrôle ---------- */

{id:'boucle_for',chap:'Boucles',pts:2,gen(R,F){
  const a=R.int(0,5),pas=R.pick([1,2,3]),b=a+pas*R.int(2,8)+R.int(0,pas-1),cmp=R.pick(['<','<=']);
  let n=0,last=null,sum=0;for(let i=a;cmp==='<'?i<b:i<=b;i+=pas){n++;last=i;sum+=i}
  const inc=pas===1?'i++':'i = i + '+pas;
  const code=`for (int i = ${a}; i ${cmp} ${b}; ${inc}) {\n  Serial.println(i);\n}`;
  return{v:{a,b,pas,cmp},text:`<p>Combien de nombres cette boucle affiche-t-elle, et quel est le dernier ?</p>${pre(code)}`,
    fields:[{label:'nombre de tours',unit:'',ans:n,d:0,tol:0.01,hint:H.ent},{label:'dernier affiché',unit:'',ans:last,d:0,tol:0.01,hint:H.ent}],
    sol:`i prend les valeurs ${a}, ${a+pas}, … tant que i ${cmp} ${b}
dernière valeur : ${last}  →  ${n} tour${n>1?'s':''}`}}},

{id:'boucle_while',chap:'Boucles',pts:2,gen(R,F){
  const a=R.int(0,4),m=R.pick([2,3]),lim=R.int(20,120);
  let v=a===0?1:a,n=0;const v0=v;while(v<lim){v=v*m;n++}
  const code=`int v = ${v0};\nwhile (v < ${lim}) {\n  v = v * ${m};\n}\nSerial.println(v);`;
  return{v:{v0,m,lim},text:`<p>Combien de tours fait la boucle, et quelle valeur est affichée ?</p>${pre(code)}`,
    fields:[{label:'tours',unit:'',ans:n,d:0,tol:0.01,hint:H.ent},{label:'affiché',unit:'',ans:v,d:0,tol:0.01,hint:H.ent}],
    sol:`v : ${(()=>{let x=v0,s=[x];while(x<lim){x*=m;s.push(x)}return s.join(' → ')})()}
on s'arrête dès que v ≥ ${lim} : ${n} tours, affiche ${v}`}}},

{id:'ifelse',chap:'Conditions',pts:2,gen(R,F){
  const a=R.int(0,3),k=a+R.int(2,6),t=R.int(1,4)+(k-a);
  const code=`int value = ${a};\n\nvoid loop() {\n  if (value < ${k}) {\n    Serial.println(value);\n    value = value + 1;\n  } else {\n    Serial.println("trop grand");\n  }\n}`;
  return{v:{a,k,t},text:`<p>Combien de nombres ce programme affiche-t-il avant le premier « trop grand », et combien de fois aura-t-il affiché « trop grand » après ${k-a+t} passages dans loop() ?</p>${pre(code)}`,
    fields:[{label:'nombres',unit:'',ans:k-a,d:0,tol:0.01,hint:H.ent},{label:'« trop grand »',unit:'',ans:t,d:0,tol:0.01,hint:H.ent}],
    sol:`value affiche ${a}${k-a>1?' … '+(k-1):''} : ${k-a} nombre${k-a>1?'s':''}, puis la condition value &lt; ${k} est fausse pour toujours
sur ${k-a+t} passages : ${k-a} nombres puis ${t} fois « trop grand »`}}},

{id:'logique',chap:'Conditions',pts:2,gen(R,F){
  const b1=R.int(0,1),b2=R.int(0,1),op=R.pick(['&&','||']),neg=R.rnd()<.3;
  const v=op==='&&'?(b1&&b2):(b1||b2),vv=neg?!v:v;
  const code=`if (${neg?'!(':''}digitalRead(button1) == HIGH ${op} digitalRead(button2) == HIGH${neg?')':''}) {\n  digitalWrite(led, HIGH);\n} else {\n  digitalWrite(led, LOW);\n}`;
  return{v:{b1,b2,op,neg},text:`<p>Le bouton 1 est ${b1?'appuyé (HIGH)':'relâché (LOW)'} et le bouton 2 est ${b2?'appuyé (HIGH)':'relâché (LOW)'}. La LED est-elle allumée ?</p>${pre(code)}`,
    fields:[{label:'LED',type:'choix',options:['allumée','éteinte'],ans:vv?0:1}],
    sol:`${b1?'vrai':'faux'} ${op==='&&'?'ET':'OU'} ${b2?'vrai':'faux'} = ${v?'vrai':'faux'}${neg?` ; avec le ! (NON) : ${vv?'vrai':'faux'}`:''}  →  LED ${vv?'allumée':'éteinte'}`}}},

{id:'pullup',chap:'Boutons',pts:2,gen(R,F){
  const m=R.pick(['pull-up','pull-down']),appui=R.rnd()<.5,haut=(m==='pull-down')===appui;
  return{v:{m,appui},text:`<p>Un bouton est câblé en <b>${m}</b> sur le port 8. Bouton ${appui?'appuyé':'relâché'}, que renvoie ${c('digitalRead(8)')} ?</p>`,
    fields:[{label:'état',type:'choix',options:['HIGH','LOW'],ans:haut?0:1}],
    sol:`${m} : au repos ${m==='pull-up'?'HIGH (5 V)':'LOW (0 V)'}, appuyé ${m==='pull-up'?'LOW (0 V)':'HIGH (5 V)'}
→ ${haut?'HIGH':'LOW'}`}}},

/* ---------- Cours 2 suite : temps réel ---------- */

{id:'millis',chap:'millis()',pts:2,gen(R,F){
  const d=R.pick([500,800,1000,1500,2000]),t1=R.int(10,30)*100,t2=t1+R.int(2,Math.floor(d/100)-1)*100;
  return{v:{d,t1,t2},text:`<p>Une LED s'allume à chaque appui sur un bouton et s'éteint quand ${c('millis() > time1 + '+d)}, avec ${c('time1 = millis()')} enregistré à chaque appui. On appuie à ${t1} ms puis à nouveau à ${t2} ms. À quel instant la LED s'éteint-elle ?</p>`,
    fields:[{label:'extinction',unit:'ms',ans:t2+d,d:0,tol:0.01,hint:'en ms'}],
    sol:`le 2ᵉ appui (à ${t2} ms, avant l'extinction prévue à ${t1+d} ms) remplace time1
extinction à ${t2} + ${d} = ${t2+d} ms`}}},

{id:'pwm',chap:'PWM',pts:2,gen(R,F){
  const v=R.int(1,254);
  return{v:{v},text:`<p>${c('analogWrite(9, '+v+');')} — quel est le rapport cyclique, et la tension moyenne sur le port 9 ?</p>`,
    fields:[{label:'α',unit:'%',ans:v/255*100,d:1,tol:0.2,hint:'en %'},{label:'tension moyenne',unit:'V',ans:v/255*5,d:2,tol:0.02,hint:'en V'}],
    sol:`α = ${v} / 255 = ${F.n(v/255*100,1)} %
tension moyenne = α × 5 V = ${F.n(v/255*5,2)} V`}}},

{id:'pwminverse',chap:'PWM',pts:2,gen(R,F){
  const U=R.int(5,48)/10,val=Math.round(U/5*255);
  return{v:{U},text:`<p>On veut une tension moyenne de ${F.n(U,1)} V sur un port PWM. Quelle valeur entière faut-il donner à ${c('analogWrite')} ?</p>`,
    fields:[{label:'valeur',unit:'',ans:val,d:0,tol:1,hint:'de 0 à 255'}],
    sol:`valeur = U / 5 × 255 = ${F.n(U,1)} / 5 × 255 = ${F.n(U/5*255,2)} → ${val}`}}},

{id:'analogread',chap:'Analogique',pts:2,gen(R,F){
  const U=R.int(1,49)/10,val=Math.round(U/5*1023),out=Math.floor(val/4);
  return{v:{U},text:`<p>Un capteur délivre ${F.n(U,1)} V sur A0. Quelle valeur renvoie à peu près ${c('analogRead(A0)')}, et quelle valeur envoie-t-on au moteur avec ${c('analogWrite(motor, value / 4)')} ?</p>`,
    fields:[{label:'analogRead',unit:'',ans:val,d:0,tol:2,hint:'de 0 à 1023'},{label:'analogWrite',unit:'',ans:out,d:0,tol:1,hint:'de 0 à 255'}],
    sol:`analogRead ≈ ${F.n(U,1)} / 5 × 1023 = ${F.n(U/5*1023,1)} → ${val}
${val} / 4 = ${out} (division entière)`,
    note:`<p class="mds-note">Piège : value * (255/1023) vaut 0 en C, car 255/1023 est une division entière.</p>`}}},

{id:'interruption',chap:'Interruptions',pts:2,gen(R,F){
  const T=[['quand le bouton passe de relâché (LOW) à appuyé (HIGH)','RISING'],['quand le bouton passe de HIGH à LOW','FALLING'],['à chaque changement d\'état du port','CHANGE'],['tant que le port est à l\'état bas','LOW']];
  const [quoi,m]=R.pick(T);
  return{v:{quoi},text:`<p>Quel mode passer à ${c('attachInterrupt')} pour déclencher la fonction <b>${quoi}</b> ?</p>`,
    fields:[{label:'mode',type:'choix',options:['LOW','CHANGE','RISING','FALLING'],ans:['LOW','CHANGE','RISING','FALLING'].indexOf(m)}],
    sol:`${m} : ${quoi}`}}},

{id:'ports',chap:'Analogique',pts:2,gen(R,F){
  const p=R.int(0,13),pwm=[3,5,6,9,10,11].includes(p);
  return{v:{p},text:`<p>Sur l'Arduino Uno, peut-on utiliser ${c('analogWrite('+p+', 128)')} ?</p>`,
    fields:[{label:'port '+p,type:'choix',options:['oui, port PWM (~)','non, pas de PWM sur ce port'],ans:pwm?0:1}],
    sol:`ports PWM (~) : 3, 5, 6, 9, 10, 11  →  ${pwm?'oui':'non'}${p<2?' (et 0, 1 servent à la liaison série)':''}${p===2||p===3?' (2 et 3 servent aussi aux interruptions)':''}`}}},

{id:'timer',chap:'Timers',pts:2,gen(R,F){
  const N=R.pick([1,8,32,64,128,256,1024]),ctc=R.rnd()<.4,top=ctc?R.int(50,250):255;
  const pas=N/16,per=(top+1)*pas;
  return{v:{N,top},text:`<p>Un timer 8 bits est cadencé par l'horloge de 16 MHz avec un prédiviseur N = ${N}${ctc?`, en mode CTC jusqu'à OCR2A = ${top}`:', en mode normal (débordement après 255)'}. Durée d'un pas, et période entre deux signaux ?</p>`,
    fields:[{label:'pas',unit:'µs',ans:pas,d:4,tol:0,hint:'en µs'},{label:'période',unit:'µs',ans:per,d:2,tol:0,hint:'en µs'}],
    sol:`pas = N / 16 MHz = ${N} / 16 = ${F.n(pas,4)} µs
le compteur va de 0 à ${top} : ${top+1} pas
période = ${top+1} × ${F.n(pas,4)} = ${F.n(per,2)} µs${per>=1000?' = '+F.n(per/1000,3)+' ms':''}`}}}

];
})();
