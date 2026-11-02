import type { ChatbotKnowledge, Experience, Project, ProjectCategory } from "../data/types";

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => void };
  }
}

type Intent =
  | "contact"
  | "availability"
  | "mobility"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "about"
  | "greet"
  | "thanks";

interface Tech {
  name: string;
  tokens: string[];
  compact: string;
}

interface Answer {
  intent: string;
  html: string;
}

// Mots-clés normalisés (minuscules, sans accents), séparés par des espaces. Un mot-clé de 3 lettres
// ou moins doit correspondre exactement ; au-delà, il sert de préfixe. L'ordre départage les égalités.
const INTENT_WORDS: [Intent, string][] = [
  [
    "contact",
    "contact joindre email mail courriel linkedin ecrire appel telephone numero rdv rendez entretien",
  ],
  [
    "availability",
    "alternan dispo quand rythme demarr commenc rentree recherch cherch contrat recrut 2026 2027",
  ],
  [
    "mobility",
    "mobil demenag ville region lieu localis situe france europe etranger international remote teletravail " +
      "deplac habite partout pays paris lyon marseille toulouse lille bordeaux nantes nice strasbourg rennes " +
      "montpellier grenoble allemagne belgique suisse espagne luxembourg",
  ],
  [
    "education",
    "formation diplom ecole etud universit master licence bachelor ingenieur cursus certif",
  ],
  ["experience", "experien parcours stage stagiaire entreprise boite job emploi carriere mission"],
  ["projects", "projet project realis portfolio github repo depot travaux construit demo"],
  ["skills", "competen skill techno stack langage outil maitris connai savoir sais sait expertise"],
  ["about", "qui present profil propos resume parle decri"],
  ["greet", "bonjour salut hello coucou hey bonsoir"],
  ["thanks", "merci thank thx"],
];

const CATEGORY_WORDS: [ProjectCategory, string][] = [
  ["ai-ml", "ia ml machine learning intelligence artificiel deep llm modele neuron"],
  ["data", "data donnee analys analyt dashboard pipeline bi"],
  ["dev", "dev develop web full backend frontend appli logiciel"],
];

const words = (list: string) => list.split(" ");
const INTENTS = INTENT_WORDS.map(([intent, list]) => [intent, words(list)] as const);
const CATEGORIES = CATEGORY_WORDS.map(([cat, list]) => [cat, words(list)] as const);

const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  dev: "Dev",
  data: "Data",
  "ai-ml": "IA / ML",
};
const SKILL_GROUP: Record<ProjectCategory, string> = {
  dev: "Dev",
  data: "Data",
  "ai-ml": "AI & ML",
};

const TITLE_STOPWORDS = new Set(words("projet project application test detection prediction"));
const DESC_STOPWORDS = new Set(words("application projet plateforme partir chaque"));
const COMPANY_STOPWORDS = new Set(words("com des les solutions"));

const BOT_BUBBLE =
  "min-w-0 max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm leading-relaxed text-[var(--color-text)] shadow-sm ring-1 ring-[var(--color-border)] [&_a]:font-semibold [&_a]:text-[var(--color-primary)] [&_a]:underline [&_a]:underline-offset-2 [&_li]:mt-1 [&_p+p]:mt-2 [&_p+ul]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ul+p]:mt-2";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9+#.]+/)
    .map((t) => t.replace(/\.+$/, ""))
    .filter(Boolean);
}

function compact(text: string): string {
  return normalize(text).replace(/[^a-z0-9+#]/g, "");
}

function matchesStem(token: string, stem: string): boolean {
  return stem.length <= 3 ? token === stem : token.startsWith(stem);
}

function containsSeq(haystack: string[], needle: string[]): boolean {
  if (!needle.length || needle.length > haystack.length) return false;
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    if (needle.every((n, j) => haystack[i + j] === n)) return true;
  }
  return false;
}

function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]!;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j]!;
      row[j] = Math.min(current + 1, row[j - 1]! + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = current;
    }
  }
  return row[b.length]!;
}

// Tolère les fautes de frappe sur les noms propres (ex. « tabaqqi » pour « tabbaqi »).
function looseEq(a: string, b: string, maxDist: number, minLen: number): boolean {
  if (a === b) return true;
  const min = Math.min(a.length, b.length);
  if (min >= 5 && (a.startsWith(b) || b.startsWith(a))) return true;
  return min >= minLen && distance(a, b) <= maxDist;
}

function esc(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function link(href: string, label: string, external = false): string {
  const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
  return `<a href="${esc(href)}"${attrs}>${esc(label)}</a>`;
}

function short(text: string, max = 110): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function list(items: string[]): string {
  return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
}

export function createResponder(kb: ChatbotKnowledge): (question: string) => Answer {
  const { profile, experiences, projects, skills, education } = kb;
  const name = esc(profile.name);
  const ofName = /^[aeiouyhéèê]/i.test(profile.name) ? `d'${name}` : `de ${name}`;
  const emailLink = link(`mailto:${profile.email}`, profile.email);
  const contactLine = `<p>Pour aller plus loin : ${emailLink} ou ${link(profile.linkedin, "LinkedIn", true)}.</p>`;

  const techs = buildTechIndex();

  function buildTechIndex(): Tech[] {
    const byCompact = new Map<string, Tech>();
    const add = (raw: string) => {
      const label = raw.trim();
      const tokens = tokenize(label);
      const key = compact(label);
      if (!tokens.length || tokens.length > 3 || key.length < 2 || byCompact.has(key)) return;
      byCompact.set(key, { name: label, tokens, compact: key });
    };
    for (const p of projects) p.technologies.forEach(add);
    for (const e of experiences) e.technologies.forEach(add);
    for (const group of skills) {
      for (const skill of group.skills) {
        skill.split(/[(),]/).forEach(add);
        (skill.match(/\b[A-Z]{3,}\b/g) ?? []).forEach(add);
      }
    }
    return [...byCompact.values()];
  }

  function detectCategories(tokens: string[]): ProjectCategory[] {
    return CATEGORIES.filter(([, stems]) =>
      tokens.some((t) => stems.some((s) => matchesStem(t, s))),
    ).map(([cat]) => cat);
  }

  function isCategoryTech(tech: Tech): boolean {
    return tech.tokens.every((t) =>
      CATEGORIES.some(([, stems]) => stems.some((s) => matchesStem(t, s))),
    );
  }

  function scoreIntents(tokens: string[]): Map<Intent, number> {
    const scores = new Map<Intent, number>();
    for (const [intent, stems] of INTENTS) {
      const score = tokens.filter((t) => stems.some((s) => matchesStem(t, s))).length;
      if (score) scores.set(intent, score);
    }
    if (tokens[0] === "ou") scores.set("mobility", (scores.get("mobility") ?? 0) + 1);
    return scores;
  }

  function bestIntent(scores: Map<Intent, number>, exclude: Intent[]): Intent | undefined {
    let best: Intent | undefined;
    let bestScore = 0;
    for (const [intent] of INTENTS) {
      const score = scores.get(intent) ?? 0;
      if (!exclude.includes(intent) && score > bestScore) {
        best = intent;
        bestScore = score;
      }
    }
    return best;
  }

  function findCompanies(tokens: string[]): Experience[] {
    const words = tokens.flatMap((t) => t.split("."));
    return experiences.filter((e) =>
      tokenize(e.company)
        .flatMap((t) => t.split("."))
        .filter((w) => w.length >= 3 && !COMPANY_STOPWORDS.has(w))
        .some((cw) => words.some((w) => looseEq(w, cw, 2, 6))),
    );
  }

  function findProjects(tokens: string[]): Project[] {
    let best: Project[] = [];
    let bestScore = 0;
    for (const p of projects) {
      const titleWords = tokenize(p.title).filter((w) => w.length >= 4 && !TITLE_STOPWORDS.has(w));
      const descWords = tokenize(p.description).filter(
        (w) => w.length >= 6 && !DESC_STOPWORDS.has(w),
      );
      const titleKey = compact(p.title);
      let score = 0;
      for (const t of tokens) {
        if (titleWords.some((w) => looseEq(t, w, 1, 7))) score += 1;
        else if (descWords.some((w) => looseEq(t, w, 1, 7))) score += 0.5;
        if (t.length >= 5 && !TITLE_STOPWORDS.has(t) && titleKey.startsWith(compact(t))) score += 2;
      }
      if (score > bestScore) {
        best = [p];
        bestScore = score;
      } else if (score === bestScore && score > 0) {
        best.push(p);
      }
    }
    return bestScore >= 1 ? best.slice(0, 3) : [];
  }

  function findTechs(tokens: string[]): Tech[] {
    const compacts = new Set(tokens.map(compact));
    for (let i = 0; i < tokens.length - 1; i++) compacts.add(compact(tokens[i]! + tokens[i + 1]!));
    const matched = techs.filter((t) => containsSeq(tokens, t.tokens) || compacts.has(t.compact));
    return matched
      .filter(
        (t) =>
          !matched.some(
            (o) => o !== t && o.tokens.length > t.tokens.length && containsSeq(o.tokens, t.tokens),
          ),
      )
      .slice(0, 3);
  }

  function mentions(texts: string[], tech: Tech): boolean {
    return texts.some(
      (text) => containsSeq(tokenize(text), tech.tokens) || compact(text) === tech.compact,
    );
  }

  function aboutAnswer(): string {
    return `<p><strong>${name}</strong> est ${esc(profile.title)}.</p><p>${esc(profile.tagline)}</p>`;
  }

  function availabilityAnswer(): string {
    return `<p>${name} recherche : <strong>${esc(profile.availability)}</strong>.</p><p>Mobilité : ${esc(profile.mobility)}.</p>${contactLine}`;
  }

  function mobilityAnswer(): string {
    return `<p><strong>${esc(profile.mobility)}</strong>.</p><p>${name} peut rejoindre une équipe partout en France et reste ouvert aux opportunités ailleurs en Europe.</p>${contactLine}`;
  }

  function contactAnswer(): string {
    return `<p>Le plus simple : un email à ${emailLink} ou un message sur ${link(profile.linkedin, "LinkedIn", true)}.</p><p>Son code est aussi sur ${link(profile.github, "GitHub", true)}.</p>`;
  }

  function educationAnswer(): string {
    if (!education.length) {
      return `<p>Les informations sur la formation ${ofName} ne sont pas encore en ligne.</p><p>Vous pouvez les lui demander directement : ${emailLink}.</p>`;
    }
    return list(
      education.map(
        (e) =>
          `<strong>${esc(e.degree)}</strong> — ${esc(e.institution)} (${esc(e.startDate)} – ${esc(e.endDate)})`,
      ),
    );
  }

  function experienceListAnswer(): string {
    const items = experiences.map(
      (e) =>
        `<strong>${esc(e.role)}</strong> — ${esc(e.company)} (${esc(e.startDate)} – ${esc(e.endDate)})`,
    );
    return `<p>${name} compte ${experiences.length} expériences professionnelles, de la plus récente à la plus ancienne :</p>${list(items)}<p>Demandez-moi le détail d'une expérience, par exemple « Et chez CGI ? ».</p>`;
  }

  function experienceDetail(e: Experience): string {
    const techLine = e.technologies.length
      ? `<p>Technologies : ${esc(e.technologies.join(", "))}.</p>`
      : "";
    const noteLine = e.note ? `<p>${esc(e.note)}.</p>` : "";
    return `<p><strong>${esc(e.role)}</strong> chez <strong>${esc(e.company)}</strong> (${esc(e.startDate)} – ${esc(e.endDate)})</p>${e.achievements.length ? list(e.achievements.map(esc)) : ""}${techLine}${noteLine}`;
  }

  function projectLinks(items: Project[], max = 6): string {
    const shown = items
      .slice(0, max)
      .map((p) => `${link(p.githubUrl, p.title, true)} — ${esc(short(p.description))}`);
    const rest = items.length - max;
    const more =
      rest > 0 ? `<p>…et ${rest} autres dans la ${link("#projets", "section Projets")}.</p>` : "";
    return `${list(shown)}${more}`;
  }

  function projectsAnswer(cats: ProjectCategory[]): string {
    const items = cats.length ? projects.filter((p) => cats.includes(p.category)) : projects;
    const label = cats.map((c) => CATEGORY_LABEL[c]).join(" et ");
    const intro = cats.length
      ? `<p>Projets ${esc(label)} ${ofName} :</p>`
      : `<p>${name} a publié ${projects.length} projets sur GitHub. Les principaux :</p>`;
    return `${intro}${projectLinks(items)}`;
  }

  function projectDetail(p: Project): string {
    const demo = p.demoUrl ? `<p>${link(p.demoUrl, "Voir la démo", true)}</p>` : "";
    return `<p>${link(p.githubUrl, p.title, true)} (${CATEGORY_LABEL[p.category]})</p><p>${esc(p.description)}</p><p>Technologies : ${esc(p.technologies.join(", "))}.</p>${demo}`;
  }

  function skillsAnswer(): string {
    const items = skills.map(
      (g) => `<strong>${esc(g.category)}</strong> : ${esc(g.skills.join(", "))}`,
    );
    return `<p>${name} maîtrise notamment :</p>${list(items)}`;
  }

  function categoryAnswer(cats: ProjectCategory[]): string {
    return cats
      .map((cat) => {
        const group = skills.find((g) => g.category === SKILL_GROUP[cat]);
        const items = projects.filter((p) => p.category === cat);
        const skillLine = group ? `<p>Compétences : ${esc(group.skills.join(", "))}.</p>` : "";
        const projectPart = items.length ? `<p>Projets :</p>${projectLinks(items, 4)}` : "";
        return `<p>Côté <strong>${CATEGORY_LABEL[cat]}</strong> :</p>${skillLine}${projectPart}`;
      })
      .join("");
  }

  function techAnswer(tech: Tech): string {
    const groups = skills.filter((g) => mentions(g.skills, tech));
    const usedIn = projects.filter((p) =>
      mentions([...p.technologies, p.title, p.description], tech),
    );
    const companies = experiences.filter((e) =>
      mentions([...e.technologies, ...e.achievements], tech),
    );
    const label = `<strong>${esc(tech.name)}</strong>`;
    const parts = [
      groups.length
        ? `<p>Oui, ${label} fait partie des compétences ${ofName} (${esc(groups.map((g) => g.category).join(", "))}).</p>`
        : `<p>Oui, ${name} a déjà travaillé avec ${label}.</p>`,
    ];
    if (usedIn.length)
      parts.push(
        `<p>Projets : ${usedIn.map((p) => link(p.githubUrl, p.title, true)).join(", ")}.</p>`,
      );
    if (companies.length)
      parts.push(`<p>En entreprise : ${esc(companies.map((e) => e.company).join(", "))}.</p>`);
    return parts.join("");
  }

  function greetAnswer(): string {
    return `<p>Bonjour ! Que souhaitez-vous savoir sur ${name} ? Son parcours, ses projets, ses compétences ou sa disponibilité : choisissez une suggestion ou posez votre question.</p>`;
  }

  function fallbackAnswer(): string {
    return `<p>Je n'ai pas bien compris. Je suis un assistant simple qui répond à partir du contenu de ce site : essayez une des suggestions ci-dessous.</p><p>Pour toute autre question, écrivez à ${name} : ${emailLink}.</p>`;
  }

  return function respond(question: string): Answer {
    const tokens = tokenize(question);
    if (!tokens.length) return { intent: "fallback", html: fallbackAnswer() };

    const scores = scoreIntents(tokens);
    const cats = detectCategories(tokens);
    const companies = findCompanies(tokens);
    if (companies.length)
      return { intent: "experience-detail", html: companies.map(experienceDetail).join("") };

    const matchedProjects = findProjects(tokens);
    if (matchedProjects.length)
      return { intent: "project-detail", html: matchedProjects.map(projectDetail).join("") };

    if (scores.has("projects") && cats.length)
      return { intent: "projects", html: projectsAnswer(cats) };

    const topicIntent = bestIntent(scores, ["greet", "thanks"]);
    const specificTechs = findTechs(tokens).filter((t) => !isCategoryTech(t));
    const generalTopic =
      topicIntent && ["contact", "availability", "mobility", "education"].includes(topicIntent);
    if (specificTechs.length && !generalTopic)
      return { intent: "tech", html: specificTechs.map(techAnswer).join("") };

    switch (topicIntent) {
      case "contact":
        return { intent: "contact", html: contactAnswer() };
      case "availability":
        return { intent: "availability", html: availabilityAnswer() };
      case "mobility":
        return { intent: "mobility", html: mobilityAnswer() };
      case "education":
        return { intent: "education", html: educationAnswer() };
      case "experience":
        return { intent: "experience", html: experienceListAnswer() };
      case "projects":
        return { intent: "projects", html: projectsAnswer([]) };
      case "skills":
        return { intent: "skills", html: cats.length ? categoryAnswer(cats) : skillsAnswer() };
      case "about":
        return { intent: "about", html: aboutAnswer() };
    }

    if (cats.length) return { intent: "category", html: categoryAnswer(cats) };
    if (scores.has("greet")) return { intent: "greet", html: greetAnswer() };
    if (scores.has("thanks")) {
      return {
        intent: "thanks",
        html: `<p>Avec plaisir ! Une autre question ? Vous pouvez aussi écrire directement à ${name} : ${emailLink}.</p>`,
      };
    }
    return { intent: "fallback", html: fallbackAnswer() };
  };
}

export function initChatbot(): void {
  const root = document.getElementById("chatbot");
  const dataEl = document.getElementById("chatbot-data");
  if (!root || !dataEl?.textContent) return;

  const kb = JSON.parse(dataEl.textContent) as ChatbotKnowledge;
  const respond = createResponder(kb);

  const toggle = root.querySelector<HTMLButtonElement>("[data-chatbot-toggle]")!;
  const panel = root.querySelector<HTMLElement>("[data-chatbot-panel]")!;
  const messages = root.querySelector<HTMLElement>("[data-chatbot-messages]")!;
  const form = root.querySelector<HTMLFormElement>("[data-chatbot-form]")!;
  const input = root.querySelector<HTMLInputElement>("[data-chatbot-input]")!;
  const teaser = root.querySelector<HTMLElement>("[data-chatbot-teaser]");
  const iconOpen = root.querySelector<HTMLElement>("[data-icon-open]")!;
  const iconClose = root.querySelector<HTMLElement>("[data-icon-close]")!;
  const initial = esc(kb.profile.name.charAt(0));
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  let started = false;
  let lastQuestion: HTMLElement | null = null;

  function addBot(html: string): void {
    const row = document.createElement("div");
    row.className = "flex items-start gap-2";
    row.innerHTML = `<span aria-hidden="true" class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-xs font-bold text-white">${initial}</span><div class="${BOT_BUBBLE}">${html}</div>`;
    messages.append(row);
    messages.scrollTop = lastQuestion ? lastQuestion.offsetTop - 12 : messages.scrollHeight;
  }

  function addUser(text: string): void {
    const row = document.createElement("div");
    row.className = "flex justify-end";
    const bubble = document.createElement("div");
    bubble.className =
      "max-w-[85%] rounded-2xl rounded-tr-sm bg-[var(--color-primary)] px-3.5 py-2 text-sm text-white shadow-sm";
    bubble.textContent = text;
    row.append(bubble);
    messages.append(row);
    lastQuestion = row;
    messages.scrollTop = messages.scrollHeight;
  }

  function addTyping(): HTMLElement {
    const row = document.createElement("div");
    row.className = "flex items-center gap-2 pl-9";
    row.setAttribute("aria-hidden", "true");
    row.innerHTML = [0, 150, 300]
      .map(
        (delay) =>
          `<span class="h-2 w-2 animate-bounce rounded-full bg-slate-400" style="animation-delay:${delay}ms"></span>`,
      )
      .join("");
    messages.append(row);
    messages.scrollTop = messages.scrollHeight;
    return row;
  }

  function ask(raw: string): void {
    const question = raw.trim().slice(0, 200);
    if (!question) return;
    addUser(question);
    const typing = addTyping();
    const answer = respond(question);
    window.umami?.track("chatbot-question", { sujet: answer.intent });
    window.setTimeout(() => {
      typing.remove();
      addBot(answer.html);
    }, 450);
  }

  function setOpen(open: boolean): void {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer l'assistant" : "Ouvrir l'assistant");
    iconOpen.classList.toggle("hidden", open);
    iconClose.classList.toggle("hidden", !open);
    if (!open) return;
    teaser?.remove();
    if (!started) {
      started = true;
      addBot(`<p>${esc(kb.welcome)}</p>`);
      window.umami?.track("chatbot-ouvert");
    }
    if (finePointer) input.focus();
  }

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  root.querySelector("[data-chatbot-close]")?.addEventListener("click", () => {
    setOpen(false);
    toggle.focus();
  });
  panel.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setOpen(false);
    toggle.focus();
  });
  root.querySelectorAll<HTMLButtonElement>("[data-chatbot-suggestion]").forEach((button) => {
    button.addEventListener("click", () => ask(button.textContent ?? ""));
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(input.value);
    input.value = "";
  });
}
