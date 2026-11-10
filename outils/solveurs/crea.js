/* Solveurs indépendants du mini-DS Créativité et Innovation (outils/verif-minids.js).
   Les situations sont repérées par leur indice k ; chaque table ci-dessous a été écrite à part,
   à partir du cours (pas recopiée de la banque) : la vérification compare les deux.
   Pour une case « choix », on renvoie le texte de l'option juste. */
'use strict';
const NIV=['invention','innovation','découverte'];           // ordre différent exprès
const niveau=['découverte','invention','innovation','découverte','invention','innovation','découverte','invention','innovation'];
const forme=['innovation de produits','innovation de procédés','innovation commerciale','nouvelle matière première','nouveau type d\'organisation','innovation de produits','innovation de procédés','innovation commerciale','nouvelle matière première','innovation de procédés','nouveau type d\'organisation'];
const rogers={'innovateurs':2.5,'adopteurs précoces':13.5,'majorité précoce':34,'majorité tardive':34,'retardataires':16};
const ordre=['innovateurs','adopteurs précoces','majorité précoce','majorité tardive','retardataires'];
const cond=['testabilité','observabilité','avantage relatif','compatibilité','complexité','testabilité','observabilité','complexité'];
const son=['Sécurité','Orgueil','Nouveauté','Confort','Argent','Sympathie','Environnement','Sécurité','Confort','Argent','Environnement'];
const inv=['Blaise Pascal','Melitta Bentz','James Watt','William Dickson et Thomas Edison','Hedy Lamarr et George Antheil','Ada Lovelace','Camille Jenatzy','3M (Spencer Silver et Arthur Fry)'];
const lecon=['échec de la diffusion : trop complexe et trop cher','détournement d\'usage d\'un objet existant','amélioration d\'une machine existante, grâce à un financeur','un échec qui trouve un autre usage, lancé par la gratuité','une technique simple, mais plus lourde et plus chère que la concurrence'];
const verbes=['analyser','déstructurer','imaginer','associer','combiner','évaluer','catégoriser','choisir'];
const phaseG=v=>['évaluer','catégoriser','choisir'].includes(v)?'convergence':'divergence';
const regle=['suspendre son jugement','privilégier la quantité','farfelu bienvenu','valoriser les différences','être présent ici et maintenant','se poser des questions'];
const bs=[[1,5],[2,10],[3,5]];
const trl=[1,2,3,4,5,6,7,8,9];
const etape=['Recherche et Développement','Recherche et Développement','Commercialisation','Diffusion','Diffusion','Recherche et Développement'];
const diff=['modèle de l\'aiguille hypodermique','modèle du flux en deux étapes','homophilie','modèle de l\'aiguille hypodermique','homophilie','modèle du flux en deux étapes'];
const strat=['inciter à l\'adoption précoce (gratuité…)','suggérer que l\'adoption est inévitable ou désirable','introduire l\'innovation dans les groupes les plus innovatifs','cibler les individus les plus respectés','inciter à l\'adoption précoce (gratuité…)'];
const pitch=['pitch investisseur','pitch entrepreneur','pitch commercial','pitch interne','pitch investisseur'];
const parts=['accroche','contexte','problème','bénéfices','solution','appel à l\'action'];
const fa=['fonctionnalité','avantage','fonctionnalité','avantage','fonctionnalité','avantage'];
const pub=['suggestion (émotion)','mécanisation (répétition)','intégration (appartenance)','publicité informative','mécanisation (répétition)','intégration (appartenance)'];
module.exports={
  niveau:({k})=>[niveau[k]],
  schumpeter:({k})=>[forme[k]],
  rogers_cat:({k})=>{const c=ordre[k];return [c,rogers[c]]},
  rogers_cumul:({k})=>{let s=0;for(const c of ordre.slice(0,k+1))s+=rogers[c];return [s,100-s]},
  conditions:({k})=>[cond[k]],
  soncase:({k})=>[son[k]],
  inventeur:({k})=>[inv[k]],
  lecon:({k})=>[lecon[k]],
  guilford:({i,j})=>[phaseG(verbes[i]),phaseG(verbes[j])],
  regles:({k})=>[regle[k]],
  brainstorming:({k})=>bs[k],
  tri:({P,A,B})=>{let a=0,b=0;for(let i=0;i<3;i++){a+=A[i]*P[i];b+=B[i]*P[i]}return [a,b,a>b?'idée A':'idée B']},
  trl:({k})=>{const n=trl[k];return [n,n<4?'Recherche':n<7?'Développement':'Déploiement']},
  etapes:({k})=>[etape[k]],
  modeles:({k})=>[diff[k]],
  strategies:({k})=>[strat[k]],
  pitch_format:({k})=>[pitch[k]],
  pitch_ordre:({i,j})=>[parts.indexOf(parts[i])+1,parts.indexOf(parts[j])+1],
  fonction_avantage:({k})=>[fa[k]],
  publicite:({k})=>[pub[k]]
};
