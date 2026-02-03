/**
 * Network Sensor
 * 
 * Monitors network quality using the Network Information API
 * Falls back to connection speed estimation if API unavailable
 * 
 * Zone Concept Alignment:
 * - 🔵 Anti-Inflammatory: Adapts content delivery to prevent loading delays
 * - 🟢 Anti-Oxidant: Evidence-based bandwidth optimization
 */

import { ContextSensor, NetworkMetrics, SensorConfig } from '../types';

export class NetworkSensor implements ContextSensor<NetworkMetrics> {
  private metrics: NetworkMetrics = {
    effectiveType: 'unknown',
    downlink: 10, // Default: 10 Mbps
    rtt: 50,      // Default: 50ms
    saveData: false,
  };

  private connection: unknown = null;
  private available = false;
  private config: SensorConfig;

  constructor(config: SensorConfig = {}) {
    this.config = {
      updateInterval: 5000,
      enableFallback: true,
      debug: false,
      ...config,
    };
  }

  async initialize(): Promise<void> {
    try {
      // Check for Network Information API
      const nav = navigator as { connection?: unknown; mozConnection?: unknown; webkitConnection?: unknown };
      this.connection = nav.connection || nav.mozConnection || nav.webkitConnection;

      if (this.connection) {
        this.updateNetworkMetrics();
        
        // Listen for network changes
        this.connection.addEventListener('change', this.updateNetworkMetrics.bind(this));
        
        this.available = true;
        
        if (this.config.debug) {
          console.log('[NetworkSensor] Initialized successfully');
        }
      } else {
        throw new Error('Network Information API not available');
      }
    } catch (error) {
      console.warn('[NetworkSensor] API unavailable, using fallback');
      
      if (this.config.enableFallback) {
        this.fallbackToSpeedTest();
      }
    }
  }

  private updateNetworkMetrics(): void {
    if (!this.connection) return;

    // Map effective type
    const effectiveTypeMap: Record<string, NetworkMetrics['effectiveType']> = {
      'slow-2g': 'slow-2g',
      '2g': '2g',
      '3g': '3g',
      '4g': '4g',
    };

    this.metrics.effectiveType = effectiveTypeMap[this.connection.effectiveType] || 'unknown';
    this.metrics.downlink = this.connection.downlink || this.metrics.downlink;
    this.metrics.rtt = this.connection.rtt || this.metrics.rtt;
    this.metrics.saveData = this.connection.saveData || false;

    if (this.config.debug) {
      console.log('[NetworkSensor] Metrics:', this.metrics);
    }
  }

  /**
   * Fallback: Estimate network speed with simple latency test
   */
  private async fallbackToSpeedTest(): Promise<void> {
    this.available = false;

    const estimateSpeed = async () => {
      try {
        const startTime = performance.now();
        
        // Fetch a small resource to estimate latency
        // Use a cache-busting parameter to get fresh data
        await fetch('/?_network_test=' + Date.now(), {
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        const endTime = performance.now();
        const rtt = endTime - startTime;

        // Update RTT
        this.metrics.rtt = rtt;

        // Estimate effective type based on RTT
        // Research-based thresholds
        if (rtt > 2000) {
          this.metrics.effectiveType = 'slow-2g';
          this.metrics.downlink = 0.05;
        } else if (rtt > 1400) {
          this.metrics.effectiveType = '2g';
          this.metrics.downlink = 0.25;
        } else if (rtt > 270) {
          this.metrics.effectiveType = '3g';
          this.metrics.downlink = 1.5;
        } else {
          this.metrics.effectiveType = '4g';
          this.metrics.downlink = 10;
        }

        if (this.config.debug) {
          console.log(`[NetworkSensor] Fallback estimation - RTT: ${rtt}ms, Type: ${this.metrics.effectiveType}`);
        }
      } catch (error) {
        console.warn('[NetworkSensor] Speed test failed:', error);
      }
    };

    // Initial estimation
    await estimateSpeed();

    // Re-estimate periodically
    setInterval(estimateSpeed, this.config.updateInterval);
  }

  getCurrentValue(): NetworkMetrics {
    return { ...this.metrics };
  }

  isAvailable(): boolean {
    return this.available;
  }

  cleanup(): void {
    if (this.connection) {
      try {
        this.connection.removeEventListener('change', this.updateNetworkMetrics.bind(this));
      } catch (error) {
        console.warn('[NetworkSensor] Cleanup error:', error);
      }
      this.connection = null;
    }
  }
}
