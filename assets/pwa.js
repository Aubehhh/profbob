/* Appli installable : enregistre le service worker et gère le bouton « Installer l'appli » de l'accueil. */
(function(){
  if('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('/sw.js').catch(function(){})}
  var box=document.getElementById('install');if(!box)return;
  var standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
  if(standalone)return;
  var ios=/iPhone|iPad|iPod/.test(navigator.userAgent),deferred=null;
  var btn=box.querySelector('button'),txt=box.querySelector('[data-txt]');
  addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;box.hidden=false});
  if(ios){box.hidden=false;btn.hidden=true;txt.innerHTML='Sur iPhone : touche <b>Partager</b> <span aria-hidden="true">⎋</span> puis <b>« Sur l\'écran d\'accueil »</b>.'}
  btn.addEventListener('click',function(){if(!deferred)return;deferred.prompt();deferred.userChoice.then(function(c){if(c.outcome==='accepted'){box.hidden=true;if(window.pbStat)pbStat('ev-install')}deferred=null})});
  addEventListener('appinstalled',function(){box.hidden=true});
})();
