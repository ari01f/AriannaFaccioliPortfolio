import { getProjectBySlug, siteData } from "./projects-data.js";
import { renderProjectContent, groupMediaItems, createMedia, renderFloatingLinks, renderProjectBlocks } from "./render.js";
import { initMediaReveal } from "./media-reveal.js";

const owner = document.querySelector("[data-site-owner]");
const pageRoot = document.querySelector("[data-project-page]");
const topLinks = document.querySelector("[data-site-top-links]");
const activeProjectLabel = document.querySelector("[data-active-project]");
const project = getProjectBySlug(document.body.dataset.projectSlug);

if (owner) {
  owner.textContent = siteData.owner;
}

if (topLinks) {
  topLinks.innerHTML = renderFloatingLinks(siteData.links);
}

if (activeProjectLabel && project) {
  activeProjectLabel.textContent = project.title;
}

if (!pageRoot) {
  throw new Error("Project page root not found.");
}

if (!project) {
  pageRoot.innerHTML = `<p class="empty-state">Project not found.</p>`;
} else {
  document.title = `${project.title} | ${siteData.owner}`;
  
  // Check if project uses new blocks system
  const hasBlocks = project.blocks && Array.isArray(project.blocks) && project.blocks.length > 0;
  
  let mediaMarkup = "";
  if (hasBlocks) {
    // Use new block-based layout system
    mediaMarkup = renderProjectBlocks(project.blocks);
  } else {
    // Fallback to legacy system
    mediaMarkup = groupMediaItems(project.media)
      .map((group) => {
        const cells = group.items
          .map(
            (item) => `
              <div class="project-media-cell">
                <div class="project-media">
                  ${createMedia(item, {
                    controls: false,
                    autoplay: item.type === "video",
                    loop: item.type === "video",
                    muted: item.type === "video",
                  })}
                </div>
              </div>
            `,
          )
          .join("");

        return `<div class="project-media-row project-media-row--${group.layout}" ${group.layout === 'multi' ? `style="--columns: ${group.items.length}"` : ''}>${cells}</div>${group.layout === "full" && group.items[0].caption ? `<p class="project-caption">${group.items[0].caption}</p>` : ""}`;
      })
      .join("");
  }

  pageRoot.classList.add("project-page-layout");
  const projectPageData = {
    title: project.title,
    subtitle: project.subtitle,
    category: project.category,
    year: project.year,
    description: project.description,
  };

  const sequenceClass = hasBlocks ? "project-sequence-blocks" : "project-sequence";
  pageRoot.innerHTML = `${renderProjectContent(projectPageData)}<section class="${sequenceClass}">${mediaMarkup}</section>`;
  initMediaReveal(pageRoot);
}

