# Yves Peyrot · Photographie

C'est le site de ta banque d'images, sorti de Wix. On y retrouve les mêmes photos, les mêmes pages et le même style, et il est hébergé gratuitement par GitHub.

**Adresse du site : https://yvespeyrot.github.io/yvespeyrot-site/**

Pour le faire vivre, tu n'as pas besoin de coder : tu parles à Claude, qui fait les modifications, te les montre, puis les met en ligne.

## Installer (une seule fois, environ 15 minutes)

1. Prendre un abonnement Claude (Pro suffit) sur https://claude.ai.
2. Ouvrir l'application **Terminal** (Applications → Utilitaires), puis coller cette ligne et appuyer sur Entrée :
   ```
   curl -fsSL https://claude.ai/install.sh | bash
   ```
3. Toujours dans le Terminal, taper `claude`, appuyer sur Entrée, et se connecter avec son compte Claude.
4. Dire à Claude :
   > Installe ce qu'il faut pour travailler sur mon site (git, Node 22, l'outil GitHub `gh`), connecte-moi à GitHub avec mon compte yvespeyrot, puis télécharge mon dépôt github.com/yvespeyrot/yvespeyrot-site dans mon dossier Documents.

   Claude demandera la permission avant chaque étape. Le site est sur ton compte GitHub (yvespeyrot).

Ensuite, à chaque fois : ouvrir le Terminal, taper `cd ~/Documents/yvespeyrot-site && claude`, puis parler.

## Ce que tu peux lui dire

- « Ajoute les photos du dossier a-ajouter, ce sont des photos d'Islande. »
  Tu poses d'abord tes photos (JPEG, TIFF, HEIC…) dans le dossier `a-ajouter`. Claude les numérote (ISL0443…), les prépare pour le site, les regarde pour écrire titre, description et mots-clés, et te montre le tout avant de publier.
- « Corrige la description de FRA0123 : c'est le lac de Pareloup, pas le lac de Villefranche. »
- « Retire CHI0045 de la banque d'images. »
- « Ajoute cette gomme bichromatée : papier Montval 25 × 18 cm, titre Le Moulin. »
- « Change les panoramas de l'accueil : mets ISL0012 en premier. »
- « Montre-moi le site avant de publier. »
- « Mets en ligne. » Le site est à jour 3 à 4 minutes plus tard.

## Prochaines étapes

- Acheter un nom de domaine (environ 10 € par an), par exemple yvespeyrot.fr. Claude saura le brancher.
- Une fois le nouveau site validé : dépublier le site Wix.

Les détails techniques, pour Claude, sont dans `CLAUDE.md`.
