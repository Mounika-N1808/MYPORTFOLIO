const profile = {
  githubUser: "Mounika-N1808",
  skills: [
    {
      title: "Programming",
      items: ["Python", "Java", "JavaScript", "SQL", "HTML", "CSS"],
    },
    {
      title: "Web Development",
      items: ["Responsive UI", "React basics", "DOM", "APIs", "Forms", "Accessibility"],
    },
    {
      title: "Data & Databases",
      items: ["SQL queries", "Data cleaning", "Excel", "Relational data"],
    },
    {
      title: "Developer Tools",
      items: ["VS Code", "Git", "GitHub", "Command line", "Browser DevTools"],
    },
    {
      title: "Professional Strengths",
      items: ["Problem solving", "Documentation", "Teamwork", "Debugging", "Learning quickly"],
    },
    {
      title: "Role Targets",
      items: ["Data Analyst", "Database roles", "Technical Support", "Business Analyst"],
    },
  ],
};

const hiddenProjectNames = new Set([
  "basic-rest-api-with-crud-operations",
  "mounika-nimmanagonti",
]);

const skillsGrid = document.querySelector("#skillsGrid");
const projectGrid = document.querySelector("#projectGrid");

function renderSkills() {
  skillsGrid.innerHTML = profile.skills
    .map(
      (group) => `
        <article class="skill-card">
          <h3>${group.title}</h3>
          <ul>
            ${group.items.map((skill) => `<li>${skill}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function repoDescription(repo) {
  if (repo.description) return repo.description;
  return "A public GitHub project by Mounika. Open the repository to review the code, structure, and implementation details.";
}

function renderProjects(repos) {
  const usefulRepos = repos
    .filter((repo) => !repo.fork && !hiddenProjectNames.has(repo.name.toLowerCase()))
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 6);

  if (!usefulRepos.length) {
    projectGrid.innerHTML = `
      <p class="loading-text">
        No public repositories were returned by GitHub yet. Add public projects to
        GitHub and this section will update automatically.
      </p>
    `;
    return;
  }

  projectGrid.innerHTML = usefulRepos
    .map(
      (repo) => `
        <article class="project-card">
          <h3>${repo.name.replaceAll("-", " ")}</h3>
          <p>${repoDescription(repo)}</p>
          <div class="project-meta">
            ${repo.language ? `<span class="repo-language">${repo.language}</span>` : ""}
            <span class="repo-stat">Updated ${formatDate(repo.pushed_at)}</span>
            <span class="repo-stat">${repo.stargazers_count} stars</span>
          </div>
          <div class="project-links">
            <a href="${repo.html_url}" target="_blank" rel="noreferrer">Code</a>
            ${
              repo.homepage
                ? `<a href="${repo.homepage}" target="_blank" rel="noreferrer">Live Demo</a>`
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");
}

async function loadGitHubProjects() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${profile.githubUser}/repos?sort=updated&per_page=100`
    );

    if (!response.ok) {
      throw new Error("GitHub response was not successful.");
    }

    const repos = await response.json();
    renderProjects(repos);
  } catch (error) {
    projectGrid.innerHTML = `
      <p class="loading-text">
        GitHub projects could not be loaded in this preview. Visit
        <a class="text-link" href="https://github.com/${profile.githubUser}" target="_blank" rel="noreferrer">
          github.com/${profile.githubUser}
        </a>
        to see the repositories.
      </p>
    `;
  }
}

renderSkills();
loadGitHubProjects();
