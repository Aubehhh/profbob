#!/usr/bin/env node
/* Vérification de la banque du mini-DS Statique (agent « tests »).
   Pour chaque question et N sujets tirés au hasard :
   1. aucune valeur NaN/undefined dans l'énoncé, les cases ou la correction ;
   2. la réponse attendue est recalculée par une méthode indépendante (solveurs ci-dessous, à partir de q.v) ;
   3. « copie parfaite » : la valeur affichée par le corrigé, et la même arrondie à 3 chiffres significatifs,
      tapées à la française (virgule), sont acceptées par le moteur de correction (assets/minids.js) → 20/20 ;
   4. chaque question est déclarée une fois dans mini-ds/matieres.js (nom lisible + chapitre).
   Usage : node outils/verif-minids.js [N=2000] [matière]   (matières : meca, thermo, chimie ; par défaut toutes) */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.join(__dirname,'..');
const ctx={window:{},Math,console};ctx.window.window=ctx.window;vm.createContext(ctx);
for(const f of ['assets/minids.js','ds/statique/mini-ds/banque.js','mini-ds/banques/thermo.js','mini-ds/banques/chimie.js','mini-ds/banques/elec.js','mini-ds/banques/outils.js','mini-ds/banques/web.js','mini-ds/matieres.js'])vm.runInContext(fs.readFileSync(path.join(ROOT,f),'utf8'),ctx,{filename:f});
const W=ctx.window,{F,makeR,_test:{parse,correct,judge}}=W.MiniDS;
const N=+process.argv[2]||2000,ONLY=process.argv[3];
// une banque par matière : global de la banque + solveurs indépendants (outils/solveurs/<id>.js)
const MATS=[{id:'meca',bank:W.BANQUE_STATIQUE},{id:'thermo',bank:W.BANQUE_THERMO},{id:'chimie',bank:W.BANQUE_CHIMIE},{id:'elec',bank:W.BANQUE_ELEC},{id:'outils',bank:W.BANQUE_OUTILS},{id:'web',bank:W.BANQUE_WEB}].filter(m=>!ONLY||m.id===ONLY);
const sig3=x=>{if(x===0)return 0;const e=Math.floor(Math.log10(Math.abs(x)))-2;return Math.round(x/10**e)*10**e};
const frStr=x=>String(x).replace('.',',').replace('-','−');
let err=0,total=0;const fail=(m)=>{if(err<40)console.log('  ✗ '+m);err++};
for(const MAT of MATS){
const BANK=MAT.bank,M=W.MINIDS_MATIERES.find(m=>m.id===MAT.id),SOLVE=require('./solveurs/'+MAT.id+'.js');
console.log('\n== '+M.nom+' ('+BANK.length+' questions)');total+=BANK.length;
const declared=M.chapitres.flatMap(c=>c.q);
for(const q of BANK){
  if(!M.noms[q.id])fail(q.id+' : pas de nom lisible dans mini-ds/matieres.js');
  const n=declared.filter(x=>x===q.id).length;if(n!==1)fail(q.id+' : déclarée '+n+' fois dans les chapitres');
  if(!SOLVE[q.id]){fail(q.id+' : pas de solveur indépendant dans outils/solveurs/'+MAT.id+'.js');continue}
  let worst=0;
  for(let s=1;s<=N;s++){
    const o=q.gen(makeR(s*7919+q.id.length),F);
    const blob=o.text+o.sol+(o.note||'')+o.fields.map(f=>f.label+(f.unit||'')+(f.hint||'')+(f.options||[]).join('')).join('');
    if(/NaN|undefined|Infinity/.test(blob)){fail(q.id+' sujet '+s+' : NaN/undefined dans le texte');break}
    const exp=SOLVE[q.id](o.v);
    o.fields.forEach((f,i)=>{
      if(f.type==='choix'||f.type==='texte'){ // réponse non numérique : comparée telle quelle au solveur
        const a=f.type==='choix'?f.options[f.ans]:[].concat(f.ans)[0];
        if(f.type==='choix'&&!(Number.isInteger(f.ans)&&f.options&&f.options[f.ans]!==undefined))return fail(q.id+' sujet '+s+' : choix invalide ('+f.label+')');
        if(f.type==='choix'&&new Set(f.options).size!==f.options.length)return fail(q.id+' sujet '+s+' : options en double ('+f.label+')');
        if(String(a)!==String(exp[i]))return fail(`${q.id} sujet ${s} : ${f.label} = ${a} mais le recalcul donne ${exp[i]}`);
        if(!judge(f,f.type==='choix'?String(f.ans):String(a)))fail(`${q.id} sujet ${s} : « ${a} » refusé pour ${f.label}`);
        return}
      if(!isFinite(f.ans))return fail(q.id+' sujet '+s+' : réponse non finie ('+f.label+')');
      const d=f.type==='angle'?Math.abs(((f.ans-exp[i])%360+540)%360-180):Math.abs(f.ans-exp[i]);
      const rel=d/Math.max(1,Math.abs(exp[i]));worst=Math.max(worst,rel);
      if(rel>1e-6)fail(`${q.id} sujet ${s} : ${f.label} = ${f.ans} mais le recalcul donne ${exp[i]}`);
      for(const typed of [F.n(f.ans,f.d??2),frStr(sig3(f.ans))]){
        if(!correct(f,parse(typed)))fail(`${q.id} sujet ${s} : « ${typed} » refusé pour ${f.label} (attendu ${f.ans})`);
      }
    });
  }
  console.log(`${err?'·':'✓'} ${q.id.padEnd(11)} ${String(q.chap).padEnd(18)} ${N} sujets, écart max au recalcul ${worst.toExponential(1)}`);
}
for(const id of declared)if(!BANK.find(q=>q.id===id))fail('mini-ds/matieres.js déclare '+id+' qui n\'existe pas dans la banque');
// une copie entière : chaque DS de 8 questions, toutes cases justes → 20/20
let copies=0;for(let s=1;s<=200;s++){const R=makeR(s);const idx=R.shuffle(BANK.map((_,i)=>i)).slice(0,8);
  let e=0,t=0;idx.forEach(i=>{const q=BANK[i],o=q.gen(makeR(s+i),F);const ok=o.fields.filter(f=>judge(f,f.type==='choix'||f.type==='texte'?String([].concat(f.ans)[0]):F.n(f.ans,f.d??2))).length;e+=q.pts*ok/o.fields.length;t+=q.pts});
  if(Math.round(e/t*20*2)/2===20)copies++;else fail('copie '+s+' : note '+(e/t*20))}
console.log(`Copies parfaites notées 20/20 : ${copies}/200`);
}
console.log(err?`\n${err} problème(s).`:`\nTout est bon : ${total} questions, ${total*N} sujets vérifiés.`);
process.exit(err?1:0);
