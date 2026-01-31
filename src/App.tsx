import React from 'react';
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { Footer } from './components/Footer';
export function App() {
  return (
    <div className="w-full min-h-screen bg-[#00082c] bg-[url('https://regimazone.org/wp-content/uploads/2016/07/RegimA-Zone-Website-Main-Background-29.6.2016.jpg')] bg-no-repeat bg-cover bg-fixed text-white text-[15px] leading-relaxed overflow-x-hidden">
      <Header />
      <main className="pt-[65px]">
        <MainContent />
      </main>
      <Footer />
    </div>);

}