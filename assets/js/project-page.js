import { getProjectBySlug, siteData } from "./projects-data.js";
import { renderProjectContent, groupMediaItems, createMedia } from "./render.js";

const owner = document.querySelector("[data-site-owner]");
const pageRoot = document.querySelector("[data-project-page]");
const fixedBar = document.querySelector(".project-fixed-bar");
const project = getProjectBySlug(document.body.dataset.projectSlug);

if (owner) {
  owner.textContent = siteData.owner;
}

if (!pageRoot) {
  throw new Error("Project page root not found.");
}

if (!project) {
  pageRoot.innerHTML = `<p class="empty-state">Project not found.</p>`;
} else {
  document.title = `${project.title} | ${siteData.owner}`;
  const mediaMarkup = groupMediaItems(project.media)
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

  pageRoot.classList.add('site-grid');
  const projectPageData = {
    title: project.title,
    subtitle: project.subtitle,
    category: project.category,
    year: project.year,
    description: project.description,
  };

  pageRoot.innerHTML = `${renderProjectContent(projectPageData)}<section class="project-sequence">${mediaMarkup}</section>`;

  if (fixedBar) {
    pageRoot.append(fixedBar);
  }
}
