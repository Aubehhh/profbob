/* Cartes de révision (flashcards) par matière du mini-DS. Chaque carte : chapitre (id de mini-ds/matieres.js),
   recto (la question) et verso (la formule, écrite en notation « texte » comme dans le cours : notation.js la met en forme).
   Mécanique : générées à partir des pages /cours/statique/… (mêmes formules, mêmes notations que les diapos). */
window.FLASHCARDS={
  meca:[
    // Chapitre 1 : principes généraux et outils mathématiques
    {ch:'vecteurs',q:'Les trois choses qui caractérisent une force',r:'son intensité, sa direction et son point d\'application'},
    {ch:'vecteurs',q:'Poids d\'une masse m',r:'W = m g   avec g = 9,81 m/s²'},
    {ch:'vecteurs',q:'Nombre de chiffres significatifs d\'une réponse finale',r:'3 au maximum (consigne du cours)'},
    {ch:'vecteurs',q:'Loi des cosinus (intensité de la résultante de deux forces)',r:'C = √(A² + B² − 2AB cos(c))\nc = angle du triangle en face de C (180° − angle entre les forces)'},
    {ch:'vecteurs',q:'Loi des sinus',r:'A / sin(a) = B / sin(b) = C / sin(c)'},
    {ch:'vecteurs',q:'Composantes d\'une force F avec un angle θ mesuré depuis l\'axe x',r:'Fx = F cos(θ)\nFy = F sin(θ)'},
    {ch:'vecteurs',q:'Composantes avec un triangle de pente (a horizontal, b vertical, c hypoténuse)',r:'Fx = F (a / c)\nFy = F (b / c)\nsignes d\'après le sens de la flèche'},
    {ch:'vecteurs',q:'Résultante de forces coplanaires : composantes',r:'(F_R)x = ΣFx\n(F_R)y = ΣFy'},
    {ch:'vecteurs',q:'Résultante de forces coplanaires : intensité et direction',r:'F_R = √((F_R)x² + (F_R)y²)\nθ = tan⁻¹ |(F_R)y / (F_R)x|   puis placer le quadrant'},
    {ch:'vecteurs',q:'Intensité d\'un vecteur 3D A',r:'A = √(Ax² + Ay² + Az²)'},
    {ch:'vecteurs',q:'Angles directeurs α, β, γ d\'un vecteur A',r:'cos α = Ax / A\ncos β = Ay / A\ncos γ = Az / A'},
    {ch:'vecteurs',q:'Relation entre les trois angles directeurs',r:'cos² α + cos² β + cos² γ = 1'},
    {ch:'vecteurs',q:'Vecteur unitaire u_A dans la direction de A',r:'u_A = A / A = cos α i + cos β j + cos γ k'},
    {ch:'vecteurs',q:'Composantes d\'un vecteur donné par deux angles θ (plan xy) et φ (depuis z)',r:'Az = A cos φ\nAx = A sin φ cos θ\nAy = A sin φ sin θ'},
    {ch:'vecteurs',q:'Vecteur position de A vers B',r:'r = (xB − xA) i + (yB − yA) j + (zB − zA) k\n« tête moins queue »'},
    {ch:'vecteurs',q:'Force d\'intensité F dirigée le long d\'un câble de A vers B',r:'F = F u = F (r / r)'},
    {ch:'vecteurs',q:'Produit scalaire : définition et calcul',r:'A · B = A B cos θ\nA · B = Ax Bx + Ay By + Az Bz'},
    {ch:'vecteurs',q:'Angle θ entre deux vecteurs A et B',r:'θ = cos⁻¹( A · B / (A B) )   0° ≤ θ ≤ 180°'},
    {ch:'vecteurs',q:'Composantes de A parallèle et perpendiculaire à un axe a',r:'A_a = A cos θ = A · u_a\nA_⊥ = A sin θ = √(A² − A_a²)'},
    // Chapitre 2 : équilibre statique
    {ch:'equilibre',q:'Condition d\'équilibre d\'une particule',r:'ΣF = 0'},
    {ch:'equilibre',q:'Équations scalaires d\'équilibre en 2D, et nombre d\'inconnues',r:'ΣFx = 0\nΣFy = 0\n2 inconnues au maximum'},
    {ch:'equilibre',q:'Équations scalaires d\'équilibre en 3D, et nombre d\'inconnues',r:'ΣFx = 0\nΣFy = 0\nΣFz = 0\n3 inconnues au maximum'},
    {ch:'equilibre',q:'Force d\'un ressort',r:'F = k s   avec s = l − l0\ns > 0 : allongé, il tire ; s < 0 : comprimé, il pousse'},
    {ch:'equilibre',q:'Ce que peut faire un câble',r:'seulement tirer (tension), selon son axe\nT constante sur un câble continu passant par une poulie sans frottement'},
    {ch:'equilibre',q:'Les 3 étapes du diagramme du corps libre (DCL)',r:'1. dessiner le contour isolé\n2. représenter toutes les forces (actives et réactives)\n3. identifier chaque force (valeurs connues, lettres pour les inconnues)'},
    {ch:'equilibre',q:'Le calcul donne une force négative : que veut dire le signe ?',r:'le sens réel est opposé à celui supposé sur le DCL'},
    // Chapitre 3 : moment d'une force
    {ch:'moments',q:'Intensité du moment d\'une force par rapport à O',r:'M_O = F d\nd : bras de levier, distance perpendiculaire de O à la ligne d\'action'},
    {ch:'moments',q:'Bras de levier quand la force n\'est pas perpendiculaire au levier',r:'d\' = d sin θ'},
    {ch:'moments',q:'Moment vectoriel d\'une force par rapport au point O',r:'M_O = r × F\nr va de O vers un point de la ligne d\'action'},
    {ch:'moments',q:'Intensité du produit vectoriel r × F',r:'M_O = r F sin θ   (θ angle entre r et F)'},
    {ch:'moments',q:'Produit vectoriel A × B en composantes',r:'(Ay Bz − Az By) i − (Ax Bz − Az Bx) j + (Ax By − Ay Bx) k'},
    {ch:'moments',q:'A × B et B × A',r:'A × B = −B × A   (pas commutatif)'},
    {ch:'moments',q:'i × j,  j × k,  k × i',r:'i × j = k,   j × k = i,   k × i = j\n(dans l\'autre sens : signe −)'},
    {ch:'moments',q:'Composantes du moment M_O = r × F',r:'M_x = ry F_z − rz F_y\nM_y = rz F_x − rx F_z\nM_z = rx F_y − ry F_x'},
    {ch:'moments',q:'Moment résultant de plusieurs forces',r:'M_R = Σ (r_i × F_i)   tous par rapport au même point O'},
    {ch:'moments',q:'Principe de transmissibilité',r:'r_1 × F = r_2 × F : on peut faire glisser F le long de sa ligne d\'action'},
    {ch:'moments',q:'Théorème de Varignon en 2D (formule du cours)',r:'M_O = F_x y − F_y x\n(+ = sens horaire dans cette écriture)'},
    {ch:'moments',q:'Moment d\'une force par rapport à un axe a',r:'M_a = u_a · (r × F)   (un nombre)'},
    {ch:'moments',q:'Vérifier un moment 3D calculé',r:'M_O · r = 0   et   M_O · F = 0'}
  ]
};
