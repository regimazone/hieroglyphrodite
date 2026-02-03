/**
 * Ambient Intelligence Type Definitions
 * 
 * Defines interfaces and types for Phase 1: Ambient Intelligence
 * Aligns with RegimA Zone's scientific integrity and Zone Concept principles
 */

/**
 * Base interface for all context sensors
 */
export interface ContextSensor<T> {
  initialize(): Promise<void>;
  getCurrentValue(): T;
  isAvailable(): boolean;
  cleanup(): void;
}

/**
 * Attention metrics derived from user behavior patterns
 */
export interface AttentionMetrics {
  focusScore: number;        // 0-1: Page visibility and focus
  cognitiveLoad: number;     // 0-1: Estimated from interaction patterns
  fatigueLevel: number;      // 0-1: Based on time and scroll patterns
  idleTime: number;          // Milliseconds since last interaction
  scrollVelocity: number;    // Pixels per second
}

/**
 * Network quality metrics
 */
export interface NetworkMetrics {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  downlink: number;          // Mbps
  rtt: number;               // Round-trip time in ms
  saveData: boolean;         // User preference for reduced data usage
}

/**
 * Aggregated ambient context from all sensors
 */
export interface AmbientContext {
  ambientLight: number;      // Lux (0-100000)
  attention: AttentionMetrics;
  network: NetworkMetrics;
  timestamp: number;
}

/**
 * Enhanced contextual keys including ambient intelligence
 */
export interface EnhancedContextualKeys {
  // Existing context (from base system)
  theme: 'light' | 'dark';
  timeOfDay: number;         // 0-23
  scrollPosition: number;    // 0-1
  viewportWidth: number;
  viewportHeight: number;
  userActivity: number;      // 0-1
  section: string;
  interactionState: 'idle' | 'hover' | 'active' | 'focus';
  
  // Ambient intelligence enhancements
  ambientLight?: number;
  attentionScore?: number;
  cognitiveLoad?: number;
  fatigueLevel?: number;
  networkQuality?: string;
}

/**
 * Context prediction result with confidence scoring
 */
export interface ContextPrediction {
  context: EnhancedContextualKeys;
  confidence: number;        // 0-1
  horizon: number;           // Prediction time horizon in ms
  timestamp: number;
}

/**
 * Temporal pattern for hourly behavior learning
 */
export interface TemporalPattern {
  hour: number;
  patterns: Map<string, number>;  // Feature -> average value
  sampleCount: number;
}

/**
 * Sensor configuration options
 */
export interface SensorConfig {
  updateInterval?: number;    // Sensor update frequency in ms
  enableFallback?: boolean;   // Use fallback values if API unavailable
  debug?: boolean;           // Enable debug logging
}
