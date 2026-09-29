// ===== Helpers =====
const $ = (sel) => document.querySelector(sel);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function scrollToSection(id) {
  const target = $(id);
  if (!target) return;
  const top =
    id === "#home"
      ? 0
      : target.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top, behavior: "smooth" });
}

// ===== Navigation & mobile menu =====
const navLinks = $("#navLinks");
const menuBtn = $("#menuBtn");

document.querySelectorAll("[data-scroll]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToSection(link.getAttribute("href"));
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
document.querySelectorAll("[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => scrollToSection(btn.dataset.target));
});

// Highlight active nav link
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  let current = "home";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  links.forEach((l) =>
    l.classList.toggle("active", l.getAttribute("href") === "#" + current),
  );
});

// ===== Reveal on scroll =====
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        io.unobserve(en.target);
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ===== Hero interface: status checks, meters, pixel grid =====
async function runHeroStatus() {
  const items = document.querySelectorAll("#heroChecks li");
  for (const li of items) {
    li.classList.add("active");
    await wait(700);
    li.classList.remove("active");
    li.classList.add("done");
  }
  document
    .querySelectorAll(".bar em")
    .forEach(
      (b) => (b.style.width = getComputedStyle(b).getPropertyValue("--w")),
    );
}
runHeroStatus();

const pixelBox = $("#pixels");
for (let i = 0; i < 48; i++)
  pixelBox.appendChild(document.createElement("span"));
const pixels = pixelBox.children;
setInterval(() => {
  for (let i = 0; i < 6; i++)
    pixels[Math.floor(Math.random() * pixels.length)].classList.toggle("on");
}, 500);

// ===== Video: placeholder + live status =====
const vid = $("#vid");
const vStatus = $("#vStatus");
vid.addEventListener("loadeddata", () => {
  $("#placeholder").style.display = "none";
});
vid.addEventListener("play", () => (vStatus.textContent = "PLAYING"));
vid.addEventListener("pause", () => (vStatus.textContent = "PAUSED"));
vid.addEventListener("ended", () => (vStatus.textContent = "COMPLETE"));

// ===== RUN SYSTEM sequence =====
const runBtn = $("#runBtn");
const log = $("#log");
const progress = $("#progress");
const welcome = $("#welcomeMsg");
const steps = [
  "INITIALIZING...",
  "CONNECTING...",
  "LOADING TECHNOLOGY...",
  "LOADING EDUCATION...",
  "SYSTEM READY.",
];

runBtn.addEventListener("click", async () => {
  runBtn.disabled = true;
  welcome.classList.remove("show");
  progress.style.width = "0";
  log.textContent = "";
  for (let i = 0; i < steps.length; i++) {
    log.textContent +=
      "> " + steps[i] + (i < steps.length - 1 ? " [OK]\n" : "\n");
    progress.style.width = ((i + 1) / steps.length) * 100 + "%";
    await wait(750);
  }
  welcome.classList.add("show");
  runBtn.textContent = "RUN AGAIN";
  runBtn.disabled = false;
});
