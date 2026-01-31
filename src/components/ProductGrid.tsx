import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Eye } from 'lucide-react';
import { ProductModal } from './ProductModal';
const products = [
{
  id: 1,
  title: 'Derma Deep Rich Creamy Cleanser',
  category: 'cleansing',
  image:
  'https://regimazone.org/wp-content/uploads/2020/02/Product-Home-Page-Product-Page-Derma-Deep-Rich-Creamy-Cleanser-22-November-2017-1170-x-500px-870x500.jpg',
  description:
  'A luxurious creamy cleanser that deeply purifies while maintaining skin hydration. Perfect for dry and sensitive skin types.'
},
{
  id: 2,
  title: '"On Q" Quenching Facial Oil',
  category: 'anti-ageing',
  image:
  'https://regimazone.org/wp-content/uploads/2019/09/Website-Zone-Products-on-Background-3-September-2019-On-Q-Quenching-Facial-Oil-870x532.png',
  description:
  'Rich in essential fatty acids and antioxidants, this facial oil restores suppleness and provides intense nourishment.'
},
{
  id: 3,
  title: 'Laser Azu-Repair',
  category: 'repairing',
  image:
  'https://regimazone.org/wp-content/uploads/2016/02/Product-Home-Page-Product-Page-1170-x-500px-La-24.3.2016-870x532.jpg',
  description:
  'Specifically formulated to aid skin recovery after laser treatments or peels. Reduces redness and inflammation effectively.'
},
{
  id: 4,
  title: 'Acne Attack – Rescue Serum',
  category: 'problem-skin',
  image:
  'https://regimazone.org/wp-content/uploads/2017/04/Product-Home-Page-Product-Page-Acne-Attack-Rescue-Serum-13-March-2017-480-x-300px-870x532.jpg',
  description:
  'A potent serum targeting active acne and breakouts. Helps to clear congestion and prevent future flare-ups.'
},
{
  id: 5,
  title: 'Techno 5',
  category: 'anti-ageing',
  image:
  'https://regimazone.org/wp-content/uploads/2016/02/Product-Home-Page-Product-Page-1170-x-500px-T5-24.3.2016-870x532.jpg',
  description:
  'Advanced anti-ageing complex utilizing 5 different technologies to combat signs of aging and improve skin texture.'
},
{
  id: 6,
  title: 'Eye Opener Serum',
  category: 'eye-care',
  image:
  'https://regimazone.org/wp-content/uploads/2016/02/Product-Home-Page-Product-Page-1170-x-500px-Eo-24.3.2016-870x532.jpg',
  description:
  'Revitalizing eye serum that targets puffiness, dark circles, and fine lines for a refreshed appearance.'
}];

const categories = [
{
  id: 'all',
  label: 'All Products'
},
{
  id: 'anti-ageing',
  label: 'Anti-Ageing'
},
{
  id: 'cleansing',
  label: 'Cleansing'
},
{
  id: 'eye-care',
  label: 'Eye Care'
},
{
  id: 'problem-skin',
  label: 'Problem Skin'
},
{
  id: 'repairing',
  label: 'Repairing'
}];

const categoryLabels: Record<string, string> = {
  cleansing: 'Cleansing',
  'anti-ageing': 'Anti-Ageing',
  repairing: 'Repairing',
  'problem-skin': 'Problem Skin',
  'eye-care': 'Eye Care'
};
export function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[0] | null>(
    null);
  const filteredProducts =
  activeFilter === 'all' ?
  products :
  products.filter((p) => p.category === activeFilter);
  return (
    <div>
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)} />


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
          className="text-center mb-12">

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Products
          </h2>
          <div className="w-16 h-0.5 bg-[#41cde0] mx-auto mb-5"></div>
          <p className="text-white/50 max-w-xl mx-auto text-sm md:text-base">
            Discover our range of professional skincare solutions designed to
            transform your skin
          </p>
        </motion.div>

        {/* Filter Buttons */}
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
            duration: 0.6,
            delay: 0.1
          }}
          className="mb-10">

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) =>
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`
                  text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 
                  transition-all duration-300 border rounded
                  ${activeFilter === cat.id ? 'bg-[#41cde0] text-[#00082c] border-[#41cde0]' : 'bg-transparent text-white/60 border-white/20 hover:border-[#41cde0] hover:text-white'}
                `}>

                {cat.label}
              </button>
            )}
          </div>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) =>
            <motion.div
              key={product.id}
              layout
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
                scale: 0.95
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.05
              }}
              className="group cursor-pointer"
              onClick={() => setSelectedProduct(product)}>

                <div className="relative overflow-hidden rounded-lg bg-white">
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00082c] via-[#00082c]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <span className="text-[#41cde0] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      {categoryLabels[product.category]}
                    </span>
                    <h3 className="text-white text-base font-bold leading-snug mb-3">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white text-xs font-medium">
                      <Eye size={14} />
                      <span>Quick View</span>
                      <ChevronRight size={14} className="ml-auto" />
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-[#00082c]/80 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                    {categoryLabels[product.category]}
                  </div>
                </div>

                {/* Mobile Title */}
                <div className="mt-3 lg:hidden">
                  <h3 className="text-white font-semibold text-sm">
                    {product.title}
                  </h3>
                  <p className="text-[#41cde0] text-xs">
                    {categoryLabels[product.category]}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          className="text-center py-16 text-white/40 text-sm">

            No products found in this category.
          </motion.div>
        }
      </div>
    </div>);

}