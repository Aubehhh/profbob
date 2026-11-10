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
    ],
    // Thermodynamique 1 (K. Figoureux) : indices écrits avec <sub>, sans vecteurs (profil « thermo » de notation.js)
    thermo:(()=>{const C='concepts',P='premier-principe',Pr='proprietes',VC='volume-controle',S2='second-principe';return [
      ['m ; V','Masse ; volume (en ch. 2 et 4, V désigne aussi une vitesse)','kg ; m³'],
      ['ρ ; v = 1/ρ','Masse volumique ; volume spécifique (massique)','kg/m³ ; m³/kg'],
      ['p','Pression (absolue dans les relations thermo). 1 bar = 10⁵ Pa = 100 kPa','Pa, bar'],
      ['p(relative) ; p(vide)','p(abs) − p<sub>atm</sub> ; p<sub>atm</sub> − p(abs)','Pa',[C]],
      ['T','Température, en kelvins dans les formules : T(°C) = T(K) − 273,15','K'],
      ['E = U + E<sub>c</sub> + E<sub>p</sub>','Énergie d\'un système : interne + cinétique + potentielle','J',[P,Pr]],
      ['U ; u','Énergie interne ; énergie interne massique','J ; kJ/kg',[P,Pr,VC]],
      ['W','Travail : W &gt; 0 fourni <b>par</b> le système, W &lt; 0 fourni <b>sur</b> le système','J',[P,Pr,S2]],
      ['Q','Chaleur : Q &gt; 0 reçue <b>par</b> le système, Q &lt; 0 cédée','J',[P,Pr,S2]],
      ['P<sub>th</sub> ; P<sub>méca</sub>','Puissance thermique reçue ; puissance mécanique fournie','W',[P,VC]],
      ['n','Exposant polytropique : p V<sup>n</sup> = constante','—',[P,Pr]],
      ['κ (k) ; h ; ε ; σ','Conductivité thermique ; coefficient de convection ; émissivité ; σ = 5,67×10⁻⁸ W/(m²·K⁴)','W/(m·K) ; W/(m²·K) ; — ; —',[P]],
      ['Φ<sub>conv</sub> ; Q̇<sub>x</sub>','Flux thermique (puissance) par convection ; par conduction selon x','W',[P]],
      ['Q<sub>in</sub> ; Q<sub>out</sub> ; W<sub>cycle</sub>','Chaleur entrante ; sortante ; travail net, par cycle (positifs dans le sens des flèches)','J',[P]],
      ['η ; β ; γ','Rendement thermique ; coefficient de performance froid ; de pompe à chaleur','—',[P,S2]],
      ['x','Titre en vapeur : masse de vapeur / masse totale (0 à 1)','—',[Pr,VC]],
      ['f ; g ; fg','Indices : liquide saturé ; vapeur saturée ; g − f (vaporisation)','—',[Pr,VC]],
      ['h = u + p v','Enthalpie massique','kJ/kg',[Pr,VC]],
      ['c<sub>v</sub> ; c<sub>p</sub> ; k','Chaleurs massiques à volume / pression constants ; k = c<sub>p</sub>/c<sub>v</sub>','kJ/(kg·K)',[Pr]],
      ['R ; r = R/M','Constante universelle (8,314 J/(mol·K)) ; constante du gaz','J/(kg·K)',[Pr,VC]],
      ['q<sub>m</sub> ; q<sub>m,e</sub> ; q<sub>m,s</sub>','Débit massique ; à l\'entrée e ; à la sortie s','kg/s',[VC]],
      ['vc','Indice : volume de contrôle (E<sub>vc</sub>, m<sub>vc</sub>, P<sub>th,vc</sub>)','—',[VC]],
      ['Q<sub>C</sub> ; Q<sub>F</sub>','Chaleur échangée avec le réservoir chaud ; froid','J',[S2]]
    ]})(),
    // Informatique embarquée (D. Gheysens) : vocabulaire et fonctions Arduino
    embarque:(()=>{const Y='systemes',A='arduino',C='controle',T='temps';return [
      ['bit ; octet','Chiffre binaire (0 ou 1) ; groupe de 8 bits','—',[Y,A]],
      ['2ⁿ','Nombre de valeurs codables sur n bits','—',[Y,T]],
      ['complément à 2','Codage des négatifs : bit de gauche = −128 sur 8 bits','—',[Y]],
      ['ET, OU, XOR, NON','Portes logiques ; en code : &amp;&amp;, ||, !','—',[Y,C]],
      ['setup() ; loop()','Exécutée une fois au démarrage ; répétée sans fin','—',[A,C]],
      ['HIGH ; LOW','État haut (5 V) ; état bas (0 V)','—',[A,C,T]],
      ['pinMode ; digitalWrite ; digitalRead','Sens d\'un port ; écrire ; lire un état','—',[A,C]],
      ['delay(ms) ; millis()','Pause bloquante ; temps écoulé depuis le démarrage','ms',[A,C,T]],
      ['== ; != ; = ','Comparer égal ; différent ; affecter une valeur','—',[C]],
      ['ISR','Fonction appelée par une interruption (courte, sans delay)','—',[T]],
      ['analogRead ; analogWrite','Lire 0 à 1023 (A0-A5) ; PWM 0 à 255 (ports ~)','—',[T]],
      ['α (duty cycle)','Rapport cyclique = état / 255','%',[T]],
      ['N (prédiviseur)','Divise la fréquence d\'horloge (16 MHz) d\'un timer','—',[T]]
    ]})(),
    // Création de page Web (R. Gosswiller) : vocabulaire plutôt que notations
    web:(()=>{const B='bases',S='structure',C='css',F='formulaires';return [
      ['balise','Élément HTML entre chevrons : simple (&lt;br /&gt;) ou double (&lt;p&gt;…&lt;/p&gt;)','—',[B,S]],
      ['attribut','Précision écrite dans la balise ouvrante : nom="valeur" (src, href, alt, class…)','—',[B,S,F]],
      ['client / serveur','Le navigateur demande ; le serveur envoie la page','—',[B]],
      ['LAMP','Linux, Apache, MySQL, PHP','—',[B]],
      ['doctype ; head ; body','Version du HTML ; méta-informations ; contenu affiché','—',[S]],
      ['ancre','Lien vers un endroit de la page : href="#nom" → id="nom"','—',[S]],
      ['sélecteur','Ce qui désigne les éléments visés par une règle CSS','—',[C]],
      ['#nom ; .nom','Sélecteur d\'id (unique) ; de classe (partageable)','—',[C]],
      ['propriété : valeur;','Une déclaration CSS, entre { }','—',[C]],
      ['#RRGGBB ; rgb(r, g, b)','Couleur en hexadécimal ; en décimal (0 à 255)','—',[C]],
      ['@media','Media query : règles appliquées selon l\'écran','—',[C]],
      ['method ; action','GET ou POST ; page qui reçoit les données','—',[F]],
      ['name ; id','Nom de la donnée envoyée ; identifiant dans la page','—',[F]]
    ]})(),
    // Outils mathématiques (N. Coupier) : profil « thermo » (indices seulement)
    outils:(()=>{const C='complexes',D='derivation',I='integration',T='trigonometrie';return [
      ['i (j en physique)','Unité imaginaire : i² = −1','—',[C]],
      ['Re z ; Im z','Partie réelle ; partie imaginaire de z = a + ib','—',[C]],
      ['z* ou z̄','Conjugué : a − ib','—',[C]],
      ['|z| ; arg z','Module √(a² + b²) ; argument (angle avec l\'axe des réels, en rad)','— ; rad',[C]],
      ['re<sup>iθ</sup> ; r(cos θ + i sin θ)','Formes exponentielle et trigonométrique','—',[C]],
      ['Ṽ ; V<sub>m</sub>∠φ','Phaseur d\'une grandeur sinusoïdale (module V<sub>m</sub>, phase φ)','—',[C]],
      ['Δ ; δ','Discriminant ; une racine carrée de Δ','—',[C]],
      ['f\' ; f\'\' ; f<sup>(n)</sup>','Dérivées première, seconde, n-ième','—',[D,I]],
      ['∂f/∂x','Dérivée partielle par rapport à x (les autres variables figées)','—',[D,T]],
      ['Cⁿ(I)','Fonctions n fois dérivables à dérivées continues sur I','—',[D]],
      ['C(n, k)','Coefficient binomial n!/(k!(n − k)!)','—',[D]],
      ['df ; Δf','Différentielle f\'(x) dx ; variation réelle','—',[D]],
      ['∫ f(x) dx ; F','Intégrale indéfinie ; une primitive (F\' = f)','—',[I]],
      ['∫ₐᵇ f(x) dx','Intégrale définie = F(b) − F(a) (aire signée)','—',[I]],
      ['Δx ; S<sub>n</sub>','Largeur d\'une bande ; somme de Riemann à n bandes','—',[I]],
      ['x ≡ y [2π]','x et y congrus modulo 2π (x = y + 2kπ)','—',[T]],
      ['sec ; csc ; cot','1/cos ; 1/sin ; 1/tan','—',[D,T]],
      ['arcsin ; arccos ; arctan','Fonctions réciproques (cyclométriques)','—',[D,I,T]],
      ['sinh ; cosh ; tanh','Fonctions hyperboliques','—',[D,I,T]],
      ['log<sub>b</sub> ; ln','Logarithme de base b ; népérien (base e)','—',[T,I]]
    ]})(),
    // Électricité (Fiolet) : profil « thermo » (indices seulement) ; complexes soulignés, vecteurs de Fresnel fléchés
    elec:(()=>{const B='bases',C='continu',T='theoremes',S='sinusoidal';return [
      ['u, i ; U, I','Minuscule : valeur instantanée (dépend du temps) ; majuscule : valeur constante ou efficace','V ; A',[B,C,T,S]],
      ['Q','Charge électrique (i = dQ/dt)','C',[B]],
      ['p(t) ; &lt;p(t)&gt; ; P','Puissance instantanée ; puissance moyenne = puissance active','W',[B,S]],
      ['w','Énergie','J (ou kWh)',[B,S]],
      ['ρ ; ρ<sub>0</sub> ; ρ<sub>θ</sub>','Résistivité ; à 0 °C ; à θ °C','Ω·m',[C]],
      ['a<sub>0</sub>','Coefficient de température défini à 0 °C','°C⁻¹',[C]],
      ['R<sub>0</sub> ; R<sub>θ</sub> ; R<sub>éq</sub>','Résistance à 0 °C ; à θ °C ; équivalente','Ω',[C,T]],
      ['l ; S','Longueur ; section du conducteur','m ; m²',[C]],
      ['V<sub>e</sub> ; V<sub>s</sub>','Tension d\'entrée ; de sortie (potentiomètre, diviseur)','V',[C]],
      ['E','Source de tension (force électromotrice)','V',[C,T,S]],
      ['E<sub>T</sub> ; R<sub>T</sub>','Modèle de Thévenin : tension à vide ; résistance interne','V ; Ω',[T,S]],
      ['I<sub>CC</sub> ; R<sub>N</sub>','Modèle de Norton : courant de court-circuit ; résistance','A ; Ω',[T]],
      ['i<sub>1E2</sub>','Superposition : part de i₁ due à la source E₂ seule','A',[T]],
      ['V̂ (V<sub>max</sub>) ; V','Amplitude ; valeur efficace (V = V̂/√2 en sinusoïdal)','V',[S]],
      ['ω ; f ; T','Pulsation (ω = 2πf) ; fréquence ; période','rad·s⁻¹ ; Hz ; s',[S]],
      ['φ','Déphasage de la tension par rapport au courant (φ = arg U − arg I)','rad ou °',[S]],
      ['V⃗','Vecteur de Fresnel (longueur = valeur efficace, angle = phase à l\'origine)','—',[S]],
      ['<u>V</u> ; [ρ ; θ]','Nombre complexe (souligné) ; forme polaire : module ρ, argument θ','—',[S]],
      ['<u>Z</u> ; Z','Impédance complexe ; son module','Ω',[S]],
      ['L ; C','Inductance ; capacité','H ; F',[S]],
      ['Q ; S','Puissance réactive ; apparente','VAR ; VA',[S]],
      ['PF = cos φ','Facteur de puissance (power factor) = P/S','—',[S]],
      ['η ; P<sub>U</sub> ; P<sub>A</sub>','Rendement ; puissance utile ; puissance absorbée','— ; W',[S]]
    ]})(),
    // Chimie (S. Beaumont) : profil « thermo » (indices seulement)
    chimie:(()=>{const A='atome',C='classification',M='molecules';return [
      ['<sup>A</sup><sub>Z</sub>X','A : nombre de masse (nucléons) ; Z : numéro atomique (protons)','—',[A,C]],
      ['N = A − Z','Nombre de neutrons','—',[A]],
      ['u.m.a.','Unité de masse atomique : 1/12 de la masse d\'un atome de ¹²C = 1,66×10⁻²⁷ kg','kg',[A]],
      ['N<sub>A</sub>','Nombre d\'Avogadro : 6,022×10²³','mol⁻¹',[A]],
      ['M','Masse molaire','g·mol⁻¹',[A]],
      ['F','Faraday : charge d\'une mole d\'électrons ≈ 96 500 C','C',[A]],
      ['h ; ν ; λ ; C','Constante de Planck (6,626×10⁻³⁴ J·s) ; fréquence ; longueur d\'onde ; célérité de la lumière','J·s ; Hz ; m ; m·s⁻¹',[A]],
      ['E<sub>n</sub> = −13,6/n²','Énergie du niveau n de l\'atome d\'hydrogène (1 eV = 1,6×10⁻¹⁹ J)','eV',[A]],
      ['n ; l ; m<sub>l</sub> ; m<sub>s</sub>','Nombres quantiques : principal, secondaire, magnétique, de spin','—',[A,C]],
      ['OA','Orbitale atomique (case quantique)','—',[A,M]],
      ['E<sub>1</sub> ; A<sub>E</sub>','Énergie de 1ʳᵉ ionisation ; affinité électronique','eV',[C]],
      ['χ ; χ<sub>M</sub>','Électronégativité (Pauling) ; de Mulliken','—',[C,M]],
      ['D<sub>AB</sub> ; d<sub>AB</sub>','Énergie de liaison ; longueur de liaison','kJ·mol⁻¹ ; m (pm)',[C,M]],
      ['N<sub>V</sub> ; N<sub>A</sub> ; N<sub>e</sub>','Électrons de valence de l\'atome ; qu\'il possède dans l\'édifice ; de tout l\'édifice','—',[M]],
      ['z<sub>F</sub> ; z','Charge formelle d\'un atome ; charge de l\'édifice','—',[M]],
      ['x','Valence : nombre de liaisons covalentes (x = 8 − N<sub>V</sub>)','—',[M]],
      ['δ ; p ; p<sub>D</sub>','Charge partielle ; moment dipolaire en C·m ; en debye (1 D = 3,33×10⁻³⁰ C·m)','C ; C·m ; D',[M]],
      ['I<sub>AB</sub>','Caractère ionique de la liaison AB','%',[M]],
      ['AX<sub>n</sub>E<sub>m</sub>','VSEPR : atome central A, n atomes liés X, m doublets non liants E','—',[M]]
    ]})()
  };
  const HOWTO='<b>Comment répondre au mini-DS :</b> un nombre par case, virgule ou point acceptés, arrondi à 3 chiffres significatifs, sans unité (elle est écrite à côté). Garde le signe − des grandeurs négatives (composantes, travail reçu, chaleur cédée). Les angles sont en degrés.';
  window.Notations={
    has:id=>!!N[id],
    rows(id,ch){return (N[id]||[]).filter(r=>!ch||!r[3]||r[3].includes(ch))},
    html(id,o){o=o||{};const L=this.rows(id,o.ch);if(!L.length)return '';
      return '<details class="nota"'+(o.open?' open':'')+'><summary>'+(o.title||'Notations utilisées')+'</summary><table>'+
        L.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('')+'</table>'+(o.howto?'<div class="howto">'+HOWTO+'</div>':'')+'</details>'}
  };
})();
