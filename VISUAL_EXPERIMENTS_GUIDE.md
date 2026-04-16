# Visual Experiments Draggable Page

## Overview
A new interactive "Visual Experiments" page with free, draggable layout. Users can move experiment items around the canvas, creating an exploratory, workspace-like experience.

## Files Created/Modified

### 1. **visual-experiments.html** (Modified)
- Updated page structure with cleaner semantic markup
- Added `.page-visual-experiments` body class
- Included new CSS file: `visual-experiments-draggable.css`
- Uses `floating-labels` structure consistent with main portfolio
- Simplified from project-based layout to canvas-based

### 2. **assets/css/visual-experiments-draggable.css** (New)
Scoped styling for the draggable canvas page:
- `.visual-experiments-canvas`: Main container with responsive padding
- `.draggable-item`: Individual items with absolute positioning, grab cursor
- `.draggable-item-media`: Responsive media container
- `.draggable-item-description`: Small serif text below each item
- Hover/drag states for visual feedback
- Responsive breakpoints for tablets/mobile

### 3. **assets/js/drag.js** (New)
Core dragging functionality:
- `initDraggableItems()`: Main initialization function
- Position persistence using `localStorage`
- Initial loose grid layout with subtle randomization
- Mouse and touch support (mobile-friendly)
- Smooth dragging with viewport constraints
- Z-index management (dragged items come to front)
- `clearSavedPositions()`: Utility to reset layout

### 4. **assets/js/render.js** (Modified)
Added new export function:
- `renderDraggableVisualExperiments()`: Generates HTML for draggable items
- Each item includes media container and description
- Uses data attributes to track experiment IDs and positions

### 5. **assets/js/visual-experiments.js** (Modified)
Updated to use new draggable system:
- Imports `renderDraggableVisualExperiments` instead of grid version
- Imports and initializes `initDraggableItems`
- Sets up canvas and items container references

## Key Features

✓ **Free Positioning**: Items placed absolutely, users drag to reposition  
✓ **Position Persistence**: Saved to localStorage, positions restore on page reload  
✓ **Responsive**: Adapts to different screen sizes  
✓ **Touch Support**: Works on mobile devices  
✓ **Visual Feedback**: Grab cursor, hover states, active dragging styles  
✓ **Z-Index Management**: Dragged items appear on top  
✓ **Viewport Constrained**: Items can't be dragged outside canvas  
✓ **Default Web Aesthetic**: Minimal, consistent with portfolio style  

## Interaction UX

1. User hovers over item → cursor changes to grab
2. User clicks and drags → item follows cursor, shadow appears
3. User releases → item stays in new position, position saved
4. Page reload → positions restored from localStorage
5. Touch support on mobile for same interaction

## Layout Behavior

- Initial layout: loose grid with slight randomization for organic feel
- No strict alignment enforcement
- Ample breathing room between items
- Min height ensures scrollable canvas even with few items
- Responsive padding scales with viewport

## CSS Classes Structure

```
.page-visual-experiments
├── .floating-labels (existing global component)
├── main[data-visual-experiments]
    └── .visual-experiments-canvas
        ├── .visual-experiments-intro-section
        │   ├── h1
        │   └── p
        └── .draggable-items-container
            └── .draggable-item (×4)
                ├── .draggable-item-media
                │   └── img
                └── .draggable-item-description
```

## Data Persistence

Uses `localStorage` with key: `draggable_experiments_positions`

Format:
```json
{
  "experiment-01": { "x": 100, "y": 150 },
  "experiment-02": { "x": 300, "y": 200 },
  ...
}
```

## Browser Support

- Tested on modern browsers (Chrome, Firefox, Safari)
- Touch events for mobile/tablet
- LocalStorage required for position persistence
- Falls back to initial layout if localStorage unavailable

## Aesthetic Goals Achieved

✓ Feels intentionally different from main portfolio grid  
✓ Maintains visual minimalism (default web style)  
✓ Informal but not messy (loose but intentional)  
✓ Still readable and organized despite free positioning  
✓ Consistent typography, spacing, and visual language
