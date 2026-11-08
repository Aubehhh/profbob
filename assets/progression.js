/* Progression par chapitre sur les pages module : pour chaque chapitre, part des types de questions
   du mini-DS dont le dernier essai est réussi (données du navigateur, suivi « Mes erreurs »). */
(function(){
  'use strict';
  const root=document.querySelector('[data-module]');if(!root)return;
  const M=(window.MINIDS_MATIERES||[]).find(x=>x.module===root.dataset.module);if(!M||!M.chapitres)return;
  let E={};try{E=JSON.parse(localStorage.getItem('minids-err-'+M.id)||'{}')||{}}catch(e){}
  let okAll=0,totAll=0,seenAll=0;
  document.querySelectorAll('[data-chap]').forEach(li=>{
    const C=M.chapitres.find(c=>c.id===li.dataset.chap);if(!C)return;
    const tot=C.q.length,ok=C.q.filter(q=>E[q]&&E[q].last===1).length,seen=C.q.filter(q=>E[q]).length;
    okAll+=ok;totAll+=tot;seenAll+=seen;
    const pct=Math.round(ok/tot*100);
    const box=document.createElement('span');box.className='prog'+(pct===100?' full':'');
    box.innerHTML=seen?`<span class="bar"><i style="width:${pct}%"></i></span><span class="pv">${ok}/${tot}</span>`:'<span class="pv none">pas encore travaillé</span>';
    box.title=seen?`${ok} type${ok>1?'s':''} de questions réussi${ok>1?'s':''} sur ${tot} au mini-DS`:'Fais un mini-DS sur ce chapitre pour voir ta progression';
    const host=li.querySelector('a,.soon')||li;const go=host.querySelector('.go,.tag');host.insertBefore(box,go||null);
  });
  const sum=document.getElementById('prog-sum');
  if(sum&&totAll){const pct=Math.round(okAll/totAll*100);
    sum.hidden=false;
    sum.innerHTML=seenAll
      ?`<div><b>Ta progression : ${pct} %</b><span>${okAll} type${okAll>1?'s':''} de questions réussi${okAll>1?'s':''} sur ${totAll} au mini-DS</span></div><span class="bar big"><i style="width:${pct}%"></i></span><a class="btn ghost" href="/mini-ds/?m=${M.id}&amp;ch=${M.chapitres.map(c=>c.id).join(',')}">S'entraîner ▸</a>`
      :`<div><b>Ta progression</b><span>Fais un mini-DS : chaque chapitre affichera ici ce que tu maîtrises.</span></div><a class="btn ghost" href="/mini-ds/?m=${M.id}">Faire un mini-DS ▸</a>`;
  }
})();
