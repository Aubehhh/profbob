/* Tableau de bord de l'accueil : calculé uniquement avec ce qui est enregistré dans ce navigateur
   (notes du simulateur, résultats et erreurs du mini-DS). Rien n'est envoyé. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const get=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
  const fr=(x,d=1)=>(Math.round(x*Math.pow(10,d))/Math.pow(10,d)).toString().replace('.',',');
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function card(el,{l,v,small,d,go,href,cls}){el.className='st'+(cls?' '+cls:'');el.href=href;
    el.innerHTML=`<div class="l">${l}</div><div class="v${v==null?' empty':''}">${v==null?'—':v}${small&&v!=null?`<small>${small}</small>`:''}</div><div class="d">${d}</div><span class="go">${go} ▸</span>`}

  // 0. compte à rebours du DS du bandeau (dates du catalogue, heure de Paris)
  (function(){
    const el=document.querySelector('.banner .cd');if(!el)return;
    const day=s=>{const[y,m,d]=s.split('-').map(Number);return Date.UTC(y,m-1,d)};
    const today=day(new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Paris'}));
    const n=Math.round((day(el.dataset.debut)-today)/864e5),fin=Math.round((day(el.dataset.fin)-today)/864e5);
    const t=n>1?'dans '+n+' jours':n===1?'demain':fin>=0?(n===0&&fin===0?'aujourd\'hui':'en ce moment'):'terminé';
    el.textContent=t;el.className='cd'+(n<=7&&fin>=0?' soon':'')+(fin<0?' past':'');
  })();

  // 1. moyenne simulée
  (function(){
    const M=window.MAQUETTE_S1,notes=get('notes-s1')||{},el=$('st-notes');if(!el||!M)return;
    let sum=0,ects=0,ok=0;
    M.ue.forEach(u=>{let W=0,We=0,S=0;u.modules.forEach(m=>m.ep.forEach(([k,,w])=>{W+=w;const v=notes[u.id+'.'+m.id+'.'+k];if(typeof v==='number'){We+=w;S+=w*v}}));
      if(!We)return;const avg=S/We;sum+=u.ects*avg;ects+=u.ects;const R=W-We;
      if((R<1e-9&&avg>=M.seuil)||(R>1e-9&&(M.seuil*W-S)/R<=0))ok++});
    if(!ects)return card(el,{l:'Moyenne simulée',v:null,d:'Pas encore de note',go:'Entrer mes notes',href:'/notes/'});
    const g=sum/ects;
    card(el,{l:'Moyenne simulée',v:fr(g,1),small:' /20',d:ok+' UE sur '+M.ue.length+' assurée'+(ok>1?'s':''),go:'Simulateur de notes',href:'/notes/',cls:g>=10?'':'warn'});
  })();

  // 2. dernier mini-DS (toutes matières)
  (function(){
    const el=$('st-ds');if(!el)return;let last=null;
    for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!/^minids-/.test(k)||/^minids-err-/.test(k))continue;
      const L=get(k);if(!Array.isArray(L))continue;
      L.forEach(x=>{const m=/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/.exec(x.date||'');const t=m?new Date(+m[3],m[2]-1,+m[1],+m[4],+m[5]).getTime():0;if(!last||t>=last.t)last=Object.assign({t},x)})}
    if(!last)return card(el,{l:'Dernier mini-DS',v:null,d:'Aucun mini-DS rendu',go:'Faire un mini-DS',href:'/mini-ds/'});
    const ago=Date.now()-last.t,mn=Math.round(ago/6e4),h=Math.round(ago/36e5),dd=Math.round(ago/864e5);
    const quand=mn<60?'il y a '+Math.max(1,mn)+' min':h<24?'il y a '+h+' h':dd===1?'hier':'il y a '+dd+' jours';
    const fmt=String(last.fmt||'').split(' · ')[0];
    card(el,{l:'Dernier mini-DS',v:fr(last.note,1),small:' /20',d:esc(fmt)+' · '+quand,go:'Refaire un mini-DS',href:'/mini-ds/',cls:last.note>=10?'':'warn'});
  })();

  // 3. questions à retravailler (mode « Mes erreurs »)
  (function(){
    const el=$('st-err');if(!el)return;const MAT=window.MINIDS_MATIERES||[];let n=0,names=[],first=null;
    MAT.forEach(m=>{const E=get('minids-err-'+m.id);if(!E)return;Object.keys(E).forEach(k=>{if(E[k].last===0){n++;if(!first)first=m.id;names.push((m.noms&&m.noms[k])||E[k].chap||k)}})});
    if(!n){const any=MAT.some(m=>get('minids-err-'+m.id));
      return card(el,{l:'À retravailler',v:any?'0':null,d:any?'Rien, bien joué':'Rien pour l\'instant',go:'Mode « Mes erreurs »',href:'/mini-ds/',cls:any?'ok':''})}
    card(el,{l:'À retravailler',v:String(n),d:esc(names.slice(0,2).join(', '))+(n>2?'…':''),go:'Mode « Mes erreurs »',href:'/mini-ds/?m='+first+'&err=1',cls:'warn'});
  })();
})();
