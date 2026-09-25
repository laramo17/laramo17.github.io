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
    technologies: ["PostgreSQL", "Railway", "Vercel", "JWT", "Docker", "CI/CD"],
  },
  {
    role: "Stagiaire en Développement et Testing",
    company: "CGI",
    startDate: "Mars 2026",
    endDate: "Août 2026",
    description:
      "Migration d'une application France Messagerie de COBOL vers .NET selon une architecture DDD, en méthode Agile.",
    achievements: [
      "Migration d'une application France Messagerie (COBOL → .NET), architecture DDD",
      "Documentation et réunions de suivi avec le client final",
      "Conception et exécution de tests fonctionnels",
    ],
    technologies: ["COBOL", ".NET", "DDD", "Agile"],
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
    technologies: ["OCR", "Machine Learning", "Python"],
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
  {
    role: "Stagiaire en développement",
    company: "BRIEF & NOUS",
    startDate: "Novembre 2022",
    endDate: "Mai 2023",
    description:
      "Constitution de base de données et traitement des commandes pour des e-commerçants.",
    achievements: ["Constitution de Data-base et traitement des commandes pour les e-commerçants"],
    technologies: [],
  },
];
