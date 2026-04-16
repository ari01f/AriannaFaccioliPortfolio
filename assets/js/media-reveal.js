const MEDIA_SELECTOR = ".single-project-media";
const PREPARED_CLASS = "media-reveal";
const REVEALED_CLASS = "is-revealed";
const DATA_LOADED = "mediaLoaded";
const DATA_IN_VIEW = "mediaInView";
const DATA_REVEALED = "mediaRevealed";
const DATA_FAILED = "mediaFailed";

function isMediaLoaded(element) {
  if (element instanceof HTMLImageElement) {
    return element.complete && element.naturalWidth > 0 && element.naturalHeight > 0;
  }

  if (element instanceof HTMLVideoElement) {
    return element.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
  }

  if (element instanceof HTMLIFrameElement) {
    return element.dataset[DATA_LOADED] === "true";
  }

  return false;
}

function getRemovalTarget(element) {
  return (
    element.closest(
      ".draggable-item, .project-media-cell, .project-media-shell, .layout-block--media-full, .column--media, .project-media, .media-container",
    ) || element
  );
}

function markLoaded(element, observer) {
  if (element.dataset[DATA_FAILED] === "true") {
    return;
  }

  element.dataset[DATA_LOADED] = "true";
  maybeReveal(element, observer);
}

function markFailed(element, observer) {
  element.dataset[DATA_FAILED] = "true";
  observer.unobserve(element);
  getRemovalTarget(element).remove();
}

function maybeReveal(element, observer) {
  if (element.dataset[DATA_FAILED] === "true") {
    return;
  }

  if (element.dataset[DATA_REVEALED] === "true") {
    return;
  }

  const isLoaded = element.dataset[DATA_LOADED] === "true";
  const isInView = element.dataset[DATA_IN_VIEW] === "true";

  if (!isLoaded || !isInView) {
    return;
  }

  element.classList.add(REVEALED_CLASS);
  element.dataset[DATA_REVEALED] = "true";
  observer.unobserve(element);
}

function watchMediaLoad(element, observer) {
  if (isMediaLoaded(element)) {
    markLoaded(element, observer);
    return;
  }

  if (element instanceof HTMLImageElement) {
    element.addEventListener(
      "load",
      () => {
        markLoaded(element, observer);
      },
      { once: true },
    );
    element.addEventListener(
      "error",
      () => {
        markFailed(element, observer);
      },
      { once: true },
    );
    return;
  }

  if (element instanceof HTMLVideoElement) {
    element.addEventListener(
      "canplay",
      () => {
        markLoaded(element, observer);
      },
      { once: true },
    );
    element.addEventListener(
      "error",
      () => {
        markFailed(element, observer);
      },
      { once: true },
    );
    return;
  }

  if (element instanceof HTMLIFrameElement) {
    element.addEventListener(
      "load",
      () => {
        markLoaded(element, observer);
      },
      { once: true },
    );
    element.addEventListener(
      "error",
      () => {
        markFailed(element, observer);
      },
      { once: true },
    );
  }
}

export function initMediaReveal(root = document) {
  const mediaElements = [...root.querySelectorAll(MEDIA_SELECTOR)];

  if (!mediaElements.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        entry.target.dataset[DATA_IN_VIEW] = entry.isIntersecting ? "true" : "false";
        maybeReveal(entry.target, instance);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  mediaElements.forEach((element) => {
    element.classList.add(PREPARED_CLASS);
    element.dataset[DATA_LOADED] = "false";
    element.dataset[DATA_IN_VIEW] = "false";
    element.dataset[DATA_REVEALED] = "false";
    element.dataset[DATA_FAILED] = "false";

    if (prefersReducedMotion) {
      element.style.transition = "none";
    }

    watchMediaLoad(element, observer);
    observer.observe(element);
  });
}
