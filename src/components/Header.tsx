import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9999] h-[65px] transition-all duration-300 ${isScrolled ? 'bg-[#00082c]/95 backdrop-blur-md shadow-lg' : 'bg-[#00082c]'}`}>

      <div className="mx-auto max-w-[1170px] h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <img
            src="https://regimazone.org/wp-content/uploads/2016/07/RegimA-the-Zone-Logo-for-Menu-Bar-24.6.2016.png"
            alt="RégimA"
            className={`transition-all duration-300 ${isScrolled ? 'h-[45px]' : 'h-[55px]'}`} />

        </a>

        {/* Navigation */}
        <Navigation />
      </div>
    </header>);

}