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
  {id:'chimie',module:'chimie',nom:'Chimie',couleur:'#0f766e',nota:'thermo',
   banque:()=>window.BANQUE_CHIMIE,
   noms:{composition:'Protons, neutrons, électrons',massemoy:'Masse atomique moyenne',abondance:'Abondance de deux isotopes',photon:'Énergie d\'un photon',raie:'Raie de l\'atome d\'hydrogène',
     quantique:'Cases quantiques et électrons max',quadruplet:'Quadruplet possible ?',config:'Électrons de valence et célibataires',
     position:'Place dans le tableau',ion:'Ion le plus probable',mulliken:'Électronégativité de Mulliken',pauling:'Électronégativité de Pauling',
     electrons:'Électrons de valence d\'un édifice',chargef:'Charge formelle',dipole:'Moment dipolaire',ionique:'Caractère ionique',vsepr:'Type VSEPR et angle',polarite:'Moment d\'une liaison (molécule coudée)',
     famille:'Famille et valence d\'une fonction',rendement:'Rendement d\'une estérification',classe:'Classe de l\'alcool et rendement',mecanisme:'Rôle dans un mécanisme',chargeo:'Charge formelle d\'un oxygène',
     brute:'Formule brute',cip:'Priorités CIP',rs:'Configuration R ou S',stereo:'Nombre de stéréoisomères',purete:'Pureté optique et excès énantiomérique',ze:'Configuration Z ou E',relation:'Énantiomères ou diastéréoisomères ?',isomerie:'Type d\'isomérie',conformation:'Conformation la plus stable',selectivite:'Réaction sélective ou spécifique'},
   chapitres:[
     {id:'atome',nom:'L\'atome',detail:'Composition, isotopes, spectre de H, nombres quantiques, configuration',q:['composition','massemoy','abondance','photon','raie','quantique','quadruplet','config']},
     {id:'classification',nom:'Classification périodique',detail:'Place dans le tableau, ions, électronégativité',q:['position','ion','mulliken','pauling']},
     {id:'molecules',nom:'Structure des molécules',detail:'Lewis, charges formelles, moment dipolaire, VSEPR, polarité',q:['electrons','chargef','dipole','ionique','vsepr','polarite']},
     {id:'organique',nom:'Chimie organique',detail:'Familles, estérification, mécanisme et flèches courbes',q:['famille','rendement','classe','mecanisme','chargeo']},
     {id:'description',nom:'Description des molécules',detail:'Formules, conformations, isoméries, R/S, Z/E, pureté optique',q:['brute','conformation','isomerie','cip','rs','stereo','purete','ze','relation','selectivite']}
   ],
   ds:[
     {id:'chimie',nom:'DS Chimie',detail:'Chapitres 1 à 4 · semaine du 14 au 18 déc.',chapitres:['atome','classification','molecules','organique','description'],n:8,min:60}
   ]},
  {id:'elec',module:'elec',nom:'Bases de l\'électricité',couleur:'#b45309',nota:'thermo',
   banque:()=>window.BANQUE_ELEC,
   noms:{charge:'Courant et charge',energie:'Énergie consommée',pmoy:'Puissance moyenne',
     resfil:'Résistance d\'un fil',temperature:'Résistance et température',tempfinale:'Température d\'un enroulement',association:'Série et parallèle',divtension:'Diviseur de tension',divcourant:'Diviseur de courant',maille:'Loi des mailles',
     theveninessai:'Modèle de Thévenin par essais',theveninch:'Thévenin sur une charge',norton:'Modèle de Norton',deuxgen:'Deux générateurs en parallèle',superposition:'Superposition',
     efficace:'Valeur efficace, pulsation, période',complexe:'Calcul en complexes',bobine:'Inductance en sinusoïdal',condensateur:'Condensateur en sinusoïdal',rlserie:'Circuit R, L série',rlc:'Circuit RLC série',puissances:'Puissances P, Q, S',boucherot:'Méthode de Boucherot',releve:'Relèvement du facteur de puissance',stockage:'Énergie stockée (L ou C)',
     fils:'Les fils du réseau triphasé',vsimple:'Tensions simples instantanées',vcomplexe:'Tension simple en complexe',ucompose:'Tensions composées instantanées',ueff:'Tension composée efficace',dephasage:'Déphasage entre deux tensions'},
   chapitres:[
     {id:'bases',nom:'Notions de base',detail:'Courant, énergie, puissance moyenne',q:['charge','energie','pmoy']},
     {id:'continu',nom:'Tension continue',detail:'Résistance d\'un fil, température, associations, Kirchhoff, diviseurs',q:['resfil','temperature','tempfinale','association','divtension','divcourant','maille']},
     {id:'theoremes',nom:'Modèles équivalents',detail:'Thévenin, Norton, superposition',q:['theveninessai','theveninch','norton','deuxgen','superposition']},
     {id:'sinusoidal',nom:'Sinusoïdal monophasé',detail:'Valeur efficace, complexes, R L C, impédances, puissances, Boucherot',q:['efficace','complexe','bobine','condensateur','stockage','rlserie','rlc','puissances','boucherot','releve']},
     {id:'triphase',nom:'Triphasé',detail:'Fils, tensions simples et composées, Fresnel et complexes',q:['fils','vsimple','vcomplexe','ucompose','ueff','dephasage']}
   ],
   ds:[
     {id:'elec',nom:'DS Électricité',detail:'Chapitres 1 à 5 · semaine du 14 au 18 déc.',chapitres:['bases','continu','theoremes','sinusoidal','triphase'],n:8,min:60}
   ]},
  {id:'outils',module:'outils',nom:'Outils mathématiques',couleur:'#4338ca',nota:'thermo',
   banque:()=>window.BANQUE_OUTILS,
   noms:{produit:'Produit de complexes',quotient:'Quotient de complexes',modarg:'Module et argument',trigalg:'Forme trigonométrique → algébrique',moivre:'Puissance (De Moivre)',racinecarree:'Racine carrée d\'un complexe',racinesn:'Racines n-ièmes',second:'Équation du second degré dans ℂ',horner:'Factorisation (Hörner)',phaseur:'Phaseur et impédance',
     chaine:'Dérivée d\'une composée',produitexp:'Dérivée d\'un produit',leibniz:'Dérivée n-ième (Leibniz)',lineaire:'Approximation linéaire',extremum:'Extremum local',erreur:'Propagation d\'erreur',cylindre:'Optimisation (boîte cylindrique)',
     integrale:'Intégrale définie',riemann:'Somme de Riemann',ipp:'Intégration par parties',simples:'Éléments simples',moyenne:'Valeur moyenne',
     valexacte:'Valeurs exactes (formules)',equation:'Équation trigonométrique',logderivee:'Dérivée d\'un logarithme',hyperbolique:'Fonctions hyperboliques'},
   chapitres:[
     {id:'complexes',nom:'Nombres complexes',detail:'Opérations, module et argument, De Moivre, racines, équations, circuits',q:['produit','quotient','modarg','trigalg','moivre','racinecarree','racinesn','second','horner','phaseur']},
     {id:'derivation',nom:'Calcul différentiel',detail:'Composée, produit, Leibniz, extremum, approximation, erreur, optimisation',q:['chaine','produitexp','leibniz','lineaire','extremum','erreur','cylindre']},
     {id:'integration',nom:'Calcul intégral',detail:'Intégrale définie, Riemann, IPP, éléments simples, valeur moyenne',q:['integrale','riemann','ipp','simples','moyenne']},
     {id:'trigonometrie',nom:'Trigonométrie et fonctions usuelles',detail:'Formules, équations, logarithme, hyperboliques',q:['valexacte','equation','logderivee','hyperbolique']}
   ],
   ds:[
     {id:'outils',nom:'DS Outils mathématiques',detail:'Chapitres 1 à 4 · semaine du 14 au 18 déc.',chapitres:['complexes','derivation','integration','trigonometrie'],n:8,min:90}
   ]},
  {id:'web',module:'web',nom:'Création de page Web',couleur:'#be185d',nota:'aucun',
   banque:()=>window.BANQUE_WEB,
   noms:{balise:'Quelle balise ?',simpledouble:'Balise simple ou double',attribut:'Attribut indispensable',lamp:'La pile LAMP',
     partie:'Doctype, head ou body',ancre:'Lien vers une ancre',tableau:'Lire un tableau',tablebalise:'Balises de tableau',
     selecteur:'Écrire un sélecteur CSS',hexrgb:'Hexadécimal → rgb',rgbhex:'rgb → hexadécimal',propriete:'Quelle propriété CSS ?',media:'Media query',boite:'Largeur d\'un bloc (padding, border, margin)',integration:'Lier une feuille CSS',
     methode:'GET ou POST',typeinput:'Type de champ',urlget:'URL d\'un envoi GET',radio:'Radio et checkbox',labelfor:'Relier un label'},
   chapitres:[
     {id:'bases',nom:'Bases du web et du HTML',detail:'Balises, attributs, LAMP',q:['balise','simpledouble','attribut','lamp']},
     {id:'structure',nom:'Structures en HTML',detail:'Doctype, head, body, ancres, tableaux',q:['partie','ancre','tableau','tablebalise']},
     {id:'css',nom:'CSS',detail:'Sélecteurs, couleurs, propriétés, media queries',q:['selecteur','hexrgb','rgbhex','propriete','media','boite','integration']},
     {id:'formulaires',nom:'Formulaires',detail:'GET et POST, types de champs, labels',q:['methode','typeinput','urlget','radio','labelfor']}
   ],
   ds:[
     {id:'web',nom:'DS Page Web',detail:'Cours 1 à 4 · semaine du 14 au 18 déc.',chapitres:['bases','structure','css','formulaires'],n:8,min:60}
   ]},
  {id:'embarque',module:'embarque',nom:'Informatique embarquée',couleur:'#15803d',nota:'aucun',
   banque:()=>window.BANQUE_EMBARQUE,
   noms:{bin2dec:'Binaire → décimal',dec2bin:'Décimal → binaire',signe:'Octet signé ou non',complement:'Complément à 2',plage:'Valeurs sur n bits',portes:'Portes logiques',ascii:'Code ASCII',
     fonction:'Quelle fonction Arduino ?',blink:'Lire un programme Blink',type:'Taille des types',serie:'Lire un programme (moniteur série)',
     boucle_for:'Lire une boucle for',boucle_while:'Lire une boucle while',ifelse:'Lire un if… else',logique:'Conditions && et ||',pullup:'Pull-up et pull-down',
     millis:'Temporisation avec millis()',pwm:'PWM : rapport cyclique',pwminverse:'PWM : valeur à envoyer',analogread:'analogRead et conversion',interruption:'Mode d\'interruption',ports:'Ports PWM',timer:'Période d\'un timer'},
   chapitres:[
     {id:'systemes',nom:'Systèmes embarqués et binaire',detail:'Binaire, complément à 2, ASCII, portes logiques',q:['bin2dec','dec2bin','signe','complement','plage','portes','ascii']},
     {id:'arduino',nom:'Premiers programmes Arduino',detail:'Fonctions de base, Blink, types, moniteur série',q:['fonction','blink','type','serie']},
     {id:'controle',nom:'Fonctions et structures de contrôle',detail:'for, while, if… else, &&, ||, boutons',q:['boucle_for','boucle_while','ifelse','logique','pullup']},
     {id:'temps',nom:'Temps réel',detail:'millis(), interruptions, analogique, PWM, timers',q:['millis','pwm','pwminverse','analogread','interruption','ports','timer']}
   ],
   ds:[
     {id:'embarque',nom:'DS Informatique embarquée',detail:'Chapitres 1 à 4 · semaine du 14 au 18 déc.',chapitres:['systemes','arduino','controle','temps'],n:8,min:60}
   ]},
  {id:'crea',module:'crea',nom:'Créativité et Innovation',couleur:'#b45309',nota:'aucun',
   banque:()=>window.BANQUE_CREA,
   noms:{niveau:'Découverte, invention ou innovation',schumpeter:'Les 5 formes (Schumpeter)',rogers_cat:'Catégories d\'adoptants',rogers_cumul:'Courbe de Rogers : cumul',conditions:'Conditions d\'adoption',soncase:'Levier SONCASE',
     inventeur:'Qui a inventé ?',lecon:'Leçon d\'une invention',guilford:'Divergence ou convergence',regles:'Règles d\'une séance créative',brainstorming:'Phases du brainstorming',tri:'Tableau de tri',
     trl:'Échelle TRL',etapes:'Étapes du processus d\'innovation',modeles:'Modèles de diffusion',strategies:'Accélérer la diffusion',pitch_format:'Format de pitch',pitch_ordre:'Structure du pitch',fonction_avantage:'Fonctionnalité ou avantage',publicite:'Type de publicité'},
   chapitres:[
     {id:'explorer',nom:'Explorer et s\'inspirer',detail:'Innovation, Schumpeter, Rogers, SONCASE',q:['niveau','schumpeter','rogers_cat','rogers_cumul','conditions','soncase']},
     {id:'imaginer',nom:'Imaginer',detail:'Inventions, Guilford, brainstorming, tri des idées',q:['inventeur','lecon','guilford','regles','brainstorming','tri']},
     {id:'innover',nom:'Innover',detail:'TRL, diffusion, pitch, publicité',q:['trl','etapes','modeles','strategies','pitch_format','pitch_ordre','fonction_avantage','publicite']}
   ],
   ds:[
     {id:'crea',nom:'DS Créativité et Innovation',detail:'Parties I à III · semaine du 14 au 18 déc.',chapitres:['explorer','imaginer','innover'],n:8,min:60}
   ]}
];
