const MEDIA_SELECTOR = ".single-project-media";
const PREPARED_CLASS = "media-reveal";
const REVEALED_CLASS = "is-revealed";

export function initMediaReveal(root = document) {
  const mediaElements = [...root.querySelectorAll(MEDIA_SELECTOR)];

  if (!mediaElements.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    mediaElements.forEach((element) => {
      element.classList.add(PREPARED_CLASS, REVEALED_CLASS);
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add(REVEALED_CLASS);
        instance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  mediaElements.forEach((element) => {
    element.classList.add(PREPARED_CLASS);
    observer.observe(element);
  });
}
