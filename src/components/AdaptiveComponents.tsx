import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLivingCanvas, useSectionTracking } from '../canvas';

/**
 * Adaptive Background Pattern
 * Demonstrates learnable patterns that adapt to context
 */
export function AdaptiveBackground() {
  const { currentPattern, getPatternCSS, getGradientBackground } = useLivingCanvas();
  const [cssVars, setCssVars] = useState<React.CSSProperties>({});

  useEffect(() => {
    setCssVars(getPatternCSS());
  }, [currentPattern, getPatternCSS]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" style={cssVars}>
      {/* Adaptive gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: getGradientBackground(),
          opacity: currentPattern.opacity * 0.05,
        }}
        animate={{
          opacity: currentPattern.opacity * 0.05,
        }}
        transition={{
          duration: currentPattern.animationSpeed,
        }}
      />

      {/* Adaptive radial pattern */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(${currentPattern.secondaryColor.join(',')}, ${currentPattern.opacity * 0.1}) 1px, transparent 1px)`,
          backgroundSize: `${24 * currentPattern.scale}px ${24 * currentPattern.scale}px`,
          filter: currentPattern.blur > 0 ? `blur(${currentPattern.blur}px)` : undefined,
        }}
        animate={{
          scale: currentPattern.scale,
          opacity: currentPattern.opacity * 0.3,
        }}
        transition={{
          duration: currentPattern.animationSpeed,
        }}
      />
    </div>
  );
}

/**
 * Adaptive Section Component
 * Wraps sections with adaptive pattern tracking
 */
interface AdaptiveSectionProps {
  sectionName: string;
  children: React.ReactNode;
  className?: string;
}

export function AdaptiveSection({ sectionName, children, className = '' }: AdaptiveSectionProps) {
  const sectionRef = useSectionTracking(sectionName);

  return (
    <section ref={sectionRef} className={className}>
      {children}
    </section>
  );
}

/**
 * Adaptive Interactive Element
 * Demonstrates interaction-aware pattern adaptation
 */
interface AdaptiveInteractiveProps {
  children: React.ReactNode;
  className?: string;
  recordFeedback?: boolean;
}

export function AdaptiveInteractive({ 
  children, 
  className = '',
  recordFeedback = false 
}: AdaptiveInteractiveProps) {
  const { setInteractionState, recordInteraction, currentPattern } = useLivingCanvas();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setInteractionState('hover');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setInteractionState('idle');
  };

  const handleClick = () => {
    setInteractionState('active');
    if (recordFeedback) {
      // Positive feedback for click interaction
      recordInteraction(1.0);
    }
    setTimeout(() => {
      if (isHovered) {
        setInteractionState('hover');
      } else {
        setInteractionState('idle');
      }
    }, 200);
  };

  return (
    <motion.div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={{
        scale: isHovered ? currentPattern.scale : 1,
      }}
      transition={{
        duration: currentPattern.animationSpeed * 0.5,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Adaptive Accent Element
 * Shows adaptive accent color based on learned patterns
 */
interface AdaptiveAccentProps {
  children: React.ReactNode;
  className?: string;
}

export function AdaptiveAccent({ children, className = '' }: AdaptiveAccentProps) {
  const { currentPattern } = useLivingCanvas();
  const accentColor = `rgb(${currentPattern.secondaryColor.map(c => Math.round(c)).join(',')})`;

  return (
    <span 
      className={className}
      style={{ color: accentColor }}
    >
      {children}
    </span>
  );
}
