const root = document.documentElement;

// Theme toggle (remembers the choice when storage is available)
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

document.getElementById("year").textContent = new Date().getFullYear();
