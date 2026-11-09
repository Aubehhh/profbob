/* Catalogue du mini-DS : matières, chapitres (avec les questions de la banque qui leur appartiennent) et DS.
   Pour ajouter une matière : charger sa banque dans mini-ds/index.html, puis remplir banque/chapitres/ds ici.
   Une matière sans banque apparaît en « bientôt ». */
window.MINIDS_MATIERES=[
  {id:'meca',module:'statique',nom:'Mécanique 1 (Statique)',couleur:'#2453b8',
   banque:()=>window.BANQUE_STATIQUE,
   noms:{cosinus:'Loi des cosinus et des sinus',pente:'Composantes avec un triangle de pente',resultante:'Résultante de deux forces',angles:'Intensité et angles directeurs',gamma:'Trouver γ avec α et β',thetaphi:'Direction par θ et φ',
     cable:'Force portée par un câble',longueur:'Longueur et direction entre deux points',angle2:'Angle entre deux vecteurs',projection:'Projection sur un axe',
     equilibre:'Équilibre : deux câbles',ressort:'Équilibre : câble et ressort',chargemax:'Charge maximale',equi3d:'Équilibre 3D : trois câbles',
     momentfd:'Moment F d et bras de levier',vectoriel:'Produit vectoriel',varignon:'Moment 2D (Varignon)',moment3d:'Moment r × F',momentres:'Moment résultant',momentaxe:'Moment par rapport à un axe'},
   chapitres:[
     {id:'vecteurs',nom:'Principes généraux et outils mathématiques',detail:'Parallélogramme, composantes, vecteurs 3D, vecteur position, produit scalaire',q:['cosinus','pente','resultante','angles','gamma','thetaphi','cable','longueur','angle2','projection']},
     {id:'equilibre',nom:'Équilibre statique',detail:'DCL, câbles, ressort F = k s, charge maximale, équilibre 3D',q:['equilibre','ressort','chargemax','equi3d']},
     {id:'moments',nom:'Moment d\'une force',detail:'M_O = F d, produit vectoriel, r × F, Varignon, moment par rapport à un axe',q:['momentfd','vectoriel','varignon','moment3d','momentres','momentaxe']}
   ],
   ds:[
     {id:'statique',nom:'DS Statique',detail:'Chapitres 1 à 3 · semaine du 14 au 18 déc.',chapitres:['vecteurs','equilibre','moments'],n:8,min:60}
   ]},
  {id:'maths',nom:'Mathématiques',couleur:'#7c3aed'},
  {id:'analyse',nom:'Analyse',couleur:'#0e7490'},
  {id:'thermo',module:'thermo',nom:'Thermodynamique',couleur:'#c2410c',nota:'thermo',
   banque:()=>window.BANQUE_THERMO,
   noms:{colonne:'Colonne de liquide (baromètre)',piston:'Pression sous un piston',manometre:'Pression absolue, relative, vide',hydraulique:'Élévateur hydraulique',
     bilan:'Bilan d\'énergie et signes de Q et W',energies:'Énergies cinétique et potentielle',polytropique:'Travail polytropique',polyq:'Détente polytropique et chaleur',
     conduction:'Conduction (Fourier)',convection:'Convection (Newton)',rayonnement:'Rayonnement (Stefan-Boltzmann)',cycles:'Cycles : moteur, frigo, PAC',
     titre:'Titre en vapeur et énergie interne',etat:'Trouver l\'état de l\'eau',interpolation:'Interpolation linéaire',gazparfait:'Gaz parfait : p V = m r T',chauffage:'Gaz parfait chauffé (c_v)',
     debit:'Débit massique',tuyere:'Tuyère : vitesse de sortie',turbine:'Turbine à vapeur',compresseur:'Compresseur',laminage:'Détendeur (laminage)',echangeur:'Condenseur (échangeur)',
     rendement:'Rendement entre deux réservoirs',enonces:'Énoncés du second principe'},
   chapitres:[
     {id:'concepts',nom:'Concepts et définitions',detail:'Pression absolue, relative, vide ; colonne de liquide ; piston ; élévateur',q:['colonne','piston','manometre','hydraulique']},
     {id:'premier-principe',nom:'Énergie et premier principe',detail:'Signes de Q et W, bilan, travail polytropique, conduction, convection, rayonnement, cycles',q:['bilan','energies','polytropique','polyq','conduction','convection','rayonnement','cycles']},
     {id:'proprietes',nom:'Propriétés thermodynamiques',detail:'Trouver l\'état, titre en vapeur, interpolation, gaz parfait',q:['titre','etat','interpolation','gazparfait','chauffage']},
     {id:'volume-controle',nom:'Volume de contrôle',detail:'Débit, tuyère, turbine, compresseur, détendeur, échangeur',q:['debit','tuyere','turbine','compresseur','laminage','echangeur']},
     {id:'second-principe',nom:'Second principe (partie 1)',detail:'Énoncés, rendement entre deux réservoirs',q:['rendement','enonces']}
   ],
   ds:[
     {id:'thermo',nom:'DS Thermodynamique',detail:'Chapitres 1 à 5 · semaine du 14 au 18 déc.',chapitres:['concepts','premier-principe','proprietes','volume-controle','second-principe'],n:8,min:60}
   ]},
  {id:'elec',nom:'Bases de l\'électricité',couleur:'#b45309'},
  {id:'web',nom:'Pages Web',couleur:'#be185d'},
  {id:'embarque',nom:'Informatique embarquée',couleur:'#15803d'},
  {id:'chimie',nom:'Chimie',couleur:'#0f766e'}
];
