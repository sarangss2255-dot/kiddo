import React from 'react';

const tickers = [
  { sym: 'CHORES DONE', price: '45,230' },
  { sym: 'POINTS EARNED', price: '1,450.2K' },
  { sym: 'ACTIVE STREAKS', price: '14,280' },
  { sym: 'FAMILIES JOINED', price: '5,432' },
  { sym: 'REWARDS CLAIMED', price: '4,200' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t-8 border-white flex items-center px-6 z-50">
      {/* Left: Live status */}
      <div className="flex items-center gap-3 w-48 border-r-4 border-white pr-4">
        <div className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full bg-[#ccff00]"></span>
          <span className="relative inline-flex h-4 w-4 bg-[#ccff00]"></span>
        </div>
        <span className="font-label text-sm font-bold text-white uppercase">
          LIVE SYSTEM
        </span>
      </div>

      {/* Center: Ticker */}
      <div className="flex-1 overflow-hidden flex ml-4">
        <div className="flex animate-[slide-in-right_30s_linear_infinite] whitespace-nowrap gap-12">
          {tickers.map((t, i) => (
            <div key={i} className="flex gap-4 items-center">
              <span className="font-label text-sm font-bold text-[#ccff00] uppercase">
                {t.sym}
              </span>
              <span className="font-display text-2xl text-white">
                {t.price}
              </span>
            </div>
          ))}
          {/* Duplicate for seamless looping */}
          {tickers.map((t, i) => (
            <div key={`dup-${i}`} className="flex gap-4 items-center">
              <span className="font-label text-sm font-bold text-[#ccff00] uppercase">
                {t.sym}
              </span>
              <span className="font-display text-2xl text-white">
                {t.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};
