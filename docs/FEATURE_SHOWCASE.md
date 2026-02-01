# Feature Showcase: Learnable Embeddings in Action

## Live Demo Features

This document describes the adaptive features you'll see when running the application.

### 1. Time-of-Day Adaptation (Circadian Design)

**What you'll see:**
- Run the app at different times of day to see color adaptation
- **Night (10 PM - 6 AM)**: Warmer colors, reduced brightness, softer edges
- **Morning (6 AM - 10 AM)**: Brighter colors, faster animations, sharper focus
- **Day/Evening**: Standard balanced presentation

**How to test:**
```typescript
// Simulate different times in browser console:
const canvas = window.__livingCanvas;
canvas.updateContext({ timeOfDay: 23 }); // Simulate night
canvas.updateContext({ timeOfDay: 8 });  // Simulate morning
```

### 2. Scroll-Based Adaptation

**What you'll see:**
- Start at the top: Full animations and effects
- Scroll halfway: Slight reduction in animation speed
- Scroll to bottom: Reduced animations (fatigue prevention)

**Technical detail:**
- Animations reduce by 20% at >50% scroll
- Prevents visual fatigue during long sessions

### 3. Section-Specific Styling

**What you'll see:**
Each section adapts its patterns:

- **Hero Section**: Bold, prominent patterns with larger scale
- **Products**: Clean, focused presentation with reduced blur
- **News**: Standard balanced styling
- **Testimonials**: Warmer color tones for trust
- **Stats**: Professional, neutral presentation
- **Footer**: Subtle, understated styling

**How it works:**
Uses `AdaptiveSection` component with automatic section tracking via IntersectionObserver.

### 4. Interaction State Changes

**What you'll see:**
Hover over interactive elements to see:
- **Idle → Hover**: Slight scale increase (1.05x), faster animations
- **Hover → Active**: Larger scale (1.1x), increased opacity
- **Focus state**: Reduced blur for clarity

**Try it on:**
- Product cards
- Navigation links
- Buttons
- Interactive elements

### 5. Responsive Adaptation

**What you'll see:**
Resize your browser window:
- **Mobile (<768px)**: Simplified patterns, reduced blur, slower animations
- **Desktop (≥768px)**: Full pattern complexity and effects

**Technical detail:**
- Mobile: 30% less blur, 10% slower animations, 5% smaller scale
- Optimizes for mobile performance and clarity

### 6. Adaptive Accent Colors

**What you'll see:**
The RegimA Zone signature cyan color (#41cde0) adapts based on:
- Context (section, time, interaction)
- Learning from user interactions
- Ambient theme preferences

**Where to see it:**
- Main tagline: "Products That Change Lives"
- Section dividers
- Key terms: "AESTHETICS" and "SKIN HEALTH"
- Product section headers
- Interactive hover states

### 7. Pattern Embeddings

**What's happening behind the scenes:**

Every visual pattern is encoded as a learnable embedding:
```typescript
{
  primaryColor: [0, 8, 44],      // RegimA dark blue
  secondaryColor: [65, 205, 224], // RegimA cyan
  gradientDirection: 135,          // Diagonal gradient
  animationSpeed: 0.5,             // Half-second transitions
  opacity: 1.0,                    // Full opacity
  blur: 0,                         // No blur
  scale: 1.0                       // Normal scale
}
```

The neural network adapts these values based on context:
- Time of day → Adjusts colors and blur
- Scroll position → Modifies animation speed
- Viewport size → Changes scale and complexity
- Section → Customizes all parameters
- Interaction → Enhances scale and opacity

### 8. Learning System (Advanced)

**What it does:**
The system learns from user interactions:

```typescript
// Record positive interaction
recordInteraction(1.0);  // User clicked, engaged

// Record negative interaction
recordInteraction(-1.0); // User ignored, bounced
```

**How to see it:**
1. Open browser DevTools console
2. Type: `window.__livingCanvas?.getStats()`
3. See adaptation statistics:
   - Total adaptations
   - Section distribution
   - Interaction states
   - Average scroll position
   - Average time of day

### 9. Parameter Persistence

**What it does:**
Learned parameters are automatically saved to localStorage and restored on next visit.

**How to test:**
1. Use the app for a while (scroll, interact, navigate)
2. Close the browser
3. Reopen: Parameters are restored
4. To reset: `localStorage.removeItem('livingCanvasParams')`

### 10. CSS Custom Properties

**What's generated:**
The system generates CSS custom properties you can inspect:

```css
--pattern-primary: rgb(0, 8, 44);
--pattern-secondary: rgb(65, 205, 224);
--pattern-gradient-angle: 135deg;
--pattern-animation-speed: 0.5s;
--pattern-opacity: 1;
--pattern-blur: 0px;
--pattern-scale: 1;
```

**How to see:**
Inspect any element with adaptive styling in DevTools.

## Code Examples

### Using Adaptive Components

```typescript
// Adaptive section with tracking
<AdaptiveSection sectionName="products">
  <h2>Our Products</h2>
  <ProductGrid />
</AdaptiveSection>

// Adaptive accent color
<h1>
  Welcome to <AdaptiveAccent>RegimA Zone</AdaptiveAccent>
</h1>

// Interactive element with learning
<AdaptiveInteractive recordFeedback={true}>
  <button>Learn More</button>
</AdaptiveInteractive>
```

### Using Hooks

```typescript
function CustomComponent() {
  const { 
    currentPattern, 
    getPatternCSS,
    setSection,
    recordInteraction 
  } = useLivingCanvas();
  
  return (
    <div style={getPatternCSS()}>
      {/* Your content */}
    </div>
  );
}
```

### Manual Pattern Rendering

```typescript
import { getLivingCanvas } from './canvas';

const canvas = getLivingCanvas();

// Get current context
const context = canvas.getContext();

// Render pattern
const basePattern = { /* ... */ };
const adapted = canvas.renderPattern(basePattern);

// Get CSS
const css = canvas.getPatternCSS(adapted);
```

## Performance Metrics

Monitor the system in production:

```typescript
const canvas = getLivingCanvas();

// Get statistics
const stats = canvas.getStats();
console.log('Adaptations:', stats.count);
console.log('Sections:', stats.sections);
console.log('States:', stats.states);

// Export parameters (for backup/analysis)
const params = canvas.network.exportParameters();
console.log('Learned parameters:', params);
```

## Browser Console Access

For debugging and exploration:

```javascript
// Access global instance
window.__livingCanvas = getLivingCanvas();

// Test different contexts
window.__livingCanvas.setSection('hero');
window.__livingCanvas.setInteractionState('hover');

// View current pattern
console.log(window.__livingCanvas.currentPattern);

// Force save
window.__livingCanvas.save();

// Force load
window.__livingCanvas.load();
```

## What Makes This Special

This is not just CSS variables or theme switching. This is:

1. **Neural Network-Based**: Real learnable embeddings in continuous vector space
2. **Context-Aware**: Multi-factor environmental consideration
3. **Evidence-Based**: Adaptation rules grounded in UX research
4. **Self-Learning**: Can improve from user interactions
5. **Persistent**: Remembers patterns across sessions
6. **Scientific**: Follows RegimA Zone's commitment to evidence and excellence

Enjoy exploring the living canvas! 🎨🧠✨
