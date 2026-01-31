import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Heart,
  ChevronUp,
  Facebook,
  Twitter,
  Linkedin } from
'lucide-react';
export function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <>
      <footer className="bg-[#1a1d1f] text-[#8a8f97]">
        <div className="mx-auto max-w-[1170px] px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <FooterLovedProducts />
            <FooterInformation />
            <FooterRecentPosts />
            <FooterContactInfo />
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="bg-[#151718] text-[#55575b]">
        <div className="mx-auto max-w-[1170px] px-6 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs">
              © 2016{' '}
              <a href="#" className="hover:text-[#41cde0] transition-colors">
                RégimA
              </a>
              . All Rights Reserved.
            </p>

            <div className="flex items-center gap-2">
              <SocialLink
                href="https://www.facebook.com/regimaglobal/"
                icon={Facebook}
                label="Facebook" />

              <SocialLink
                href="https://twitter.com/RegimaZone"
                icon={Twitter}
                label="Twitter" />

              <SocialLink
                href="https://www.linkedin.com/company/régima-global"
                icon={Linkedin}
                label="LinkedIn" />

            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop &&
        <motion.button
          onClick={scrollToTop}
          initial={{
            opacity: 0,
            scale: 0.8
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 0.8
          }}
          whileHover={{
            scale: 1.1
          }}
          whileTap={{
            scale: 0.95
          }}
          className="fixed bottom-6 right-6 z-[9999] w-11 h-11 flex items-center justify-center text-[#00082c] bg-[#41cde0] rounded-full shadow-lg"
          aria-label="Back to top">

            <ChevronUp size={20} />
          </motion.button>
        }
      </AnimatePresence>
    </>);

}
function SocialLink({
  href,
  icon: Icon,
  label




}: {href: string;icon: typeof Facebook;label: string;}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full border border-[#3a3d40] flex items-center justify-center text-[#55575b] hover:border-[#41cde0] hover:text-[#41cde0] transition-all duration-300"
      aria-label={label}>

      <Icon size={14} />
    </a>);

}
function FooterLovedProducts() {
  const products = [
  {
    href: '#',
    title: 'Scar Repair Forte Serum',
    image:
    'https://regimazone.org/wp-content/uploads/2016/02/Product-Home-Page-Product-Page-480-x-300px-Sf-24.3.2016-150x150.jpg',
    category: 'Repairing',
    likes: 183
  },
  {
    href: '#',
    title: 'Epi-Genes Xpress',
    image:
    'https://regimazone.org/wp-content/uploads/2016/07/Epi-Gene-Express-480-x-300px-X-23.5.2016-V2-150x150.jpg',
    category: 'Anti-Ageing',
    likes: 86
  }];

  return (
    <div>
      <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-6">
        Most Loved Products
      </h3>
      <div className="space-y-4">
        {products.map((product, index) =>
        <a key={index} href={product.href} className="flex gap-3 group">
            <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-[#00082c]">
              <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover" />

            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-[#41cde0] uppercase tracking-wider mb-0.5">
                {product.category}
              </p>
              <h4 className="text-white text-xs leading-tight mb-1 group-hover:text-[#41cde0] transition-colors line-clamp-2">
                {product.title}
              </h4>
              <div className="flex items-center gap-1 text-[#55575b] text-[10px]">
                <Heart size={10} />
                <span>{product.likes}</span>
              </div>
            </div>
          </a>
        )}
      </div>
    </div>);

}
function FooterInformation() {
  const links = [
  'Home',
  'Products',
  'News',
  'About Us',
  'Contact Us',
  'FAQs',
  'Testimonials'];

  return (
    <div>
      <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-6">
        Information
      </h3>
      <ul className="space-y-2.5">
        {links.map((link, index) =>
        <li key={index}>
            <a
            href="#"
            className="text-sm text-[#8a8f97] hover:text-[#41cde0] hover:pl-1 transition-all duration-300 inline-block">

              {link}
            </a>
          </li>
        )}
      </ul>
    </div>);

}
function FooterRecentPosts() {
  const posts = [
  {
    title: 'Multiple Top Award Winning',
    date: 'April 22, 2020'
  },
  {
    title: 'Professional Beauty Awards 2020',
    date: 'April 20, 2020'
  }];

  return (
    <div>
      <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-6">
        Recent Posts
      </h3>
      <div className="space-y-4">
        {posts.map((post, index) =>
        <a key={index} href="#" className="flex gap-3 group">
            <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-[#00082c] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#41cde0]/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#41cde0]"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-xs leading-tight mb-1.5 group-hover:text-[#41cde0] transition-colors line-clamp-2">
                {post.title}
              </h4>
              <p className="text-[10px] text-[#55575b] italic">{post.date}</p>
            </div>
          </a>
        )}
      </div>
    </div>);

}
function FooterContactInfo() {
  return (
    <div>
      <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-6">
        Contact Info
      </h3>
      <div className="border border-[#2f3034] rounded-lg p-4">
        <p className="text-xs mb-4 leading-relaxed">
          We would love to hear from you! Contact us to find out exactly what
          you need.
        </p>
        <div className="space-y-2.5 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin size={12} className="text-[#41cde0] mt-0.5 flex-shrink-0" />
            <span>
              50 van Buuren road, Bedfordview, 2008, Gauteng, South Africa
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone size={12} className="text-[#41cde0] flex-shrink-0" />
            <span>011 615 2869</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail size={12} className="text-[#41cde0] flex-shrink-0" />
            <a
              href="mailto:info@regima.com"
              className="hover:text-[#41cde0] transition-colors">

              info@regima.com
            </a>
          </div>
        </div>
      </div>
    </div>);

}