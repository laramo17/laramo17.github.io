# Portfolio — Omar El Ouardi

Site portfolio personnel, statique, construit avec [Astro](https://astro.build) + TypeScript +
Tailwind CSS, déployé automatiquement sur GitHub Pages.

🔗 https://laramo17.github.io

## Stack

- **Astro** (site statique) + TypeScript strict
- **Tailwind CSS v4**
- Filtres de projets en JavaScript natif (pas de framework lourd)
- Déploiement automatique via GitHub Actions → GitHub Pages

## Lancer le projet en local

```sh
npm install
npm run dev       # http://localhost:4321
```

| Commande               | Action                                          |
| ----------------------- | ------------------------------------------------ |
| `npm run dev`           | Serveur de développement                         |
| `npm run build`         | Build de production dans `./dist/`               |
| `npm run preview`       | Prévisualise le build de production               |
| `npm run sync:github`   | Rafraîchit la liste des dépôts publics GitHub     |
| `npm run format`        | Formate le code avec Prettier                     |
| `npm run format:check`  | Vérifie le formatage sans modifier les fichiers   |

## Structure des données

Tout le contenu du site est séparé du code dans `src/data/`, pour pouvoir le mettre à jour sans
toucher aux composants :

- `profile.ts` — nom, titre, accroche, contact, lien du CV
- `experience.ts` — expériences professionnelles (timeline)
- `education.ts` — diplômes et certifications
- `projects.ts` — projets GitHub (titre, catégorie, technologies, liens)
- `skills.ts` — compétences groupées par catégorie
- `types.ts` — types TypeScript partagés

### Ajouter / modifier un projet

Édite `src/data/projects.ts` et ajoute un objet respectant l'interface `Project` (voir
`src/data/types.ts`) :

```ts
{
  title: "Mon projet",
  description: "Description courte orientée impact.",
  category: "dev", // "dev" | "data" | "ai-ml"
  technologies: ["React", "Node.js"],
  githubUrl: "https://github.com/laramo17/mon-projet",
  demoUrl: "https://mon-projet.vercel.app", // optionnel
  featured: false,
}
```

### Ajouter / modifier une expérience

Édite `src/data/experience.ts` (le tableau est affiché dans l'ordre où il est écrit — la plus
récente doit rester en premier).

### Synchroniser avec GitHub

```sh
npm run sync:github
```

Ce script interroge l'API GitHub publique et affiche un tableau des dépôts non-forkés avec leur
langage, taille et description. Il **n'écrit pas** directement dans `projects.ts` : les
catégories et descriptions y sont rédigées à la main pour rester orientées recruteur. Utilise sa
sortie comme base pour mettre à jour `src/data/projects.ts` toi-même.

## Déploiement

Le déploiement est automatique via `.github/workflows/deploy.yml` à chaque push sur `main`.

Pour l'activer sur GitHub :

1. Pousse ce dépôt sur `https://github.com/laramo17/laramo17.github.io` (branche `main`).
2. Dans **Settings → Pages**, choisis la source **GitHub Actions**.
3. Le site sera disponible sur `https://laramo17.github.io` après le premier run du workflow.

## TODO avant mise en ligne

Ces éléments n'étaient pas présents dans l'extrait de CV fourni ou nécessitent une action de ta
part :

- [ ] `src/data/profile.ts` : accroche (`tagline`), localisation, vérifier l'URL LinkedIn exacte
- [ ] `src/data/education.ts` : diplômes et certifications (section absente de l'extrait de CV)
- [ ] `src/components/About.astro` : paragraphe de présentation personnelle
- [ ] `public/cv.pdf` : ajouter le fichier CV réel en PDF (le bouton de téléchargement pointe déjà
      vers `/cv.pdf`)
- [ ] Vérifier/compléter les catégories et descriptions de projets dans `src/data/projects.ts`
