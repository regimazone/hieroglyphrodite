/**
 * Tests for Ambient Intelligence Components
 * 
 * Tests sensor functionality, context prediction, and integration
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SensorManager } from '../sensors/SensorManager';
import { ContextPredictor } from '../predictive/ContextPredictor';
import { EnhancedContextualKeys } from '../types';

describe('SensorManager', () => {
  let sensorManager: SensorManager;

  beforeEach(async () => {
    sensorManager = new SensorManager({ debug: false });
    // Mock browser APIs
    global.window = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      scrollY: 0,
      innerWidth: 1920,
      innerHeight: 1080,
      matchMedia: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    } as any;

    global.document = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      hidden: false,
      documentElement: {
        scrollHeight: 2000,
      },
    } as any;

    global.navigator = {
      connection: undefined,
    } as any;

    await sensorManager.initialize();
  });

  afterEach(() => {
    sensorManager.cleanup();
  });

  it('should initialize successfully', () => {
    expect(sensorManager).toBeDefined();
  });

  it('should aggregate multi-modal sensor data', () => {
    const context = sensorManager.getContext();

    expect(context).toHaveProperty('ambientLight');
    expect(context).toHaveProperty('attention');
    expect(context).toHaveProperty('network');
    expect(context).toHaveProperty('timestamp');
    
    expect(context.ambientLight).toBeGreaterThanOrEqual(0);
    expect(context.attention.focusScore).toBeGreaterThanOrEqual(0);
    expect(context.attention.focusScore).toBeLessThanOrEqual(1);
  });

  it('should report sensor status', () => {
    const status = sensorManager.getSensorStatus();

    expect(status).toHaveProperty('light');
    expect(status).toHaveProperty('attention');
    expect(status).toHaveProperty('network');
  });
});

describe('ContextPredictor', () => {
  let predictor: ContextPredictor;

  beforeEach(() => {
    predictor = new ContextPredictor({ debug: false });
  });

  it('should record context observations', () => {
    const context: EnhancedContextualKeys = {
      theme: 'light',
      timeOfDay: 12,
      scrollPosition: 0.5,
      viewportWidth: 1920,
      viewportHeight: 1080,
      userActivity: 0.5,
      section: 'hero',
      interactionState: 'idle',
      ambientLight: 500,
      attentionScore: 1.0,
      cognitiveLoad: 0.3,
      fatigueLevel: 0.2,
      networkQuality: '4g',
    };

    predictor.recordContext(context);
    const stats = predictor.getStats();

    expect(stats.historySize).toBe(1);
    expect(stats.totalSamples).toBe(1);
  });

  it('should predict future context with confidence', () => {
    // Record some context history
    for (let i = 0; i < 10; i++) {
      predictor.recordContext({
        theme: 'light',
        timeOfDay: 12 + i,
        scrollPosition: i * 0.1,
        viewportWidth: 1920,
        viewportHeight: 1080,
        userActivity: 0.5,
        section: 'hero',
        interactionState: 'idle',
        ambientLight: 500,
        attentionScore: 1.0,
        cognitiveLoad: 0.3,
        fatigueLevel: 0.2,
        networkQuality: '4g',
      });
    }

    // Predict 10 seconds ahead
    const prediction = predictor.predictContext(10000);

    expect(prediction).toHaveProperty('context');
    expect(prediction).toHaveProperty('confidence');
    expect(prediction).toHaveProperty('horizon');
    expect(prediction).toHaveProperty('timestamp');
    
    expect(prediction.confidence).toBeGreaterThanOrEqual(0);
    expect(prediction.confidence).toBeLessThanOrEqual(1);
    expect(prediction.horizon).toBe(10000);
  });

  it('should learn hourly patterns', () => {
    // Simulate daytime activity (hour 14)
    for (let i = 0; i < 10; i++) {
      predictor.recordContext({
        theme: 'light',
        timeOfDay: 14,
        scrollPosition: Math.random(),
        viewportWidth: 1920,
        viewportHeight: 1080,
        userActivity: 0.8,
        section: 'hero',
        interactionState: 'idle',
        ambientLight: 800,
        attentionScore: 0.9,
        cognitiveLoad: 0.4,
        fatigueLevel: 0.3,
        networkQuality: '4g',
      });
    }

    const stats = predictor.getStats();
    expect(stats.totalSamples).toBe(10);
    expect(stats.historySize).toBe(10);

    // Predict for the learned hour
    const prediction = predictor.predictContext(1000);
    expect(prediction.context.theme).toBe('light');
  });

  it('should handle short-term prediction with trends', () => {
    // Create scroll trend
    for (let i = 0; i < 5; i++) {
      predictor.recordContext({
        theme: 'light',
        timeOfDay: 12,
        scrollPosition: i * 0.2,
        viewportWidth: 1920,
        viewportHeight: 1080,
        userActivity: 0.5,
        section: 'hero',
        interactionState: 'idle',
        ambientLight: 500,
        attentionScore: 1.0,
        cognitiveLoad: 0.3,
        fatigueLevel: 0.2,
        networkQuality: '4g',
      });
    }

    const prediction = predictor.predictContext(5000); // 5 seconds
    
    // Should extrapolate scroll position
    expect(prediction.context.scrollPosition).toBeGreaterThanOrEqual(0);
    expect(prediction.context.scrollPosition).toBeLessThanOrEqual(1);
  });

  it('should reset patterns', () => {
    predictor.recordContext({
      theme: 'light',
      timeOfDay: 12,
      scrollPosition: 0.5,
      viewportWidth: 1920,
      viewportHeight: 1080,
      userActivity: 0.5,
      section: 'hero',
      interactionState: 'idle',
    });

    let stats = predictor.getStats();
    expect(stats.historySize).toBe(1);

    predictor.reset();
    stats = predictor.getStats();
    expect(stats.historySize).toBe(0);
    expect(stats.totalSamples).toBe(0);
  });
});
