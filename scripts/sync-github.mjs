#!/usr/bin/env node
// Rafraîchit la liste des dépôts publics GitHub et affiche un tableau récapitulatif.
// Ce script ne modifie PAS src/data/projects.ts automatiquement : les catégories et
// descriptions y sont écrites à la main pour rester orientées "recruteur". Utilise
// la sortie de ce script comme base pour mettre à jour projects.ts toi-même.

const GITHUB_USERNAME = "laramo17";

async function main() {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
    { headers: { Accept: "application/vnd.github+json" } },
  );

  if (!res.ok) {
    console.error(`Erreur GitHub API: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const repos = await res.json();
  const active = repos.filter((r) => !r.fork);

  console.log(`\n${active.length} dépôts non-forkés trouvés pour ${GITHUB_USERNAME}:\n`);
  console.log("Nom".padEnd(45), "Langage".padEnd(15), "Taille (Ko)".padEnd(12), "Description");
  console.log("-".repeat(120));

  for (const repo of active) {
    console.log(
      repo.name.padEnd(45),
      (repo.language ?? "-").padEnd(15),
      String(repo.size).padEnd(12),
      repo.description ?? "(pas de description)",
    );
  }

  console.log(
    "\nDépôts avec size=0 ou LICENSE/README seuls sont probablement vides : à exclure de projects.ts.",
  );
  console.log("Mets à jour src/data/projects.ts manuellement avec les projets pertinents.\n");
}

main();
