import type { Experience } from "./types";

export const experiences: Experience[] = [
  {
    role: "Développeur Full-Stack (Data & Sécurité)",
    company: "Tabbaqi.com",
    startDate: "Juin 2026",
    endDate: "Septembre 2026",
    description:
      "Conception et déploiement d'une architecture monolithique robuste, avec un pipeline CI/CD automatisé et un système d'authentification avancé.",
    achievements: [
      "Architecture monolithique robuste : PostgreSQL, déploiement production (Railway backend, Vercel frontend)",
      "Pipeline CI/CD automatisé : containerisation, gestion infrastructure multi-plateforme, monitoring",
      "Système d'authentification avancé : JWT, rôles granulaires, audit complet des accès, conformité RGPD",
    ],
    technologies: ["PostgreSQL", "Railway", "Vercel", "JWT", "CI/CD"],
  },
  {
    role: "Stage",
    company: "CGI",
    startDate: "Mars 2026",
    endDate: "Août 2026",
    description: "Stage chez CGI. Contenu confidentiel, à détailler en entretien.",
    achievements: [],
    technologies: [],
    note: "Contenu confidentiel : détails à discuter en entretien",
  },
  {
    role: "Stagiaire en Machine Learning",
    company: "ALTEN",
    startDate: "Janvier 2026",
    endDate: "Mars 2026",
    description:
      "Participation à un projet de traitement intelligent de données non structurées via des modèles d'OCR.",
    achievements: [
      "Extraction et structuration automatique d'informations non structurées via des modèles d'OCR",
      "Analyse et fiabilisation des résultats",
    ],
    technologies: ["OCR", "Machine Learning"],
  },
  {
    role: "Stagiaire en développement",
    company: "BRIV SOLUTIONS",
    startDate: "Juin 2025",
    endDate: "Août 2025",
    description:
      "Création d'une application B2B pour la gestion des stocks, des salaires, et de plus de 9000 médicaments et fournisseurs marocains.",
    achievements: [
      "Application B2B de gestion des stocks, salaires, et plus de 9000 médicaments et fournisseurs marocains",
    ],
    technologies: [],
  },
  {
    role: "Stagiaire en développement",
    company: "MINISTÈRE DE LA SANTÉ",
    startDate: "Juillet 2024",
    endDate: "Août 2024",
    description: "Développement d'une application de gestion des rendez-vous médicaux en ligne.",
    achievements: ["Développement d'une application de gestion des rendez-vous médicaux en ligne"],
    technologies: [],
  },
];
