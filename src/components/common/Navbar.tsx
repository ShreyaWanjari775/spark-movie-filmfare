import React from 'react';

interface NavbarProps {
  onHomeClick: () => void;
  onEventClick: () => void;
  onAwardsClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onHomeClick, onEventClick, onAwardsClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#00c2e0]/15 bg-[#030712]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <button 
          onClick={onHomeClick}
          className="flex items-center gap-3 group focus:outline-none text-left cursor-pointer flex-shrink-0"
          aria-label="SPark Filmfare: Movie Night home"
        >
          <div className="relative w-8 h-10 sm:w-9 sm:h-11 flex-shrink-0 flex items-center justify-center">
              <img
                src="/spark-logo.png"
                alt="SPark Logo"
                className="w-full h-full object-contain transition-all duration-300"
              />
          </div>
          <div className="flex flex-col">
            <span className="font-['Cinzel',serif] text-xs sm:text-base font-bold text-white">
              SPark Filmfare: Movie Night
            </span>
          </div>
        </button>

        <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-3 sm:gap-8 text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.14em] font-medium text-[#a5f3fc]/80">
          <button type="button" onClick={onEventClick} className="py-2 transition-colors hover:text-white">Event</button>
          <button type="button" onClick={onAwardsClick} className="py-2 transition-colors hover:text-white">Awards</button>
        </nav>
      </div>
    </header>
  );
};
