/* Catalogue du site : UE → modules → chapitres et DS.
   C'est la source unique des menus : après une modification, lancer `node outils/build.js`
   (régénère l'accueil, les pages /matieres/<slug>/ et la liste des pages de l'admin).
   Les poids et épreuves de chaque module viennent de notes/maquette-s1.js (même id).

   Ajouter du contenu :
   - un chapitre : { id:'vecteurs', titre:'Vecteurs force', url:'/cours/statique/vecteurs/' } dans chapitres
     (page faite au format standard : voir outils/agents/createur-de-cours.md ; les pages /cours/… sont indexées par la recherche)
     (sans url, il apparaît « bientôt »)
   - un DS : { titre, quand:'semaine du 14 au 18 déc.', date:'2026-12-14', dateFin:'2026-12-18', url, desc, liens:[[texte,url], …], minids:'/mini-ds/?…' } dans ds
     (date / dateFin au format AAAA-MM-JJ : compte à rebours « dans N jours » dans le bandeau de l'accueil ; le DS le plus proche en premier) */
module.exports={
  // liste « Nouveautés » de l'accueil (la plus récente en premier ; les 4 premières sont affichées)
  nouveautes:[
    {date:'10 nov.',texte:'Création de page Web : HTML, structure, CSS et formulaires, avec mini-DS et flashcards',url:'/matieres/pages-web/',nouveau:true},
    {date:'9 nov.',texte:'Outils mathématiques : complexes, dérivation, intégration et trigonométrie, avec mini-DS et flashcards',url:'/matieres/mathematiques/'},
    {date:'9 nov.',texte:'Électricité : les 4 chapitres (continu, théorèmes, sinusoïdal), avec mini-DS et flashcards',url:'/matieres/electricite/'},
    {date:'9 nov.',texte:'Chimie : l\'atome, la classification et les molécules, avec mini-DS et flashcards',url:'/matieres/chimie/'},
    {date:'9 nov.',texte:'Thermodynamique : les 5 chapitres, avec mini-DS et flashcards',url:'/matieres/thermodynamique/'},
    {date:'9 nov.',texte:'Statique refaite chapitre par chapitre, d\'après les diapos du prof',url:'/cours/statique/vecteurs/'},
    {date:'8 nov.',texte:'Flashcards des formules, recherche dans les cours et progression par chapitre',url:'/flashcards/?m=meca'},
    {date:'8 nov.',texte:'Mode « Mes erreurs » dans le mini-DS',url:'/mini-ds/'},
    {date:'8 nov.',texte:'Toutes les matières du S1 rangées par UE',url:'/matieres/'},
    {date:'8 nov.',texte:'Le site s\'installe comme une appli sur ton téléphone',url:'/'},
    {date:'6 nov.',texte:'Mini-DS Statique corrigé automatiquement',url:'/mini-ds/?m=meca&ds=statique'}
  ],
  // petit mot sous le titre de l'accueil (HTML autorisé)
  dedicace:'big up à squige, polo, pouletpaki, mashmash et tagrandmere, RDV sur <a href="https://richup.io" target="_blank" rel="noopener">monopoly</a>',
  ue:[
    {id:'maths',couleur:'#7c3aed',modules:[
      {id:'outils',slug:'mathematiques',mono:'OM',
       chapitres:[
         {id:'complexes',titre:'Nombres complexes',url:'/cours/maths/complexes/'},
         {id:'derivation',titre:'Calcul différentiel',url:'/cours/maths/derivation/'},
         {id:'integration',titre:'Techniques fondamentales du calcul intégral',url:'/cours/maths/integration/'},
         {id:'trigonometrie',titre:'Trigonométrie et fonctions usuelles',url:'/cours/maths/trigonometrie/'}],
       ds:[
         {titre:'Outils mathématiques : DS de fin de trimestre',quand:'semaine du 14 au 18 déc.',date:'2026-12-14',dateFin:'2026-12-18',url:'/mini-ds/?m=outils&ds=outils',desc:'Chapitres 1 à 4 : complexes, dérivation, intégration, trigonométrie et fonctions usuelles.',liens:[['Complexes','/cours/maths/complexes/'],['Dérivation','/cours/maths/derivation/'],['Intégration','/cours/maths/integration/'],['Trigonométrie','/cours/maths/trigonometrie/'],['Flashcards','/flashcards/?m=outils']],minids:'/mini-ds/?m=outils&ds=outils'}]},
      {id:'analyse',slug:'analyse',mono:'An',chapitres:[],ds:[]}]},
    {id:'chelec',couleur:'#0f766e',modules:[
      {id:'chimie',slug:'chimie',mono:'Ch',
       chapitres:[
         {id:'atome',titre:'L\'atome',url:'/cours/chimie/atome/'},
         {id:'classification',titre:'La classification périodique',url:'/cours/chimie/classification/'},
         {id:'molecules',titre:'Structure électronique des molécules',url:'/cours/chimie/molecules/'}],
       ds:[{titre:'Chimie : DS de fin de trimestre',quand:'semaine du 14 au 18 déc.',date:'2026-12-14',dateFin:'2026-12-18',url:'/mini-ds/?m=chimie&ds=chimie',
            desc:'Chapitres 1 et 2 : atome, configuration électronique, classification et électronégativité, Lewis, VSEPR, polarité.',
            liens:[['L\'atome','/cours/chimie/atome/'],['Classification','/cours/chimie/classification/'],['Molécules','/cours/chimie/molecules/'],['Flashcards','/flashcards/?m=chimie']],
            minids:'/mini-ds/?m=chimie&ds=chimie'}]},
      {id:'elec',slug:'electricite',mono:'Él',
       chapitres:[
         {id:'bases',titre:'Notions de base en électricité',url:'/cours/elec/bases/'},
         {id:'continu',titre:'Circuits alimentés en continu',url:'/cours/elec/continu/'},
         {id:'theoremes',titre:'Modèles électriques équivalents',url:'/cours/elec/theoremes/'},
         {id:'sinusoidal',titre:'Circuits alimentés en sinusoïdal monophasé',url:'/cours/elec/sinusoidal/'}],
       ds:[
         {titre:'Électricité : DS de fin de trimestre',quand:'semaine du 14 au 18 déc.',date:'2026-12-14',dateFin:'2026-12-18',url:'/mini-ds/?m=elec&ds=elec',desc:'Chapitres 1 à 4 : puissance et énergie, résistance, Kirchhoff, Thévenin et Norton, sinusoïdal, puissances et Boucherot.',liens:[['Bases','/cours/elec/bases/'],['Continu','/cours/elec/continu/'],['Théorèmes','/cours/elec/theoremes/'],['Sinusoïdal','/cours/elec/sinusoidal/'],['Flashcards','/flashcards/?m=elec']],minids:'/mini-ds/?m=elec&ds=elec'}]}]},
    {id:'meca',couleur:'#2453b8',modules:[
      {id:'statique',slug:'mecanique',mono:'Mé',
       chapitres:[
         {id:'vecteurs',titre:'Principes généraux et outils mathématiques',url:'/cours/statique/vecteurs/'},
         {id:'equilibre',titre:'Équilibre statique',url:'/cours/statique/equilibre/'},
         {id:'moments',titre:'Moment d\'une force',url:'/cours/statique/moments/'}],
       ds:[{titre:'Statique : DS de fin de trimestre',quand:'semaine du 14 au 18 déc.',date:'2026-12-14',dateFin:'2026-12-18',url:'/mini-ds/?m=meca&ds=statique',
            desc:'Chapitres 1 à 3 : vecteurs et forces, vecteur position, produit scalaire, équilibre d\'une particule, produit vectoriel, moments.',
            liens:[['Chapitre 1','/cours/statique/vecteurs/'],['Chapitre 2','/cours/statique/equilibre/'],['Chapitre 3','/cours/statique/moments/'],['Flashcards','/flashcards/?m=meca']],
            minids:'/mini-ds/?m=meca&ds=statique'}]},
      {id:'thermo',slug:'thermodynamique',mono:'Th',
       chapitres:[
         {id:'concepts',titre:'Concepts et définitions d\'introduction',url:'/cours/thermo/concepts/'},
         {id:'premier-principe',titre:'L\'énergie et le premier principe',url:'/cours/thermo/premier-principe/'},
         {id:'proprietes',titre:'Évaluation des propriétés thermodynamiques',url:'/cours/thermo/proprietes/'},
         {id:'volume-controle',titre:'Analyse par volume de contrôle',url:'/cours/thermo/volume-controle/'},
         {id:'second-principe',titre:'Le second principe (partie 1)',url:'/cours/thermo/second-principe/'}],
       ds:[{titre:'Thermodynamique : DS de fin de trimestre',quand:'semaine du 14 au 18 déc.',date:'2026-12-14',dateFin:'2026-12-18',url:'/mini-ds/?m=thermo&ds=thermo',
            desc:'Chapitres 1 à 5 : pression et température, premier principe, transferts de chaleur, cycles, tables et gaz parfait, volume de contrôle, second principe.',
            liens:[['Ch. 1','/cours/thermo/concepts/'],['Ch. 2','/cours/thermo/premier-principe/'],['Ch. 3','/cours/thermo/proprietes/'],['Ch. 4','/cours/thermo/volume-controle/'],['Ch. 5','/cours/thermo/second-principe/'],['Flashcards','/flashcards/?m=thermo']],
            minids:'/mini-ds/?m=thermo&ds=thermo'}]}]},
    {id:'info',couleur:'#be185d',modules:[
      {id:'embarque',slug:'informatique-embarquee',mono:'IE',chapitres:[],ds:[]},
      {id:'web',slug:'pages-web',mono:'We',
       chapitres:[
         {id:'bases',titre:'Bases du web et du HTML',url:'/cours/web/bases/'},
         {id:'structure',titre:'Structures en HTML',url:'/cours/web/structure/'},
         {id:'css',titre:'CSS',url:'/cours/web/css/'},
         {id:'formulaires',titre:'Formulaires',url:'/cours/web/formulaires/'}],
       ds:[]}]},
    {id:'huma',couleur:'#c2410c',modules:[
      {id:'anglais',slug:'anglais',mono:'En',chapitres:[],ds:[]},
      {id:'lv2',slug:'lv2',mono:'L2',chapitres:[],ds:[]},
      {id:'relation',slug:'competences-relationnelles',mono:'CR',chapitres:[],ds:[]},
      {id:'oral',slug:'expression-orale',mono:'EO',chapitres:[],ds:[]},
      {id:'ecrit',slug:'expression-ecrite',mono:'EÉ',chapitres:[],ds:[]}]},
    {id:'ome',couleur:'#b45309',modules:[
      {id:'crea',slug:'creativite-innovation',mono:'CI',chapitres:[],ds:[]},
      {id:'bureau',slug:'outils-bureautiques',mono:'OB',chapitres:[],ds:[]}]}
  ]
};
