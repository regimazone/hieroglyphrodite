import React from 'react';
import { motion } from 'framer-motion';
import { ProductGrid } from './ProductGrid';
import { NewsSection } from './NewsSection';
import { TestimonialCarousel } from './TestimonialCarousel';
import { StatsSection } from './StatsSection';
export function MainContent() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1170px] px-6">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.8
              }}>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                RégimA
              </h1>
              <p className="text-[#41cde0] text-base md:text-lg font-semibold tracking-widest uppercase mb-10">
                Products That Change Lives
              </p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 30
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.8,
                delay: 0.2
              }}
              className="space-y-5 text-white/90 text-base md:text-lg leading-relaxed">

              <p>
                RégimA is a unique, advanced, medically accepted, results
                driven, anti-ageing, skin rejuvenating range manufactured
                exclusively for the use of doctors and skin care professionals.
              </p>
              <p>
                Multiple award winning, RégimA's status is cemented as a skin
                care leader in the world market. Ensuring actives are used at
                maximum efficacy, RégimA is a cosmeceutical focusing not only on
                <span className="text-[#41cde0] font-semibold">
                  {' '}
                  AESTHETICS{' '}
                </span>
                but
                <span className="text-[#41cde0] font-semibold">
                  {' '}
                  SKIN HEALTH
                </span>
                .
              </p>
              <p className="text-white/60 text-sm md:text-base">
                Safely, gently and naturally, RégimA helps all skin types and
                skin problems—treating pigmentation, active acne, acne scarring,
                rejuvenating, restoring a youthful appearance, improving colour,
                tone and texture, bringing back that glow of healthy skin,
                irrespective of age.
              </p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              transition={{
                duration: 0.6,
                delay: 0.5
              }}
              className="mt-10">

              <div className="w-20 h-0.5 bg-[#41cde0] mx-auto"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="pb-20">
        <ProductGrid />
      </section>

      {/* News Section */}
      <NewsSection />

      {/* Testimonials Section */}
      <TestimonialCarousel />

      {/* Stats Section */}
      <StatsSection />
    </div>);

}