import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
const testimonials = [
{
  id: 1,
  name: 'Sarah Mitchell',
  role: 'Verified Customer',
  quote:
  'RégimA transformed my skin completely. After years of struggling with pigmentation, I finally found a solution that actually works. The results are undeniable.',
  rating: 5
},
{
  id: 2,
  name: 'Dr. James Kennedy',
  role: 'Dermatologist',
  quote:
  'As a dermatologist, I recommend RégimA to my patients because of its scientifically backed formulation. It focuses on skin health first, which naturally leads to aesthetic improvement.',
  rating: 5
},
{
  id: 3,
  name: 'Michelle Thompson',
  role: 'Esthetician',
  quote:
  "I've used many professional ranges in my salon, but nothing compares to the results I get with RégimA. My clients are always amazed by the immediate glow.",
  rating: 5
}];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);
  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, []);
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);
  return (
    <section
      className="py-20 bg-[#00082c] relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>

      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#41cde0]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#41cde0]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.6
          }}
          className="text-center mb-16">

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Client Success Stories
          </h2>
          <div className="w-20 h-1 bg-[#41cde0] mx-auto"></div>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#41cde0] hover:border-[#41cde0] hover:text-[#00082c] transition-all duration-300 z-10"
            aria-label="Previous testimonial">

            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#41cde0] hover:border-[#41cde0] hover:text-[#00082c] transition-all duration-300 z-10"
            aria-label="Next testimonial">

            <ChevronRight size={20} />
          </button>

          {/* Testimonial Content */}
          <div className="min-h-[280px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: -20
                }}
                transition={{
                  duration: 0.5
                }}
                className="text-center max-w-3xl mx-auto px-8">

                <Quote size={40} className="text-[#41cde0]/30 mx-auto mb-6" />

                <blockquote className="text-xl md:text-2xl text-white/90 font-light italic leading-relaxed mb-8">
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) =>
                  <Star
                    key={i}
                    size={18}
                    className="text-[#41cde0] fill-[#41cde0]" />

                  )}
                </div>

                {/* Author */}
                <div>
                  <h4 className="font-bold text-white text-lg">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-[#41cde0] text-sm uppercase tracking-wider">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 mt-10">
          {testimonials.map((_, index) =>
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-[#41cde0] w-8' : 'bg-white/30 w-2 hover:bg-white/50'}`}
            aria-label={`Go to testimonial ${index + 1}`} />

          )}
        </div>
      </div>
    </section>);

}