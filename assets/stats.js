/* Statistiques de visites maison (sans cookie, sans donnée personnelle).
   Chaque visite incrémente quelques compteurs anonymes chez Abacus (service de compteurs gratuit) :
   total, jour, page, type d'appareil, visiteurs uniques du jour (repérés par une date gardée dans le navigateur).
   Les chiffres se lisent sur /admin/. Pour ne pas compter ses propres visites : bouton dans /admin/. */
(function(){
  'use strict';
  var NS='profbob-fr', API='https://abacus.jasoncameron.dev/hit/'+NS+'/';
  function hit(key){try{fetch(API+key,{keepalive:true,cache:'no-store',mode:'cors'}).catch(function(){})}catch(e){}}
  function off(){try{return localStorage.getItem('pb-nostats')==='1'}catch(e){return false}}
  window.pbStat=function(key){if(!off())hit(key)};
  if(off()||location.hostname==='localhost'||location.hostname==='127.0.0.1')return;

  var day=new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Paris'}).replace(/-/g,'');
  var path=location.pathname.replace(/index\.html$/,'').replace(/^\/|\/$/g,'');
  var page='p-'+(path?path.replace(/[^a-z0-9]+/gi,'_').toLowerCase():'accueil');
  var mobile=matchMedia('(max-width:820px)').matches||/Mobi|Android|iPhone/i.test(navigator.userAgent);

  hit('total');hit('j-'+day);hit(page.slice(0,60));hit(mobile?'app-mobile':'app-ordi');
  try{
    var seen=localStorage.getItem('pb-seen');
    if(!seen)hit('visiteurs');
    if(seen!==day){hit('u-'+day);localStorage.setItem('pb-seen',day)}
  }catch(e){}
})();
