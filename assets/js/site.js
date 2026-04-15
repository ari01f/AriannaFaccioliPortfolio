import { getHomepageProjects, siteData, projects } from "./projects-data.js";
import { renderFloatingLinks, renderProjectIndexItem } from "./render.js";
import { initMediaReveal } from "./media-reveal.js";

const owners = document.querySelectorAll("[data-site-owner]");
const bio = document.querySelector("[data-site-bio]");
const topLinks = document.querySelector("[data-site-top-links]");
const projectIndex = document.querySelector("[data-project-index]");
const rightContent = document.querySelector(".right-content");
const scrollRoot =
  rightContent && getComputedStyle(rightContent).overflowY !== "visible"
    ? rightContent
    : null;

owners.forEach((owner) => {
  owner.textContent = siteData.owner;
});

if (bio) {
  bio.textContent = siteData.bio;
}

if (topLinks) {
  topLinks.innerHTML = renderFloatingLinks(siteData.links);
}

if (projectIndex) {
  projectIndex.innerHTML = getHomepageProjects().map(renderProjectIndexItem).join("");
  initMediaReveal(projectIndex);
}

const activeProjectLabel = document.querySelector("[data-active-project]");
const mediaBlocks = [...document.querySelectorAll("[data-home-media-block]")];
const projectTitleBySlug = new Map(
  projects.map(({ slug, title }) => [slug, title]),
);

if (activeProjectLabel && mediaBlocks.length > 0) {
  const visibleBlocks = new Set();
  const thresholds = Array.from({ length: 101 }, (_, index) => index / 100);
  let activeBlock = null;
  let frameId = 0;

  function getProjectTitle(block) {
    const slug = block.closest(".project-card")?.dataset.projectSlug;
    return slug ? projectTitleBySlug.get(slug) ?? "" : "";
  }

  function getVisibilityRatio(block, rootRect) {
    const rect = block.getBoundingClientRect();
    const visibleTop = Math.max(rect.top, rootRect.top);
    const visibleBottom = Math.min(rect.bottom, rootRect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    return rect.height > 0 ? visibleHeight / rect.height : 0;
  }

  function getDistanceToViewportCenter(block, rootRect) {
    const rect = block.getBoundingClientRect();
    const blockCenter = rect.top + rect.height / 2;
    const viewportCenter = rootRect.top + rootRect.height / 2;

    return Math.abs(blockCenter - viewportCenter);
  }

  function setActiveBlock(nextBlock) {
    if (!nextBlock || nextBlock === activeBlock) {
      return;
    }

    activeBlock = nextBlock;
    activeProjectLabel.textContent = getProjectTitle(nextBlock);
  }

  function resolveActiveBlock() {
    frameId = 0;

    const rootRect = scrollRoot
      ? scrollRoot.getBoundingClientRect()
      : {
          top: 0,
          bottom: window.innerHeight,
          height: window.innerHeight,
        };
    const candidates = visibleBlocks.size > 0 ? [...visibleBlocks] : mediaBlocks;
    let nextBlock = null;
    let highestRatio = 0;
    let closestToCenter = Number.POSITIVE_INFINITY;

    candidates.forEach((block) => {
      const ratio = getVisibilityRatio(block, rootRect);

      if (ratio <= 0) {
        visibleBlocks.delete(block);
        return;
      }

      const distanceToCenter = getDistanceToViewportCenter(block, rootRect);

      if (
        ratio > highestRatio + 0.01 ||
        (Math.abs(ratio - highestRatio) <= 0.01 &&
          distanceToCenter < closestToCenter)
      ) {
        nextBlock = block;
        highestRatio = ratio;
        closestToCenter = distanceToCenter;
      }
    });

    setActiveBlock(nextBlock ?? mediaBlocks[0]);
  }

  function queueActiveBlockUpdate() {
    if (frameId) {
      return;
    }

    frameId = window.requestAnimationFrame(resolveActiveBlock);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleBlocks.add(entry.target);
        } else {
          visibleBlocks.delete(entry.target);
        }
      });

      queueActiveBlockUpdate();
    },
    {
      root: scrollRoot,
      threshold: thresholds,
    },
  );

  mediaBlocks.forEach((block) => observer.observe(block));

  (scrollRoot ?? window).addEventListener("scroll", queueActiveBlockUpdate, {
    passive: true,
  });
  window.addEventListener("resize", queueActiveBlockUpdate);

  queueActiveBlockUpdate();
}
