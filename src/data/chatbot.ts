import type { ChatbotConfig } from "./types";
import { profile } from "./profile";

const ofName = /^[aeiouyhéèê]/i.test(profile.name) ? `d'${profile.name}` : `de ${profile.name}`;

// Les réponses sont générées automatiquement à partir des autres fichiers de src/data.
export const chatbot: ChatbotConfig = {
  name: `L'assistant ${ofName}`,
  welcome: `Bonjour ! Je réponds à vos questions sur ${profile.name} : parcours, projets, compétences, disponibilité ou mobilité. Choisissez une suggestion ou écrivez votre question.`,
  suggestions: [
    `Qui est ${profile.name} ?`,
    `Que recherche ${profile.name} ?`,
    "Quel est son parcours ?",
    "Ses projets IA / ML ?",
    "Quelle est sa mobilité ?",
    `Comment contacter ${profile.name} ?`,
  ],
};
