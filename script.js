const root = document.documentElement;

// ---------- Language (HR text lives in the HTML, EN text here) ----------
const EN = {
  title: "Petar Ruškan | Software Engineer",
  description:
    "Petar Ruškan – software engineer. C, C++, C#, .NET, web and mobile apps.",

  skip: "Skip to content",
  home: "Home",
  navLabel: "Main navigation",
  navAbout: "About",
  navSkills: "Skills",
  navProjects: "Projects",
  navContact: "Contact",
  theme: "Toggle theme",

  heroLead:
    "I write C, C++ and C#. I’m most interested in systems programming, tooling and keeping legacy code alive – and I build web and mobile apps along the way.",
  heroCta: "View projects",
  factLangs: "main languages",

  aboutTitle: "<span>01</span> About me",
  aboutP1:
    "Software engineer from Croatia. My background is in computer science at the Faculty of Electrical Engineering, Computer Science and Information Technology in Osijek, where I worked on everything from C console apps to computer vision and mobile development.",
  aboutP2:
    "These days I mostly work in the C/C++/C# ecosystem and .NET – I enjoy tooling, systems work and cleaning up old code so it keeps running reliably.",
  timelineLabel: "Experience and education",
  tlJobMeta: "Work",
  tlJobDesc:
    "On-Site Supervision and Manufacturing Rolling Mill Software Development",
  tlInternMeta: "Internship · 2024",
  tlInternDesc:
    "REST API for restaurant orders in C#/.NET 8 with an Angular frontend.",
  tlEduMeta: "Education",
  tlEduTitle: "Computer Science · FERIT Osijek",
  tlEduDesc:
    "Faculty of Electrical Engineering, Computer Science and Information Technology.",

  skillsTitle: "<span>02</span> Skills",
  skLangs: "Languages",
  skBackend: "Backend &amp; data",
  skFrontend: "Frontend &amp; mobile",
  skTools: "Tools &amp; ML",

  projectsTitle: "<span>03</span> Projects",
  allRepos: "All repositories →",
  codeLink: "Code on GitHub →",
  pNextrip:
    "Travel planner that generates trips based on your preferences. Trips can be saved, edited and exported straight to Google Maps.",
  pOrdersMeta: "2024 · Internship · Backend",
  pOrders:
    'REST API for restaurants, categories, items, customers and orders. Input validation, DTO mapping, logging and unit tests. Comes with an <a href="https://github.com/CroniX-Business/Praksa-Danieli-Systec-Frontend" target="_blank" rel="noopener">Angular frontend</a>.',
  pTierbnbMeta: "2024 · Mobile",
  pTierbnb:
    "Android car rental app: sign-up and login, vehicle listings and details, reservations and a map view.",
  pGasMeta: "2024 · Machine learning · ★ 3",
  pGasTitle: "Gas Meter Reader",
  pGas: "A YOLOv8 model finds the dial in a photo of a gas meter and crops it, then PaddleOCR reads the digits. It’s all wrapped in a simple Streamlit web app.",
  pTodoTitle: "Todo Web App",
  pTodo:
    "Plan tasks up to 10 days ahead. Admins have full CRUD access and can set a daily task limit per user.",
  pPerfumeMeta: "Programming 2 · FERIT",
  pPerfumeTitle: "Perfume Store",
  pPerfume:
    "Console app for managing records: add, delete and edit entries, save them to a binary file, and search and sort by parameter.",

  contactTitle: "<span>04</span> Contact",
  contactText:
    "The easiest way to reach me is GitHub or LinkedIn. Feel free to browse the code or send me a message.",
};

const textNodes = [...document.querySelectorAll("[data-i18n]")];
const ariaNodes = [...document.querySelectorAll("[data-i18n-aria]")];
const metaDesc = document.querySelector('meta[name="description"]');
const langBtn = document.querySelector(".lang-toggle");

// Remember the original Croatian text so we can switch back
const HR = {
  title: document.title,
  description: metaDesc.content,
};
textNodes.forEach((el) => (HR["t:" + el.dataset.i18n] ??= el.innerHTML));
ariaNodes.forEach(
  (el) => (HR["a:" + el.dataset.i18nAria] ??= el.getAttribute("aria-label"))
);

function setLang(lang) {
  const en = lang === "en";
  root.lang = lang;
  document.title = en ? EN.title : HR.title;
  metaDesc.content = en ? EN.description : HR.description;

  textNodes.forEach((el) => {
    const key = el.dataset.i18n;
    el.innerHTML = en && EN[key] ? EN[key] : HR["t:" + key];
  });
  ariaNodes.forEach((el) => {
    const key = el.dataset.i18nAria;
    el.setAttribute("aria-label", en && EN[key] ? EN[key] : HR["a:" + key]);
  });

  updateRepoLabel();
  updateSince();

  // The button shows the language you can switch TO
  langBtn.textContent = en ? "HR" : "EN";
  langBtn.lang = en ? "hr" : "en";
  langBtn.setAttribute(
    "aria-label",
    en ? "Prebaci na hrvatski" : "Switch to English"
  );
}

function initialLang() {
  const param = new URLSearchParams(location.search).get("lang");
  if (param === "en" || param === "hr") return param;
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "hr") return saved;
  } catch (e) {}
  // Croatian (and neighbouring languages) get HR, everyone else gets EN
  return /^(hr|bs|sr|sh)\b/i.test(navigator.language || "") ? "hr" : "en";
}

// ---------- "2024 – present" with the number of years filled in ----------
const thisYear = new Date().getFullYear();

function updateSince() {
  const en = root.lang === "en";
  document.querySelectorAll("[data-since]").forEach((el) => {
    const start = parseInt(el.dataset.since, 10);
    const years = thisYear - start;
    let text = `${start} – ${en ? "present" : "danas"}`;
    if (years >= 1) text += ` · ${years} ${en ? (years === 1 ? "yr" : "yrs") : "god."}`;
    el.textContent = text;
  });
}

// ---------- Live GitHub project count ----------
const GITHUB_USER = "CroniX-Business";
// Not counted as projects: forks, the profile README repo and this site
const SKIP_REPOS = ["cronix-business", "cronix-business.github.io"];

const repoCount = document.getElementById("repo-count");
const repoLabel = document.getElementById("repo-label");

function updateRepoLabel() {
  const n = parseInt(repoCount.textContent, 10) || 0;
  if (root.lang === "en") {
    repoLabel.textContent = (n === 1 ? "project" : "projects") + " on GitHub";
    return;
  }
  // Croatian plural: 1 projekt, 2–4 projekta, 5+ projekata (11–14 too)
  const one = n % 10 === 1 && n % 100 !== 11;
  const few = n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14);
  repoLabel.textContent =
    (one ? "projekt" : few ? "projekta" : "projekata") + " na GitHubu";
}

function showRepoCount(n) {
  repoCount.textContent = n;
  updateRepoLabel();
}

// If GitHub is unreachable (e.g. rate limit: 60 requests/hour per visitor),
// fall back to the last count this browser saw, then to the number in the HTML.
try {
  const last = localStorage.getItem("repoCount");
  if (last) showRepoCount(last);
} catch (e) {}

fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`)
  .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
  .then((repos) => {
    const n = repos.filter(
      (r) => !r.fork && !SKIP_REPOS.includes(r.name.toLowerCase())
    ).length;
    showRepoCount(n);
    try {
      localStorage.setItem("repoCount", n);
    } catch (e) {}
  })
  .catch(() => {});

setLang(initialLang());

langBtn.addEventListener("click", () => {
  const next = root.lang === "en" ? "hr" : "en";
  setLang(next);
  try {
    localStorage.setItem("lang", next);
  } catch (e) {}
});

// ---------- Theme toggle (remembers the choice when storage is available) ----------
document.querySelector(".theme-toggle").addEventListener("click", () => {
  const current =
    root.dataset.theme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
});

// Header border once the page is scrolled
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Fade sections in as they enter the viewport
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("visible"));
}

// Highlight the nav link for the section in view
const links = document.querySelectorAll(".nav a");
const sections = [...links].map((a) => document.querySelector(a.hash));
if ("IntersectionObserver" in window) {
  const navIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          links.forEach((a) =>
            a.classList.toggle("active", a.hash === "#" + e.target.id)
          );
        }
      }
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => s && navIo.observe(s));
}

// Footer year
document.getElementById("year").textContent = thisYear;
