/**
 * Ambient Intelligence Module
 * 
 * Phase 1: Context-anticipatory system with environmental sensing
 * and predictive adaptation
 * 
 * Exports all ambient intelligence components for integration
 */

// Type definitions
export * from './types';

// Sensors
export { AmbientLightSensor } from './sensors/AmbientLightSensor';
export { AttentionSensor } from './sensors/AttentionSensor';
export { NetworkSensor } from './sensors/NetworkSensor';
export { SensorManager } from './sensors/SensorManager';

// Predictive system
export { ContextPredictor } from './predictive/ContextPredictor';
