/* Solveurs indépendants du mini-DS Création de page Web (outils/verif-minids.js).
   Réponses retrouvées à partir des données du sujet (q.v) avec des tables écrites à part de la banque,
   et les calculs (tableaux, couleurs, boîtes, URL) refaits autrement. Pour une case « choix », on renvoie le texte de l'option juste. */
'use strict';
const TAG={'mettre un mot en gras':'b','mettre un mot en italique':'i','souligner un mot':'u','passer à la ligne':'br','créer un lien':'a','écrire un paragraphe':'p',
  'écrire le titre principal de la page':'h1','faire une liste à puces (sans numéros)':'ul','faire une liste numérotée':'ol','écrire un élément de liste':'li','afficher une image':'img',
  'créer un bloc de mise en page':'div','créer une ligne de tableau':'tr','créer une cellule de tableau':'td','créer un formulaire':'form'};
const VIDES=new Set(['br','img','input','meta','link','hr','area','base','col','embed','source','track','wbr']); // éléments vides du HTML
const ROLE={Linux:"le système d'exploitation du serveur",Apache:"le serveur qui envoie le fichier demandé",MySQL:'la base de données qui conserve les informations',PHP:'le langage qui génère la page à la volée'};
const PROP={'la couleur du texte':'color','la couleur de fond':'background-color','la taille de la police':'font-size','la police utilisée':'font-family','mettre le texte en gras':'font-weight',
  'arrondir les coins':'border-radius','la marge intérieure (entre contenu et bordure)':'padding','la marge extérieure':'margin','la transparence':'opacity',
  'placer un bloc à gauche ou à droite, le texte coulant autour':'float','une ombre portée':'box-shadow','le style de bordure (pleine, pointillée…)':'border-style'};
const TYPE={'un mot de passe (caractères masqués)':'password','plusieurs choix indépendants à cocher':'checkbox','un seul choix parmi plusieurs':'radio','un curseur pour choisir un niveau':'range',
  'une adresse e-mail':'email','une couleur':'color','une date':'date','un nombre':'number','un fichier à envoyer':'file','une ligne de texte libre':'text'};
const hex2=n=>n.toString(16).toUpperCase().padStart(2,'0');
module.exports={
  balise:({quoi})=>[TAG[quoi]],
  simpledouble:({tag})=>[VIDES.has(tag)?'simple (se ferme elle-même)':'double (ouvrante + fermante)'],
  attribut:({tag})=>[{img:'src',a:'href'}[tag]],
  lamp:({nom})=>[nom,ROLE[nom]],
  partie:({quoi})=>[/version/.test(quoi)?'doctype':/onglet|encodage|feuille|mots-clés/.test(quoi)?'head':'body'],
  ancre:({nom})=>['#'+nom],
  tableau:({L,C,pied})=>[L+(pied?1:0),L*C+(pied?1:0)],
  tablebalise:({quoi})=>['<'+({'une ligne':'tr','une cellule':'td',"l'en-tête du tableau":'thead','le corps du tableau':'tbody','le pied du tableau':'tfoot'})[quoi]+'>'],
  selecteur:({k,nom,tag})=>[k==='id'?'#'+nom:k==='class'?'.'+nom:tag],
  hexrgb:({hex})=>[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)],
  rgbhex:({r,g,b})=>['#'+hex2(r)+hex2(g)+hex2(b)],
  propriete:({quoi})=>[PROP[quoi]],
  media:({lim,mode,w1,w2,ecr})=>[((mode==='max'&&ecr<=lim)||(mode==='min'&&ecr>=lim)?w2:w1)+' %'],
  boite:({w,p,b,m})=>{const box=[m,b,p,w,p,b,m];const tot=box.reduce((s,x)=>s+x,0);return [tot-2*m,tot]},
  integration:({f})=>['<link rel="stylesheet" href="'+f+'" />'],
  methode:({cas})=>[/connexion|personnelles|inscription/.test(cas)?'POST':'GET'],
  typeinput:({quoi})=>[TYPE[quoi]],
  urlget:({url})=>[url],
  radio:({k,nom})=>[k==='radio'?'le même name':nom+'=on'],
  labelfor:({id})=>[id]
};
