/* Notations du site : transforme l'écriture « texte » des formules en notation propre.
   - vecteurs : r_AB, u_a, i j k (dans {… i … j … k}), r × F, a · b, |A|  →  flèche au-dessus (classe .vec)
   - indices  : X_AB → X avec AB en indice (aussi A_⊥, A_∥) ; Fx, F1x, FRx, FR → F avec x, 1x, Rx, R en indice ; (F_R)x → (F_R) avec x en indice
   Appliqué aux éléments .formula, .m et [data-nota] (texte seulement, le HTML existant est respecté).
   Une seule règle pour tout le site : la page de cours et le mini-DS écrivent pareil.
   Profils : par défaut « meca » (vecteurs + indices). Un élément sous [data-nota-profil="thermo"] (ou le body) n'a que
   les indices X_ab (lettres accentuées et virgule permises : P_méca, q_m,e, W_cycle, h_fg), sans flèches de vecteur. */
(function(){
  'use strict';
  const V=(s,sub)=>'<span class="vec">'+s+'</span>'+(sub?'<sub>'+sub+'</sub>':'');
  const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const VEC_LETTERS='ruabAB'; // lettres toujours vectorielles quand elles portent un indice de points (r_AB, u_a…)

  function convert(t){
    let s=esc(t);
    // normes |A| ou |r_AB|  → ‖A⃗‖
    s=s.replace(/\|([A-Za-z])(?:_([A-Za-z0-9]+))?\|/g,(m,a,b)=>'‖'+V(a,b)+'‖');
    // vecteurs position / unitaires avec indice : r_AB, u_a, u_AB
    s=s.replace(/(^|[^A-Za-z̀-ͯ>])([ru])_([A-Za-z0-9]+)/g,(m,p,a,b)=>p+V(a,b));
    // produits vectoriel / scalaire entre lettres vectorielles (pas F · d : d est une distance)
    s=s.replace(/(^|[\s(=\[−-])([ABCMabruFijk])( ?[×·] ?)([ABCabruFijk])(?=[\s),.;:|]|$)/g,(m,p,a,op,b)=>p+V(a)+op+V(b));
    // vecteur nommé devant « = {…} », « = r × F », « = A × B » : F = {…}, M_O = {…}, C = A × B
    s=s.replace(/(^|[\s(])([ABCFMR])(?:_([A-Za-z0-9]+))?(?=\s*=\s*(?:\{|[A-Za-z] × |<span class="vec">[A-Za-z]<\/span> × ))/g,(m,p,a,b)=>p+V(a,b));
    // vecteurs de base dans une écriture en composantes : {12 i − 8 j}, + k, (2/3) i
    s=s.replace(/(\{|[0-9)] |[+−-] )([ijk])(?=[\s}),.;]|$)/g,(m,p,u)=>p+V(u));
    // indices génériques X_YZ (scalaires : T_AB, M_O, F_s…)
    s=s.replace(/(^|[^A-Za-z>])([A-Za-zα-ωΑ-Ω])_([A-Za-z0-9₀-₉⊥∥]+)/g,(m,p,a,b)=>p+a+'<sub>'+b+'</sub>');
    // composante d'une grandeur indicée, écrite comme dans le cours : (F_R)x, (F_R)y
    s=s.replace(/(<\/sub>\))([xyz])(?![A-Za-z])/g,(m,p,c)=>p+'<sub>'+c+'</sub>');
    // composantes : Fx, F1x, FRx, Mz, Tx … et résultante FR
    s=s.replace(/(^|[^A-Za-z>])([FTMRWN])([0-9]{0,2}|R)([xyz])(?![A-Za-z])/g,(m,p,a,n,c)=>p+a+'<sub>'+n+c+'</sub>');
    s=s.replace(/(^|[^A-Za-z>])FR(?![A-Za-z])/g,(m,p)=>p+'F<sub>R</sub>');
    // autres composantes : Ax, By, rz, uax, xB…
    s=s.replace(/(^|[^A-Za-z>])([A-Z])([xyz])(?![A-Za-z])/g,(m,p,a,c)=>p+a+'<sub>'+c+'</sub>');
    s=s.replace(/(^|[^A-Za-z>])(r|u|ua)([xyz])(?![A-Za-z])/g,(m,p,a,c)=>p+a[0]+'<sub>'+(a.length>1?a.slice(1):'')+c+'</sub>');
    s=s.replace(/(^|[^A-Za-z>])([xyz])([A-Z])(?![A-Za-z])/g,(m,p,a,c)=>p+a+'<sub>'+c+'</sub>');
    s=s.replace(/(^|[^A-Za-z>])([FT])([0-9])(?![0-9A-Za-z])/g,(m,p,a,n)=>p+a+'<sub>'+n+'</sub>');
    // dernières passes (après les indices) : i j k après une composante, « = k », vecteur F = F · u⃗
    s=s.replace(/(<\/sub> |= −?|= )([ijk])(?=[\s}),.;]|$)/g,(m,p,u)=>p+V(u));
    s=s.replace(/(^|[\s(])([A-Z])(?=\s*=\s*[A-Za-z0-9,/ ]{1,14}[·×] ?<span class="vec">)/g,(m,p,a)=>p+V(a));
    s=s.replace(/(^|[\s(])([A-Z])(?=\s*=\s*[A-Z]<sub>x<\/sub>)/g,(m,p,a)=>p+V(a));
    return s;
  }

  // profil thermo : seulement les indices, écrits avec _ comme dans le cours (h_e, v_f, Q_in, P_th, Φ_conv, E_c2)
  function convertThermo(t){
    let s=esc(t);
    const SB='([A-Za-zÀ-ÿ0-9,₀-₉]*[A-Za-zÀ-ÿ0-9₀-₉])';
    s=s.replace(new RegExp('(^|[^A-Za-zÀ-ÿ>])d([A-Za-z])_'+SB,'g'),(m,p,a,b)=>p+'d'+a+'<sub>'+b+'</sub>');        // dm_vc/dt, dE_vc/dt
    s=s.replace(new RegExp('(^|[^A-Za-zÀ-ÿ>])([A-Za-zα-ωΑ-Ω]\u0307?)_'+SB,'g'),(m,p,a,b)=>p+a+'<sub>'+b+'</sub>');   // h_e, Q̇_x, Σ_e
    s=s.replace(/\)_([a-z]+)/g,(m,b)=>')<sub>'+b+'</sub>');                                                         // (∂u/∂T)_v
    return s;
  }
  function applyText(node){
    const w=document.createTreeWalker(node,NodeFilter.SHOW_TEXT,{acceptNode:n=>{
      const p=n.parentElement;if(!p)return NodeFilter.FILTER_REJECT;
      if(p.closest('.vec,sub,sup,svg,script,style,input,textarea,[data-nonota]'))return NodeFilter.FILTER_REJECT;
      return /[_|×·ijkxyzR0-9]/.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
    const list=[];let n;while((n=w.nextNode()))list.push(n);
    list.forEach(t=>{const pr=t.parentElement.closest('[data-nota-profil]');if(pr&&pr.dataset.notaProfil==='aucun')return;const th=pr&&pr.dataset.notaProfil==='thermo';
      const h=(th?convertThermo:convert)(t.nodeValue);if(h===esc(t.nodeValue))return;
      const span=document.createElement('span');span.innerHTML=h;t.replaceWith(...span.childNodes)});
  }
  function apply(root){
    (root||document).querySelectorAll('.formula,.m,[data-nota],[data-nota-all] p,[data-nota-all] li,[data-nota-all] td,[data-nota-all] button,[data-nota-all] summary,[data-nota-all] .q').forEach(el=>{if(!el.dataset.notaDone){applyText(el);el.dataset.notaDone='1'}});
  }
  window.Nota={apply,convert,convertThermo,V};
  if(document.readyState!=='loading')apply();else document.addEventListener('DOMContentLoaded',()=>apply());
})();
