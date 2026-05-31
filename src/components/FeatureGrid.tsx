import React from 'react';
import { Star, ShieldCheck, Zap, Heart } from 'lucide-react';

const features = [
  { title: 'GAMIFIED', value: '100%', desc: 'Earn points and streaks', icon: Star, color: '#ccff00' },
  { title: 'CONTROLS', value: 'ROLE', desc: 'Secure parental controls', icon: ShieldCheck, color: 'white' },
  { title: 'SETUP TIME', value: '2m', desc: 'Quick routine creation', icon: Zap, color: '#ccff00' },
  { title: 'USAGE', value: '24/7', desc: 'Offline ready core features', icon: Heart, color: 'white' },
];

export const FeatureGrid: React.FC = () => {
  return (
    <section className="border-b-8 border-black bg-[#121212] px-4 py-24 md:px-6 lg:px-8">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="neo-shadow-white border-8 border-black p-8 flex flex-col justify-between transition-transform hover:-translate-y-2 hover:shadow-none"
            style={{ backgroundColor: f.color }}
          >
            <div className="border-4 border-black bg-black text-white p-3 inline-flex self-start">
              <f.icon size={24} />
            </div>
            <div className="mt-8">
              <div className="font-label text-xs font-bold text-black tracking-widest uppercase">
                {f.title}
              </div>
              <div className="font-display text-6xl leading-none text-black mt-4 mb-2">
                {f.value}
              </div>
              <div className="font-sans font-bold text-black mt-4 border-t-4 border-black pt-4">
                {f.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
