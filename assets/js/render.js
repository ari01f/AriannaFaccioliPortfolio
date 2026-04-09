function resolveAssetPath(path) {
  if (!path) {
    return "";
  }

  if (/^(?:[a-z]+:|\/\/|#|\/)/i.test(path)) {
    return path;
  }

  return new URL(`../../${path}`, import.meta.url).href;
}

function createMedia(media, options = {}) {
  const { controls = true, autoplay = false, loop = false, muted = false } =
    options;
  const source = resolveAssetPath(media.src);
  const poster = media.poster ? ` poster="${resolveAssetPath(media.poster)}"` : "";

  if (media.type === "video") {
    const autoplayAttrs = autoplay
      ? ` autoplay${muted ? " muted" : ""}${loop ? " loop" : ""} playsinline`
      : "";
    const controlsAttr = controls ? " controls" : "";

    return `<video class="single-project-media" src="${source}"${poster} preload="metadata"${autoplayAttrs}${controlsAttr}></video>`;
  }

  return `<img class="single-project-media" src="${source}" alt="${media.alt || ""}" loading="lazy" />`;
}

function createLinks(links) {
  if (!links?.length) {
    return "";
  }

  return links
    .map(
      (link) =>
        `<a href="${link.href}" target="_blank" rel="noreferrer">${link.label}</a>`,
    )
    .join("");
}

function createFloatingLinks(links) {
  if (!links?.length) {
    return "";
  }

  return links
    .map((link) => {
      const fingerprint = `${link.label} ${link.href}`.toLowerCase();
      let shortLabel = "";

      if (fingerprint.includes("instagram")) {
        shortLabel = "IG";
      } else if (fingerprint.includes("linkedin")) {
        shortLabel = "LI";
      }

      if (!shortLabel) {
        return "";
      }

      return `<a class="floating-label floating-label--social" href="${link.href}" target="_blank" rel="noreferrer">${shortLabel}</a>`;
    })
    .join("");
}

export function renderIdentityLinks(links) {
  return createLinks(links);
}

export function renderFloatingLinks(links) {
  return createFloatingLinks(links);
}

function groupMediaItems(items) {
  if (!items.length) {
    return [];
  }

  if (items.length === 1) {
    return [{ layout: "full", items: [items[0]] }];
  }

  if (items.length === 2) {
    return [{ layout: "pair", items: items }];
  }

  const groups = [{ layout: "full", items: [items[0]] }];
  let index = 1;

  while (index < items.length) {
    const remaining = items.length - index;

    if (remaining === 1) {
      groups.push({ layout: "full", items: [items[index]] });
      index += 1;
    } else {
      groups.push({ layout: "pair", items: items.slice(index, index + 2) });
      index += 2;
    }
  }

  return groups;
}

export function renderProjectIndexItem({ slug, category, year, preview }) {
  return `
    <article class="project-card" data-project-slug="${slug}" data-project-category="${category}" data-project-year="${year}">
      <a
        class="project-card-link"
        href="./projects/${slug}.html"
        aria-label="Open project"
      >
        <div class="project-media-shell" data-home-media-block>
          ${createMedia(preview, {
            controls: false,
            autoplay: preview.type === "video",
            loop: preview.type === "video",
            muted: preview.type === "video",
          })}
        </div>
      </a>
    </article>
  `;
}

export function renderProjectPage({
  title,
  subtitle,
  category,
  year,
  description,
  media,
}) {
  const mediaMarkup = groupMediaItems(media)
    .map((group) => {
      const cells = group.items
        .map(
          (item) => `
            <div class="project-media-cell">
              <div class="project-media">
                ${createMedia(item, {
                  controls: item.type === "video",
                  autoplay: false,
                  loop: false,
                  muted: false,
                })}
              </div>
            </div>
          `,
        )
        .join("");

      return `<div class="project-media-row project-media-row--${group.layout}">${cells}</div>`;
    })
    .join("");

  return `
    <article class="project-essay">
      <section class="project-intro">
        <div class="project-intro-main">
          <h1 class="project-page-title">${title}</h1>
          ${subtitle ? `<p class="project-page-subtitle">${subtitle}</p>` : ""}
          <div class="project-intro-meta">
            <p class="project-intro-category">${category}</p>
            <p class="project-intro-year">${year}</p>
          </div>
        </div>
        ${description ? `<div class="project-intro-side"><p class="project-page-description">${description}</p></div>` : ""}
      </section>

      <section class="project-sequence">
        ${mediaMarkup}
      </section>
    </article>
  `;
}

export function renderVisualExperimentsPage(experiments) {
  const rows = groupMediaItems(
    experiments.map((item) => ({
      type: "image",
      src: item.src,
      alt: item.alt,
      title: item.title,
    })),
  )
    .map((group) => {
      const cells = group.items
        .map(
          (item) => `
            <a class="project-media-cell" href="${resolveAssetPath(item.src)}" target="_blank" rel="noreferrer" aria-label="${item.title}">
              <div class="project-media">
                <img class="single-project-media" src="${resolveAssetPath(item.src)}" alt="${item.alt}" loading="lazy" />
              </div>
            </a>
          `,
        )
        .join("");

      return `<div class="project-media-row project-media-row--${group.layout}">${cells}</div>`;
    })
    .join("");

  return `
    <article class="project-essay visual-experiments-essay">
      <section class="project-intro visual-experiments-intro">
        <div class="project-intro-main">
          <p class="project-intro-meta">VISUAL EXPERIMENTS</p>
          <h1 class="project-page-title">Independent visual studies.</h1>
        </div>
        <div class="project-intro-side">
          <p class="project-page-description">
            A separate set of image-based experiments. These entries are not part of the selected works archive and do not open individual project pages.
          </p>
        </div>
      </section>
      <section class="project-sequence">
        ${rows}
      </section>
    </article>
  `;
}
