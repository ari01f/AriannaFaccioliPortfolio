import { siteData, visualExperiments } from "./projects-data.js";
import { renderDraggableVisualExperiments, renderFloatingLinks } from "./render.js";
import { initDraggableItems } from "./drag.js";
import { initMediaReveal } from "./media-reveal.js";

function waitForMediaDimensions(media) {
  return new Promise((resolve) => {
    if (media instanceof HTMLImageElement) {
      if (media.complete && media.naturalWidth > 0 && media.naturalHeight > 0) {
        resolve({ width: media.naturalWidth, height: media.naturalHeight });
        return;
      }

      media.addEventListener(
        "load",
        () => {
          resolve({ width: media.naturalWidth, height: media.naturalHeight });
        },
        { once: true },
      );
      media.addEventListener(
        "error",
        () => {
          resolve({ width: 1, height: 1 });
        },
        { once: true },
      );
      return;
    }

    if (media instanceof HTMLVideoElement) {
      if (media.videoWidth > 0 && media.videoHeight > 0) {
        resolve({ width: media.videoWidth, height: media.videoHeight });
        return;
      }

      media.addEventListener(
        "loadedmetadata",
        () => {
          resolve({ width: media.videoWidth || 1, height: media.videoHeight || 1 });
        },
        { once: true },
      );
      media.addEventListener(
        "error",
        () => {
          resolve({ width: 1, height: 1 });
        },
        { once: true },
      );
      return;
    }

    resolve({ width: 1, height: 1 });
  });
}

async function prepareDraggableMedia(rootElement) {
  const items = [...rootElement.querySelectorAll(".draggable-item")];

  await Promise.all(
    items.map(async (item) => {
      const media = item.querySelector(".single-project-media");
      const mediaShell = item.querySelector(".draggable-item-media");

      if (!media || !mediaShell) {
        return;
      }

      const { width, height } = await waitForMediaDimensions(media);
      const safeWidth = Math.max(width, 1);
      const safeHeight = Math.max(height, 1);
      const ratio = safeWidth / safeHeight;

      mediaShell.style.setProperty("--experiment-media-aspect", `${safeWidth} / ${safeHeight}`);

      const isMobile = window.innerWidth <= 720;

      if (isMobile) {
        if (ratio < 0.85) {
          item.style.setProperty("--experiment-item-width", "clamp(8rem, 35vw, 10rem)");
        } else if (ratio > 1.2) {
          item.style.setProperty("--experiment-item-width", "clamp(10rem, 45vw, 14rem)");
        } else {
          item.style.setProperty("--experiment-item-width", "clamp(9rem, 40vw, 12rem)");
        }
      } else {
        if (ratio < 0.85) {
          item.style.setProperty("--experiment-item-width", "clamp(11rem, 16vw, 14rem)");
        } else if (ratio > 1.2) {
          item.style.setProperty("--experiment-item-width", "clamp(16rem, 26vw, 24rem)");
        } else {
          item.style.setProperty("--experiment-item-width", "clamp(14rem, 21vw, 18rem)");
        }
      }
    }),
  );
}

function initOrganicMotion(container) {
  const items = [...container.querySelectorAll(".draggable-item")];
  const motionStates = new Map();
  let animationId = null;

  // Configura il container per contenere gli elementi assoluti
  container.style.position = "relative";
  container.style.overflow = "hidden";

  function getRandomMotion(item) {
    const itemWidth = item.offsetWidth || 180;
    const itemHeight = item.offsetHeight || 180;
    const maxX = Math.max(container.clientWidth - itemWidth, 0);
    const maxY = Math.max(container.clientHeight - itemHeight, 0);
    return {
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      isAnimating: true,
    };
  }

  function updateMotion(item, state) {
    if (!state.isAnimating) return;

    const itemWidth = item.offsetWidth;
    const itemHeight = item.offsetHeight;
    const maxX = Math.max(container.clientWidth - itemWidth, 0);
    const maxY = Math.max(container.clientHeight - itemHeight, 0);

    // Advance position
    let nextX = state.x + state.vx;
    let nextY = state.y + state.vy;

    // Bounce horizontally — reflect and preserve speed
    if (nextX < 0) {
      nextX = -nextX;
      state.vx = Math.abs(state.vx);
    } else if (nextX > maxX) {
      nextX = maxX - (nextX - maxX);
      state.vx = -Math.abs(state.vx);
    }

    // Bounce vertically — reflect and preserve speed
    if (nextY < 0) {
      nextY = -nextY;
      state.vy = Math.abs(state.vy);
    } else if (nextY > maxY) {
      nextY = maxY - (nextY - maxY);
      state.vy = -Math.abs(state.vy);
    }

    // Final safety clamp so nothing ever renders outside bounds
    state.x = Math.max(0, Math.min(nextX, maxX));
    state.y = Math.max(0, Math.min(nextY, maxY));

    item.style.left = `${state.x}px`;
    item.style.top = `${state.y}px`;
  }

  function animate() {
    items.forEach((item) => {
      const state = motionStates.get(item);
      if (state) {
        updateMotion(item, state);
      }
    });
    animationId = requestAnimationFrame(animate);
  }

  // Inizializza stati
  items.forEach((item) => {
    const state = getRandomMotion(item);
    motionStates.set(item, state);
    item.style.position = "absolute";
    item.style.left = `${state.x}px`;
    item.style.top = `${state.y}px`;
    item.dataset.positioned = "true";
    item.dataset.preventClick = "false";
    item.style.pointerEvents = "auto";

    // Stop animazione al tocco/drag
    const stopAnimation = () => {
      const state = motionStates.get(item);
      if (state) {
        state.isAnimating = false;
      }
    };

    item.addEventListener("mousedown", stopAnimation);
    item.addEventListener("touchstart", stopAnimation);
  });

  // Inizia animazione
  animate();

  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}

const root = document.querySelector("[data-visual-experiments]");
const topLinks = document.querySelector("[data-site-top-links]");
const activeProjectLabel = document.querySelector("[data-active-project]");

const MOBILE_BREAKPOINT = 1040;
function getOwnerLabel() {
  return window.innerWidth <= MOBILE_BREAKPOINT ? "AF" : siteData.owner;
}

if (activeProjectLabel) {
  activeProjectLabel.textContent = getOwnerLabel();
}

if (topLinks) {
  topLinks.innerHTML = renderFloatingLinks(siteData.links);
}



if (!root) {
  throw new Error("Visual experiments root not found.");
}

// Render draggable visual experiments page
root.innerHTML = renderDraggableVisualExperiments(visualExperiments);
initMediaReveal(root);

// Initialize dragging functionality
const canvas = root.querySelector(".visual-experiments-canvas");
const itemsContainer = root.querySelector(".draggable-items-container");
if (canvas && itemsContainer) {
  await prepareDraggableMedia(root);
  initOrganicMotion(itemsContainer);
  initDraggableItems(itemsContainer);
}
