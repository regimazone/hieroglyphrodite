import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Sparkles } from 'lucide-react';
interface Product {
  id: number;
  title: string;
  category: string;
  image: string;
  description?: string;
}
interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}
const categoryLabels: Record<string, string> = {
  cleansing: 'Cleansing',
  'anti-ageing': 'Anti-Ageing',
  repairing: 'Repairing',
  'problem-skin': 'Problem Skin',
  'eye-care': 'Eye Care'
};
export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!product) return null;
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.3
          }}
          onClick={onClose}
          className="fixed inset-0 bg-[#00082c]/90 backdrop-blur-sm z-[10000]" />


          {/* Modal Container */}
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 400
            }}
            className="bg-white w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col md:flex-row max-h-[90vh]">

              {/* Image Section */}
              <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-8 md:p-12 flex items-center justify-center relative">
                <motion.img
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  delay: 0.15,
                  duration: 0.4
                }}
                src={product.image}
                alt={product.title}
                className="max-h-[350px] w-auto object-contain" />


                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-[#41cde0] text-[#00082c] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded">
                    {categoryLabels[product.category] || product.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col relative">
                {/* Close Button */}
                <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300"
                aria-label="Close modal">

                  <X size={22} />
                </button>

                <div className="flex-1">
                  {/* Title */}
                  <motion.div
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: 0.2
                  }}>

                    <h2 className="text-2xl md:text-3xl font-bold text-[#00082c] mb-3 leading-tight pr-8">
                      {product.title}
                    </h2>
                    <div className="w-12 h-1 bg-[#41cde0] mb-6"></div>
                  </motion.div>

                  {/* Description */}
                  <motion.p
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: 0.25
                  }}
                  className="text-gray-600 leading-relaxed mb-6">

                    {product.description ||
                  "Experience the transformative power of RégimA's advanced formulation. This product is designed to target specific skin concerns while maintaining optimal skin health."}
                  </motion.p>

                  {/* Features */}
                  <motion.div
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: 0.3
                  }}
                  className="flex items-center gap-2 text-sm text-gray-500 mb-8">

                    <Sparkles size={16} className="text-[#41cde0]" />
                    <span>Professional Grade • Dermatologist Tested</span>
                  </motion.div>
                </div>

                {/* Actions */}
                <motion.div
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.35
                }}
                className="space-y-4">

                  <div className="flex gap-3">
                    <button className="flex-1 bg-[#00082c] text-white py-4 px-6 rounded-lg font-bold uppercase tracking-wide text-sm flex items-center justify-center gap-2 hover:bg-[#001a4d] transition-colors duration-300">
                      <ShoppingBag size={18} />
                      Add to Cart
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-300">
                      <Heart size={22} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    Free shipping on orders over R1000
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}