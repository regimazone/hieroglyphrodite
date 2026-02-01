import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getLivingCanvas, LivingCanvas } from './LivingCanvas';
import { PatternFeatures, ContextualKeys } from '../embeddings/FeatureEncoders';

interface LivingCanvasContextType {
  canvas: LivingCanvas;
  currentPattern: PatternFeatures;
  context: ContextualKeys;
  setSection: (section: string) => void;
  setInteractionState: (state: ContextualKeys['interactionState']) => void;
  recordInteraction: (feedback: number) => void;
  getPatternCSS: () => React.CSSProperties;
  getGradientBackground: () => string;
  getAnimationProps: () => React.CSSProperties;
}

const LivingCanvasContext = createContext<LivingCanvasContextType | null>(null);

/**
 * Provider component for Living Canvas
 */
export function LivingCanvasProvider({ children }: { children: React.ReactNode }) {
  const [canvas] = useState(() => getLivingCanvas());
  const [currentPattern, setCurrentPattern] = useState<PatternFeatures>(() => {
    const basePattern: PatternFeatures = {
      primaryColor: [0, 8, 44],
      secondaryColor: [65, 205, 224],
      gradientDirection: 135,
      animationSpeed: 0.5,
      opacity: 1,
      blur: 0,
      scale: 1,
    };
    return canvas.renderPattern(basePattern);
  });
  const [context, setContext] = useState<ContextualKeys>(() => canvas.getContext());

  useEffect(() => {
    // Subscribe to pattern updates
    const unsubscribe = canvas.subscribe((pattern) => {
      setCurrentPattern(pattern);
      setContext(canvas.getContext());
    });

    // Initial update
    const basePattern: PatternFeatures = {
      primaryColor: [0, 8, 44],
      secondaryColor: [65, 205, 224],
      gradientDirection: 135,
      animationSpeed: 0.5,
      opacity: 1,
      blur: 0,
      scale: 1,
    };
    setCurrentPattern(canvas.renderPattern(basePattern));

    return () => {
      unsubscribe();
    };
  }, [canvas]);

  const setSection = useCallback((section: string) => {
    canvas.setSection(section);
  }, [canvas]);

  const setInteractionState = useCallback((state: ContextualKeys['interactionState']) => {
    canvas.setInteractionState(state);
  }, [canvas]);

  const recordInteraction = useCallback((feedback: number) => {
    canvas.recordInteraction(feedback);
  }, [canvas]);

  const getPatternCSS = useCallback(() => {
    return canvas.getPatternCSS(currentPattern);
  }, [canvas, currentPattern]);

  const getGradientBackground = useCallback(() => {
    return canvas.getGradientBackground(currentPattern);
  }, [canvas, currentPattern]);

  const getAnimationProps = useCallback(() => {
    return canvas.getAnimationProps(currentPattern);
  }, [canvas, currentPattern]);

  const value: LivingCanvasContextType = {
    canvas,
    currentPattern,
    context,
    setSection,
    setInteractionState,
    recordInteraction,
    getPatternCSS,
    getGradientBackground,
    getAnimationProps,
  };

  return (
    <LivingCanvasContext.Provider value={value}>
      {children}
    </LivingCanvasContext.Provider>
  );
}

/**
 * Hook to access Living Canvas context
 */
export function useLivingCanvas(): LivingCanvasContextType {
  const context = useContext(LivingCanvasContext);
  if (!context) {
    throw new Error('useLivingCanvas must be used within LivingCanvasProvider');
  }
  return context;
}

/**
 * Hook to track section visibility
 */
export function useSectionTracking(sectionName: string) {
  const { setSection } = useLivingCanvas();
  const ref = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSection(sectionName);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [sectionName, setSection]);

  return ref;
}

/**
 * Hook to track interaction state
 */
export function useInteractionTracking() {
  const { setInteractionState } = useLivingCanvas();

  const handlers = {
    onMouseEnter: () => setInteractionState('hover'),
    onMouseLeave: () => setInteractionState('idle'),
    onMouseDown: () => setInteractionState('active'),
    onMouseUp: () => setInteractionState('hover'),
    onFocus: () => setInteractionState('focus'),
    onBlur: () => setInteractionState('idle'),
  };

  return handlers;
}
