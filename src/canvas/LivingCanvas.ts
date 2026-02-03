import { PatternFeatures, ContextualKeys } from '../embeddings/FeatureEncoders';
import { AdaptiveFeatureNetwork } from '../embeddings/AdaptiveFeatureNetwork';
import { 
  SensorManager, 
  ContextPredictor, 
  AmbientContext,
  EnhancedContextualKeys 
} from '../ambient';

/**
 * Living Canvas - Renders content with learnable adaptive features
 * Integrates with the ambient theme and dynamically responds to context
 * 
 * PHASE 1 ENHANCEMENT: Now includes ambient intelligence with multi-modal
 * sensing and predictive context adaptation
 */
export class LivingCanvas {
  private network: AdaptiveFeatureNetwork;
  private currentContext: ContextualKeys;
  private animationFrameId: number | null = null;
  private observers: Set<(features: PatternFeatures) => void> = new Set();

  // Phase 1: Ambient Intelligence
  private sensorManager: SensorManager | null = null;
  private contextPredictor: ContextPredictor | null = null;
  private ambientEnabled = false;
  private predictedPatternCache: Map<string, PatternFeatures> = new Map();

  constructor(enableAmbient = true) {
    this.network = new AdaptiveFeatureNetwork(128);
    
    // Initialize with current context
    this.currentContext = this.detectContext();

    // Set up context monitoring
    this.setupContextMonitoring();

    // Initialize ambient intelligence if enabled
    if (enableAmbient) {
      this.setupAmbientIntelligence().catch(err => {
        console.warn('[LivingCanvas] Ambient intelligence initialization failed:', err);
      });
    }
  }

  /**
   * Detect current environmental context
   */
  private detectContext(): ContextualKeys {
    const hour = new Date().getHours();
    const scrollPosition = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
    
    // Detect theme from document or system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDark ? 'dark' : 'light';

    // Detect current section from scroll position
    let section = 'hero';
    const sections = ['hero', 'products', 'news', 'testimonials', 'stats', 'footer'];
    const sectionHeight = 1 / sections.length;
    const sectionIndex = Math.floor(scrollPosition / sectionHeight);
    if (sectionIndex >= 0 && sectionIndex < sections.length) {
      section = sections[sectionIndex];
    }

    return {
      theme,
      timeOfDay: hour,
      scrollPosition: Math.max(0, Math.min(1, scrollPosition)),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      userActivity: 0.5, // Default, can be updated based on interaction tracking
      section,
      interactionState: 'idle',
    };
  }

  /**
   * Set up monitoring for context changes
   */
  private setupContextMonitoring(): void {
    // Monitor scroll
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.updateContext({ scrollPosition: window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1) });
      }, 100);
    });

    // Monitor viewport changes
    window.addEventListener('resize', () => {
      this.updateContext({
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
    });

    // Monitor theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.updateContext({ theme: e.matches ? 'dark' : 'light' });
    });

    // Update time periodically
    setInterval(() => {
      this.updateContext({ timeOfDay: new Date().getHours() });
    }, 60000); // Every minute
  }

  /**
   * PHASE 1: Set up ambient intelligence
   */
  private async setupAmbientIntelligence(): Promise<void> {
    try {
      // Initialize sensor manager
      this.sensorManager = new SensorManager({ debug: false });
      await this.sensorManager.initialize();

      // Initialize context predictor
      this.contextPredictor = new ContextPredictor({ debug: false });

      // Update predictor with sensor data periodically
      setInterval(() => {
        if (this.sensorManager && this.contextPredictor) {
          const ambientContext = this.sensorManager.getContext();
          const enhancedContext = this.enrichContext(this.currentContext, ambientContext);
          this.contextPredictor.recordContext(enhancedContext);
        }
      }, 1000);

      this.ambientEnabled = true;
      console.log('[LivingCanvas] Ambient intelligence enabled');
    } catch (error) {
      console.warn('[LivingCanvas] Could not initialize ambient intelligence:', error);
      this.ambientEnabled = false;
    }
  }

  /**
   * PHASE 1: Enrich base context with ambient data
   */
  private enrichContext(
    baseContext: ContextualKeys,
    ambientContext: AmbientContext
  ): EnhancedContextualKeys {
    return {
      ...baseContext,
      ambientLight: ambientContext.ambientLight,
      attentionScore: ambientContext.attention.focusScore,
      cognitiveLoad: ambientContext.attention.cognitiveLoad,
      fatigueLevel: ambientContext.attention.fatigueLevel,
      networkQuality: ambientContext.network.effectiveType,
    };
  }

  /**
   * PHASE 1: Predict and prepare for future context
   */
  async prepareForFutureContext(horizonMs = 10000): Promise<void> {
    if (!this.contextPredictor || !this.ambientEnabled) {
      return;
    }

    const prediction = this.contextPredictor.predictContext(horizonMs);

    if (prediction.confidence > 0.7) {
      // Pre-compute adaptations for predicted context
      const basePattern = this.getBasePattern();
      
      // Convert enhanced context to base context for network compatibility
      const futureBaseContext: ContextualKeys = {
        theme: prediction.context.theme,
        timeOfDay: prediction.context.timeOfDay,
        scrollPosition: prediction.context.scrollPosition,
        viewportWidth: prediction.context.viewportWidth,
        viewportHeight: prediction.context.viewportHeight,
        userActivity: prediction.context.userActivity,
        section: prediction.context.section,
        interactionState: prediction.context.interactionState,
      };
      
      const futurePattern = this.network.adaptPattern(basePattern, futureBaseContext);

      // Cache for quick application
      this.predictedPatternCache.set('future', futurePattern);
      
      if (prediction.confidence > 0.85) {
        console.log('[LivingCanvas] High-confidence prediction cached', {
          confidence: prediction.confidence,
          horizon: horizonMs,
        });
      }
    }
  }

  /**
   * PHASE 1: Get ambient context status
   */
  getAmbientStatus(): {
    enabled: boolean;
    sensorStatus?: Record<string, boolean>;
    predictorStats?: any;
  } {
    return {
      enabled: this.ambientEnabled,
      sensorStatus: this.sensorManager?.getSensorStatus(),
      predictorStats: this.contextPredictor?.getStats(),
    };
  }

  /**
   * Update context and notify observers
   */
  private updateContext(partial: Partial<ContextualKeys>): void {
    this.currentContext = { ...this.currentContext, ...partial };
    this.notifyObservers();
  }

  /**
   * Get current context
   */
  getContext(): ContextualKeys {
    return { ...this.currentContext };
  }

  /**
   * Set interaction state
   */
  setInteractionState(state: ContextualKeys['interactionState']): void {
    this.updateContext({ interactionState: state });
  }

  /**
   * Set current section
   */
  setSection(section: string): void {
    this.updateContext({ section });
  }

  /**
   * Render adaptive pattern features
   */
  renderPattern(basePattern: PatternFeatures): PatternFeatures {
    return this.network.adaptPattern(basePattern, this.currentContext);
  }

  /**
   * Get adaptive CSS properties from pattern features
   */
  getPatternCSS(pattern: PatternFeatures): React.CSSProperties {
    const rgb = (color: number[]) => `rgb(${color.map(c => Math.round(c)).join(',')})`;
    
    return {
      '--pattern-primary': rgb(pattern.primaryColor),
      '--pattern-secondary': rgb(pattern.secondaryColor),
      '--pattern-gradient-angle': `${pattern.gradientDirection}deg`,
      '--pattern-animation-speed': `${pattern.animationSpeed}s`,
      '--pattern-opacity': pattern.opacity,
      '--pattern-blur': `${pattern.blur}px`,
      '--pattern-scale': pattern.scale,
    } as React.CSSProperties;
  }

  /**
   * Generate gradient background from pattern
   */
  getGradientBackground(pattern: PatternFeatures): string {
    const rgb = (color: number[]) => `rgb(${color.map(c => Math.round(c)).join(',')})`;
    const primary = rgb(pattern.primaryColor);
    const secondary = rgb(pattern.secondaryColor);
    const angle = pattern.gradientDirection;
    
    return `linear-gradient(${angle}deg, ${primary}, ${secondary})`;
  }

  /**
   * Generate radial pattern overlay
   */
  getRadialPattern(pattern: PatternFeatures): string {
    const rgb = (color: number[], alpha: number = 1) => 
      `rgba(${color.map(c => Math.round(c)).join(',')}, ${alpha})`;
    
    const color = rgb(pattern.secondaryColor, pattern.opacity * 0.3);
    const size = 24 * pattern.scale;
    
    return `radial-gradient(circle, ${color} 1px, transparent 1px)`;
  }

  /**
   * Get animation properties
   */
  getAnimationProps(pattern: PatternFeatures) {
    return {
      transition: `all ${pattern.animationSpeed}s ease-in-out`,
      transform: `scale(${pattern.scale})`,
      opacity: pattern.opacity,
      filter: pattern.blur > 0 ? `blur(${pattern.blur}px)` : undefined,
    };
  }

  /**
   * Subscribe to pattern updates
   */
  subscribe(callback: (features: PatternFeatures) => void): () => void {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  /**
   * Notify all observers of pattern changes
   */
  private notifyObservers(): void {
    // Get base pattern from theme
    const basePattern = this.getBasePattern();
    const adaptedPattern = this.renderPattern(basePattern);
    
    this.observers.forEach(callback => {
      callback(adaptedPattern);
    });
  }

  /**
   * Get base pattern from current RegimA Zone theme
   */
  private getBasePattern(): PatternFeatures {
    // RegimA Zone brand colors
    const regimaBlue = [65, 205, 224]; // #41cde0
    const regimaDark = [0, 8, 44];     // #00082c
    
    return {
      primaryColor: regimaDark,
      secondaryColor: regimaBlue,
      gradientDirection: 135,
      animationSpeed: 0.5,
      opacity: 1,
      blur: 0,
      scale: 1,
    };
  }

  /**
   * Record user feedback for learning
   */
  recordInteraction(feedback: number): void {
    this.network.updateFromInteraction(this.currentContext, feedback);
  }

  /**
   * Get adaptation statistics
   */
  getStats() {
    return this.network.getAdaptationStats();
  }

  /**
   * Save learned parameters to localStorage
   */
  save(): void {
    const params = this.network.exportParameters();
    localStorage.setItem('livingCanvasParams', JSON.stringify(params));
  }

  /**
   * Load learned parameters from localStorage
   */
  load(): void {
    const stored = localStorage.getItem('livingCanvasParams');
    if (stored) {
      try {
        const params = JSON.parse(stored);
        this.network.importParameters(params);
      } catch (error) {
        console.error('Failed to load living canvas parameters:', error);
      }
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.observers.clear();
    
    // Phase 1: Cleanup ambient intelligence
    if (this.sensorManager) {
      this.sensorManager.cleanup();
      this.sensorManager = null;
    }
    this.contextPredictor = null;
    this.predictedPatternCache.clear();
  }
}

/**
 * Singleton instance for global access
 */
let canvasInstance: LivingCanvas | null = null;

export function getLivingCanvas(): LivingCanvas {
  if (!canvasInstance) {
    canvasInstance = new LivingCanvas();
    canvasInstance.load(); // Load saved parameters
    
    // Expose for debugging in browser console
    if (typeof window !== 'undefined') {
      (window as any).__livingCanvas = canvasInstance;
    }
  }
  return canvasInstance;
}
