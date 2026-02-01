import { Module, Embedding, Linear, LayerNorm, Tanh, Tensor } from '../nn';

/**
 * Visual Pattern Features
 * Represents learnable embeddings for visual design patterns
 */
export interface PatternFeatures {
  primaryColor: number[];      // RGB + intensity
  secondaryColor: number[];    // Accent color
  gradientDirection: number;   // 0-360 degrees
  animationSpeed: number;      // 0-1 range
  opacity: number;             // 0-1 range
  blur: number;                // Blur intensity
  scale: number;               // Size multiplier
}

/**
 * Symbol Features
 * Represents learnable embeddings for symbolic elements (icons, shapes)
 */
export interface SymbolFeatures {
  iconType: number;            // Categorical index
  size: number;                // Size multiplier
  weight: number;              // Stroke weight
  rotation: number;            // 0-360 degrees
  color: number[];             // RGB
  glowIntensity: number;       // Glow effect
}

/**
 * Contextual Keys
 * Environmental and user context that influences feature adaptation
 */
export interface ContextualKeys {
  theme: 'light' | 'dark' | 'auto';
  timeOfDay: number;           // 0-23 hours
  scrollPosition: number;      // 0-1 normalized
  viewportWidth: number;       // pixels
  viewportHeight: number;      // pixels
  userActivity: number;        // Activity level 0-1
  section: string;             // Current page section
  interactionState: 'idle' | 'hover' | 'active' | 'focus';
}

/**
 * Pattern Encoder - Converts visual patterns to learnable embeddings
 */
export class PatternEncoder extends Module {
  private colorEmbedding: Embedding;
  private featureProjection: Linear;
  private normalization: LayerNorm;
  private activation: Tanh;
  private embeddingDim: number;

  constructor(embeddingDim: number = 64) {
    super();
    this.embeddingDim = embeddingDim;

    // Color palette embeddings (256 quantized colors)
    this.colorEmbedding = new Embedding(256, 16);
    this.registerModule('colorEmbedding', this.colorEmbedding);

    // Project features to embedding space
    this.featureProjection = new Linear(32, embeddingDim);
    this.registerModule('featureProjection', this.featureProjection);

    // Normalization for stable embeddings
    this.normalization = new LayerNorm([embeddingDim]);
    this.registerModule('normalization', this.normalization);

    // Activation
    this.activation = new Tanh();
    this.registerModule('activation', this.activation);
  }

  /**
   * Encode pattern features into embedding space
   */
  encodePattern(pattern: PatternFeatures): Tensor {
    // Quantize colors to indices
    const primaryIdx = this.colorToIndex(pattern.primaryColor);
    const secondaryIdx = this.colorToIndex(pattern.secondaryColor);

    // Get color embeddings
    const primaryEmbed = this.colorEmbedding.getEmbedding(primaryIdx);
    const secondaryEmbed = this.colorEmbedding.getEmbedding(secondaryIdx);

    // Combine all features
    const features = [
      ...primaryEmbed,
      ...secondaryEmbed,
      pattern.gradientDirection / 360,
      pattern.animationSpeed,
      pattern.opacity,
      pattern.blur,
      pattern.scale,
    ];

    // Project to embedding space
    const featureTensor = new Tensor(features, [features.length]);
    const projected = this.featureProjection.forward(featureTensor);
    const normalized = this.normalization.forward(projected);
    return this.activation.forward(normalized);
  }

  /**
   * Decode embedding back to pattern features
   */
  decodeEmbedding(embedding: number[]): PatternFeatures {
    // Simple linear decode for now
    // In a full implementation, this would use a learned decoder network
    
    const scale = (val: number) => (val + 1) / 2; // Tanh output is [-1, 1]
    
    return {
      primaryColor: [
        scale(embedding[0]) * 255,
        scale(embedding[1]) * 255,
        scale(embedding[2]) * 255,
      ],
      secondaryColor: [
        scale(embedding[3]) * 255,
        scale(embedding[4]) * 255,
        scale(embedding[5]) * 255,
      ],
      gradientDirection: scale(embedding[6]) * 360,
      animationSpeed: scale(embedding[7]),
      opacity: Math.max(0.1, scale(embedding[8])),
      blur: scale(embedding[9]) * 20,
      scale: 0.5 + scale(embedding[10]) * 1.5,
    };
  }

  private colorToIndex(rgb: number[]): number {
    // Quantize RGB to 256 colors (8-bit per channel reduced to 256 total)
    const r = Math.floor((rgb[0] / 255) * 5);
    const g = Math.floor((rgb[1] / 255) * 5);
    const b = Math.floor((rgb[2] / 255) * 5);
    return Math.min(255, r * 36 + g * 6 + b);
  }

  forward(input: Tensor): Tensor {
    // For generic forward pass
    return this.featureProjection.forward(input);
  }
}

/**
 * Symbol Encoder - Converts symbolic elements to learnable embeddings
 */
export class SymbolEncoder extends Module {
  private iconEmbedding: Embedding;
  private featureProjection: Linear;
  private normalization: LayerNorm;
  private embeddingDim: number;

  constructor(numIconTypes: number = 50, embeddingDim: number = 32) {
    super();
    this.embeddingDim = embeddingDim;

    // Icon type embeddings
    this.iconEmbedding = new Embedding(numIconTypes, 16);
    this.registerModule('iconEmbedding', this.iconEmbedding);

    // Feature projection
    this.featureProjection = new Linear(21, embeddingDim);
    this.registerModule('featureProjection', this.featureProjection);

    // Normalization
    this.normalization = new LayerNorm([embeddingDim]);
    this.registerModule('normalization', this.normalization);
  }

  /**
   * Encode symbol features into embedding space
   */
  encodeSymbol(symbol: SymbolFeatures): Tensor {
    const iconEmbed = this.iconEmbedding.getEmbedding(symbol.iconType);

    const features = [
      ...iconEmbed,
      symbol.size,
      symbol.weight,
      symbol.rotation / 360,
      ...symbol.color.map(c => c / 255),
      symbol.glowIntensity,
    ];

    const featureTensor = new Tensor(features, [features.length]);
    const projected = this.featureProjection.forward(featureTensor);
    return this.normalization.forward(projected);
  }

  forward(input: Tensor): Tensor {
    return this.featureProjection.forward(input);
  }
}

/**
 * Context Encoder - Converts contextual keys to embeddings
 */
export class ContextEncoder extends Module {
  private sectionEmbedding: Embedding;
  private stateEmbedding: Embedding;
  private featureProjection: Linear;
  private embeddingDim: number;
  private sectionMap: Map<string, number>;
  private stateMap: Map<string, number>;

  constructor(embeddingDim: number = 32) {
    super();
    this.embeddingDim = embeddingDim;

    // Section embeddings
    this.sectionMap = new Map([
      ['hero', 0],
      ['products', 1],
      ['news', 2],
      ['testimonials', 3],
      ['stats', 4],
      ['footer', 5],
    ]);
    this.sectionEmbedding = new Embedding(10, 8);
    this.registerModule('sectionEmbedding', this.sectionEmbedding);

    // Interaction state embeddings
    this.stateMap = new Map([
      ['idle', 0],
      ['hover', 1],
      ['active', 2],
      ['focus', 3],
    ]);
    this.stateEmbedding = new Embedding(4, 4);
    this.registerModule('stateEmbedding', this.stateEmbedding);

    // Feature projection
    this.featureProjection = new Linear(18, embeddingDim);
    this.registerModule('featureProjection', this.featureProjection);
  }

  /**
   * Encode contextual information into embedding space
   */
  encodeContext(context: ContextualKeys): Tensor {
    const sectionIdx = this.sectionMap.get(context.section) ?? 0;
    const stateIdx = this.stateMap.get(context.interactionState) ?? 0;

    const sectionEmbed = this.sectionEmbedding.getEmbedding(sectionIdx);
    const stateEmbed = this.stateEmbedding.getEmbedding(stateIdx);

    const themeValue = context.theme === 'light' ? 0 : context.theme === 'dark' ? 1 : 0.5;

    const features = [
      ...sectionEmbed,
      ...stateEmbed,
      themeValue,
      context.timeOfDay / 24,
      context.scrollPosition,
      context.viewportWidth / 2000,
      context.viewportHeight / 2000,
      context.userActivity,
    ];

    const featureTensor = new Tensor(features, [features.length]);
    return this.featureProjection.forward(featureTensor);
  }

  forward(input: Tensor): Tensor {
    return this.featureProjection.forward(input);
  }
}
