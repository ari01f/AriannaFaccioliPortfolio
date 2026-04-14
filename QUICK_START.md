# Quick Start: Block-Based Layout System

## 3-Minute Setup

### Step 1: Copy the pattern

Open `projects-data.js` and locate your project:

```javascript
createProject({
  folder: "09-Your-Project",
  slug: "your-project",
  title: "Your Project",
  // ... other properties ...
  media: [ /* your existing media */ ],
  // ADD THIS:
  blocks: [
    // Your blocks go here
  ]
})
```

### Step 2: Add your blocks

Replace the `blocks` array with your desired layout:

#### Full-width video:
```javascript
blocks: [
  {
    type: "media-full",
    media: {
      type: "video",
      src: "filmati/my-video.mov",
      alt: "Video description"
    }
  }
]
```

#### Full-width image:
```javascript
{
  type: "media-full",
  media: {
    type: "image",
    src: "images/my-image.jpg",
    alt: "Image description"
  }
}
```

#### Add a caption:
```javascript
{
  type: "caption",
  content: "Explanation of the media above"
}
```

#### Two-column layout (image + text):
```javascript
{
  type: "two-column",
  items: [
    {
      type: "image",
      src: "images/left.jpg",
      alt: "Left image"
    },
    {
      type: "text",
      content: "Text content for right column"
    }
  ]
}
```

### Step 3: Combine blocks

Stack them in any order:

```javascript
blocks: [
  {
    type: "media-full",
    media: { type: "video", src: "filmati/hero.mov", alt: "..." }
  },
  {
    type: "caption",
    content: "This is the hero section"
  },
  {
    type: "two-column",
    items: [
      { type: "image", src: "images/detail1.jpg", alt: "..." },
      { type: "text", content: "Explanation text" }
    ]
  },
  {
    type: "media-full",
    media: { type: "image", src: "images/final.jpg", alt: "..." }
  }
]
```

## Real Example

From "Prompted Identities":

```javascript
blocks: [
  {
    type: "media-full",
    media: {
      type: "video",
      src: "filmati/similarity_x2.mov",
      alt: "Interface similarity view"
    }
  },
  {
    type: "caption",
    content: "Users explore clusters and compare models with dimensional analysis"
  },
  {
    type: "media-full",
    media: {
      type: "video",
      src: "workinprogress/ANTEPRIMA.mp4",
      alt: "Interface preview"
    }
  }
]
```

## Important Notes

1. **Media paths are relative to the project folder** (same as before)
2. **Media always fills its container** with cover cropping
3. **Two columns stack on mobile** (< 1040px)
4. **Keep `media` array** even if using `blocks` (for backwards compatibility)
5. **Blocks render in the order you define them**

## Preview Your Changes

After editing `projects-data.js`, reload the project page in your browser to see the new layout.

## Troubleshooting

- **Layout not showing?** Make sure media paths start from your project folder
- **Responsive not working?** Check browser window size changes at 1040px and 720px
- **Old layout showing?** Blocks take precedence - remove `blocks` to use legacy media array
- **Path errors?** Use relative paths from project folder, no leading slash

## Advanced

See `LAYOUT_SYSTEM.md` for:
- Detailed block specifications
- CSS class customization
- Responsive breakpoints
- Migration guide
