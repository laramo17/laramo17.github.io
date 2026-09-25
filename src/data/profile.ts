import type { Profile } from "./types";

// TODO: certains champs sont incomplets car absents de l'extrait de CV fourni.
// Complète-les puis relance `npm run build`.
export const profile: Profile = {
  name: "Omar El Ouardi",
  title: "Développeur Full-Stack — Data & Sécurité",
  tagline:
    "TODO: écris une accroche en 1-2 phrases (ex. ton positionnement, ce que tu recherches).",
  location: "TODO: ville, pays",
  email: "elomar954@gmail.com",
  linkedin: "https://www.linkedin.com/in/omar-zr", // TODO: vérifier l'URL LinkedIn exacte
  github: "https://github.com/laramo17",
  cvUrl: "/cv.pdf", // TODO: ajouter le fichier public/cv.pdf (le CV réel, en PDF)
};
