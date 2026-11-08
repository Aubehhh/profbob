/* Légendes « Notations » par matière, partagées par les pages de cours et le mini-DS.
   Chaque ligne : [symbole (HTML), signification, unité]. Rendu : Notations.html('meca', {open, howto}). */
(function(){
  const v=(s,sub)=>'<span class="vec">'+s+'</span>'+(sub?'<sub>'+sub+'</sub>':'');
  const s=(a,sub)=>a+'<sub>'+sub+'</sub>';
  const N={
    meca:[
      [v('F'),'Force (vecteur : intensité + direction + sens)','N'],
      ['F &nbsp;ou&nbsp; ‖'+v('F')+'‖','Intensité (norme) de la force, toujours positive','N'],
      [s('F','x')+', '+s('F','y')+', '+s('F','z'),'Composantes de '+v('F')+' sur les axes, avec leur signe','N'],
      [v('i')+', '+v('j')+', '+v('k'),'Vecteurs unitaires des axes x, y, z','—'],
      ['θ','Angle de la force mesuré depuis l\'axe +x, sens anti-horaire','°'],
      ['α, β, γ','Angles directeurs : angles entre le vecteur et les axes x, y, z','°'],
      [v('F','R'),'Résultante : somme de toutes les forces','N'],
      [v('r','AB'),'Vecteur position de A vers B : coordonnées de B − coordonnées de A','m'],
      [v('u','AB'),'Vecteur unitaire de A vers B (norme 1) : '+v('r','AB')+' / ‖'+v('r','AB')+'‖','—'],
      [s('T','AB'),'Tension dans le câble AB','N'],
      ['W = m·g','Poids, avec g = 9,81 m/s²','N'],
      [s('F','s')+' = k (l − l₀)','Force d\'un ressort (k raideur, l₀ longueur à vide)','N'],
      [v('a')+' · '+v('b'),'Produit scalaire : donne un nombre','—'],
      [v('A')+' × '+v('B'),'Produit vectoriel : donne un vecteur','—'],
      [v('M','O')+' = '+v('r')+' × '+v('F'),'Moment de '+v('F')+' par rapport au point O ('+v('r')+' va de O au point d\'application)','N·m'],
      [s('M','a')+' = '+v('u','a')+' · '+v('M','O'),'Moment par rapport à l\'axe a : un nombre, signe donné par la main droite','N·m']
    ]
  };
  const HOWTO='<b>Comment répondre au mini-DS :</b> un nombre par case, virgule ou point acceptés, arrondi à 3 chiffres significatifs, sans unité (elle est écrite à côté). Garde le signe − des composantes négatives. Les angles sont en degrés.';
  window.Notations={
    has:id=>!!N[id],
    html(id,o){o=o||{};const L=N[id];if(!L)return '';
      return '<details class="nota"'+(o.open?' open':'')+'><summary>'+(o.title||'Notations utilisées')+'</summary><table>'+
        L.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('')+'</table>'+(o.howto?'<div class="howto">'+HOWTO+'</div>':'')+'</details>'}
  };
})();
