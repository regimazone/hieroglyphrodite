/**
 * Context Predictor
 * 
 * Predicts future context based on temporal patterns and behavioral learning
 * Uses sliding window history and hourly pattern recognition
 * 
 * Zone Concept Alignment:
 * - 🔵 Anti-Inflammatory: Proactive adaptation prevents jarring transitions
 * - 🟢 Anti-Oxidant: Evidence-based prediction with confidence scoring
 * - 🟡 Rejuvenation: Continuous learning and improvement
 */

import {
  EnhancedContextualKeys,
  ContextPrediction,
  TemporalPattern,
  SensorConfig,
} from '../types';

export class ContextPredictor {
  private contextHistory: EnhancedContextualKeys[] = [];
  private maxHistorySize = 1000; // Keep last 1000 contexts (~16 minutes at 1Hz)
  private hourlyPatterns: Map<number, TemporalPattern> = new Map();
  private config: SensorConfig;

  constructor(config: SensorConfig = {}) {
    this.config = {
      updateInterval: 1000,
      enableFallback: true,
      debug: false,
      ...config,
    };

    // Initialize hourly patterns for 24 hours
    for (let hour = 0; hour < 24; hour++) {
      this.hourlyPatterns.set(hour, {
        hour,
        patterns: new Map(),
        sampleCount: 0,
      });
    }
  }

  /**
   * Record a context observation
   */
  recordContext(context: EnhancedContextualKeys): void {
    // Add to history
    this.contextHistory.push({
      ...context,
    });

    // Maintain history size limit
    if (this.contextHistory.length > this.maxHistorySize) {
      this.contextHistory.shift();
    }

    // Update hourly patterns
    this.updateHourlyPattern(context);

    if (this.config.debug && this.contextHistory.length % 100 === 0) {
      console.log(`[ContextPredictor] Recorded ${this.contextHistory.length} contexts`);
    }
  }

  /**
   * Update hourly pattern statistics
   */
  private updateHourlyPattern(context: EnhancedContextualKeys): void {
    const hour = context.timeOfDay;
    const pattern = this.hourlyPatterns.get(hour);

    if (!pattern) return;

    // Update running averages for each feature
    const features: Array<keyof EnhancedContextualKeys> = [
      'scrollPosition',
      'viewportWidth',
      'viewportHeight',
      'userActivity',
      'ambientLight',
      'attentionScore',
      'cognitiveLoad',
      'fatigueLevel',
    ];

    features.forEach(feature => {
      const value = context[feature];
      if (typeof value === 'number') {
        const currentAvg = pattern.patterns.get(feature as string) || 0;
        const newAvg = (currentAvg * pattern.sampleCount + value) / (pattern.sampleCount + 1);
        pattern.patterns.set(feature as string, newAvg);
      }
    });

    // Update theme frequency (most common theme for this hour)
    const themeKey = `theme_${context.theme}`;
    const themeCount = pattern.patterns.get(themeKey) || 0;
    pattern.patterns.set(themeKey, themeCount + 1);

    pattern.sampleCount++;
  }

  /**
   * Predict context at a future time horizon
   */
  predictContext(horizonMs: number): ContextPrediction {
    const now = Date.now();
    const futureTime = now + horizonMs;
    const futureDate = new Date(futureTime);
    const futureHour = futureDate.getHours();

    // Get most recent context as base
    const recentContext = this.contextHistory[this.contextHistory.length - 1];

    if (!recentContext) {
      // No history yet, return current time-based prediction with low confidence
      return {
        context: this.getDefaultContext(futureHour),
        confidence: 0.1,
        horizon: horizonMs,
        timestamp: now,
      };
    }

    // Calculate prediction confidence
    const confidence = this.calculateConfidence(horizonMs);

    // Short-term prediction (< 30 seconds): Use recent trends
    if (horizonMs < 30000) {
      const predicted = this.predictShortTerm(recentContext, horizonMs);
      return {
        context: predicted,
        confidence: confidence * 0.9, // High confidence for short-term
        horizon: horizonMs,
        timestamp: now,
      };
    }

    // Long-term prediction (> 30 seconds): Use hourly patterns
    const predicted = this.predictLongTerm(recentContext, futureHour);
    return {
      context: predicted,
      confidence: confidence * 0.7, // Lower confidence for long-term
      horizon: horizonMs,
      timestamp: now,
    };
  }

  /**
   * Short-term prediction based on recent trends
   */
  private predictShortTerm(
    recentContext: EnhancedContextualKeys,
    horizonMs: number
  ): EnhancedContextualKeys {
    // For short-term, assume context is relatively stable
    // with small adjustments based on trends

    const predicted = { ...recentContext };

    // Analyze recent trend if we have enough history
    if (this.contextHistory.length >= 5) {
      const recentContexts = this.contextHistory.slice(-5);

      // Calculate scroll velocity trend
      const scrollPositions = recentContexts.map(c => c.scrollPosition);
      const scrollTrend = this.calculateTrend(scrollPositions);
      
      // Extrapolate scroll position
      const timeRatio = horizonMs / 10000; // Normalize to 10 seconds
      predicted.scrollPosition = Math.max(
        0,
        Math.min(1, recentContext.scrollPosition + scrollTrend * timeRatio)
      );

      // Predict fatigue (gradually increases)
      if (recentContext.fatigueLevel !== undefined) {
        predicted.fatigueLevel = Math.min(
          1.0,
          recentContext.fatigueLevel + (timeRatio * 0.01)
        );
      }
    }

    return predicted;
  }

  /**
   * Long-term prediction based on hourly patterns
   */
  private predictLongTerm(
    recentContext: EnhancedContextualKeys,
    futureHour: number
  ): EnhancedContextualKeys {
    const pattern = this.hourlyPatterns.get(futureHour);

    if (!pattern || pattern.sampleCount < 5) {
      // Not enough data, use recent context with time-based adjustments
      return this.applyTimeBasedAdjustments(recentContext, futureHour);
    }

    // Use learned patterns
    const predicted: EnhancedContextualKeys = {
      ...recentContext,
      timeOfDay: futureHour,
    };

    // Apply learned patterns
    predicted.scrollPosition = pattern.patterns.get('scrollPosition') || recentContext.scrollPosition;
    predicted.userActivity = pattern.patterns.get('userActivity') || recentContext.userActivity;
    predicted.ambientLight = pattern.patterns.get('ambientLight');
    predicted.attentionScore = pattern.patterns.get('attentionScore');
    predicted.cognitiveLoad = pattern.patterns.get('cognitiveLoad');
    predicted.fatigueLevel = pattern.patterns.get('fatigueLevel');

    // Predict theme based on most common for this hour
    const darkCount = pattern.patterns.get('theme_dark') || 0;
    const lightCount = pattern.patterns.get('theme_light') || 0;
    predicted.theme = darkCount > lightCount ? 'dark' : 'light';

    return predicted;
  }

  /**
   * Apply time-based adjustments when pattern data is unavailable
   */
  private applyTimeBasedAdjustments(
    context: EnhancedContextualKeys,
    hour: number
  ): EnhancedContextualKeys {
    const adjusted = { ...context, timeOfDay: hour };

    // Evidence-based circadian adjustments
    if (hour >= 6 && hour < 18) {
      adjusted.theme = 'light';
      adjusted.ambientLight = 500 + Math.sin((hour - 6) / 12 * Math.PI) * 500;
    } else {
      adjusted.theme = 'dark';
      adjusted.ambientLight = 50 + Math.random() * 50;
    }

    return adjusted;
  }

  /**
   * Calculate prediction confidence based on history and horizon
   */
  private calculateConfidence(horizonMs: number): number {
    // Confidence decreases with prediction horizon
    const horizonSeconds = horizonMs / 1000;
    const horizonFactor = Math.max(0, 1 - horizonSeconds / 60); // Drops to 0 at 60 seconds

    // Confidence increases with history size
    const historyFactor = Math.min(1, this.contextHistory.length / 100);

    // Combined confidence
    return horizonFactor * 0.7 + historyFactor * 0.3;
  }

  /**
   * Calculate trend from a series of values
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    // Simple linear regression
    const n = values.length;
    const indices = Array.from({ length: n }, (_, i) => i);

    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
    const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    return slope;
  }

  /**
   * Get default context for a given hour
   */
  private getDefaultContext(hour: number): EnhancedContextualKeys {
    return {
      theme: hour >= 6 && hour < 18 ? 'light' : 'dark',
      timeOfDay: hour,
      scrollPosition: 0,
      viewportWidth: 1920,
      viewportHeight: 1080,
      userActivity: 0.5,
      section: 'hero',
      interactionState: 'idle',
      ambientLight: hour >= 6 && hour < 18 ? 500 : 100,
      attentionScore: 1.0,
      cognitiveLoad: 0.0,
      fatigueLevel: 0.0,
      networkQuality: '4g',
    };
  }

  /**
   * Get learning statistics
   */
  getStats(): {
    historySize: number;
    patternsLearned: number;
    totalSamples: number;
  } {
    let totalSamples = 0;
    this.hourlyPatterns.forEach(pattern => {
      totalSamples += pattern.sampleCount;
    });

    return {
      historySize: this.contextHistory.length,
      patternsLearned: this.hourlyPatterns.size,
      totalSamples,
    };
  }

  /**
   * Clear all learned patterns (useful for testing)
   */
  reset(): void {
    this.contextHistory = [];
    
    for (let hour = 0; hour < 24; hour++) {
      this.hourlyPatterns.set(hour, {
        hour,
        patterns: new Map(),
        sampleCount: 0,
      });
    }

    if (this.config.debug) {
      console.log('[ContextPredictor] Reset all patterns');
    }
  }
}
