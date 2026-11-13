# Site d'Yves Peyrot, photographe

Banque d'images d'Yves Peyrot (environ 2 600 photos, classées par pays), plus deux pages d'œuvres : Gomme bichromatée et Tirages alternatifs. Le site a remplacé le site Wix https://ysoweb.wixstudio.com/photographie le 2026-11-13, avec le même contenu et le même style (fond noir, accents dorés).

- **Qui travaille dessus** : Yves, avec Claude. Il n'est pas développeur, mais il connaît bien son site, qu'il a monté lui-même sur Wix Studio. **Toujours répondre en français et en mots simples**, sans jargon : dire ce qui va changer sur le site, pas comment c'est codé.
- **Mise en ligne** : GitHub Pages, gratuit. Chaque `git push` sur `main` lance `.github/workflows/deploy.yml` (vérification, construction, publication, environ 3 à 4 minutes).
- **Adresse** : https://tttpeyrot.github.io/yvespeyrot/ (dépôt `tttpeyrot/yvespeyrot`, compte de Tom, fils d'Yves), en attendant le transfert vers un compte d'Yves (voir « Prochaines étapes »).
- **Technique** : Astro (site statique), JavaScript et CSS simples. Node 22 (`.nvmrc`). Polices libres hébergées avec le site : Barlow, dans l'esprit DIN de l'ancien site, pour le nom, les titres et les identifiants ; Inter pour le texte. Aucun cookie, aucune mesure d'audience.

## Où est quoi

- `src/data/catalogue.json` : **la banque d'images**, une fiche par photo, triée par identifiant :
  `{ "id": "FRA0001", "pays": "FRA", "alt": "titre court", "description": "1 à 3 phrases", "motsCles": ["…"], "l": 1050, "h": 700 }`.
  `alt` sert de titre (fenêtre photo, titre de la page, Google) ; `description` est le texte complet.
- `public/photos/hd/<id>.webp` (1 050 px de côté) et `public/photos/mini/<id>.webp` (vignette, 480 px).
- `src/data/pays.json` : les pays, avec leur code de 3 lettres (préfixe des identifiants), et l'ordre des boutons de la banque d'images.
- `src/data/oeuvres.json` : rubriques `accueil` (panoramas du diaporama de l'accueil, `public/accueil/`), `gomme` et `alternatif` (`public/oeuvres/` et `public/oeuvres/mini/`). Une œuvre : `{ image, titre, description, alt, l, h }`, dans l'ordre d'affichage.
- `src/textes/gomme.md` (le procédé) et `src/textes/alternatif.md` (l'introduction) : textes des pages, en Markdown.
- `src/site.js` : nom, e-mail, description du site, mention « Webmaster ©Ysoweb ».
- `src/pages/` : une page par fichier. `src/layouts/Base.astro` : en-tête, menu et pied, communs à tout le site. `src/styles/global.css` : couleurs et polices (variables en tête).
- `outils/` : `ajouter.mjs` (`npm run photos`), `verifier.mjs` (`npm run verifier`), `importer-wix.mjs` (import depuis Wix, fait une fois, ne plus lancer).
- `docs/wix/` : captures et textes de l'ancien site Wix, pour mémoire (non versionné, absent de GitHub).

## Ce qu'Yves demande, et comment le faire

### « Ajoute les photos du dossier a-ajouter »

1. **Le pays.** S'il n'est pas dit, le demander, car il donne l'identifiant (ISL0443…). Un seul pays par passage. Un pays nouveau s'ajoute d'abord à `src/data/pays.json` (code de 3 lettres, nom, libellé du bouton, slug). Proposer le code à Yves, dans la logique des existants : ISL, FRA, CHI, GBR, ESP, ITA, HAW.
2. `npm run photos -- <pays>`. Le script :
   - numérote ;
   - fait l'image HD et la vignette ;
   - ajoute les fiches vides ;
   - range les originaux dans `a-ajouter/deja-ajoutees/` ;
   - met des aperçus JPEG dans `a-ajouter/apercus/`.
3. **Regarder chaque aperçu** (outil Read sur `a-ajouter/apercus/<id>.jpg`), puis remplir sa fiche dans `catalogue.json`, dans le style des fiches existantes (en lire quelques-unes du même pays avant) :
   - `alt` : titre court, environ 40 à 90 caractères, avec le lieu (« Laguna verde de l'Altiplano au Chili ») ;
   - `description` : 1 à 3 phrases, ce qu'on voit et où ;
   - `motsCles` : 15 à 25 mots en minuscules. Y mettre :
     - les lieux, la région et le pays ;
     - le code du pays en minuscules (« isl ») ;
     - « horizontal » ou « vertical », d'après `l` et `h` ;
     - les couleurs dominantes ;
     - les sujets (« cascade », « mousse », « brume »…) ;
     - « n&b » si la photo est en noir et blanc.
   - **Ne jamais inventer un lieu précis.** Si l'image ne permet pas de le savoir, demander à Yves (« Où a été prise FRA1524 ? »), ou ne mettre que ce qui est sûr.
4. **Montrer à Yves** un tableau (identifiant, fichier d'origine, titre proposé), et corriger selon ses remarques.
5. `npm run verifier`, supprimer les aperçus (`rm a-ajouter/apercus/*`), puis mettre en ligne (voir plus bas). Le compteur de l'accueil se met à jour tout seul.

### Œuvres et accueil

- **Œuvres** : `npm run photos -- gomme` (ou `alternatif`). Les images sont ajoutées à la fin de la rubrique, titre = nom du fichier. Corriger `titre`, remplir `description` (technique, papier, format, comme les autres : « Gomme bichromatée sur papier Montval 25X18 cm. ») et `alt`. Pour changer l'ordre, déplacer les fiches dans `oeuvres.json`.
- **Papillon de l'accueil** : le machaon de l'ancien site Wix (`animPapillon5.gif`, converti en WebP animé de 300 px : `public/accueil/papillon.webp`). À chaque ouverture de l'accueil, il entre en grand par la gauche, traverse la page en rapetissant, fait une boucle et se pose sur « ICI », penché à 25° (12,6 s sur ordinateur).
  - Les trajectoires sont celles du code Velo qu'Yves avait écrit sur Wix, recopiées dans `src/scripts/papillon.js` (ordinateur au-delà de 1 200 px, tablette, téléphone). Chaque point est un décalage en pixels par rapport à sa place sur ICI.
  - Sa place posée et sa taille (3,67 % de la largeur de l'écran, comme sur Wix) sont dans `src/pages/index.astro` (`.ici-zone`, `.papillon`).
  - Si le visiteur a désactivé les animations, il est posé d'emblée et immobile (`papillon-fixe.webp`).
- **Accueil** : `npm run photos -- accueil` ajoute un panorama au diaporama (format large, environ 2,9:1, comme les dix d'origine en 2 862 × 1 000). Pour en retirer un ou changer l'ordre : `oeuvres.json`, rubrique `accueil`. Le premier sert aussi d'image d'aperçu quand on partage le site.

### Corriger, retirer

- **Corriger une fiche** : la modifier dans `catalogue.json` ou `oeuvres.json`, puis mettre en ligne.
- **Retirer une photo de la banque** : retirer sa fiche de `catalogue.json` et `git rm` ses deux images (`hd` et `mini`). Les numéros ne sont pas réutilisés : l'ajout suivant prend le plus grand numéro + 1, et un trou dans la suite n'est pas grave.
- **Changer un texte** : `src/textes/*.md`, `src/site.js`, ou la page dans `src/pages/`.

### « Montre-moi le site » / « Mets en ligne »

- **Voir avant de publier** : `npm run dev`, puis ouvrir http://localhost:4321/. La page se met à jour à chaque modification.
- **Mettre en ligne** :
  1. `npm run verifier` ;
  2. `git add -A && git commit -m "<ce qui change, en français>" && git push` ;
  3. `gh run watch` pour suivre ;
  4. donner à Yves l'adresse de la page modifiée.

  Ne publier qu'avec l'accord d'Yves.
- Si le workflow échoue, lire l'erreur (`gh run view --log-failed`), corriger, et repousser. Le site en ligne reste l'ancienne version tant que ça échoue.

## Règles

- Les liens internes passent toujours par `lien()` (`src/lien.js`), jamais par un chemin qui commence par `/`. Sinon, ils cassent tant que le site est dans un sous-dossier (`/yvespeyrot/`).
- Ne jamais réencoder les images HD existantes (perte de qualité à chaque passage). Celles de la banque viennent de Wix telles quelles.
- Garder `catalogue.json` trié par identifiant, avec une clé par ligne (`JSON.stringify(…, null, 1)`) : l'historique Git reste lisible.
- « Ma sélection » est gardée dans le navigateur du visiteur (`localStorage`, clé `yp-selection`) et partagée par lien (`selection/?ids=FRA0001.ISL0042`). Il n'y a ni serveur ni base de données : c'est voulu, c'est ce qui rend l'hébergement gratuit.
- Les photos et l'e-mail sont publics (dépôt public, obligatoire pour GitHub Pages gratuit), comme ils l'étaient sur Wix.

## Si le site devient trop lourd

GitHub Pages accepte 1 Go au plus. Le site pesait 800 Mo à l'import (2 626 photos : 696 Mo d'images HD copiées de Wix sans réencodage, 50 Mo de vignettes), ce qui laisse de la place pour environ 500 à 700 photos de plus (une nouvelle photo fait environ 200 à 250 Ko). `npm run verifier` et le workflow bloquent au-delà de 950 Mo. La solution la plus simple est de passer sur **Cloudflare Pages** (gratuit, sans limite de poids total, 20 000 fichiers au plus) : en parler à Tom.

## Prochaines étapes

1. **Adresse yvespeyrot.github.io**
   - Yves crée un compte GitHub au nom de `yvespeyrot` (libre le 2026-11-13).
   - Tom transfère le dépôt : Settings → General → Transfer ownership.
   - Yves le renomme `yvespeyrot.github.io`.
   - Le site passe sur https://yvespeyrot.github.io/ sans rien changer au code : le workflow donne la nouvelle adresse à Astro.
2. **Nom de domaine**
   - L'acheter (OVH, environ 7 à 10 € par an pour un .fr).
   - Dans le dépôt : Settings → Pages → Custom domain.
   - Chez OVH, zone DNS :
     - 4 enregistrements A vers 185.199.108.153, 185.199.109.153, 185.199.110.153 et 185.199.111.153 ;
     - `www` en CNAME vers `yvespeyrot.github.io`.
   - Cocher « Enforce HTTPS » quand GitHub le propose.
3. **Quitter Wix** : une fois le nouveau site validé, mettre sur la page Wix un lien vers la nouvelle adresse, puis dépublier le site Wix. Plus rien ne dépend de Wix.

## Historique

- 2026-11-13 : import depuis Wix (`outils/importer-wix.mjs`). Le catalogue (2 626 fiches) a été lu par l'API publique de données du site ; les galeries de l'accueil (10), de Gomme (26) et d'Alternatif (47) par l'API Pro Gallery. Les images HD ont été copiées sans réencodage, et les vignettes refaites en 480 px.
  - Les textes des pages Gomme et Alternatif ont été repris avec de légères corrections d'orthographe et de typographie (« devra-t-être » → « devra être », « Deux jour » → « deux jours »…).
  - Les descriptions et les mots-clés des photos sont repris tels quels.
