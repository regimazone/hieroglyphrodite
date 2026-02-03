/**
 * Ambient Light Sensor
 * 
 * Detects ambient light levels using the Ambient Light Sensor API
 * Falls back to time-based estimation if API unavailable
 * 
 * Zone Concept Alignment:
 * - 🔵 Anti-Inflammatory: Adjusts display brightness to reduce eye strain
 * - 🟢 Anti-Oxidant: Evidence-based circadian rhythm support
 */

import { ContextSensor, SensorConfig } from '../types';

export class AmbientLightSensor implements ContextSensor<number> {
  private sensor: any | null = null;
  private currentValue: number = 500; // Default: moderate indoor lighting
  private available: boolean = false;
  private config: SensorConfig;

  constructor(config: SensorConfig = {}) {
    this.config = {
      updateInterval: 1000,
      enableFallback: true,
      debug: false,
      ...config,
    };
  }

  async initialize(): Promise<void> {
    try {
      // Check if Ambient Light Sensor API is available
      if ('AmbientLightSensor' in window) {
        const AmbientLightSensor = (window as any).AmbientLightSensor;
        
        this.sensor = new AmbientLightSensor({ frequency: 1 });
        
        this.sensor.addEventListener('reading', () => {
          this.currentValue = this.sensor.illuminance;
          if (this.config.debug) {
            console.log(`[AmbientLightSensor] Reading: ${this.currentValue} lux`);
          }
        });

        this.sensor.addEventListener('error', (event: any) => {
          console.warn('[AmbientLightSensor] Error:', event.error);
          this.fallbackToTimeBasedEstimation();
        });

        await this.sensor.start();
        this.available = true;
        
        if (this.config.debug) {
          console.log('[AmbientLightSensor] Initialized successfully');
        }
      } else {
        throw new Error('Ambient Light Sensor API not available');
      }
    } catch (error) {
      console.warn('[AmbientLightSensor] API unavailable, using fallback');
      this.fallbackToTimeBasedEstimation();
    }
  }

  /**
   * Fallback: Estimate ambient light based on time of day
   * Based on circadian rhythm research
   */
  private fallbackToTimeBasedEstimation(): void {
    if (!this.config.enableFallback) {
      return;
    }

    this.available = false;
    
    // Update estimation every minute
    const updateEstimation = () => {
      const hour = new Date().getHours();
      
      // Evidence-based light level estimation (lux)
      if (hour >= 6 && hour < 8) {
        // Dawn: 100-400 lux
        this.currentValue = 100 + (hour - 6) * 150;
      } else if (hour >= 8 && hour < 18) {
        // Daytime: 400-1000 lux (indoor office)
        this.currentValue = 400 + Math.sin((hour - 8) / 10 * Math.PI) * 600;
      } else if (hour >= 18 && hour < 21) {
        // Evening: 100-400 lux
        this.currentValue = 400 - (hour - 18) * 100;
      } else {
        // Night: 50-100 lux (artificial light)
        this.currentValue = 50 + Math.random() * 50;
      }

      if (this.config.debug) {
        console.log(`[AmbientLightSensor] Fallback estimation: ${this.currentValue} lux`);
      }
    };

    updateEstimation();
    setInterval(updateEstimation, 60000); // Update every minute
  }

  getCurrentValue(): number {
    return this.currentValue;
  }

  isAvailable(): boolean {
    return this.available;
  }

  cleanup(): void {
    if (this.sensor) {
      try {
        this.sensor.stop();
      } catch (error) {
        console.warn('[AmbientLightSensor] Cleanup error:', error);
      }
      this.sensor = null;
    }
  }
}
