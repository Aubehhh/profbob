/* Cartes de révision (flashcards) par matière du mini-DS. Chaque carte : chapitre (id de mini-ds/matieres.js),
   recto (la question) et verso (la formule, écrite en notation « texte » : notation.js la met en forme). */
window.FLASHCARDS={
  meca:[
    {ch:'vecteurs',q:'Composantes d\'une force d\'intensité F faisant un angle θ avec l\'axe +x',r:'Fx = F cos θ\nFy = F sin θ'},
    {ch:'vecteurs',q:'Intensité de la résultante en 2D',r:'FR = √(FRx² + FRy²)'},
    {ch:'vecteurs',q:'Direction de la résultante en 2D',r:'θ = arctan(FRy / FRx)\npuis placer l\'angle dans le bon quadrant (signes de FRx et FRy)'},
    {ch:'vecteurs',q:'Poids d\'une masse m',r:'W = m·g   avec g = 9,81 m/s²'},
    {ch:'vecteurs',q:'Norme d\'un vecteur 3D A',r:'|A| = √(Ax² + Ay² + Az²)'},
    {ch:'vecteurs',q:'Angles directeurs α, β, γ d\'un vecteur A',r:'cos α = Ax / A\ncos β = Ay / A\ncos γ = Az / A'},
    {ch:'vecteurs',q:'Relation entre les trois angles directeurs',r:'cos²α + cos²β + cos²γ = 1'},
    {ch:'vecteurs',q:'Vecteur position de A vers B',r:'r_AB = (xB − xA) i + (yB − yA) j + (zB − zA) k\n« arrivée moins départ »'},
    {ch:'vecteurs',q:'Force d\'intensité F portée par un câble de A vers B',r:'F = F · u_AB = F · r_AB / |r_AB|'},
    {ch:'vecteurs',q:'Produit scalaire en composantes',r:'A · B = AxBx + AyBy + AzBz'},
    {ch:'vecteurs',q:'Angle θ entre deux vecteurs A et B',r:'θ = arccos( A · B / (|A| |B|) )   0° ≤ θ ≤ 180°'},
    {ch:'vecteurs',q:'Composantes de F parallèle et perpendiculaire à un axe de vecteur unitaire u',r:'F∥ = F · u   (peut être négatif)\nF⊥ = √(F² − F∥²)'},
    {ch:'equilibre',q:'Condition d\'équilibre d\'une particule',r:'ΣF = 0  ⇔  ΣFx = 0, ΣFy = 0 (et ΣFz = 0 en 3D)'},
    {ch:'equilibre',q:'Première chose à faire dans un exercice d\'équilibre',r:'Le DCL : isoler le point et dessiner TOUTES les forces avec leurs angles'},
    {ch:'equilibre',q:'Force exercée par un ressort',r:'F_s = k (l − l₀)\nk : raideur (N/m), l₀ : longueur à vide'},
    {ch:'equilibre',q:'Nombre maximum d\'inconnues pour un équilibre de particule en 2D',r:'2 (on a deux équations : ΣFx = 0 et ΣFy = 0)'},
    {ch:'moments',q:'Produit vectoriel A × B en composantes',r:'(AyBz − AzBy) i − (AxBz − AzBx) j + (AxBy − AyBx) k'},
    {ch:'moments',q:'i × j,  j × k,  k × i',r:'i × j = k,   j × k = i,   k × i = j\n(dans l\'autre sens : signe −)'},
    {ch:'moments',q:'Moment d\'une force en 2D avec le bras de levier',r:'M_O = F · d   (d perpendiculaire à la ligne d\'action)\npositif dans le sens anti-horaire'},
    {ch:'moments',q:'Théorème de Varignon en 2D',r:'M_O = x·Fy − y·Fx'},
    {ch:'moments',q:'Moment 3D d\'une force par rapport au point O',r:'M_O = r × F   (r va de O à un point de la ligne d\'action)'},
    {ch:'moments',q:'Moment d\'une force par rapport à un axe a',r:'M_a = u_a · (r × F)   (un nombre)'},
    {ch:'moments',q:'Vérifier un moment 3D calculé',r:'M_O · r = 0   et   M_O · F = 0'}
  ]
};
