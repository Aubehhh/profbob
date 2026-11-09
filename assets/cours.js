/* Pages chapitre : légende des notations du chapitre, questions rapides, « J'ai compris » par section
   (gardé dans le navigateur), barre de progression et sommaire qui suit la lecture.
   La page déclare : <body data-cours="statique-vecteurs" data-matiere="meca" data-ch="vecteurs">
   Sections : <section class="csec" id="s1"> … <label class="checkrow"><input type="checkbox" data-s="s1"> … */
(function(){
  'use strict';
  const B=document.body,KEY='cours-'+(B.dataset.cours||location.pathname);
  const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return {}}};
  const put=o=>{try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}};

  // légende des notations du chapitre (assets/notations.js)
  document.querySelectorAll('[data-notations]').forEach(el=>{
    if(!window.Notations)return;
    el.innerHTML=Notations.html(el.dataset.notations,{ch:el.dataset.ch||B.dataset.ch,title:'Notations du chapitre'});
    el.setAttribute('data-nonota','');
  });

  // questions rapides
  document.querySelectorAll('.q').forEach(q=>{
    const fb=q.querySelector('.fb');
    q.querySelectorAll('.opts button').forEach(b=>b.addEventListener('click',()=>{
      if(b.dataset.ok){b.classList.add('right');q.querySelectorAll('.opts button').forEach(x=>x.disabled=true)}else b.classList.add('wrong');
      if(fb&&b.dataset.ok)fb.hidden=false;
    }));
  });

  // « J'ai compris » + progression + sommaire
  const boxes=[...document.querySelectorAll('.checkrow input[data-s]')];
  const toc=[...document.querySelectorAll('nav.ctoc a[href^="#"]')];
  function paint(){
    const st=get();let n=0;
    boxes.forEach(b=>{b.checked=!!st[b.dataset.s];if(b.checked)n++});
    toc.forEach(a=>a.classList.toggle('done',!!st[a.getAttribute('href').slice(1)]));
    const p=document.getElementById('cprog');
    if(p&&boxes.length){p.querySelector('.bar i').style.width=Math.round(n/boxes.length*100)+'%';
      p.querySelector('.pv').textContent=n+' section'+(n>1?'s':'')+' comprise'+(n>1?'s':'')+' sur '+boxes.length}
  }
  boxes.forEach(b=>b.addEventListener('change',()=>{const st=get();if(b.checked)st[b.dataset.s]=1;else delete st[b.dataset.s];put(st);paint()}));
  paint();

  if('IntersectionObserver' in window&&toc.length){
    const secs=toc.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    const io=new IntersectionObserver(es=>{es.forEach(e=>{if(!e.isIntersecting)return;
      toc.forEach(a=>{const on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('cur',on);
        if(on&&a.scrollIntoView){const bar=a.parentElement;bar.scrollTo({left:a.offsetLeft-bar.clientWidth/2+a.clientWidth/2,behavior:'smooth'})}})})},
      {rootMargin:'-30% 0px -65% 0px'});
    secs.forEach(s=>io.observe(s));
  }
})();
