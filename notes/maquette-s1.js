/* Maquette des notes HEI 1, semestre 1 (d'après le PDF de la maquette).
   Pour chaque module : son poids dans l'UE (en %) et le poids de chaque épreuve (en % de l'UE).
   La somme des épreuves d'un module = poids du module. La somme des modules d'une UE = 100.
   Une UE est validée avec une moyenne ≥ 10/20. */
window.MAQUETTE_S1={
  semestre:'Semestre 1',
  seuil:10,
  ue:[
    {id:'maths',nom:'Mathématiques',ects:4,couleur:'#5fa35a',modules:[
      {id:'outils',nom:'Outils mathématiques pour l\'ingénieur 1',poids:60,ep:[['DS','DS',25],['Finale','Épreuve finale',35]]},
      {id:'analyse',nom:'Analyse',poids:40,ep:[['DS','DS',15],['Finale','Épreuve finale',25]]}]},
    {id:'chelec',nom:'Chimie et Électricité',ects:6,couleur:'#3f9a3a',modules:[
      {id:'chimie',nom:'Chimie 1',poids:50,ep:[['DS','DS',20],['Finale','Épreuve finale',30]]},
      {id:'elec',nom:'Bases de l\'électricité',poids:50,ep:[['DS','DS',20],['Finale','Épreuve finale',25],['TP1','TP 1',2.5],['TP2','TP 2',2.5]]}]},
    {id:'meca',nom:'Mécanique',ects:7,couleur:'#2a8fc8',modules:[
      {id:'statique',nom:'Mécanique 1 (Statique)',poids:50,ep:[['DS','DS',20],['Finale','Épreuve finale',30]]},
      {id:'thermo',nom:'Thermodynamique',poids:50,ep:[['DS','DS',15],['Finale','Épreuve finale',25],['TP1','TP 1',5],['TP2','TP 2',5]]}]},
    {id:'info',nom:'Informatique',ects:4,couleur:'#c04fb5',modules:[
      {id:'embarque',nom:'Informatique embarquée',poids:70,ep:[['Finale','Épreuve finale',30],['CC1','CC 1',20],['TP1','TP 1',20]]},
      {id:'web',nom:'Création de page Web',poids:30,ep:[['Finale','Épreuve finale',20],['CC1','CC 1',10]]}]},
    {id:'huma',nom:'Humanités et Langues',ects:5,couleur:'#d0703f',modules:[
      {id:'anglais',nom:'Anglais',poids:30,ep:[['Finale','Épreuve finale',6],['CC1','CC 1',4.5],['CC2','CC 2',4.5],['CC3','CC 3',9],['TP1','Travaux 1',3],['TP2','Travaux 2',3]]},
      {id:'lv2',nom:'LV2',poids:20,ep:[['Finale','Épreuve finale',10],['CC1','CC 1',5],['CC2','CC 2',5]]},
      {id:'stage',nom:'Préparation à la recherche de stage',poids:0,ep:[]},
      {id:'relation',nom:'Compétences relationnelles',poids:20,ep:[['Finale','Épreuve finale',20]]},
      {id:'oral',nom:'Expression orale',poids:15,ep:[['CC1','CC 1',15]]},
      {id:'ecrit',nom:'Expression écrite',poids:15,ep:[['CC1','CC 1',15]]}]},
    {id:'ome',nom:'Organisation et Management des Entreprises',ects:4,couleur:'#c98a5c',modules:[
      {id:'crea',nom:'Créativité et Innovation',poids:70,ep:[['DS','DS',35],['Proj','Projet',35]]},
      {id:'bureau',nom:'Outils bureautiques',poids:30,ep:[['Rap','Rapport',30]]},
      {id:'fresque',nom:'Fresque du climat',poids:0,ep:[]}]}
  ]
};
