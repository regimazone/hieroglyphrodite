import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
const navItems = [
{
  label: 'Home',
  href: '/',
  active: true
},
{
  label: 'Products',
  href: '/products'
},
{
  label: 'News',
  href: '/news'
},
{
  label: 'About Us',
  href: '/about'
},
{
  label: 'Contact Us',
  href: '/contact'
},
{
  label: 'FAQs',
  href: '/faqs'
},
{
  label: 'Testimonials',
  href: '/testimonials'
}];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <ul className="flex items-center gap-1">
          {navItems.map((item) =>
          <li key={item.label}>
              <a
              href={item.href}
              className={`
                  px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200
                  ${item.active ? 'bg-white text-[#00082c]' : 'text-white hover:text-[#41cde0]'}
                `}>

                {item.label}
              </a>
            </li>
          )}
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-white"
        aria-label="Toggle menu">

        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      {mobileMenuOpen &&
      <div className="absolute top-[65px] left-0 right-0 bg-[#00082c] border-t border-white/10 md:hidden">
          <nav className="max-w-[1170px] mx-auto px-6 py-4">
            <ul className="space-y-2">
              {navItems.map((item) =>
            <li key={item.label}>
                  <a
                href={item.href}
                className={`
                      block px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-200
                      ${item.active ? 'bg-white text-[#00082c]' : 'text-white hover:bg-white/10'}
                    `}>

                    {item.label}
                  </a>
                </li>
            )}
            </ul>
          </nav>
        </div>
      }
    </>);

}