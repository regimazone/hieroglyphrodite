/**
 * Sensor Manager
 * 
 * Orchestrates all ambient sensors and aggregates their data
 * Provides unified interface for accessing ambient context
 * 
 * Zone Concept Alignment:
 * - 🔵 Anti-Inflammatory: Centralized sensor management reduces complexity
 * - 🟢 Anti-Oxidant: Consistent data aggregation and validation
 * - 🟡 Rejuvenation: Modular design enables easy extension
 */

import { AmbientLightSensor } from './AmbientLightSensor';
import { AttentionSensor } from './AttentionSensor';
import { NetworkSensor } from './NetworkSensor';
import { ContextSensor, AmbientContext, SensorConfig } from '../types';

export class SensorManager {
  private sensors: Map<string, ContextSensor<unknown>> = new Map();
  private aggregatedContext: AmbientContext;
  private config: SensorConfig;
  private updateInterval: number;
  private aggregationTimer: NodeJS.Timeout | null = null;

  constructor(config: SensorConfig = {}) {
    this.config = {
      updateInterval: 100, // Aggregate at 10 Hz
      enableFallback: true,
      debug: false,
      ...config,
    };

    this.updateInterval = this.config.updateInterval || 100;

    // Initialize with default values
    this.aggregatedContext = {
      ambientLight: 500,
      attention: {
        focusScore: 1.0,
        cognitiveLoad: 0.0,
        fatigueLevel: 0.0,
        idleTime: 0,
        scrollVelocity: 0,
      },
      network: {
        effectiveType: 'unknown',
        downlink: 10,
        rtt: 50,
        saveData: false,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * Initialize all sensors
   */
  async initialize(): Promise<void> {
    try {
      // Create sensor instances
      const ambientLight = new AmbientLightSensor(this.config);
      const attention = new AttentionSensor(this.config);
      const network = new NetworkSensor(this.config);

      // Initialize all sensors in parallel
      await Promise.all([
        ambientLight.initialize(),
        attention.initialize(),
        network.initialize(),
      ]);

      // Store sensors
      this.sensors.set('light', ambientLight);
      this.sensors.set('attention', attention);
      this.sensors.set('network', network);

      // Start aggregation
      this.startAggregation();

      if (this.config.debug) {
        console.log('[SensorManager] Initialized with', this.sensors.size, 'sensors');
      }
    } catch (error) {
      console.error('[SensorManager] Initialization error:', error);
      throw error;
    }
  }

  /**
   * Start periodic aggregation of sensor data
   */
  private startAggregation(): void {
    this.aggregationTimer = setInterval(() => {
      this.aggregateContext();
    }, this.updateInterval);

    // Initial aggregation
    this.aggregateContext();
  }

  /**
   * Aggregate data from all sensors
   */
  private aggregateContext(): void {
    const lightSensor = this.sensors.get('light');
    const attentionSensor = this.sensors.get('attention');
    const networkSensor = this.sensors.get('network');

    this.aggregatedContext = {
      ambientLight: lightSensor?.getCurrentValue() ?? 500,
      attention: attentionSensor?.getCurrentValue() ?? {
        focusScore: 1.0,
        cognitiveLoad: 0.0,
        fatigueLevel: 0.0,
        idleTime: 0,
        scrollVelocity: 0,
      },
      network: networkSensor?.getCurrentValue() ?? {
        effectiveType: 'unknown',
        downlink: 10,
        rtt: 50,
        saveData: false,
      },
      timestamp: Date.now(),
    };

    if (this.config.debug && Date.now() % 5000 < this.updateInterval) {
      console.log('[SensorManager] Aggregated context:', {
        light: this.aggregatedContext.ambientLight,
        focus: this.aggregatedContext.attention.focusScore,
        fatigue: this.aggregatedContext.attention.fatigueLevel,
        network: this.aggregatedContext.network.effectiveType,
      });
    }
  }

  /**
   * Get current aggregated context
   */
  getContext(): AmbientContext {
    return { ...this.aggregatedContext };
  }

  /**
   * Get status of all sensors
   */
  getSensorStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    
    this.sensors.forEach((sensor, name) => {
      status[name] = sensor.isAvailable();
    });

    return status;
  }

  /**
   * Clean up all sensors
   */
  cleanup(): void {
    // Stop aggregation
    if (this.aggregationTimer) {
      clearInterval(this.aggregationTimer);
      this.aggregationTimer = null;
    }

    // Clean up all sensors
    this.sensors.forEach((sensor, name) => {
      try {
        sensor.cleanup();
      } catch (error) {
        console.warn(`[SensorManager] Error cleaning up sensor ${name}:`, error);
      }
    });

    this.sensors.clear();

    if (this.config.debug) {
      console.log('[SensorManager] Cleaned up all sensors');
    }
  }
}
