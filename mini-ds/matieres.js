/* Catalogue du mini-DS : matières, chapitres (avec les questions de la banque qui leur appartiennent) et DS.
   Pour ajouter une matière : charger sa banque dans mini-ds/index.html, puis remplir banque/chapitres/ds ici.
   Une matière sans banque apparaît en « bientôt ». */
window.MINIDS_MATIERES=[
  {id:'meca',nom:'Mécanique',couleur:'#2453b8',
   banque:()=>window.BANQUE_STATIQUE,
   chapitres:[
     {id:'vecteurs',nom:'Vecteurs force',detail:'Résultante, vecteur position, angles directeurs, produit scalaire, projection',q:['resultante','cable','angles','angle2','projection']},
     {id:'equilibre',nom:'Équilibre d\'une particule',detail:'DCL, câbles, ressorts',q:['equilibre','ressort']},
     {id:'moments',nom:'Moments',detail:'Produit vectoriel, Varignon, moment 3D, moment par rapport à un axe',q:['vectoriel','varignon','moment3d','momentaxe']}
   ],
   ds:[
     {id:'statique',nom:'DS Statique',detail:'Chapitres 1 à 3 · novembre 2026',chapitres:['vecteurs','equilibre','moments'],n:8,min:60}
   ]},
  {id:'maths',nom:'Mathématiques',couleur:'#7c3aed'},
  {id:'analyse',nom:'Analyse',couleur:'#0e7490'},
  {id:'thermo',nom:'Thermodynamique',couleur:'#c2410c'},
  {id:'elec',nom:'Bases de l\'électricité',couleur:'#b45309'},
  {id:'web',nom:'Pages Web',couleur:'#be185d'},
  {id:'embarque',nom:'Informatique embarquée',couleur:'#15803d'},
  {id:'chimie',nom:'Chimie',couleur:'#0f766e'}
];
