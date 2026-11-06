/* Moteur de mini-DS interactif — profbob.fr
   Une page de DS fournit une banque de questions (générateurs) et appelle MiniDS.start({...}).
   Chaque sujet a un numéro : même numéro + même format = mêmes valeurs, pour faire le même sujet à plusieurs.

   Format d'une question de la banque :
   { id:'resultante', chap:'Forces 2D', pts:3,
     gen(R,F){ return { text:'<p>énoncé html</p>',
                        fields:[{label:'FR', unit:'N', ans:217.4, type:'angle'?, tol:abs?, rel:relatif?}],
                        sol:'texte de correction (formules, une ligne par étape)', note:'html facultatif' } } }
*/
(function(){
  'use strict';

  // --- hasard reproductible ---
  function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function makeR(seed){
    const r=mulberry32(seed);
    const R={
      rnd:r,
      int:(a,b)=>a+Math.floor(r()*(b-a+1)),
      pick:arr=>arr[Math.floor(r()*arr.length)],
      sign:()=>r()<.5?-1:1,
      shuffle:arr=>{const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a},
      nz:(a,b)=>{let x=0;while(x===0)x=a+Math.floor(r()*(b-a+1));return x}
    };
    return R;
  }

  // --- mise en forme des nombres à la française ---
  const F={
    n(x,d=2){if(!isFinite(x))return '—';const p=Math.pow(10,d);let v=Math.round(x*p)/p;if(Object.is(v,-0)||v===0)v=0;
      const s=Math.abs(v).toString().replace('.',',');return (v<0?'−':'')+s},
    vec(v,d=2){const n=['i','j','k'];let out='';v.forEach((c,i)=>{if(Math.abs(c)<1e-9)return;let s=F.n(Math.abs(c),d);if(s==='1')s='';
      const t=(s?s+' ':'')+n[i];if(out==='')out+=(c<0?'−':'')+t;else out+=(c<0?' − ':' + ')+t});return '{'+(out||'0')+'}'},
    pt(p,d=2){return '('+p.map(c=>F.n(c,d)).join(' ; ')+')'},
    deg:Math.PI/180
  };

  const parse=s=>{if(s==null)return NaN;s=String(s).trim().replace(/\s/g,'').replace(/[−–]/g,'-').replace(',','.').replace(/[^0-9.eE+\-]/g,'');
    if(s===''||s==='-'||s==='.')return NaN;return Number(s)};
  function correct(field,val){
    if(!isFinite(val))return false;
    if(field.type==='angle'){let d=Math.abs(((val-field.ans)%360+540)%360-180);return d<=(field.tol??0.6)}
    const tol=Math.max(field.tol??0.05,(field.rel??0.015)*Math.abs(field.ans));
    return Math.abs(val-field.ans)<=tol;
  }

  const store={
    get(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}},
    set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  };
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const h=(html)=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild};

  function start(cfg){
    const root=cfg.mount;
    const KEY=cfg.histKey||('minids-'+cfg.id);
    const home=()=>cfg.onHome?(state='intro',stopTimer(),window.onbeforeunload=null,cfg.onHome()):intro();
    const params=new URLSearchParams(location.search);
    let fmt=cfg.formats.find(f=>f.id===params.get('format'))||cfg.formats[cfg.defaultFormat||0];
    let seed=parseInt(params.get('sujet'),10);
    if(!(seed>0))seed=1000+Math.floor(Math.random()*9000);
    let state='intro',timerIv=null,endAt=0,startAt=0,subject=null;

    function setURL(){const u=new URL(location.href);u.searchParams.set('sujet',seed);u.searchParams.set('format',fmt.id);history.replaceState(null,'',u)}
    function shareURL(){const u=new URL(location.href);u.hash='';u.searchParams.set('sujet',seed);u.searchParams.set('format',fmt.id);return u.toString()}

    function build(){
      const R=makeR(hash(cfg.id+':'+seed+':'+fmt.id));
      const idx=R.shuffle(cfg.bank.map((_,i)=>i)).slice(0,Math.min(fmt.n,cfg.bank.length)).sort((a,b)=>a-b);
      return idx.map((i,k)=>{const q=cfg.bank[i];const g=q.gen(makeR(hash(cfg.id+':'+seed+':'+q.id)),F);return Object.assign({num:k+1,id:q.id,chap:q.chap,pts:q.pts},g)});
    }

    function history_(){
      const list=store.get(KEY)||[];
      if(!list.length)return '<p class="mds-note">Pas encore de copie rendue sur ce navigateur.</p>';
      const best=list.reduce((m,x)=>x.note>m.note?x:m,list[0]);
      return '<p class="mds-hist">Meilleure note : <b>'+F.n(best.note,1)+'/20</b> · '+list.length+' copie'+(list.length>1?'s':'')+' rendue'+(list.length>1?'s':'')+'</p><ul class="mds-hist">'+
        list.slice(-5).reverse().map(x=>'<li>'+esc(x.date)+' · sujet '+x.seed+' · '+esc(x.fmt)+' · '+F.n(x.note,1)+'/20</li>').join('')+'</ul>';
    }

    // --- écran d'accueil ---
    function intro(){
      state='intro';stopTimer();window.onbeforeunload=null;
      root.innerHTML='';
      const el=h(`<div>
        <h2>Choisis ton format</h2>
        <div class="mds-formats">${cfg.formats.map(f=>`<button class="mds-format" data-f="${f.id}" aria-pressed="${f.id===fmt.id}"><b>${esc(f.label)}</b><span>${f.min} min · ${f.n} questions</span></button>`).join('')}</div>
        <div class="card">
          <div class="mds-row"><span class="eyebrow">Sujet n°</span><b class="m" id="mds-seed">${seed}</b>
            <button class="btn ghost" id="mds-new">Tirer un autre sujet</button>
            <button class="btn ghost" id="mds-share">Copier le lien du sujet</button></div>
          <p class="mds-note">Envoie le lien à ta classe : tout le monde aura exactement les mêmes valeurs, et vous pourrez comparer vos notes.</p>
          <p class="mds-note">Réponds avec des nombres (virgule ou point acceptés), arrondis à 3 chiffres significatifs. Les angles sont en degrés. Calculatrice autorisée, cours fermé.</p>
          <div class="mds-row"><button class="btn" id="mds-go">Commencer le mini-DS</button></div>
        </div>
        <h3 style="margin-top:28px">Tes résultats</h3>
        ${history_()}
      </div>`);
      root.appendChild(el);
      el.querySelectorAll('.mds-format').forEach(b=>b.onclick=()=>{fmt=cfg.formats.find(f=>f.id===b.dataset.f);setURL();intro()});
      el.querySelector('#mds-new').onclick=()=>{let s;do{s=1000+Math.floor(Math.random()*9000)}while(s===seed);seed=s;setURL();intro()};
      el.querySelector('#mds-share').onclick=e=>{const b=e.currentTarget;const url=shareURL();
        const done=()=>{b.textContent='Lien copié ✓';setTimeout(()=>b.textContent='Copier le lien du sujet',1800)};
        if(navigator.clipboard)navigator.clipboard.writeText(url).then(done,()=>prompt('Copie ce lien :',url));else prompt('Copie ce lien :',url)};
      el.querySelector('#mds-go').onclick=run;
    }

    // --- épreuve ---
    function run(){
      state='run';setURL();subject=build();
      const total=subject.reduce((s,q)=>s+q.pts,0);
      root.innerHTML='';
      const el=h(`<div>
        <div class="mds-bar"><div class="in"><span class="mds-time" id="mds-t">--:--</span><span class="meta grow">Sujet ${seed} · ${esc(fmt.label)} · ${total} pts</span>
          <button class="btn ghost" id="mds-quit">Abandonner</button><button class="btn" id="mds-submit">Rendre ma copie</button></div></div>
        <div id="mds-qs">${subject.map(q=>`<div class="mds-q" data-q="${q.num}">
          <h3>Question ${q.num} <span class="tag">${esc(q.chap)}</span><span class="mds-pts">${q.pts} pt${q.pts>1?'s':''}</span></h3>
          ${q.text}
          <div class="mds-fields">${q.fields.map((f,j)=>`<div class="mds-field"><label for="f${q.num}_${j}">${f.label}</label><div class="box"><input id="f${q.num}_${j}" inputmode="decimal" autocomplete="off" spellcheck="false"><span class="unit">${f.unit||''}</span></div></div>`).join('')}</div>
        </div>`).join('')}</div>
        <div class="mds-row"><button class="btn" id="mds-submit2">Rendre ma copie</button></div>
      </div>`);
      root.appendChild(el);
      el.querySelector('#mds-submit').onclick=el.querySelector('#mds-submit2').onclick=()=>{
        const empty=[...el.querySelectorAll('.mds-field input')].filter(i=>i.value.trim()==='').length;
        if(empty&&!confirm(empty+' case'+(empty>1?'s':'')+' vide'+(empty>1?'s':'')+'. Rendre quand même ?'))return;
        grade(false)};
      el.querySelector('#mds-quit').onclick=()=>{if(confirm('Abandonner ce mini-DS ? Ta copie ne sera pas notée.'))home()};
      window.onbeforeunload=()=>'Ton mini-DS est en cours.';
      startAt=Date.now();endAt=startAt+fmt.min*60000;tick();timerIv=setInterval(tick,500);
      window.scrollTo({top:root.offsetTop-10});
    }
    function stopTimer(){if(timerIv){clearInterval(timerIv);timerIv=null}}
    function tick(){
      const t=document.getElementById('mds-t');if(!t)return;
      if(!fmt.min){const up=Math.round((Date.now()-startAt)/1000);t.textContent=String(Math.floor(up/60)).padStart(2,'0')+':'+String(up%60).padStart(2,'0');return}
      const left=Math.max(0,Math.round((endAt-Date.now())/1000));
      t.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');
      t.classList.toggle('low',left<=300);
      if(left===0&&state==='run'){grade(true)}
    }

    // --- correction ---
    function grade(timeout){
      state='done';stopTimer();window.onbeforeunload=null;
      const usedSec=Math.round((Date.now()-startAt)/1000);
      let earned=0,total=0;const rows=[];
      subject.forEach(q=>{
        const box=root.querySelector(`.mds-q[data-q="${q.num}"]`);let ok=0;
        q.fields.forEach((f,j)=>{
          const wrap=box.querySelectorAll('.mds-field')[j],inp=wrap.querySelector('input');
          const v=parse(inp.value),good=correct(f,v);if(good)ok++;
          inp.readOnly=true;wrap.classList.add(good?'ok':'ko');
          wrap.appendChild(h(`<div class="exp">${good?'✓ ':'✗ attendu '}${F.n(f.ans,f.d??2)} ${f.unit||''}</div>`));
        });
        const e=q.pts*ok/q.fields.length;earned+=e;total+=q.pts;
        box.querySelector('.mds-pts').textContent=F.n(e,2)+' / '+q.pts+' pt'+(q.pts>1?'s':'');
        box.appendChild(h(`<details open><summary>Correction</summary><div><div class="formula">${q.sol}</div>${q.note||''}</div></details>`));
        rows.push(`<tr><td>Q${q.num} · ${esc(q.chap)}</td><td>${F.n(e,2)} / ${q.pts}</td></tr>`);
      });
      const note=Math.round(earned/total*20*2)/2;
      const d=new Date();const date=d.toLocaleDateString('fr-FR')+' '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
      if(window.pbStat)pbStat('ev-minids');
      const list=store.get(KEY)||[];list.push({date,seed,fmt:fmt.label,note});store.set(KEY,list.slice(-50));
      const mm=Math.floor(usedSec/60),ss=usedSec%60;
      const mail=cfg.report?cfg.report+'?type=erreur&page='+encodeURIComponent('Mini-DS '+cfg.id+' · sujet '+seed+' ('+fmt.label+') · question n° '):null;
      const bar=root.querySelector('.mds-bar');if(bar)bar.remove();
      root.querySelector('#mds-submit2').parentElement.remove();
      const sc=h(`<div class="mds-score">
        <div class="eyebrow">${timeout?'Temps écoulé · copie ramassée':'Copie rendue'} · sujet ${seed} · ${esc(fmt.label)} · ${mm} min ${String(ss).padStart(2,'0')}</div>
        <div class="big">${F.n(note,1)}<small> / 20</small></div>
        <table>${rows.join('')}</table>
        <div class="mds-row">
          <button class="btn" id="mds-again">Nouveau sujet</button>
          <button class="btn ghost" id="mds-redo">Refaire ce sujet</button>
          <button class="btn ghost" id="mds-share2">Partager ce sujet</button>
          <button class="btn ghost" id="mds-home">${cfg.onHome?'Changer les réglages':'Retour'}</button>
          ${mail?`<a class="btn ghost" href="${mail}">Signaler une erreur</a>`:''}
        </div>
        <p class="mds-note">Les cases rouges montrent la valeur attendue. Lis la correction de chaque question ratée, puis refais le même sujet sans regarder.</p>
      </div>`);
      root.prepend(sc);
      sc.querySelector('#mds-again').onclick=()=>{let s;do{s=1000+Math.floor(Math.random()*9000)}while(s===seed);seed=s;run()};
      sc.querySelector('#mds-redo').onclick=run;
      sc.querySelector('#mds-home').onclick=home;
      const sh=sc.querySelector('#mds-share2');if(sh)sh.onclick=()=>{const url=shareURL();const done=()=>{sh.textContent='Lien copié ✓';setTimeout(()=>sh.textContent='Partager ce sujet',1800)};if(navigator.clipboard)navigator.clipboard.writeText(url).then(done,()=>prompt('Copie ce lien :',url));else prompt('Copie ce lien :',url)};
      window.scrollTo({top:root.offsetTop-10});
    }

    if(cfg.startNow)run();else intro();
  }

  window.MiniDS={start,F,makeR,_test:{parse,correct}};
})();
