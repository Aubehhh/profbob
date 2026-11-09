# Agent « tests » (mini-DS, flashcards, exercices) — profbob.fr

Lancé par l'agent « créateur de cours » une fois le chapitre écrit. Il part de la page chapitre (mêmes chapitres, mêmes notations, mêmes formules) et produit :

## 1. Banque du mini-DS (`<chemin>/mini-ds/banque.js`)
Un générateur par **type d'exercice** du chapitre (au moins un par section importante). Format : voir l'en-tête de `ds/statique/mini-ds/banque.js`.
- Valeurs tirées avec `R` (reproductible : même sujet = mêmes valeurs pour toute la classe), choisies pour que le calcul soit propre (racines entières, angles usuels).
- `fields` : `label` en notation du cours, `unit`, `ans`, `d` (décimales affichées), `tol`/`rel` si besoin, `type:'angle'`, et **`hint` = « quoi taper »** (signe, intervalle, unité).
- `sol` : correction pas à pas, une ligne par étape, avec les formules **exactement** comme sur la page chapitre ; `note` = le piège classique.
- `v` : les données tirées, pour la vérification.
- Éviter les ambiguïtés : un angle qui peut dépasser 90° ne se calcule pas par sin⁻¹ (exemple réel trouvé par la vérification sur la question `cosinus`).

## 2. Déclaration (`mini-ds/matieres.js`)
`noms` (nom lisible de chaque question), `chapitres` (`id` = celui du catalogue, `q` = ids des questions), `ds`. La progression par chapitre des pages module se calcule à partir de ces listes.

## 3. Flashcards (`flashcards/cartes.js`)
Pour chaque chapitre : toutes les formules encadrées de la page, recto = la question, verso = la formule en notation « texte » du cours (`notation.js` la met en forme).

## 4. Exercices de la page
Les exercices des diapos et des PDF complémentaires vont dans la section `#exos` de la page chapitre (méthode, et correction complète quand les données de la figure sont lisibles et le résultat vérifié).

## 5. Vérifier (obligatoire)
- `node outils/verif-minids.js 3000` : pour chaque question, un **solveur indépendant** (méthode différente : système linéaire, règle cyclique pour le produit vectoriel…) recalcule la réponse à partir de `v` ; contrôle aussi qu'aucun NaN/undefined n'apparaît, et qu'une réponse tapée à la française (valeur du corrigé, ou 3 chiffres significatifs) est acceptée → copies parfaites notées 20/20. Ajouter un solveur pour chaque nouvelle question.
- Test navigateur : sur `/mini-ds/?m=<id>&ch=<chapitre>`, rendre une copie, relire les valeurs attendues, refaire le même sujet avec ces valeurs → 20/20 sans erreur JS.
- `node outils/build.js`, puis maquette avant mise en ligne.

## 6. Mode « DS spécifique » (demande du type « DS le 20 nov. sur les chapitres 2 et 3 »)
Entrée : matière, chapitres concernés, date du DS (et durée si connue). Les chapitres doivent déjà avoir leur page et leurs questions (sinon : agent « créateur de cours » d'abord).
- `outils/catalogue.js` : un DS dans `ds` du module (`titre`, `quand`, `date:'AAAA-MM-JJ'`, `desc`, `liens` vers les chapitres, `minids:'/mini-ds/?m=<id>&ds=<ds id>'`). Le premier DS du catalogue alimente le bandeau « En ce moment » de l'accueil : mettre le DS le plus proche en premier.
- `mini-ds/matieres.js` : `{id, nom, detail, chapitres:[…], n, min}` dans `ds` (n = nombre de questions, min = durée réelle du DS).
- Si des types d'exercices des chapitres manquent à la banque, les ajouter (et leurs solveurs) avant.
- Optionnel, si demandé : une page de révision `/ds/<module>-<ds id>/` (plan de révision jusqu'à la date, sujet blanc, fiche récap des formules des chapitres concernés).
- Vérifier (`verif-minids.js`, test navigateur sur `?ds=<ds id>`), build, maquette, mise en ligne après validation.
