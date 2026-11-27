const SELECTOR = ".reveal, .timeline, .timeline__item";

if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("js");

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -5% 0px" }
  );

  for (const element of document.querySelectorAll(SELECTOR)) {
    observer.observe(element);
  }
}

// Keep --header-height equal to the real header height. The header changes height
// when the nav wraps onto more rows on narrow screens or when the fonts finish loading.
const siteHeader = document.querySelector(".site-header");
if (siteHeader && "ResizeObserver" in window) {
  new ResizeObserver(() => {
    document.documentElement.style.setProperty("--header-height", `${siteHeader.offsetHeight}px`);
  }).observe(siteHeader);
}

const aboutSection = document.querySelector("#about");

// 0 at the top of the page, 1 once About me reaches the spot the About link scrolls to
// (just under the header, set by scroll-padding-top in style.css).
function updatePhotoBlur() {
  const stopOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const fadeDistance = aboutSection
    ? aboutSection.getBoundingClientRect().top + window.scrollY - stopOffset
    : window.innerHeight * 0.9;
  const progress = Math.min(Math.max(window.scrollY / Math.max(fadeDistance, 1), 0), 1);
  document.documentElement.style.setProperty("--photo-progress", progress.toFixed(3));
}

updatePhotoBlur();
window.addEventListener("scroll", updatePhotoBlur, { passive: true });
window.addEventListener("resize", updatePhotoBlur);

const navLinks = [...document.querySelectorAll(".site-nav__link")];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

// The current section is the last one whose top has scrolled past 40% of the screen.
// At the very bottom of the page, the last section counts as current.
function updateCurrentNav() {
  const marker = window.innerHeight * 0.4;
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  let current = null;
  for (const section of navSections) {
    if (section.getBoundingClientRect().top <= marker) {
      current = section;
    }
  }
  if (atBottom && navSections.length > 0) {
    current = navSections[navSections.length - 1];
  }
  for (const link of navLinks) {
    if (current && link.getAttribute("href") === `#${current.id}`) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

updateCurrentNav();
window.addEventListener("scroll", updateCurrentNav, { passive: true });
window.addEventListener("resize", updateCurrentNav);

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  for (const video of document.querySelectorAll("video[autoplay]")) {
    video.removeAttribute("autoplay");
    video.pause();
  }
}

function lockCardHeights(grid) {
  if (grid.classList.contains("card-grid--locked")) {
    return;
  }
  for (const card of grid.children) {
    card.style.minHeight = `${card.offsetHeight}px`;
  }
  grid.classList.add("card-grid--locked");
}

function unlockCardHeights(grid) {
  for (const card of grid.children) {
    card.style.minHeight = "";
  }
  grid.classList.remove("card-grid--locked");
}

for (const details of document.querySelectorAll(".card-grid .card__details")) {
  const grid = details.closest(".card-grid");
  details.querySelector("summary").addEventListener("click", () => lockCardHeights(grid));
  details.addEventListener("toggle", () => {
    if (!grid.querySelector(".card__details[open]")) {
      unlockCardHeights(grid);
    }
  });
}

let lastWidth = window.innerWidth;

window.addEventListener("resize", () => {
  if (window.innerWidth === lastWidth) {
    return;
  }
  lastWidth = window.innerWidth;
  for (const grid of document.querySelectorAll(".card-grid--locked")) {
    unlockCardHeights(grid);
  }
});