# Learnable Feature Embeddings System

## Overview

This system implements **learnable sub-symbolic feature embeddings** for site patterns and symbols, enabling dynamic adaptation to contextual changes. It provides a "living canvas" that renders content in styles that adapt to user context, time of day, interaction state, and more.

## Architecture

### Core Components

#### 1. Neural Network Infrastructure (`src/nn/`)

Inspired by PyTorch's `torch.nn` module, provides foundational building blocks including Tensor operations, Module base class, Linear/Embedding layers, and activation functions (ReLU, Sigmoid, Tanh, Softmax).

#### 2. Feature Encoders (`src/embeddings/`)

Converts visual patterns, symbols, and context into learnable embeddings with PatternEncoder (colors, gradients, animations), SymbolEncoder (icons, shapes), and ContextEncoder (theme, time, scroll, viewport, section, interaction state).

#### 3. Adaptive Feature Network

The core learning system with context-aware attention, pattern adaptation, online learning from interactions, and evidence-based contextual rules including circadian alignment, scroll fatigue prevention, responsive optimization, and Zone Concept integration.

#### 4. Living Canvas (`src/canvas/`)

Renders adaptive content with context detection, pattern rendering, CSS generation, and React integration through hooks and providers.

## Integration Guide

### Step 1: Wrap Application
```typescript
import { LivingCanvasProvider } from './canvas';

function App() {
  return (
    <LivingCanvasProvider>
      {/* Your app */}
    </LivingCanvasProvider>
  );
}
```

### Step 2: Use Adaptive Components
```typescript
import { AdaptiveSection, AdaptiveAccent } from './components/AdaptiveComponents';

<AdaptiveSection sectionName="hero">
  <h1><AdaptiveAccent>RegimA Zone</AdaptiveAccent></h1>
</AdaptiveSection>
```

## Contextual Adaptation Rules

- **Time-based**: Circadian-aligned color warmth and brightness
- **Scroll-based**: Reduced animations at high scroll positions
- **Interaction**: Scale/opacity adjustments on hover/active/focus
- **Viewport**: Simplified patterns on mobile
- **Section-specific**: Zone Concept integration

## Scientific Foundation

Follows RegimA Zone principles: evidence-based design, holistic integration (3-sphere Zone Concept), professional excellence, and continuous innovation.

## API Reference

See full documentation for PatternFeatures, ContextualKeys, and LivingCanvas methods.
