/**
 * Attention Sensor
 * 
 * Tracks user attention and cognitive load through behavioral patterns
 * Uses Page Visibility API, scroll patterns, and interaction tracking
 * 
 * Zone Concept Alignment:
 * - 🔵 Anti-Inflammatory: Detects fatigue and cognitive overload
 * - 🟡 Rejuvenation: Identifies optimal moments for adaptive rest
 */

import { ContextSensor, AttentionMetrics, SensorConfig } from '../types';

export class AttentionSensor implements ContextSensor<AttentionMetrics> {
  private metrics: AttentionMetrics = {
    focusScore: 1.0,
    cognitiveLoad: 0.0,
    fatigueLevel: 0.0,
    idleTime: 0,
    scrollVelocity: 0,
  };

  private available: boolean = false;
  private config: SensorConfig;
  
  // Tracking state
  private lastInteractionTime: number = Date.now();
  private lastScrollPosition: number = 0;
  private lastScrollTime: number = Date.now();
  private scrollEvents: Array<{ position: number; time: number }> = [];
  private sessionStartTime: number = Date.now();
  private interactionCount: number = 0;

  constructor(config: SensorConfig = {}) {
    this.config = {
      updateInterval: 100,
      enableFallback: true,
      debug: false,
      ...config,
    };
  }

  async initialize(): Promise<void> {
    try {
      // Set up Page Visibility API
      if (typeof document.hidden !== 'undefined') {
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
      }

      // Track user interactions
      const interactionEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
      interactionEvents.forEach(event => {
        document.addEventListener(event, this.handleInteraction.bind(this));
      });

      // Track scroll specifically for velocity calculation
      document.addEventListener('scroll', this.handleScroll.bind(this));

      // Update metrics periodically
      setInterval(() => this.updateMetrics(), this.config.updateInterval);

      this.available = true;
      
      if (this.config.debug) {
        console.log('[AttentionSensor] Initialized successfully');
      }
    } catch (error) {
      console.warn('[AttentionSensor] Initialization error:', error);
    }
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.metrics.focusScore = 0.0;
    } else {
      this.metrics.focusScore = 1.0;
      this.lastInteractionTime = Date.now();
    }
  }

  private handleInteraction(): void {
    this.lastInteractionTime = Date.now();
    this.interactionCount++;
  }

  private handleScroll(): void {
    const now = Date.now();
    const currentPosition = window.scrollY;
    
    // Track scroll events for pattern analysis
    this.scrollEvents.push({ position: currentPosition, time: now });
    
    // Keep only recent events (last 5 seconds)
    this.scrollEvents = this.scrollEvents.filter(e => now - e.time < 5000);
    
    // Calculate scroll velocity
    const timeDelta = now - this.lastScrollTime;
    if (timeDelta > 0) {
      const positionDelta = Math.abs(currentPosition - this.lastScrollPosition);
      this.metrics.scrollVelocity = (positionDelta / timeDelta) * 1000; // pixels per second
    }
    
    this.lastScrollPosition = currentPosition;
    this.lastScrollTime = now;
    this.lastInteractionTime = now;
  }

  private updateMetrics(): void {
    const now = Date.now();
    
    // Update idle time
    this.metrics.idleTime = now - this.lastInteractionTime;
    
    // Calculate focus score based on idle time
    if (!document.hidden) {
      if (this.metrics.idleTime < 30000) { // Active: < 30 seconds
        this.metrics.focusScore = 1.0;
      } else if (this.metrics.idleTime < 120000) { // Semi-active: 30s - 2min
        this.metrics.focusScore = 0.5;
      } else { // Likely away: > 2 minutes
        this.metrics.focusScore = 0.1;
      }
    }
    
    // Calculate cognitive load from interaction patterns
    // More interactions = higher cognitive engagement
    const sessionDuration = (now - this.sessionStartTime) / 1000; // seconds
    const interactionRate = this.interactionCount / Math.max(sessionDuration, 1);
    
    // Normalize to 0-1 (assume 5 interactions/second as high load)
    this.metrics.cognitiveLoad = Math.min(interactionRate / 5, 1.0);
    
    // Calculate fatigue level based on session time and scroll patterns
    const sessionMinutes = sessionDuration / 60;
    
    // Base fatigue increases with session time (research: attention span ~20-40 min)
    const timeFatigue = Math.min(sessionMinutes / 40, 1.0);
    
    // Rapid scrolling suggests scanning/fatigue
    const scrollFatigue = Math.min(this.metrics.scrollVelocity / 1000, 1.0);
    
    // Combined fatigue metric (weighted average)
    this.metrics.fatigueLevel = 0.6 * timeFatigue + 0.4 * scrollFatigue;
    
    if (this.config.debug && now % 5000 < this.config.updateInterval!) {
      console.log('[AttentionSensor] Metrics:', this.metrics);
    }
  }

  getCurrentValue(): AttentionMetrics {
    return { ...this.metrics };
  }

  isAvailable(): boolean {
    return this.available;
  }

  cleanup(): void {
    // Remove event listeners
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    const interactionEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    interactionEvents.forEach(event => {
      document.removeEventListener(event, this.handleInteraction.bind(this));
    });
    
    document.removeEventListener('scroll', this.handleScroll.bind(this));
  }
}
