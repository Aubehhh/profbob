/* Solveurs indépendants du mini-DS Informatique embarquée (outils/verif-minids.js).
   Conversions par parseInt / toString et par simulation des programmes (boucles exécutées pas à pas),
   au lieu des formules de la banque. Pour une case « choix », on renvoie le texte de l'option juste. */
'use strict';
const toBin=n=>((n%256)+256)%256;
const b8=n=>toBin(n).toString(2).padStart(8,'0');
const signed=b=>{const u=parseInt(b,2);return u>127?u-256:u};
module.exports={
  bin2dec:({b})=>[parseInt(b,2)],
  dec2bin:({n})=>[b8(n)],
  signe:({b})=>[parseInt(b,2),signed(b)],
  complement:({n})=>[b8(-n)],
  plage:({n})=>{let c=1;for(let i=0;i<n;i++)c*=2;return [c,c-1,-c/2]},
  portes:({A,B,C,g1,g2,neg})=>{const T={ET:(x,y)=>x&&y?1:0,OU:(x,y)=>x||y?1:0,XOR:(x,y)=>x!==y?1:0};let s=T[g1](A,B);if(neg)s=s?0:1;return [s,T[g2](s,C)]},
  ascii:({ch})=>[ch.charCodeAt(0),b8(ch.charCodeAt(0))],
  fonction:({quoi})=>[{"déclarer le port 9 comme sortie":'pinMode',"mettre une sortie à 5 V":'digitalWrite',"lire l'état d'un bouton":'digitalRead',"mettre le programme en pause":'delay',
    "afficher une valeur sur le moniteur série":'Serial.println',"ouvrir la liaison avec le moniteur série":'Serial.begin',"lire une tension sur A0":'analogRead',"envoyer un signal PWM à un moteur":'analogWrite',
    "connaître le temps écoulé depuis le démarrage":'millis',"déclencher une fonction quand un bouton change d'état":'attachInterrupt'}[quoi]],
  blink:({on,off})=>{let t=0,n=0;while(t<60000){n++;t+=on+off}const P=on+off;return [P,1/(P/1000),60/(P/1000)]},
  type:({t})=>[{byte:8,int:16,'unsigned long':32,bool:8}[t]],
  serie:({k,t})=>{let c=0,lignes=0,cur=0;for(let s=0;s<t;s++){c++;cur++;if(c===k){c=0;lignes++;cur=0}}return [lignes,cur]},
  boucle_for:({a,b,pas,cmp})=>{const out=[];for(let i=a;cmp==='<'?i<b:i<=b;i+=pas)out.push(i);return [out.length,out[out.length-1]]},
  boucle_while:({v0,m,lim})=>{let v=v0,n=0;while(v<lim){v*=m;n++}return [n,v]},
  ifelse:({a,k,t})=>{let v=a,nb=0,tg=0;for(let p=0;p<k-a+t;p++){if(v<k){nb++;v++}else tg++}return [nb,tg]},
  logique:({b1,b2,op,neg})=>{let r=op==='&&'?(b1===1&&b2===1):(b1===1||b2===1);if(neg)r=!r;return [r?'allumée':'éteinte']},
  pullup:({m,appui})=>[(m==='pull-up'?!appui:appui)?'HIGH':'LOW'],
  millis:({d,t1,t2})=>{let time1=0,on=false;for(let t=0;t<t2+5*d;t++){if(t===t1||t===t2){time1=t;on=true}if(on&&t>time1+d){on=false;return [t-1]}}return [NaN]},
  pwm:({v})=>[100*v/255,5*v/255],
  pwminverse:({U})=>[Math.round(255*U/5)],
  analogread:({U})=>{const v=Math.round(1023*U/5);return [v,v>>2]},
  interruption:({quoi})=>[/relâché \(LOW\) à appuyé/.test(quoi)?'RISING':/HIGH à LOW/.test(quoi)?'FALLING':/changement/.test(quoi)?'CHANGE':'LOW'],
  ports:({p})=>[[3,5,6,9,10,11].indexOf(p)>=0?'oui, port PWM (~)':'non, pas de PWM sur ce port'],
  timer:({N,top})=>{const tick=1e6*N/16e6;return [tick,tick*(top+1)]}
};
