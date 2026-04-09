import { getProjectBySlug, siteData } from "./projects-data.js";
import { renderProjectPage } from "./render.js";

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
  const projectPageData = {
    title: project.title,
    subtitle: project.subtitle,
    category: project.category,
    year: project.year,
    description: project.description,
    media: project.media,
  };

  pageRoot.innerHTML = renderProjectPage(projectPageData);

  if (fixedBar) {
    pageRoot.append(fixedBar);
  }
}
