import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, Package, Users, Globe } from 'lucide-react';
const stats = [
{
  label: 'Years of Excellence',
  value: 25,
  icon: Award,
  suffix: ''
},
{
  label: 'Unique Products',
  value: 50,
  icon: Package,
  suffix: '+'
},
{
  label: 'Happy Customers',
  value: 10000,
  icon: Users,
  suffix: '+'
},
{
  label: 'Countries',
  value: 15,
  icon: Globe,
  suffix: ''
}];

export function StatsSection() {
  return (
    <section className="py-20 bg-[#1a1d1f] relative overflow-hidden">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(#41cde0_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) =>
          <StatItem key={index} stat={stat} index={index} />
          )}
        </div>
      </div>
    </section>);

}
function StatItem({ stat, index }: {stat: (typeof stats)[0];index: number;}) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true,
        margin: '-50px'
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.1
      }}
      className="text-center">

      <div className="inline-flex items-center justify-center w-14 h-14 mb-5 rounded-full bg-[#41cde0]/10 text-[#41cde0]">
        <Icon size={26} strokeWidth={1.5} />
      </div>

      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        <CountUp end={stat.value} duration={2} />
        <span className="text-[#41cde0]">{stat.suffix}</span>
      </div>

      <p className="text-gray-500 text-xs uppercase tracking-widest font-medium">
        {stat.label}
      </p>
    </motion.div>);

}
function CountUp({ end, duration }: {end: number;duration: number;}) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            // Easing function for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      {
        threshold: 0.5
      }
    );
    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }
    return () => observer.disconnect();
  }, [end, duration]);
  return <span ref={nodeRef}>{count.toLocaleString()}</span>;
}