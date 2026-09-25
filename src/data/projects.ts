import type { Project } from "./types";

// Données statiques générées à partir de l'API GitHub (voir `npm run sync:github`).
// Modifie ce fichier directement pour ajuster une description, une catégorie ou l'ordre.
export const projects: Project[] = [
  {
    title: "Medi_MA",
    description:
      "SaaS de gestion pour pharmacies marocaines : suivi des stocks, des commandes et des fournisseurs pour plus de 9000 médicaments.",
    category: "dev",
    technologies: ["Spring Boot", "React", "SQL"],
    githubUrl: "https://github.com/laramo17/Medi_MA",
    featured: true,
  },
  {
    title: "Jobby",
    description:
      "Portail de gestion des offres d'emploi : candidatures, messagerie interne et authentification par rôles (employeur / candidat).",
    category: "dev",
    technologies: ["Java", "Spring Boot", "Spring Security"],
    githubUrl: "https://github.com/laramo17/Jobby",
    featured: true,
  },
  {
    title: "Piver Events",
    description:
      "Plateforme de suivi des événements d'une commande (création, paiement, livraison) pour un contexte de livraison de repas, exposée via une API REST.",
    category: "dev",
    technologies: ["FastAPI", "PostgreSQL", "React", "Docker"],
    githubUrl: "https://github.com/laramo17/piver",
    featured: true,
  },
  {
    title: "Stock-Management",
    description: "Application web de gestion de stock développée avec Django.",
    category: "dev",
    technologies: ["Django", "Python"],
    githubUrl: "https://github.com/laramo17/Stock-Management",
    featured: false,
  },
  {
    title: "Weather App",
    description: "Application météo consommant l'API OpenWeatherMap en temps réel.",
    category: "dev",
    technologies: ["Angular", "TypeScript"],
    githubUrl: "https://github.com/laramo17/Weather-app-",
    featured: false,
  },
  {
    title: "TicTacTrip API Test",
    description:
      "API REST de justification de texte (80 caractères par ligne) avec authentification par token, déployée publiquement.",
    category: "dev",
    technologies: ["Node.js", "TypeScript"],
    githubUrl: "https://github.com/laramo17/ticctac-Apitest",
    featured: false,
  },
  {
    title: "SIEM Analytics",
    description:
      "Analyseur de logs pour détecter des comportements suspects (échecs d'authentification, anomalies) via une API et un tableau de bord.",
    category: "data",
    technologies: ["Node.js", "Express", "Sequelize"],
    githubUrl: "https://github.com/laramo17/Siem-analytics",
    featured: true,
  },
  {
    title: "Automation Project — Industrie Automobile",
    description:
      "Pipeline de supervision d'une ligne de production automobile : détection d'anomalies (seuils et statistiques) en temps réel, alerting et dashboard web.",
    category: "data",
    technologies: ["Python", "Dashboard temps réel"],
    githubUrl: "https://github.com/laramo17/Automation-project-in-the-automotive-industry",
    featured: true,
  },
  {
    title: "Détection de maladies pulmonaires",
    description:
      "Classification d'images médicales (radiographies thoraciques) pour la détection assistée de pathologies pulmonaires.",
    category: "ai-ml",
    technologies: ["Python", "Deep Learning", "Jupyter"],
    githubUrl: "https://github.com/laramo17/lung_disease_project",
    featured: true,
  },
  {
    title: "Prédiction de maladie cardiaque",
    description: "Modèle prédictif du risque de maladie cardiaque à partir de données cliniques.",
    category: "ai-ml",
    technologies: ["Python", "scikit-learn", "Jupyter"],
    githubUrl: "https://github.com/laramo17/Prediction_maladie_cardiaque",
    featured: false,
  },
];
