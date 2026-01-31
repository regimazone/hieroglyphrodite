import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, CheckCircle, Loader2, Calendar } from 'lucide-react';
const newsItems = [
{
  id: 1,
  title: 'Multiple Top Award Winning',
  date: 'April 22, 2020',
  excerpt:
  'RégimA continues to set the standard in the skincare industry with another prestigious award recognition for excellence.',
  category: 'Awards'
},
{
  id: 2,
  title: 'Professional Beauty Awards 2020',
  date: 'April 20, 2020',
  excerpt:
  "We are thrilled to announce our success at this year's Professional Beauty Awards ceremony.",
  category: 'Awards'
},
{
  id: 3,
  title: 'Acne – Problems and Solution!',
  date: 'March 19, 2018',
  excerpt:
  'Understanding the root causes of acne and how our specialized treatments can help achieve clear skin.',
  category: 'Education'
}];

export function NewsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-[1170px] px-6">
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
          className="text-center mb-14">

          <h2 className="text-3xl md:text-4xl font-bold text-[#00082c] mb-4">
            Latest News
          </h2>
          <div className="w-16 h-0.5 bg-[#41cde0] mx-auto mb-5"></div>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
            Stay updated with the latest news, awards, and insights from the
            RégimA team
          </p>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {newsItems.map((item, index) =>
          <NewsCard key={item.id} item={item} index={index} />
          )}
        </div>

        {/* Newsletter */}
        <NewsletterSignup />
      </div>
    </section>);

}
function NewsCard({
  item,
  index



}: {item: (typeof newsItems)[0];index: number;}) {
  return (
    <motion.article
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
        duration: 0.5,
        delay: index * 0.1
      }}
      className="group cursor-pointer">

      <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        {/* Header */}
        <div className="h-44 bg-gradient-to-br from-[#00082c] to-[#001a4d] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#41cde0_0%,transparent_50%)] opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#00082c] to-transparent"></div>

          <div className="absolute top-4 left-4">
            <span className="bg-[#41cde0] text-[#00082c] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
              {item.category}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/80 text-xs">
            <Calendar size={12} />
            <span>{item.date}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-[#00082c] mb-2 group-hover:text-[#41cde0] transition-colors">
            {item.title}
          </h3>
          <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-3">
            {item.excerpt}
          </p>
          <div className="flex items-center text-[#00082c] font-semibold text-xs group-hover:text-[#41cde0] transition-colors">
            Read Article
            <ArrowRight
              size={14}
              className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />

          </div>
        </div>
      </div>
    </motion.article>);

}
function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };
  return (
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
      className="bg-[#00082c] rounded-xl p-8 md:p-10 relative overflow-hidden">

      <div className="absolute top-0 right-0 w-72 h-72 bg-[#41cde0]/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#41cde0]/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10 max-w-xl mx-auto text-center">
        <div className="w-14 h-14 bg-[#41cde0]/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <Mail size={24} className="text-[#41cde0]" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">
          Join the RégimA Community
        </h3>
        <p className="text-white/50 mb-6 text-sm">
          Subscribe to receive updates, exclusive deals, and skincare tips from
          our experts.
        </p>

        {status === 'success' ?
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          className="bg-[#41cde0]/20 text-[#41cde0] p-4 rounded-lg flex items-center justify-center gap-2 text-sm">

            <CheckCircle size={18} />
            <span>Thank you for subscribing!</span>
          </motion.div> :

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3">

            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-5 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#41cde0] transition-colors"
            required />

            <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-[#41cde0] text-[#00082c] font-bold px-6 py-3.5 rounded-lg hover:bg-[#5dd8eb] transition-colors disabled:opacity-70 flex items-center justify-center gap-2 text-sm">

              {status === 'loading' ?
            <Loader2 size={18} className="animate-spin" /> :

            'Subscribe'
            }
            </button>
          </form>
        }
      </div>
    </motion.div>);

}