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
    { rootMargin: "0px 0px -10% 0px" }
  );

  for (const element of document.querySelectorAll(SELECTOR)) {
    observer.observe(element);
  }
}

function updatePhotoBlur() {
  const blurDistance = window.innerHeight * 0.9;
  const progress = Math.min(Math.max(window.scrollY / blurDistance, 0), 1);
  document.documentElement.style.setProperty("--photo-progress", progress.toFixed(3));
}

updatePhotoBlur();
window.addEventListener("scroll", updatePhotoBlur, { passive: true });
window.addEventListener("resize", updatePhotoBlur);