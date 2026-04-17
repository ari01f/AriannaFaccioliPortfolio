function resolveAssetPath(path) {
  if (!path) {
    return "";
  }

  if (/^(?:[a-z]+:|\/\/|#|\/)/i.test(path)) {
    return path;
  }

  return new URL(`../../${path}`, import.meta.url).href;
}

function normalizeHtmlMedia(content) {
  if (!content) {
    return "";
  }

  // Remove duplicate Vimeo player.js script tags
  let cleaned = content.replace(/<script[^>]*player\.vimeo\.com\/api\/player\.js[^>]*><\/script>/gi, "");

  return cleaned.replace(/<iframe\b([^>]*)>/gi, (match, attrs) => {
    // Convert src to data-src for lazy loading, add loading="lazy"
    const lazyAttrs = attrs
      .replace(/\bsrc\s*=\s*"([^"]*)"/i, 'data-src="$1"')
      .replace(/\bsrc\s*=\s*'([^']*)'/i, "data-src='$1'");

    if (/\bclass\s*=\s*"/i.test(lazyAttrs)) {
      return `<iframe loading="lazy"${lazyAttrs.replace(/\bclass\s*=\s*"([^"]*)"/i, (classMatch, classNames) => {
        if (classNames.split(/\s+/).includes("single-project-media")) {
          return classMatch;
        }
        return `class="${classNames} single-project-media"`;
      })}>`;
    }

    return `<iframe class="single-project-media" loading="lazy"${lazyAttrs}>`;
  });
}

export function createMedia(media, options = {}) {
  const { controls = true, autoplay = false, loop = false, muted = false } =
    options;

  if (media.type === "html") {
    return normalizeHtmlMedia(media.content);
  }

  const isMobile = window.innerWidth <= 1040;
  const source = resolveAssetPath(isMobile && media.mobileSrc ? media.mobileSrc : media.src);
  const poster = media.poster ? ` poster="${resolveAssetPath(media.poster)}"` : "";

  if (media.type === "video") {
    const autoplayData = autoplay ? ' data-autoplay' : '';
    const autoplayAttrs = autoplay
      ? `${muted ? " muted" : ""}${loop ? " loop" : ""} playsinline`
      : "";
    const controlsAttr = controls ? " controls" : "";

    return `<video class="single-project-media" data-src="${source}"${poster} preload="metadata" crossorigin="anonymous"${autoplayAttrs}${autoplayData}${controlsAttr}><source type="video/mp4"></video>`;
  }

  return `<img class="single-project-media" src="${source}" alt="${media.alt || ""}" loading="lazy" />`;
}

function createFloatingLinks(links) {
  if (!links?.length) {
    return "";
  }

  const selectedLinks = [];

  links.forEach((link) => {
    const fingerprint = `${link.label} ${link.href}`.toLowerCase();

    if (fingerprint.includes("instagram")) {
      selectedLinks.push({
        ...link,
        compactLabel: "IG",
        order: 0,
      });
    } else if (fingerprint.includes("mailto:") || fingerprint.includes("email")) {
      selectedLinks.push({
        ...link,
        compactLabel: "mail",
        order: 1,
      });
    }
  });

  return selectedLinks
    .sort((left, right) => left.order - right.order)
    .map(
      (link) =>
        `<a class="floating-label floating-label--social" href="${link.href}" target="_blank" rel="noreferrer">${link.compactLabel}</a>`,
    )
    .join("");
}

export function renderFloatingLinks(links) {
  return createFloatingLinks(links);
}

export function groupMediaItems(items) {
  if (!items.length) {
    return [];
  }

  const groups = [];
  let index = 0;

  while (index < items.length) {
    if (index === 0) {
      groups.push({ layout: "full", items: [items[index]] });
      index += 1;
      continue;
    }

    const remaining = items.length - index;
    const previous = groups[groups.length - 1];

    if (previous.layout === "full") {
      if (remaining >= 2) {
        groups.push({ layout: "pair", items: items.slice(index, index + 2) });
        index += 2;
      } else {
        groups.push({ layout: "full", items: [items[index]] });
        index += 1;
      }
    } else {
      groups.push({ layout: "full", items: [items[index]] });
      index += 1;
    }
  }

  return groups;
}

export function renderProjectIndexItem({
  slug,
  title,
  category,
  year,
  summary,
  preview,
}) {
  return `
    <article class="project-card" data-project-slug="${slug}" data-project-category="${category}" data-project-year="${year}">
      <a
        class="project-card-link"
        href="./projects/${slug}.html"
        aria-label="Open ${title}"
      >
        <div class="project-media-shell" data-home-media-block>
          ${createMedia(preview, {
            controls: false,
            autoplay: preview.type === "video",
            loop: preview.type === "video",
            muted: preview.type === "video",
          })}
        </div>
        <div class="project-card-copy">
          <p class="project-card-caption">
            <span class="project-card-title">${title}</span>${category ? `<span class="project-card-separator" aria-hidden="true">, </span><span class="project-chip">${category}</span>` : ""}${summary ? `<span class="project-card-separator" aria-hidden="true">, </span><span class="project-card-summary">${summary}</span>` : ""}
          </p>
          ${year ? `<span class="project-chip project-chip--year">${year}</span>` : ""}
        </div>
      </a>
    </article>
  `;
}

export function renderProjectContent({
  title,
  subtitle,
  category,
  year,
  description,
}) {
  return `
    <section class="project-page-intro" aria-label="Project introduction">
      <div class="right-content">
        <div class="project-metadata">
          <h1 class="project-page-title">${title}</h1>
          ${subtitle ? `<p class="project-page-subtitle">${subtitle}</p>` : ""}
          <p class="project-intro-category">${category}</p>
          <p class="project-intro-year">${year}</p>
        </div>
      </div>
      <div class="identity-column">
        <div class="sticky-left">
          <p class="identity-bio">${description}</p>
        </div>
      </div>
    </section>
  `;
}

// ===== BLOCK-BASED LAYOUT SYSTEM =====

export function renderMediaFullBlock(media) {
  return `
    <div class="layout-block layout-block--media-full">
      <div class="media-container media-container--full">
        ${createMedia(media, {
          controls: false,
          autoplay: media.type === "video",
          loop: media.type === "video",
          muted: media.type === "video",
        })}
      </div>
    </div>
  `;
}

export function renderTwoColumnBlock(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  const columns = items.map((item) => {
    if (item.type === "text") {
      return `
        <div class="column column--text">
          <p class="column-text">${item.content}</p>
        </div>
      `;
    } else if (item.type === "html") {
      return `
        <div class="column column--media">
          <div class="media-container media-container--column">
            ${normalizeHtmlMedia(item.content)}
          </div>
        </div>
      `;
    } else {
      // Media item
      return `
        <div class="column column--media">
          <div class="media-container media-container--column">
            ${createMedia(item, {
              controls: false,
              autoplay: item.type === "video",
              loop: item.type === "video",
              muted: item.type === "video",
            })}
          </div>
        </div>
      `;
    }
  }).join("");

  return `
    <div class="layout-block layout-block--two-column">
      <div class="two-column-grid">
        ${columns}
      </div>
    </div>
  `;
}

export function renderCaptionBlock(text) {
  if (!text) return "";
  
  return `
    <div class="layout-block layout-block--caption">
      <p class="caption-text">${text}</p>
    </div>
  `;
}

export function renderHtmlBlock(content) {
  if (!content) {
    return "";
  }

  return `
    <div class="layout-block layout-block--html">
      ${normalizeHtmlMedia(content)}
    </div>
  `;
}

export function renderProjectBlocks(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return "";
  }

  return blocks
    .map((block) => {
      switch (block.type) {
        case "media-full":
          return renderMediaFullBlock(block.media);
        case "two-column":
          return renderTwoColumnBlock(block.items);
        case "caption":
          return renderCaptionBlock(block.content);
        case "html":
          return renderHtmlBlock(block.content);
        default:
          return "";
      }
    })
    .join("");
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
          <p class="project-intro-meta">Visual experiments</p>
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

/**
 * Render draggable visual experiments page
 * Each item includes media and description, positioned absolutely for free dragging
 */
export function renderDraggableVisualExperiments(experiments) {
  function renderDraggableMedia(item) {
    const source = resolveAssetPath(item.src);

    if (item.type === "video") {
      const poster = item.poster ? ` poster="${resolveAssetPath(item.poster)}"` : "";

      return `<video class="single-project-media" src="${source}"${poster} preload="metadata" playsinline muted loop autoplay crossorigin="anonymous"><source type="video/mp4"></video>`;
    }

    return `<img class="single-project-media" src="${source}" alt="${item.alt}" loading="lazy" draggable="false" />`;
  }

  const items = experiments
    .map(
      (item) => `
    <div class="draggable-item" data-experiment-id="${item.slug}" data-x="0" data-y="0" data-positioned="false">
      ${item.href ? `<a class="draggable-item-link" href="${item.href}" target="_blank" rel="noreferrer">` : '<div class="draggable-item-link">'}
        <div class="draggable-item-media">
          ${renderDraggableMedia(item)}
        </div>
        <p class="draggable-item-description">${item.title}</p>
      ${item.href ? "</a>" : "</div>"}
    </div>
  `,
    )
    .join("");

  return `
    <div class="visual-experiments-canvas">
      <section class="visual-experiments-intro-section">
        <div class="visual-experiments-intro-side">
          <p class="project-page-description visual-experiments-intro-description">A separate set of image-based experiments. These entries are not part of the selected works archive. Drag items to explore the canvas freely.</p>
        </div>
      </section>
      <div class="draggable-items-container">
        ${items}
      </div>
    </div>
  `;
}
