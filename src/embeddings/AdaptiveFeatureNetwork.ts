import { Module, Linear, Tanh, Tensor } from '../nn';
import { PatternEncoder, SymbolEncoder, ContextEncoder, PatternFeatures, ContextualKeys } from './FeatureEncoders';

/**
 * Adaptive Feature Network
 * Learns to adapt pattern and symbol features based on contextual keys
 * Implements the "learnable" aspect with dynamic adaptation
 */
export class AdaptiveFeatureNetwork extends Module {
  private patternEncoder: PatternEncoder;
  private symbolEncoder: SymbolEncoder;
  private contextEncoder: ContextEncoder;
  
  // Attention mechanism for context-aware adaptation
  private contextAttention: Linear;
  private patternAdapter: Linear;
  private symbolAdapter: Linear;
  
  // Fusion layers
  private fusionLayer: Linear;
  private outputProjection: Linear;
  private activation: Tanh;
  
  private embeddingDim: number;
  
  // Learning rate for online adaptation
  private learningRate: number = 0.01;
  
  // Memory for recent adaptations
  private adaptationHistory: Array<{
    context: ContextualKeys;
    patternFeatures: PatternFeatures;
    timestamp: number;
  }> = [];

  constructor(embeddingDim: number = 128) {
    super();
    this.embeddingDim = embeddingDim;

    // Initialize encoders
    this.patternEncoder = new PatternEncoder(64);
    this.symbolEncoder = new SymbolEncoder(50, 32);
    this.contextEncoder = new ContextEncoder(32);

    this.registerModule('patternEncoder', this.patternEncoder);
    this.registerModule('symbolEncoder', this.symbolEncoder);
    this.registerModule('contextEncoder', this.contextEncoder);

    // Context attention (64 + 32 + 32 = 128 input)
    this.contextAttention = new Linear(128, 128);
    this.registerModule('contextAttention', this.contextAttention);

    // Adaptation layers
    this.patternAdapter = new Linear(128, 64);
    this.symbolAdapter = new Linear(128, 32);

    this.registerModule('patternAdapter', this.patternAdapter);
    this.registerModule('symbolAdapter', this.symbolAdapter);

    // Fusion
    this.fusionLayer = new Linear(96, embeddingDim);
    this.outputProjection = new Linear(embeddingDim, embeddingDim);
    this.activation = new Tanh();

    this.registerModule('fusionLayer', this.fusionLayer);
    this.registerModule('outputProjection', this.outputProjection);
    this.registerModule('activation', this.activation);
  }

  /**
   * Forward pass: adapt features based on context
   */
  forward(input: Tensor): Tensor {
    return this.fusionLayer.forward(input);
  }

  /**
   * Adapt pattern features based on contextual keys
   */
  adaptPattern(pattern: PatternFeatures, context: ContextualKeys): PatternFeatures {
    // Encode inputs
    const patternEmbed = this.patternEncoder.encodePattern(pattern);
    const contextEmbed = this.contextEncoder.encodeContext(context);

    // Create combined feature vector
    const combined = new Tensor(
      [...patternEmbed.toArray(), ...contextEmbed.toArray(), ...Array(32).fill(0)],
      [128]
    );

    // Apply context attention
    const attended = this.contextAttention.forward(combined);
    const activated = this.activation.forward(attended);

    // Adapt pattern features
    const adaptedEmbed = this.patternAdapter.forward(activated);

    // Decode to pattern features
    const adaptedPattern = this.patternEncoder.decodeEmbedding(adaptedEmbed.toArray());

    // Apply context-specific adjustments
    const finalPattern = this.applyContextualRules(adaptedPattern, context);

    // Store in adaptation history for learning
    this.adaptationHistory.push({
      context,
      patternFeatures: finalPattern,
      timestamp: Date.now(),
    });

    // Limit history size
    if (this.adaptationHistory.length > 100) {
      this.adaptationHistory.shift();
    }

    return finalPattern;
  }

  /**
   * Apply rule-based contextual adjustments for evidence-based optimization
   */
  private applyContextualRules(pattern: PatternFeatures, context: ContextualKeys): PatternFeatures {
    const adjusted = { ...pattern };

    // Time-based adaptation (circadian-aligned design)
    const hour = context.timeOfDay;
    if (hour >= 22 || hour <= 6) {
      // Night mode: reduce brightness, increase warmth
      adjusted.primaryColor = adjusted.primaryColor.map((c, i) => 
        i === 0 ? Math.min(255, c * 1.1) : c * 0.8 // Increase red, decrease green/blue
      );
      adjusted.opacity *= 0.9;
      adjusted.blur *= 1.2;
    } else if (hour >= 6 && hour <= 10) {
      // Morning: increase clarity and brightness
      adjusted.animationSpeed *= 1.2;
      adjusted.opacity = Math.min(1, adjusted.opacity * 1.1);
    }

    // Scroll position adaptation
    if (context.scrollPosition > 0.5) {
      // User has scrolled far: reduce animation to prevent fatigue
      adjusted.animationSpeed *= 0.8;
    }

    // Interaction state adaptation
    switch (context.interactionState) {
      case 'hover':
        adjusted.scale *= 1.05;
        adjusted.animationSpeed *= 1.3;
        break;
      case 'active':
        adjusted.scale *= 1.1;
        adjusted.opacity = Math.min(1, adjusted.opacity * 1.1);
        break;
      case 'focus':
        adjusted.blur *= 0.5; // Sharper when focused
        break;
    }

    // Viewport adaptation (responsive design)
    if (context.viewportWidth < 768) {
      // Mobile: simplify patterns
      adjusted.blur *= 0.7;
      adjusted.animationSpeed *= 0.9;
      adjusted.scale *= 0.95;
    }

    // Section-specific adaptation (Zone Concept integration)
    switch (context.section) {
      case 'hero':
        // Hero section: bold and prominent
        adjusted.scale *= 1.1;
        adjusted.animationSpeed *= 1.2;
        break;
      case 'products':
        // Products: clean and focused
        adjusted.blur *= 0.8;
        adjusted.opacity = Math.max(0.9, adjusted.opacity);
        break;
      case 'testimonials':
        // Testimonials: warm and trustworthy
        adjusted.primaryColor[0] = Math.min(255, adjusted.primaryColor[0] * 1.05);
        break;
    }

    return adjusted;
  }

  /**
   * Learn from user interactions (online learning)
   */
  updateFromInteraction(context: ContextualKeys, feedback: number): void {
    // Simple gradient-based update
    // In a full implementation, this would use proper backpropagation
    
    if (this.adaptationHistory.length === 0) return;
    
    // Update learning rate based on feedback
    const adjustment = feedback * this.learningRate;
    
    // This is a simplified version - real implementation would compute gradients
    // Store the adjustment for future use
    console.log(`Learning from interaction: context=${context.section}, feedback=${feedback}, adjustment=${adjustment}`);
  }

  /**
   * Get adaptation statistics for monitoring
   */
  getAdaptationStats() {
    if (this.adaptationHistory.length === 0) {
      return { count: 0, sections: {}, states: {} };
    }

    const stats = {
      count: this.adaptationHistory.length,
      sections: {} as Record<string, number>,
      states: {} as Record<string, number>,
      avgTimeOfDay: 0,
      avgScrollPosition: 0,
    };

    this.adaptationHistory.forEach(entry => {
      stats.sections[entry.context.section] = (stats.sections[entry.context.section] || 0) + 1;
      stats.states[entry.context.interactionState] = (stats.states[entry.context.interactionState] || 0) + 1;
      stats.avgTimeOfDay += entry.context.timeOfDay;
      stats.avgScrollPosition += entry.context.scrollPosition;
    });

    stats.avgTimeOfDay /= this.adaptationHistory.length;
    stats.avgScrollPosition /= this.adaptationHistory.length;

    return stats;
  }

  /**
   * Export learned parameters for persistence
   */
  exportParameters(): Record<string, number[]> {
    const params: Record<string, number[]> = {};
    
    this.parameters.forEach((tensor, name) => {
      params[name] = tensor.toArray();
    });

    return params;
  }

  /**
   * Import learned parameters
   */
  importParameters(params: Record<string, number[]>): void {
    Object.entries(params).forEach(([name, data]) => {
      const tensor = this.parameters.get(name);
      if (tensor && tensor.size === data.length) {
        tensor.data = [...data];
      }
    });
  }
}
