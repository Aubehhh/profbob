/* Légendes « Notations » par matière, partagées par les pages de cours, le mini-DS et les flashcards.
   Chaque ligne : [symbole (HTML), signification, unité, chapitres]. Les symboles sont écrits comme dans le cours du prof.
   « chapitres » = ids de chapitre (mini-ds/matieres.js) où la notation apparaît ; absent = tous les chapitres.
   Rendu : Notations.html('meca', {open, howto, ch:'equilibre'}) — avec ch, seules les lignes de ce chapitre sont gardées.
   Ajouter une matière : une nouvelle clé dans N (même id que dans mini-ds/matieres.js). */
(function(){
  const v=(s,sub)=>'<span class="vec">'+s+'</span>'+(sub?'<sub>'+sub+'</sub>':'');
  const s=(a,sub)=>a+'<sub>'+sub+'</sub>';
  const V='vecteurs',E='equilibre',M='moments';
  const N={
    meca:[
      [v('F'),'Force : intensité + direction + sens (vecteur, en gras dans le cours)','N'],
      ['F','Intensité (norme) de la force, toujours positive sur un schéma','N'],
      [s('F','x')+', '+s('F','y')+', '+s('F','z'),'Composantes de '+v('F')+' sur les axes, avec leur signe','N'],
      [v('i')+', '+v('j')+', '+v('k'),'Vecteurs unitaires cartésiens des axes x, y, z (à la main : î, ĵ, k̂)','—',[V,E,M]],
      [v('F','R')+' ; (F<sub>R</sub>)<sub>x</sub>, (F<sub>R</sub>)<sub>y</sub>','Force résultante et ses composantes : (F<sub>R</sub>)<sub>x</sub> = ΣF<sub>x</sub>','N',[V]],
      ['θ','Angle de direction (2D : depuis l\'axe x)','°',[V]],
      ['a, b, c','Côtés du petit triangle de « pente » qui donne la direction d\'une force','—',[V]],
      ['α, β, γ','Angles directeurs : entre le vecteur et les axes +x, +y, +z (0 à 180°)','°',[V]],
      ['θ, φ','Direction 3D par deux angles : φ depuis l\'axe z, θ dans le plan xy','°',[V]],
      [v('u','A'),'Vecteur unitaire de '+v('A')+' : '+v('A')+' / A (norme 1)','—',[V]],
      [v('r')+' ou '+v('r','AB'),'Vecteur position de A vers B : '+v('r','B')+' − '+v('r','A'),'m',[V,E,M]],
      [v('A')+' · '+v('B'),'Produit scalaire (« A point B ») : donne un nombre','—',[V,M]],
      [s('A','a')+' ; '+s('A','⊥'),'Composantes de '+v('A')+' parallèle et perpendiculaire à l\'axe a','N',[V]],
      ['W = m g','Poids, avec g = 9,81 m/s²','N',[V,E]],
      ['DCL','Diagramme du corps libre : la particule isolée avec toutes ses forces','—',[E]],
      ['T','Tension d\'un câble (traction seulement, selon l\'axe du câble)','N',[E]],
      ['k','Raideur d\'un ressort','N/m',[E]],
      ['F = k s ; s = l − l<sub>0</sub>','Force d\'un ressort ; s = déflexion depuis la longueur à vide l<sub>0</sub>','N',[E]],
      ['ΣF = 0','Équilibre : ΣF<sub>x</sub> = 0, ΣF<sub>y</sub> = 0 (et ΣF<sub>z</sub> = 0 en 3D)','N',[E]],
      ['d','Bras de levier : distance perpendiculaire du point O à la ligne d\'action','m',[M]],
      [s('M','O')+' = F d','Intensité du moment par rapport au point O','N·m',[M]],
      [v('A')+' × '+v('B'),'Produit vectoriel : donne un vecteur','—',[M]],
      [v('M','O')+' = '+v('r')+' × '+v('F'),'Moment vectoriel ('+v('r')+' va de O vers un point de la ligne d\'action)','N·m',[M]],
      [v('M','R')+' = Σ('+v('r','i')+' × '+v('F','i')+')','Moment résultant de plusieurs forces, toutes par rapport au même point O','N·m',[M]],
      [s('M','a')+' = '+v('u','a')+' · ('+v('r')+' × '+v('F')+')','Moment par rapport à un axe a (exercices complémentaires) : un nombre','N·m',[M]]
    ]
  };
  const HOWTO='<b>Comment répondre au mini-DS :</b> un nombre par case, virgule ou point acceptés, arrondi à 3 chiffres significatifs, sans unité (elle est écrite à côté). Garde le signe − des composantes négatives. Les angles sont en degrés.';
  window.Notations={
    has:id=>!!N[id],
    rows(id,ch){return (N[id]||[]).filter(r=>!ch||!r[3]||r[3].includes(ch))},
    html(id,o){o=o||{};const L=this.rows(id,o.ch);if(!L.length)return '';
      return '<details class="nota"'+(o.open?' open':'')+'><summary>'+(o.title||'Notations utilisées')+'</summary><table>'+
        L.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('')+'</table>'+(o.howto?'<div class="howto">'+HOWTO+'</div>':'')+'</details>'}
  };
})();
