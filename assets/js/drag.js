/**
 * Draggable items initialization and management
 * Enables free positioning of items on the visual experiments canvas
 * Persists positions in data attributes and localStorage
 */

const OUTER_GAP = 24;
const ITEM_GAP = 36;

function shuffle(values) {
  const result = [...values];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

function getAnchorSlots(topInset, usableWidth, usableHeight) {
  const anchors = [
    { x: 0.08, y: 0.04 },
    { x: 0.34, y: 0.1 },
    { x: 0.68, y: 0.06 },
    { x: 0.18, y: 0.3 },
    { x: 0.56, y: 0.26 },
    { x: 0.78, y: 0.34 },
    { x: 0.1, y: 0.56 },
    { x: 0.38, y: 0.52 },
    { x: 0.7, y: 0.6 },
    { x: 0.24, y: 0.78 },
    { x: 0.62, y: 0.8 },
  ];

  return shuffle(anchors).map((anchor) => ({
    x: OUTER_GAP + anchor.x * Math.max(usableWidth, 0),
    y: topInset + anchor.y * Math.max(usableHeight, 0),
  }));
}

/**
 * Get initial loose grid positions for items
 * Creates a random layout while keeping items readable and below the labels
 */
function getInitialPositions(items, containerWidth, containerHeight, topInset = 0) {
  const positions = [];
  const placedRects = [];
  const maxAttempts = 80;
  const fallbackCols = Math.max(1, Math.ceil(Math.sqrt(items.length)));
  const viewportWidth = window.innerWidth;
  const effectiveWidth = Math.min(containerWidth, viewportWidth);
  const usableWidth = Math.max(effectiveWidth - OUTER_GAP * 2, 0);
  const usableHeight = Math.max(containerHeight - topInset - OUTER_GAP, 320);
  const anchors = getAnchorSlots(topInset, usableWidth, usableHeight);

  function overlaps(candidate) {
    return placedRects.some((rect) => {
      return !(
        candidate.right + ITEM_GAP <= rect.left ||
        candidate.left >= rect.right + ITEM_GAP ||
        candidate.bottom + ITEM_GAP <= rect.top ||
        candidate.top >= rect.bottom + ITEM_GAP
      );
    });
  }

  items.forEach((item, index) => {
    const itemWidth = Math.max(item.offsetWidth, 180);
    const itemHeight = Math.max(item.offsetHeight, 180);
    const maxX = Math.max(effectiveWidth - itemWidth - OUTER_GAP, OUTER_GAP);
    const minY = topInset;
    const maxY = Math.max(containerHeight - itemHeight - OUTER_GAP, minY);
    let position = null;

    for (const anchor of anchors) {
      const jitterX = (Math.random() - 0.5) * Math.min(usableWidth * 0.12, 120);
      const jitterY = (Math.random() - 0.5) * Math.min(usableHeight * 0.14, 140);
      const x = Math.max(OUTER_GAP, Math.min(anchor.x + jitterX, maxX));
      const y = Math.max(minY, Math.min(anchor.y + jitterY, maxY));
      const candidate = {
        left: x,
        top: y,
        right: x + itemWidth,
        bottom: y + itemHeight,
      };

      if (!overlaps(candidate)) {
        position = { x, y };
        placedRects.push(candidate);
        break;
      }
    }

    if (!position) {
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const x = OUTER_GAP + Math.random() * Math.max(maxX - OUTER_GAP, 0);
        const y = minY + Math.random() * Math.max(maxY - minY, 0);
        const candidate = {
          left: x,
          top: y,
          right: x + itemWidth,
          bottom: y + itemHeight,
        };

        if (!overlaps(candidate)) {
          position = { x, y };
          placedRects.push(candidate);
          break;
        }
      }
    }

    if (!position) {
      const col = index % fallbackCols;
      const row = Math.floor(index / fallbackCols);
      const fallbackX = OUTER_GAP + col * ((effectiveWidth - OUTER_GAP * 2) / fallbackCols);
      const fallbackY = minY + row * (itemHeight + ITEM_GAP);
      const candidate = {
        left: fallbackX,
        top: fallbackY,
        right: fallbackX + itemWidth,
        bottom: fallbackY + itemHeight,
      };

      position = { x: fallbackX, y: fallbackY };
      placedRects.push(candidate);
    }

    positions.push(position);
  });

  return positions;
}

/**
 * Initialize draggable items on the visual experiments canvas
 */
export function initDraggableItems(container) {
  if (!container) return;

  const items = [...container.querySelectorAll(".draggable-item")];
  if (items.length === 0) return;

  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  const labels = document.querySelector(".floating-labels");
  const containerRect = container.getBoundingClientRect();
  const labelsRect = labels ? labels.getBoundingClientRect() : null;
  const topInset = labelsRect
    ? Math.max(labelsRect.bottom - containerRect.top, 0) + 24
    : 24;

  // On mobile, constrain spawn area to the visible viewport
  const isMobile = window.innerWidth <= 1040;
  const visibleHeight = isMobile
    ? Math.max(window.innerHeight - Math.max(containerRect.top, 0), 300)
    : containerHeight;

  const initialPositions = getInitialPositions(
    items,
    containerWidth,
    visibleHeight,
    topInset,
  );
  const dragThreshold = 6;

  let draggedItem = null;
  let activePointerId = null;
  let offset = { x: 0, y: 0 };
  let dragStartPointer = { x: 0, y: 0 };
  let hasMoved = false;

  const maxBottom = initialPositions.reduce((largest, position, index) => {
    return Math.max(largest, position.y + items[index].offsetHeight + OUTER_GAP);
  }, topInset + OUTER_GAP);

  container.style.minHeight = `${Math.max(containerHeight, maxBottom)}px`;

  function getDragBounds(item) {
    const maxX = Math.max(0, container.clientWidth - item.offsetWidth);
    const maxY = Math.max(topInset, container.scrollHeight - item.offsetHeight - OUTER_GAP);

    return {
      minX: 0,
      maxX,
      minY: topInset,
      maxY,
    };
  }

  function finishDrag() {
    if (!draggedItem) return;

    if (hasMoved) {
      draggedItem.dataset.x = `${parseFloat(draggedItem.style.left)}`;
      draggedItem.dataset.y = `${parseFloat(draggedItem.style.top)}`;
    }

    draggedItem.classList.remove("dragging");
    draggedItem = null;
    activePointerId = null;
    hasMoved = false;
  }

  // Apply initial or saved positions (skip if already positioned, e.g. by organic motion)
  items.forEach((item, index) => {
    if (item.dataset.positioned === "true") return;

    const position = initialPositions[index] ?? { x: 0, y: 0 };
    const x = position.x;
    const y = position.y;

    item.dataset.x = x;
    item.dataset.y = y;
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.dataset.preventClick = "false";
    item.dataset.positioned = "true";
  });

  items.forEach((item) => {
    item.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });

    item.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 && e.pointerType !== "touch") return;

      draggedItem = item;
      activePointerId = e.pointerId;
      const rect = item.getBoundingClientRect();

      offset.x = e.clientX - rect.left;
      offset.y = e.clientY - rect.top;
      dragStartPointer = { x: e.clientX, y: e.clientY };
      hasMoved = false;
      item.dataset.preventClick = "false";

      items.forEach((i) => {
        i.style.zIndex = "0";
      });
      draggedItem.style.zIndex = "999";
      item.setPointerCapture(e.pointerId);
    });

    item.addEventListener(
      "click",
      (e) => {
        if (item.dataset.preventClick === "true") {
          e.preventDefault();
          e.stopPropagation();
          item.dataset.preventClick = "false";
          return;
        }

        const link = item.querySelector(".draggable-item-link[href]");

        if (!link) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (link.target === "_blank") {
          window.open(link.href, "_blank", "noreferrer");
          return;
        }

        window.location.assign(link.href);
      },
      true,
    );
  });

  document.addEventListener("pointermove", (e) => {
    if (!draggedItem) return;
    if (activePointerId !== null && e.pointerId !== activePointerId) return;

    const deltaX = e.clientX - dragStartPointer.x;
    const deltaY = e.clientY - dragStartPointer.y;

    if (!hasMoved && Math.hypot(deltaX, deltaY) >= dragThreshold) {
      hasMoved = true;
      draggedItem.classList.add("dragging");
      draggedItem.dataset.preventClick = "true";
    }

    if (!hasMoved) return;

    const containerRect = container.getBoundingClientRect();
    const bounds = getDragBounds(draggedItem);
    let x = e.clientX - containerRect.left - offset.x;
    let y = e.clientY - containerRect.top - offset.y;

    x = Math.max(bounds.minX, Math.min(x, bounds.maxX));
    y = Math.max(bounds.minY, Math.min(y, bounds.maxY));

    draggedItem.style.left = `${x}px`;
    draggedItem.style.top = `${y}px`;
    e.preventDefault();
  });

  document.addEventListener("pointerup", finishDrag);
  document.addEventListener("pointercancel", finishDrag);
}
