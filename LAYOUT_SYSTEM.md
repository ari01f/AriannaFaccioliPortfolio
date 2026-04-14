# Block-Based Layout System Documentation

## Overview

The project layout system is now fully customizable using a **modular block-based architecture**. Instead of a fixed layout structure, you can compose project pages by manually defining an array of blocks in any order.

## Block Types

### 1. Full-Width Media Block

A single media item (image or video) that fills the full width of the container.

**Structure:**
```javascript
{
  type: "media-full",
  media: {
    type: "image" | "video",
    src: "path/to/media.jpg",
    alt: "Description",
    poster: "path/to/poster.jpg" // Optional, for videos
  }
}
```

**Behavior:**
- Media fills the entire container (80-90vh height)
- Uses `object-fit: cover` with center positioning
- Cropping is applied if aspect ratio doesn't match
- Responsive: height reduces on smaller screens

**Example:**
```javascript
{
  type: "media-full",
  media: {
    type: "video",
    src: "filmati/showcase.mov",
    poster: "images/poster.jpg",
    alt: "Project showcase video"
  }
}
```

---

### 2. Two-Column Block

A responsive container with two columns side-by-side. Each column can contain media or text.

**Structure:**
```javascript
{
  type: "two-column",
  items: [
    {
      type: "image" | "video" | "text",
      // Media properties if type is image/video:
      src: "path/to/media.jpg",
      alt: "Description",
      // OR Text property if type is text:
      content: "Text content or caption"
    },
    // ... more items (typically 2, but flexible)
  ]
}
```

**Behavior:**
- Two equal-width columns at default screen size
- Media uses `object-fit: cover` (60-70vh height)
- Text content is vertically centered within the column
- **Responsive:** Collapses to single column on screens < 1040px
- Maintains consistent spacing and alignment

**Example:**
```javascript
{
  type: "two-column",
  items: [
    {
      type: "video",
      src: "filmati/left-video.mov",
      alt: "Left side video"
    },
    {
      type: "text",
      content: "This text appears on the right side, centered vertically."
    }
  ]
}
```

---

### 3. Caption / Text Block

A standalone text block that can be placed anywhere in the layout. Useful for descriptions, notes, or captions between media blocks.

**Structure:**
```javascript
{
  type: "caption",
  content: "Caption or descriptive text"
}
```

**Behavior:**
- Independent block that doesn't affect media sizing
- Uses serif font family (consistent with project description)
- Standard font size and line height
- Can be placed before, after, or between other blocks
- Maintains consistent spacing with surrounding blocks

**Example:**
```javascript
{
  type: "caption",
  content: "The video above shows the interactive navigation system with real-time filtering capabilities."
}
```

---

## Layout Composition Examples

### Example 1: Sequential Full-Width Media
```javascript
blocks: [
  {
    type: "media-full",
    media: { type: "video", src: "v1.mov", alt: "..." }
  },
  {
    type: "media-full",
    media: { type: "image", src: "img1.jpg", alt: "..." }
  },
  {
    type: "media-full",
    media: { type: "video", src: "v2.mov", alt: "..." }
  }
]
```

### Example 2: Mixed Layout
```javascript
blocks: [
  {
    type: "media-full",
    media: { type: "video", src: "hero.mov", alt: "Hero video" }
  },
  {
    type: "caption",
    content: "The system uses real-time analysis to visualize data patterns."
  },
  {
    type: "two-column",
    items: [
      { type: "image", src: "detail1.jpg", alt: "Detail view" },
      { type: "image", src: "detail2.jpg", alt: "Another detail" }
    ]
  },
  {
    type: "caption",
    content: "Both images show different aspects of the interface design."
  },
  {
    type: "media-full",
    media: { type: "image", src: "final.jpg", alt: "Final result" }
  }
]
```

### Example 3: Text + Media Pairing
```javascript
blocks: [
  {
    type: "two-column",
    items: [
      {
        type: "text",
        content: "A detailed description of the design approach, methodology, or key insights from the project."
      },
      {
        type: "image",
        src: "supporting-image.jpg",
        alt: "Supporting visual"
      }
    ]
  }
]
```

---

## How to Use

### Step 1: Add `blocks` property to your project

In `projects-data.js`, add a `blocks` array to your project configuration:

```javascript
createProject({
  folder: "09-Project-Name",
  slug: "project-slug",
  title: "Project Title",
  // ... other properties ...
  blocks: [
    // Define your layout blocks here
  ]
})
```

### Step 2: Define your blocks

Compose your layout by defining blocks in the order you want them to appear:

```javascript
createProject({
  folder: "09-Admirari_Silva",
  slug: "admirari-silva",
  title: "Admirari Silva",
  // ... metadata ...
  media: [...], // Keep this for backwards compatibility/fallback
  blocks: [
    {
      type: "media-full",
      media: {
        type: "video",
        src: "filmati/intro.mov",
        alt: "Project introduction"
      }
    },
    {
      type: "caption",
      content: "This section introduces the core concept."
    },
    {
      type: "two-column",
      items: [
        {
          type: "image",
          src: "images/left.jpg",
          alt: "Left perspective"
        },
        {
          type: "text",
          content: "Explanation of the left image and design rationale."
        }
      ]
    }
  ]
})
```

### Step 3: Update media paths

All media paths are relative to the project folder (same as before).

---

## Responsive Behavior

### Desktop (> 1040px)
- Full-width media: 80-90vh height
- Two-column: side-by-side layout
- Two-column media: 60-70vh height

### Tablet (≤ 1040px)
- Full-width media: 56vh height
- Two-column: stacks vertically (1 column)
- Media: 56vh height

### Mobile (≤ 720px)
- Full-width media: 44vh height
- Two-column: single column
- Media: 44vh height

---

## CSS Classes for Styling

If you need custom styling for specific blocks:

```css
/* Full-width media blocks */
.layout-block--media-full { }
.media-container--full { }

/* Two-column blocks */
.layout-block--two-column { }
.two-column-grid { }
.column { }
.column--media { }
.column--text { }

/* Caption blocks */
.layout-block--caption { }
.caption-text { }

/* Media container */
.media-container { }
.media-container--column { }
```

---

## Backwards Compatibility

**Important:** If a project does NOT have a `blocks` property, the system automatically falls back to the legacy media grouping system. This means you can gradually migrate projects to the new system without breaking existing projects.

### What happens without `blocks`:
1. The `media` array is automatically grouped using the old logic
2. Layout is: full → pair → full → pair (automatic pattern)
3. Captions are attached to full-width media
4. No manual control over ordering

### Migration strategy:
- Projects without `blocks` use legacy system (unchanged behavior)
- Add `blocks` to a project when you want custom layout control
- No breaking changes to existing projects

---

## Advanced Usage

### Conditional blocks
You can dynamically construct blocks based on media properties:

```javascript
blocks: project.media.map((media) => ({
  type: "media-full",
  media: media
}))
```

### Reusing common patterns
Create helper functions for common block types:

```javascript
function captionBlock(text) {
  return { type: "caption", content: text };
}

function fullMediaBlock(media) {
  return { type: "media-full", media };
}

blocks: [
  fullMediaBlock(preview),
  captionBlock("Introduction"),
  // ... more blocks
]
```

---

## Summary

- **Full creative control** over project layout
- **Three block types** for composing flexible layouts
- **Modular and independent** blocks
- **Fully responsive** across all screen sizes
- **Backwards compatible** with existing projects
- **No hardcoded structures** or predefined patterns
