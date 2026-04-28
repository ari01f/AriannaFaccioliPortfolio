const MEDIA_SELECTOR = ".single-project-media";
const PREPARED_CLASS = "media-reveal";
const REVEALED_CLASS = "is-revealed";
const DATA_LOADED = "mediaLoaded";
const DATA_IN_VIEW = "mediaInView";
const DATA_REVEALED = "mediaRevealed";
const DATA_FAILED = "mediaFailed";
const DATA_UNLOADED = "mediaUnloaded";

function getPreloadMargin() {
  const isMobile = window.innerWidth <= 1040;
  const conn = navigator.connection;
  if (conn) {
    if (conn.saveData) return isMobile ? "200px" : "300px";
    if (conn.effectiveType === "2g" || conn.effectiveType === "slow-2g") return "200px";
    if (conn.effectiveType === "3g") return isMobile ? "400px" : "600px";
  }
  return isMobile ? "600px" : "800px";
}

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

function activateVideoSource(video) {
  if (video.dataset.src && !video.getAttribute("src")) {
    video.src = video.dataset.src;
    video.preload = "auto";
    video.dataset[DATA_UNLOADED] = "false";
    video.load();
  }
}

function deactivateVideoSource(video) {
  if (!video.getAttribute("src")) return;
  video.pause();
  video.removeAttribute("src");
  video.load();
  video.dataset[DATA_LOADED] = "false";
  video.dataset[DATA_REVEALED] = "false";
  video.dataset[DATA_UNLOADED] = "true";
  video.classList.remove(REVEALED_CLASS);
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

  if (element instanceof HTMLVideoElement && element.dataset.autoplay !== undefined) {
    element.play().catch(() => {});
  } else {
    observer.unobserve(element);
  }
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
    // Su Safari mobile, usa loadedmetadata invece di canplay
    const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const loadEvent = isIOSSafari ? "loadedmetadata" : "canplay";
    
    const handleLoad = () => {
      markLoaded(element, observer);
      element.removeEventListener(loadEvent, handleLoad);
      element.removeEventListener("error", handleError);
    };
    
    const handleError = () => {
      markFailed(element, observer);
      element.removeEventListener(loadEvent, handleLoad);
      element.removeEventListener("error", handleError);
    };
    
    element.addEventListener(loadEvent, handleLoad);
    element.addEventListener("error", handleError);
    
    // Timeout di sicurezza: se il video non carica in 15 secondi, marca come failed
    setTimeout(() => {
      if (!isMediaLoaded(element) && element.dataset[DATA_LOADED] !== "true") {
        handleError();
      }
    }, 15000);
    
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

  const revealObserver = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        const el = entry.target;
        el.dataset[DATA_IN_VIEW] = entry.isIntersecting ? "true" : "false";

        if (el instanceof HTMLVideoElement && el.dataset.autoplay !== undefined && el.dataset[DATA_REVEALED] === "true") {
          if (entry.isIntersecting) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        }

        maybeReveal(el, instance);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  const preloadMargin = getPreloadMargin();

  const preloadObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          if (el instanceof HTMLVideoElement) {
            activateVideoSource(el);
            watchMediaLoad(el, revealObserver);
          } else if (el instanceof HTMLIFrameElement && el.dataset.src && !el.getAttribute("src")) {
            el.src = el.dataset.src;
            watchMediaLoad(el, revealObserver);
          }
        } else if (el instanceof HTMLVideoElement && el.dataset[DATA_UNLOADED] !== "true") {
          deactivateVideoSource(el);
        }
      });
    },
    {
      threshold: 0,
      rootMargin: `${preloadMargin} 0px ${preloadMargin} 0px`,
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

    if (element instanceof HTMLVideoElement && element.dataset.src) {
      preloadObserver.observe(element);
    } else if (element instanceof HTMLIFrameElement && element.dataset.src && !element.getAttribute("src")) {
      preloadObserver.observe(element);
    } else {
      watchMediaLoad(element, revealObserver);
    }

    revealObserver.observe(element);
  });
}
