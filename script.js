const profile = {
  githubUser: "Mounika-N1808",
  skills: [
    {
      title: "Programming",
      items: ["Python", "Java", "JavaScript", "SQL", "HTML5", "CSS"],
    },
    {
      title: "Web Development",
      items: ["Responsive UI", "React basics", "DOM", "APIs", "Forms", "Accessibility"],
    },
    {
      title: "Data & Databases",
      items: ["MySQL", "SQL queries", "Data cleaning", "Excel", "Power BI", "Relational data"],
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
      items: ["Data Analyst", "BI Analyst", "Database roles", "Technical Support", "Business Analyst"],
    },
  ],
};

const featuredProjectOrder = [
  "website-visitor-dashboard",
  "forecasting-self-harm-trends-from-online-platorms",
  "house-price-prediction",
  "covid-19-analysis",
  "task-manager",
  "weather-application",
];

const hiddenProjectNames = new Set([
  "22311a1285",
  "basic-rest-api-with-crud-operations",
  "basic-rest-api-with-crud-operations.",
  "mounika-n1808",
  "mounika-nimmanagonti",
  "myportfolio",
]);

const skillsGrid = document.querySelector("#skillsGrid");
const projectGrid = document.querySelector("#projectGrid");

const projectDescriptions = {
  "website-visitor-dashboard":
    "Power BI dashboard for tracking website traffic, visitor count, page views, bounce rate, session duration, and conversion trends. Built to turn raw web metrics into clear business insights.",
  "forecasting-self-harm-trends-from-online-platorms":
    "Machine learning and NLP project that analyzes online platform signals, sentiment, and emotions to forecast self-harm trends using models such as Random Forest and XGBoost.",
  "house-price-prediction":
    "Python regression project for predicting house prices with preprocessing, exploratory analysis, model training, and evaluation using MAE, RMSE, and R-squared.",
  "covid-19-analysis":
    "Jupyter Notebook analysis project exploring COVID-19 data with Python, data cleaning, visual summaries, and trend-based insights.",
  "task-manager":
    "Responsive task management web app with a deployed live demo, focused on clean UI, task organization, and front-end implementation.",
  "weather-application":
    "Weather application project using web technologies to practice API-style UI flows, responsive layout, and front-end data display.",
};

const projectTitles = {
  "website-visitor-dashboard": "Website Visitor Dashboard",
  "forecasting-self-harm-trends-from-online-platorms":
    "Forecasting Self-Harm Trends from Online Platforms",
  "house-price-prediction": "House Price Prediction",
  "covid-19-analysis": "COVID-19 Analysis",
  "task-manager": "Task Manager",
  "weather-application": "Weather Application",
};

function normalizeName(name) {
  return name.toLowerCase().replaceAll("_", "-");
}

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
  const normalizedName = normalizeName(repo.name);
  if (projectDescriptions[normalizedName]) return projectDescriptions[normalizedName];
  if (repo.description) return repo.description;
  return "A public GitHub project by Mounika. Open the repository to review the code, structure, and implementation details.";
}

function repoTitle(repo) {
  const normalizedName = normalizeName(repo.name);
  if (projectTitles[normalizedName]) return projectTitles[normalizedName];

  return repo.name.replaceAll("-", " ").replaceAll("_", " ");
}

function renderProjects(repos) {
  const usefulRepos = repos
    .filter((repo) => !repo.fork && !hiddenProjectNames.has(normalizeName(repo.name)))
    .sort((a, b) => {
      const firstIndex = featuredProjectOrder.indexOf(normalizeName(a.name));
      const secondIndex = featuredProjectOrder.indexOf(normalizeName(b.name));

      if (firstIndex !== -1 || secondIndex !== -1) {
        return (firstIndex === -1 ? 99 : firstIndex) - (secondIndex === -1 ? 99 : secondIndex);
      }

      return new Date(b.pushed_at) - new Date(a.pushed_at);
    })
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
          <h3>${repoTitle(repo)}</h3>
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
