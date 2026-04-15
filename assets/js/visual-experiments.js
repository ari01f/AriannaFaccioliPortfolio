import { siteData, visualExperiments } from "./projects-data.js";
import { renderVisualExperimentsPage } from "./render.js";
import { initMediaReveal } from "./media-reveal.js";

const owner = document.querySelector("[data-site-owner]");
const root = document.querySelector("[data-visual-experiments]");
const fixedBar = document.querySelector(".project-fixed-bar");

if (owner) {
  owner.textContent = siteData.owner;
}

if (!root) {
  throw new Error("Visual experiments root not found.");
}

root.innerHTML = renderVisualExperimentsPage(visualExperiments);
initMediaReveal(root);

if (fixedBar) {
  root.append(fixedBar);
}
