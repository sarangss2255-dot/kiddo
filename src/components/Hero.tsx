import React from 'react';
import { Download } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="border-b-8 border-black bg-white px-4 py-32 text-black md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px] grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in">
          <div className="neo-shadow-black inline-flex rotate-[-2deg] border-4 border-black bg-[#ccff00] px-4 py-2 font-label text-xs font-bold mb-8">
            POWERED BY PERFORMANCE
          </div>
          
          <h1 className="font-display text-6xl leading-[0.85] md:text-[100px] uppercase">
            TRANSFORM<br />
            ROUTINES
          </h1>
          
          <p className="mt-8 text-2xl font-medium italic leading-tight max-w-xl">
            Make chores and routines meaningful with clear progress, rewards, and a brutalist gamified experience.
          </p>
          
          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="/kiddo-app.apk"
              download
              className="neo-shadow-black inline-flex items-center gap-3 border-4 border-black bg-[#ccff00] px-8 py-5 font-label text-base font-bold text-black transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <Download size={20} /> DOWNLOAD APK
            </a>
          </div>
        </div>

        <div className="relative flex items-center justify-center animate-slide-in-right">
          {/* Brutalist Hero Visual Placeholder */}
          <div className="neo-shadow-black border-8 border-black bg-[#121212] p-8 relative w-full aspect-square max-w-[500px]">
             <div className="absolute -top-6 -right-6 neo-shadow-white border-4 border-black bg-[#ccff00] p-4 font-label font-bold text-black rotate-12">
               🔥 420 kcal
             </div>
             <div className="absolute top-1/2 -left-8 neo-shadow-white border-4 border-black bg-white p-4 font-label font-bold text-black -rotate-6">
               🌟 7 Streak
             </div>
             <div className="w-full h-full border-4 border-white/20 bg-black flex items-center justify-center p-8">
               <div className="w-full h-full border-4 border-dashed border-[#ccff00] flex items-center justify-center">
                 <span className="font-display text-[#ccff00] text-3xl">APP PREVIEW</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
