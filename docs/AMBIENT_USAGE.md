# Ambient Intelligence Usage Examples

This document demonstrates how to use the Phase 1 Ambient Intelligence features in your application.

## Basic Integration

The ambient intelligence system is automatically enabled when you use the `LivingCanvas`:

```typescript
import { getLivingCanvas } from './canvas';

// Get the living canvas instance (ambient intelligence enabled by default)
const canvas = getLivingCanvas();

// Check ambient intelligence status
const status = canvas.getAmbientStatus();
console.log('Ambient enabled:', status.enabled);
console.log('Sensors:', status.sensorStatus);
console.log('Predictor stats:', status.predictorStats);
```

## Accessing Sensor Data

You can access real-time sensor data through the SensorManager:

```typescript
import { SensorManager } from './ambient';

const sensorManager = new SensorManager({ debug: false });
await sensorManager.initialize();

// Get current ambient context
const context = sensorManager.getContext();

console.log('Ambient light:', context.ambientLight, 'lux');
console.log('Focus score:', context.attention.focusScore);
console.log('Cognitive load:', context.attention.cognitiveLoad);
console.log('Fatigue level:', context.attention.fatigueLevel);
console.log('Network type:', context.network.effectiveType);
console.log('Network RTT:', context.network.rtt, 'ms');
```

## Predictive Context

The ContextPredictor learns temporal patterns and predicts future context:

```typescript
import { ContextPredictor, EnhancedContextualKeys } from './ambient';

const predictor = new ContextPredictor({ debug: false });

// Record current context for learning
const currentContext: EnhancedContextualKeys = {
  theme: 'light',
  timeOfDay: 14,
  scrollPosition: 0.5,
  viewportWidth: 1920,
  viewportHeight: 1080,
  userActivity: 0.8,
  section: 'products',
  interactionState: 'idle',
  ambientLight: 750,
  attentionScore: 0.9,
  cognitiveLoad: 0.4,
  fatigueLevel: 0.3,
  networkQuality: '4g',
};

predictor.recordContext(currentContext);

// Predict context 10 seconds in the future
const prediction = predictor.predictContext(10000);

console.log('Predicted context:', prediction.context);
console.log('Confidence:', prediction.confidence);
console.log('Horizon:', prediction.horizon, 'ms');

// Get learning statistics
const stats = predictor.getStats();
console.log('History size:', stats.historySize);
console.log('Patterns learned:', stats.patternsLearned);
console.log('Total samples:', stats.totalSamples);
```

## Proactive Pattern Adaptation

The Living Canvas can prepare for predicted future contexts:

```typescript
import { getLivingCanvas } from './canvas';

const canvas = getLivingCanvas();

// Prepare for predicted context 10 seconds ahead
await canvas.prepareForFutureContext(10000);

// When prediction confidence is >70%, patterns are pre-computed and cached
// This enables seamless transitions when the predicted context arrives
```

## Sensor Configuration

You can customize sensor behavior with configuration options:

```typescript
import { AmbientLightSensor, AttentionSensor, NetworkSensor } from './ambient';

// Configure with custom options
const lightSensor = new AmbientLightSensor({
  updateInterval: 2000,  // Update every 2 seconds
  enableFallback: true,  // Use fallback when API unavailable
  debug: true,           // Enable debug logging
});

await lightSensor.initialize();
console.log('Current light level:', lightSensor.getCurrentValue());
console.log('API available:', lightSensor.isAvailable());
```

## Zone Concept Integration

The ambient intelligence system aligns with RegimA Zone's 3-sphere Zone Concept:

### 🔵 Anti-Inflammatory Features
```typescript
// Detect fatigue and adjust accordingly
const context = sensorManager.getContext();

if (context.attention.fatigueLevel > 0.7) {
  console.log('High fatigue detected - suggest break or simplify interface');
}

if (context.attention.idleTime > 120000) {
  console.log('User idle for 2+ minutes - reduce animations');
}
```

### 🟢 Anti-Oxidant Features
```typescript
// Evidence-based adaptation with confidence scoring
const prediction = predictor.predictContext(10000);

if (prediction.confidence > 0.8) {
  // High-confidence prediction - safe to adapt
  console.log('High-confidence prediction:', prediction.context);
} else {
  // Low confidence - maintain current state
  console.log('Low confidence, maintaining current context');
}
```

### 🟡 Rejuvenation Features
```typescript
// Learn from user patterns over time
predictor.recordContext(currentContext);

// Get insights into learned patterns
const stats = predictor.getStats();
console.log(`Learned from ${stats.totalSamples} observations`);
console.log(`Tracking patterns for ${stats.patternsLearned} hours`);
```

## Complete Example: Adaptive Dashboard

Here's a complete example showing how to create an adaptive dashboard:

```typescript
import { getLivingCanvas } from './canvas';
import { SensorManager } from './ambient';

class AdaptiveDashboard {
  private canvas = getLivingCanvas();
  private sensorManager: SensorManager;

  async initialize() {
    this.sensorManager = new SensorManager({ debug: false });
    await this.sensorManager.initialize();

    // Update dashboard every second
    setInterval(() => this.updateDashboard(), 1000);

    // Prepare for future context every 5 seconds
    setInterval(() => this.canvas.prepareForFutureContext(10000), 5000);
  }

  private updateDashboard() {
    const context = this.sensorManager.getContext();
    const status = this.canvas.getAmbientStatus();

    // Adapt UI based on ambient context
    if (context.attention.fatigueLevel > 0.7) {
      this.showFatigueWarning();
    }

    if (context.network.effectiveType === 'slow-2g' || context.network.effectiveType === '2g') {
      this.enableLowBandwidthMode();
    }

    if (context.ambientLight < 200) {
      this.suggestDarkMode();
    }

    // Display ambient intelligence status
    console.log('📊 Dashboard Update:', {
      light: `${context.ambientLight} lux`,
      attention: `${(context.attention.focusScore * 100).toFixed(0)}%`,
      fatigue: `${(context.attention.fatigueLevel * 100).toFixed(0)}%`,
      network: context.network.effectiveType,
      prediction: status.predictorStats,
    });
  }

  private showFatigueWarning() {
    console.log('⚠️ High fatigue detected - consider taking a break');
  }

  private enableLowBandwidthMode() {
    console.log('📶 Low bandwidth mode enabled');
  }

  private suggestDarkMode() {
    console.log('🌙 Low light detected - dark mode recommended');
  }
}

// Usage
const dashboard = new AdaptiveDashboard();
dashboard.initialize();
```

## Performance Considerations

The ambient intelligence system is designed for minimal performance impact:

- **Sensor aggregation**: 10 Hz (100ms intervals)
- **Context prediction**: On-demand with caching
- **Pattern learning**: Incremental, non-blocking
- **Memory footprint**: ~1000 context records in history buffer

All sensors include fallback mechanisms and graceful degradation when browser APIs are unavailable.

## Browser Compatibility

- **Ambient Light Sensor**: Limited support (Chrome with flag). Falls back to time-based estimation.
- **Page Visibility API**: Widely supported (all modern browsers)
- **Network Information API**: Chrome, Edge, Opera. Falls back to RTT-based estimation.
- **Scroll/Interaction Tracking**: Universal browser support

The system is designed to work in all modern browsers with progressive enhancement.
