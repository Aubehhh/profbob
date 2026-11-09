# Agent « créateur de cours » — profbob.fr

Transforme les supports d'un chapitre (PDF du prof, photos, exercices, consignes) en **page chapitre** au format du site, l'ajoute au catalogue et lance le build. Puis passe la main à l'agent « tests » (`outils/agents/agent-tests.md`).

Modèle de référence : `cours/statique/vecteurs/index.html` (et `equilibre/`, `moments/`).

## 1. Lire les supports
- Extraire le texte (`pdftotext -layout`), puis **regarder les diapos en image** (`pdftoppm -r 50` + `montage`) : les données des exercices sont sur les figures.
- Relever l'ordre des notions (numéros de section du prof), les numéros de diapo, et **toutes les notations** telles qu'elles sont écrites.
- Repérer les coquilles des diapos (comparer avec les fiches de révision de la classe si elles existent). On ne les recopie pas : on les signale dans un encadré `.coquille`.

## 2. Notations de la matière
- `assets/notations.js` : une clé par matière (même id que `mini-ds/matieres.js`). Chaque ligne : `[symbole HTML, sens, unité, [ids des chapitres]]`. Écrire les symboles **comme dans le cours** (ex. `F = k s ; s = l − l0`, `(F_R)x`, `M_O = F d`).
- `assets/notation.js` met en forme le texte : `X_AB` → indice, `r_AB`/`u_a` → vecteur fléché, `Fx`/`rx` → composante. Une composante scalaire s'écrit **sans** `_` (`rx`, pas `r_x`, qui donnerait une flèche). Si le cours utilise une écriture que la règle ne connaît pas, compléter `convert()` (et vérifier les autres pages).
- Une formule à mettre en forme à la main : `<span class="vec">r</span>` + `data-nonota` sur le bloc.

## 3. Écrire la page `/cours/<module>/<chapitre>/index.html`
En-tête obligatoire : viewport, favicon, manifest, theme-color `#2453b8`, apple-touch-icon, polices, `site.css` + `notation.css` + `cours.css`, `notation.js` (defer).
`<body data-cours="<module>-<chapitre>" data-matiere="<id matière>" data-ch="<id chapitre>" data-nota-all>`.
Barre du haut commune (Matières en `aria-current`, avec la loupe), puis dans `.wrap` (largeur commune, ne pas la surcharger) :

1. `header.chero` : fil d'Ariane vers `/matieres/<slug>/` + « Chapitre n sur N », `h1` = titre du prof, `.lead`, `.chips` (sections, durée, diapos, prérequis), `.ctools` (Mini-DS du chapitre `?m=<id>&ch=<chapitre>`, Flashcards), `#cprog`.
2. `nav.ctoc` (hors `.wrap`) : un lien par section `#s1…`, puis Exercices, S'entraîner.
3. `<div data-notations="<id matière>"></div>` : la légende du chapitre est insérée par `cours.js`.
4. Une `section.csec#sN` par partie du cours, dans l'ordre du prof : `.shead` (numéro, titre, « diapos a à b · durée ») ; `.idee` ; formules en `.formula.key.cours` (« Comme dans le cours ») ; `.coquille` ; `.trap` ; `.retiens` ; figures SVG (couleurs via variables CSS) ; exemples `.example` avec correction dans `details.sol` (réponse en `.res`, 3 chiffres significatifs) ; `.quiz` (boutons `data-ok="1"` + `.fb`) ; `label.checkrow` avec `input[data-s="sN"]`.
5. `section#exos` : exercices des diapos et des PDF complémentaires, méthode en `details.hint`, sans recopier les figures.
6. `section#train` : cartes Mini-DS / Flashcards / révision DS + `nav.chnav` (chapitres précédent et suivant).
7. Pied de page « Signale une erreur » (`/contact/?type=erreur&matiere=…`), puis `notations.js`, `cours.js`, `stats.js` (defer), `pwa.js` (defer).

**Chaque valeur numérique d'un exemple est recalculée par un script** avant d'être écrite (et confrontée au corrigé du livre ou de la fiche quand il existe).

## 4. Brancher
- `outils/catalogue.js` : `{id, titre, url:'/cours/<module>/<chapitre>/'}` dans `chapitres`, + une entrée `nouveautes`.
- `sw.js` : ajouter les pages (et les nouveaux assets) à `CORE`, incrémenter `VERSION`.
- `node outils/build.js` : régénère l'accueil, les pages module, la recherche (les sections des pages `/cours/…` sont indexées) et la liste des pages de l'admin.

## 5. Contrôler, puis passer la main
- Audit : chaque page en 1280 clair, 390 clair, 390 sombre, sans débordement ni erreur JS.
- Passer la main à l'agent « tests » avec : id matière, ids des chapitres, notations, liste des notions par chapitre.
- **Maquette (captures ordi + téléphone) envoyée et validée avant toute mise en ligne.**
