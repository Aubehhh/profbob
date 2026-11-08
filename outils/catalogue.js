/* Catalogue du site : UE → modules → chapitres et DS.
   C'est la source unique des menus : après une modification, lancer `node outils/build.js`
   (régénère l'accueil, les pages /matieres/<slug>/ et la liste des pages de l'admin).
   Les poids et épreuves de chaque module viennent de notes/maquette-s1.js (même id).

   Ajouter du contenu :
   - un chapitre : { id:'vecteurs', titre:'Vecteurs force', url:'/cours/statique/vecteurs/' } dans chapitres
     (sans url, il apparaît « bientôt »)
   - un DS : { titre, quand:'novembre 2026', url, desc, liens:[[texte,url], …], minids:'/mini-ds/?…' } dans ds */
module.exports={
  // liste « Nouveautés » de l'accueil (la plus récente en premier ; les 4 premières sont affichées)
  nouveautes:[
    {date:'8 nov.',texte:'Mode « Mes erreurs » dans le mini-DS',url:'/mini-ds/',nouveau:true},
    {date:'8 nov.',texte:'Toutes les matières du S1 rangées par UE',url:'/matieres/'},
    {date:'8 nov.',texte:'Le site s\'installe comme une appli sur ton téléphone',url:'/'},
    {date:'6 nov.',texte:'DS Statique : cours, 12 exercices, fiche et mini-DS',url:'/ds/statique/'}
  ],
  // petit mot sous le titre de l'accueil (HTML autorisé)
  dedicace:'big up à squige, polo, mashmash et tagrandmere, RDV sur <a href="https://richup.io" target="_blank" rel="noopener">monopoly</a>',
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
         {id:'vecteurs',titre:'Vecteurs force',url:'/ds/statique/#m1'},
         {id:'equilibre',titre:'Équilibre d\'une particule',url:'/ds/statique/#m5'},
         {id:'moments',titre:'Moments',url:'/ds/statique/#m7'}],
       ds:[{titre:'Statique : chapitres 1 à 3',quand:'novembre 2026',url:'/ds/statique/',
            desc:'Vecteurs et forces, vecteur position, produit scalaire, équilibre d\'une particule, produit vectoriel, moments.',
            liens:[['Cours · 8 modules','/ds/statique/'],['12 exercices','/ds/statique/#exos'],['Fiche récap','/ds/statique/#fiche']],
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
