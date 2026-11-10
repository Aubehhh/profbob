#!/usr/bin/env python3
"""Assemble les pages chapitre de Thermodynamique 1 au format standard (même gabarit que /cours/statique/…).
Usage : python3 outils/gen-cours.py <matière>  → écrit cours/<dir>/<id>/index.html à partir de outils/sources-cours/<dir>/<id>.html
(matières : thermo, chimie, elec, maths, web, embarque, crea ; sans argument : thermo)"""
import re, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[1]

import sys
MAT = sys.argv[1] if len(sys.argv) > 1 else 'thermo'
CFG = {
 'thermo': dict(dir='thermo', mid='thermo', nom='Thermodynamique', slug='thermodynamique', prof='K. Figoureux', ds='thermo'),
 'chimie': dict(dir='chimie', mid='chimie', nom='Chimie', slug='chimie', prof='S. Beaumont', credit="Cours de chimie de S. Beaumont (HEI, JUNIA). Cette page en reprend le contenu pour réviser ; les exemples corrigés et les remarques sont ajoutés par profbob.", ds='chimie'),
'elec': dict(dir='elec', mid='elec', nom='Électricité', slug='electricite', prof='E. Fiolet', credit="Cours « Les bases de l'électricité » de E. Fiolet (HEI 1, JUNIA). Cette page en reprend le contenu pour réviser ; les exemples corrigés et les remarques sont ajoutés par profbob.", ds='elec'),
'maths': dict(dir='maths', mid='outils', nom='Outils mathématiques', slug='mathematiques', prof='N. Coupier', credit="Cours « Outils mathématiques pour l'ingénieur 1 » de N. Coupier (HEI 1, JUNIA). Cette page en reprend le contenu pour réviser ; les exemples corrigés et les remarques sont ajoutés par profbob.", ds='outils'),
'web': dict(dir='web', mid='web', nom='Création de page Web', slug='pages-web', prof='R. Gosswiller', nota='aucun', credit="Cours « Développement et Architecture Web » de R. Gosswiller (HEI 1, JUNIA). Cette page en reprend le contenu pour réviser ; les exemples, corrections de TD et remarques sont ajoutés par profbob.", ds='web'),
'embarque': dict(dir='embarque', mid='embarque', nom='Informatique embarquée', slug='informatique-embarquee', prof='D. Gheysens', nota='aucun', credit="Cours « Systèmes embarqués » de D. Gheysens (HEI 1, JUNIA). Cette page en reprend le contenu pour réviser ; les exemples, corrections de TD et remarques sont ajoutés par profbob.", ds='embarque'),
'crea': dict(dir='crea', mid='crea', nom='Créativité et Innovation', slug='creativite-innovation', prof='B. Dufossé et F. Lefebvre', nota='aucun', credit="Cours « Créativité et innovation » de B. Dufossé et F. Lefebvre (HEI 1, JUNIA). Cette page en reprend le contenu pour réviser ; les exemples, corrections et remarques sont ajoutés par profbob.", ds='crea'),
}[MAT]
CHS = {}
CHS['crea'] = [
  dict(id='explorer', titre='Explorer et s\'inspirer : l\'innovation et sa diffusion', court='Explorer et s\'inspirer',
       lead='Découverte, invention et innovation, les 5 formes d\'innovation de Schumpeter, la diffusion selon Rogers, puis comment explorer un client, sa cible et ses concurrents.',
       duree='≈ 2 h', diapos='Partie I, 36 diapos'),
  dict(id='imaginer', titre='Imaginer : créativité et intelligence collective', court='Imaginer',
       lead='Ce que des inventions célèbres nous apprennent, la créativité selon Guilford (diverger puis converger), les techniques de groupe (brainstorming, brainwriting, IA) et le tri des idées.',
       duree='≈ 2 h', diapos='Partie II, 71 diapos'),
  dict(id='innover', titre='Innover : développer, diffuser et promouvoir', court='Innover',
       lead='Les étapes du processus d\'innovation et l\'échelle TRL, les modèles de diffusion par les médias, l\'art du pitch, la publicité persuasive et le storyboard.',
       duree='≈ 2 h', diapos='Partie III, 31 diapos'),
]
CHS['embarque'] = [
  dict(id='systemes', titre='Systèmes embarqués et codage binaire', court='Systèmes et binaire',
       lead='Ce qu\'est un système embarqué et un microcontrôleur, le binaire, les nombres négatifs (complément à 2), le code ASCII et les portes logiques.',
       duree='≈ 2 h', diapos='Cours 1, diapos 1 à 21'),
  dict(id='arduino', titre='Premiers programmes Arduino', court='Arduino',
       lead='L\'IDE et la carte Uno, la structure setup() / loop(), les types, le moniteur série, l\'écran LCD et le programme Blink.',
       duree='≈ 1 h 30', diapos='Cours 1, diapos 22 à 43'),
  dict(id='controle', titre='Fonctions et structures de contrôle', court='Fonctions et boucles',
       lead='Créer ses fonctions, lire un bouton (pull-up, pull-down), if… else, && et ||, les boucles while et for.',
       duree='≈ 2 h', diapos='Cours 2, diapos 1 à 26'),
  dict(id='temps', titre='Temps réel : millis, interruptions, PWM et timers', court='Temps réel',
       lead='Ne plus bloquer avec millis(), réagir avec les interruptions, lire une tension, piloter en PWM et comprendre les timers.',
       duree='≈ 2 h 30', diapos='Cours 2, diapos 27 à 45'),
]
CHS['web'] = [
  dict(id='bases', titre='Bases du web et du HTML', court='Bases du HTML',
       lead='Comment le web s\'est construit (client-serveur, LAMP), ce qu\'est le HTML, et les premières balises : texte, titres, listes, images et liens.',
       duree='≈ 1 h 30', diapos='Cours 1, 22 diapos'),
  dict(id='structure', titre='Structures en HTML', court='Structure',
       lead='Les trois parties d\'une page (doctype, head, body), les liens et les ancres, puis la mise en page : iframes, tableaux et blocs.',
       duree='≈ 1 h 30', diapos='Cours 2, 17 diapos'),
  dict(id='css', titre='CSS', court='CSS',
       lead='Ajouter du style : intégrer une feuille CSS, cibler avec id, classes et sélecteurs, les propriétés principales, les couleurs et le responsive design.',
       duree='≈ 2 h', diapos='Cours 3, 30 diapos'),
  dict(id='formulaires', titre='Formulaires', court='Formulaires',
       lead='Faire saisir des données : la balise form, GET et POST, les champs (texte, cases, boutons radio, curseurs…) et le bouton d\'envoi.',
       duree='≈ 1 h', diapos='Cours 4, 12 diapos'),
]
CHS['maths'] = [
  dict(id='complexes', titre='Nombres complexes', court='Complexes',
       lead='Calculer avec i, passer d\'une forme à l\'autre (algébrique, trigonométrique, exponentielle), trouver des racines et résoudre des équations, jusqu\'aux circuits en sinusoïdal.',
       duree='≈ 4 h', diapos='Chapitre 1, diapos 1 à 53'),
  dict(id='derivation', titre='Calcul différentiel', court='Dérivation',
       lead='Continuité, dérivées et leurs règles, étude de fonction, convexité, approximation linéaire, propagation d\'erreur et optimisation.',
       duree='≈ 4 h', diapos='Chapitre 2, diapos 1 à 45'),
  dict(id='integration', titre='Techniques fondamentales du calcul intégral', court='Intégration',
       lead='Primitives, intégrale définie, sommes de Riemann, théorème fondamental, changement de variable, intégration par parties, éléments simples.',
       duree='≈ 4 h', diapos='Chapitre 3, diapos 1 à 34'),
  dict(id='trigonometrie', titre='Trigonométrie et fonctions usuelles', court='Trigonométrie',
       lead='Cercle trigonométrique et formules, fonctions réciproques, équations trigonométriques, exponentielle, logarithme et fonctions hyperboliques.',
       duree='≈ 4 h', diapos='Chapitre 4, diapos 1 à 50'),
]
CHS['elec'] = [
  dict(id='bases', titre='Notions de base en électricité', court='Notions de base',
       lead='Ce qu\'est une tension, un courant, un signal continu ou alternatif, et le lien entre puissance et énergie.',
       duree='≈ 1 h', diapos='Chapitre 1'),
  dict(id='continu', titre='Circuits alimentés en continu', court='Tension continue',
       lead='Conventions de fléchage, résistance d\'un fil, loi d\'Ohm, associations, lois de Kirchhoff et diviseurs de tension et de courant.',
       duree='≈ 3 h', diapos='Chapitre 2'),
  dict(id='theoremes', titre='Modèles électriques équivalents', court='Théorèmes',
       lead='Résoudre un circuit à plusieurs mailles : méthode de Kirchhoff, superposition, modèles de Thévenin et de Norton.',
       duree='≈ 3 h', diapos='Chapitre 3'),
  dict(id='sinusoidal', titre='Circuits alimentés en sinusoïdal monophasé', court='Sinusoïdal',
       lead='Valeur efficace, Fresnel et complexes, R, L et C en alternatif, impédances, puissances P, Q, S, Boucherot et facteur de puissance.',
       duree='≈ 5 h', diapos='Chapitre 4'),
  dict(id='triphase', titre='Structure et propriétés d\'un réseau triphasé équilibré', court='Triphasé',
       lead='Les fils d\'un réseau triphasé, les trois tensions simples à 120° (courbes, Fresnel, complexes) et les tensions composées entre phases.',
       duree='≈ 1 h 15', diapos='Chapitre 5, parties 5.1 à 5.3'),
]
CHS['chimie'] = [
  dict(id='atome', titre='L\'atome', court='L\'atome',
       lead='De quoi est fait un atome, comment ses électrons se rangent en niveaux d\'énergie, et comment écrire sa configuration électronique.',
       duree='≈ 3 h', diapos='Chap. 1, partie 1'),
  dict(id='classification', titre='La classification périodique', court='Classification',
       lead='Pourquoi le tableau a cette forme, et comment l\'énergie d\'ionisation et l\'électronégativité y évoluent.',
       duree='≈ 2 h', diapos='Chap. 1, partie 2'),
  dict(id='molecules', titre='Structure électronique des molécules', court='Molécules',
       lead='Écrire la formule de Lewis d\'une molécule ou d\'un ion, prévoir sa forme avec la VSEPR et dire si elle est polaire.',
       duree='≈ 3 h 30', diapos='Chap. 2'),
  dict(id='organique', titre='Introduction à la chimie organique', court='Chimie organique',
       lead='Reconnaître les groupes fonctionnels et leur famille, puis comprendre l\'estérification : bilan, rendement et mécanisme avec les flèches courbes.',
       duree='≈ 2 h', diapos='Chap. 3'),
  dict(id='description', titre='Description des molécules organiques', court='Isomérie',
       lead='Écrire une molécule (brute, semi-développée, topologique, Cram, Newman), puis reconnaître les isoméries : conformation, constitution, énantiomérie (R/S) et diastéréoisomérie (Z/E).',
       duree='≈ 4 h', diapos='Chap. 4'),
]
CHS['thermo'] = [
  dict(id='concepts', titre='Concepts et définitions d\'introduction', court='Concepts et définitions',
       lead='Le vocabulaire de toute la thermo : système, état, variables, et surtout la pression et la température, avec les bonnes unités.',
       duree='≈ 1 h 30', diapos='Diapos 1 à 25'),
  dict(id='premier-principe', titre='L\'énergie et le premier principe', court='Premier principe',
       lead='L\'énergie se conserve : ce que le système gagne vient de la chaleur reçue moins le travail fourni. Avec les modes de transfert de chaleur et les cycles.',
       duree='≈ 3 h', diapos='Diapos 26 à 72'),
  dict(id='proprietes', titre='Évaluation des propriétés thermodynamiques', court='Propriétés',
       lead='Trouver l\'état d\'une substance (liquide, mélange, vapeur), lire les tables, utiliser le titre en vapeur et le modèle du gaz parfait.',
       duree='≈ 3 h 30', diapos='Diapos 73 à 132'),
  dict(id='volume-controle', titre='Analyse par volume de contrôle fondée sur l\'énergie', court='Volume de contrôle',
       lead='Quand la matière traverse le système : bilans de débit et de puissance, appliqués aux tuyères, turbines, compresseurs, échangeurs et détendeurs.',
       duree='≈ 3 h', diapos='Diapos 133 à 163'),
  dict(id='second-principe', titre='Le second principe de la thermodynamique', court='Second principe',
       lead='Pourquoi aucun moteur n\'atteint 100 % : les énoncés du second principe, les irréversibilités et le rendement entre deux réservoirs.',
       duree='≈ 1 h', diapos='Diapos 164 à 179 (partie 1)'),
]
CH = CHS[MAT]
HEAD = '''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#2453b8">
<link rel="apple-touch-icon" href="/assets/icon-192.png">
<title>Chapitre {n} · {titre} · {MNOM} · profbob.fr</title>
<meta name="description" content="{MNOM}, chapitre {n} : {desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=JetBrains+Mono:wght@400;600&display=swap">
<link rel="stylesheet" href="/assets/site.css">
<link rel="stylesheet" href="/assets/notation.css">
<link rel="stylesheet" href="/assets/cours.css">
<script src="/assets/notation.js" defer></script>
</head>
<body data-cours="{MDIR}-{id}" data-matiere="{MID}" data-ch="{id}" data-nota-all data-nota-profil="{NOTA}">
<header class="topbar"><div class="in">
  <a class="brand" href="/"><i>p</i>profbob</a>
  <nav aria-label="Navigation du site">
    <a href="/">Accueil</a>
    <a href="/matieres/" aria-current="page">Matières</a>
    <a href="/notes/">Notes</a>
    <a class="opt" href="/mini-ds/">Mini-DS</a>
    <a href="/contact/">Contact</a>
    <a class="srch" href="/recherche/" aria-label="Rechercher" title="Rechercher (touche /)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></a>
  </nav>
</div></header>

<div class="wrap">
<header class="chero">
  <div class="eyebrow"><a href="/matieres/{MSLUG}/">← {MNOM}</a> · Chapitre {n} sur {N}</div>
  <h1>{titre}</h1>
  <p class="lead">{lead}</p>
  <div class="chips"><span class="chip"><b>{nsec}</b> sections</span><span class="chip">{duree}</span><span class="chip">{diapos}</span><span class="chip">Cours de {MPROF}</span>{prereq}</div>
  <div class="ctools"><a class="btn" href="/mini-ds/?m={MID}&amp;ch={id}">Mini-DS du chapitre ▸</a><a class="btn ghost" href="/flashcards/?m={MID}&amp;ch={id}">Flashcards</a></div>
  <div class="cprog" id="cprog"><span class="bar"><i></i></span><span class="pv">0 section comprise</span></div>
</header>
</div>

<nav class="ctoc" aria-label="Sommaire du chapitre"><div class="in">
{toc}
  <a href="#exos">Exercices</a>
  <a href="#train">S'entraîner</a>
</div></nav>

<div class="wrap">
<div data-notations="{MID}"></div>
'''
TAIL = '''
<section class="csec" id="train">
  <div class="shead"><h2>S'entraîner sur ce chapitre</h2></div>
  <div class="train">
    <a href="/mini-ds/?m={MID}&amp;ch={id}"><b>Mini-DS du chapitre ▸</b><span>Valeurs tirées au hasard, corrigé détaillé, note sur 20</span></a>
    <a href="/flashcards/?m={MID}&amp;ch={id}"><b>Flashcards ▸</b><span>Les formules du chapitre à retourner</span></a>
    <a href="/mini-ds/?m={MID}&amp;ds={MDS}"><b>DS blanc {MNOM} ▸</b><span>Tous les chapitres, format DS{DSQ}</span></a>
  </div>
  <nav class="chnav" aria-label="Chapitres">{prev}{next}</nav>
</section>

{CREDIT}<footer class="site">Une erreur dans ce cours ? <a href="/contact/?type=erreur&amp;matiere={MNOM}%20%C2%B7%20chapitre%20{n}">Signale-la ici</a>.</footer>
</div>
<script src="/assets/notations.js"></script>
<script src="/assets/cours.js"></script>
<script src="/assets/stats.js" defer></script>
<script src="/assets/pwa.js" defer></script>
</body>
</html>
'''
def main():
    N = len(CH)
    for i, c in enumerate(CH):
        SRC = ROOT / 'outils' / 'sources-cours' / CFG['dir']
        body = (SRC / (c['id'] + '.html')).read_text()
        # blocs de code : <pre class="code"> … </pre> écrit en clair dans la source, échappé ici
        import html as _h, re as _re
        body = _re.sub(r'(<pre class="code"[^>]*>)(.*?)(</pre>)', lambda m: m.group(1) + _h.escape(m.group(2).strip('\n'), quote=False) + m.group(3), body, flags=_re.S)
        secs = re.findall(r'<section class="csec" id="(s\d+)" data-toc="([^"]+)">\s*<div class="shead"><span class="num">\d+</span><h2>(.*?)</h2>', body)
        toc = '\n'.join(f'  <a href="#{sid}"><span class="n">{sid[1:]}</span>{court}</a>' for sid, court, t in secs)
        desc = re.sub(r'\s+', ' ', ', '.join(re.sub('<[^>]+>', '', t) for _, _, t in secs)).lower()
        prereq = '' if i == 0 else f'<span class="chip">Prérequis : <a href="/cours/{CFG['dir']}/{CH[i-1]["id"]}/">chapitre {i}</a></span>'
        prev = '' if i == 0 else f'<a href="/cours/{CFG['dir']}/{CH[i-1]["id"]}/"><small>◂ Chapitre {i}</small>{CH[i-1]["court"]}</a>'
        nxt = '' if i == N - 1 else f'<a class="next" href="/cours/{CFG['dir']}/{CH[i+1]["id"]}/"><small>Chapitre {i+2} ▸</small>{CH[i+1]["court"]}</a>'
        M = dict(MNOM=CFG['nom'], MDIR=CFG['dir'], MID=CFG['mid'], MSLUG=CFG['slug'], MPROF=CFG['prof'], MDS=CFG['ds'], NOTA=CFG.get('nota','thermo'), DSQ=CFG.get('dsq',' · DS du 14 au 18 déc.'), CREDIT=('<p class="credit">'+CFG['credit']+'</p>\n' if CFG.get('credit') else ''))
        html = HEAD.format(**M, n=i + 1, N=N, nsec=len(secs), toc=toc, prereq=prereq, desc=desc[:150] + '. Cours, exemples corrigés et exercices.', **c) + body + TAIL.format(**M, n=i + 1, prev=prev, next=nxt, **c)
        out = ROOT / 'cours' / CFG['dir'] / c['id'] / 'index.html'
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html)
        print(out, len(secs), 'sections')
SHORT = {}
def short(t):
    t = re.sub('<[^>]+>', '', t)
    return SHORT.get(t, t if len(t) <= 26 else t[:24].rsplit(' ', 1)[0] + '…')
if __name__ == '__main__':
    main()
