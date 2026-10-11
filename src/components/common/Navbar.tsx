import React from 'react';
import { Sparkles, Check } from 'lucide-react';

interface NavbarProps {
  onVoteClick: () => void;
  onReplayIntro?: () => void;
  hasVoted?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onVoteClick, onReplayIntro, hasVoted = false }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#00c2e0]/15 bg-[#030712]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <button 
          onClick={onReplayIntro}
          title="Click to replay cinematic SPark flame intro"
          className="flex items-center gap-3 group focus:outline-none text-left cursor-pointer flex-shrink-0"
        >
          <div className="relative w-8 h-10 sm:w-9 sm:h-11 flex-shrink-0 flex items-center justify-center">
            <img 
              src="/spark-logo.png" 
              alt="SPark Logo" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,194,224,0.4)] group-hover:drop-shadow-[0_0_14px_rgba(0,245,212,0.8)] transition-all duration-300"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-['Cinzel',serif] text-sm sm:text-base font-bold tracking-[0.18em] text-white flex items-center gap-1.5">
              SPARK <span className="text-[#00c2e0] font-normal">FILMFARE</span>
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold text-[#a5f3fc]/70">
              FnC MOVIE NIGHT
            </span>
          </div>
        </button>

        {/* Center / Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.18em] font-medium text-[#a5f3fc]/80">
          <a href="#about" className="hover:text-white hover:drop-shadow-[0_0_8px_#00c2e0] transition-colors">
            The Event
          </a>
          <a href="#categories" className="hover:text-white hover:drop-shadow-[0_0_8px_#00c2e0] transition-colors">
            Genre Awards
          </a>
          <a href="#rules" className="hover:text-white hover:drop-shadow-[0_0_8px_#00c2e0] transition-colors">
            Voting Rules
          </a>
        </nav>

        {/* Right Action: Status Pill & Vote CTA */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Status Indicator (Already Voted vs Voting Open) */}
          {hasVoted ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#062831]/90 border border-[#00f5d4]/40 shadow-[0_0_12px_rgba(0,245,212,0.2)]">
              <Check className="w-3.5 h-3.5 text-[#00f5d4]" />
              <span className="text-[10px] font-bold tracking-wider text-[#a5f3fc] uppercase">
                Ballot Submitted
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#062831]/80 border border-[#00c2e0]/30 shadow-[0_0_12px_rgba(0,194,224,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f5d4] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f5d4]"></span>
              </span>
              <span className="text-[10px] font-bold tracking-wider text-[#a5f3fc] uppercase">
                Voting Open
              </span>
            </div>
          )}

          {/* Cast Vote CTA Button */}
          <button
            onClick={onVoteClick}
            className="relative group overflow-hidden px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#062831] via-[#00c2e0] to-[#00f5d4] p-[1px] font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,194,224,0.5)] active:scale-95 cursor-pointer"
          >
            <div className="relative px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#030712] group-hover:bg-[#030712]/40 transition-colors flex items-center gap-1.5 text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#00f5d4]" />
              <span className="font-['Plus_Jakarta_Sans',sans-serif] tracking-wider">
                {hasVoted ? 'View Picks' : 'Vote Now'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
