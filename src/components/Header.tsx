import React from 'react';
import { NavLink } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-white border-b-8 border-black z-50">
      <div className="font-display text-4xl leading-none text-black">
        KidDo
      </div>
      <nav className="hidden md:flex gap-8 font-label text-sm font-bold text-black">
        <NavLink to="/" className="hover:underline">HOME</NavLink>
        <NavLink to="/download" className="hover:underline">DOWNLOAD</NavLink>
        <NavLink to="/auth" className="hover:underline">LOGIN</NavLink>
      </nav>
      <button className="neo-shadow-black border-4 border-black bg-[#ccff00] px-6 py-3 font-label text-sm font-bold text-black transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
        GET EARLY ACCESS
      </button>
    </header>
  );
};
