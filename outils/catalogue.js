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
    {date:'9 nov.',texte:'Statique refaite chapitre par chapitre, d\'après les diapos du prof',url:'/cours/statique/vecteurs/',nouveau:true},
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
      {id:'outils',slug:'mathematiques',mono:'OM',chapitres:[],ds:[]},
      {id:'analyse',slug:'analyse',mono:'An',chapitres:[],ds:[]}]},
    {id:'chelec',couleur:'#0f766e',modules:[
      {id:'chimie',slug:'chimie',mono:'Ch',chapitres:[],ds:[]},
      {id:'elec',slug:'electricite',mono:'Él',chapitres:[],ds:[]}]},
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
      {id:'thermo',slug:'thermodynamique',mono:'Th',chapitres:[],ds:[]}]},
    {id:'info',couleur:'#be185d',modules:[
      {id:'embarque',slug:'informatique-embarquee',mono:'IE',chapitres:[],ds:[]},
      {id:'web',slug:'pages-web',mono:'We',chapitres:[],ds:[]}]},
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
