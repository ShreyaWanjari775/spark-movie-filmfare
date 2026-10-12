import React, { useState } from 'react';
import { Play, Sparkles, ChevronDown, Calendar, MapPin, Award } from 'lucide-react';
import { FnCCinematicBackground } from './FnCCinematicBackground';
import { TeaserVideoModal } from './TeaserVideoModal';

interface HeroSectionProps {
  onCastVoteClick: () => void;
  onExploreClick: () => void;
  eyebrow?: string;
  heading?: string;
  supportingLine?: string;
  tagline?: string;
  description?: string;
  date?: string;
  venue?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onCastVoteClick, 
  onExploreClick,
  eyebrow = "THE BIGGEST NIGHT IN CINEMA",
  heading = "MOVIE FILMFARE",
  supportingLine = "FNC MOVIE NIGHT AWARDS",
  tagline = "Every genre has a legend. Every legend deserves its moment.",
  description = "The ultimate college cinema ballot. Pick your champions across genre categories, then watch the winners take the spotlight at Movie Night.",
  date = "APR 26, 2025",
  venue = "AMPHITHEATRE"
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section 
      aria-label="FnC Movie Night Hero Reveal"
      className="relative min-h-[95vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden"
    >
      {/* 1. THE APPROVED CINEMATIC REVEAL BACKGROUND (Matches Reference: Seating, Solitary Figure, Astronaut, Film Reel) */}
      <FnCCinematicBackground />

      {/* 2. FOREGROUND CONTENT: Typographic Composition from Approved Reference */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Eyebrow: THE BIGGEST NIGHT IN CINEMA */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#062831]/75 border border-[#00c2e0]/35 backdrop-blur-md mb-6 shadow-[0_0_25px_rgba(0,194,224,0.2)]">
          <img 
            src="/spark-logo.png" 
            alt="SPark Symbol" 
            className="w-3.5 h-4.5 object-contain filter drop-shadow-[0_0_6px_#00c2e0]" 
          />
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#a5f3fc]">
            {eyebrow}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
        </div>

        <h1 className="flex flex-col items-center leading-tight mb-4">
          <span className="font-['Cinzel',serif] font-black text-4xl sm:text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#a5f3fc] to-[#00c2e0] drop-shadow-[0_0_30px_rgba(0,194,224,0.5)]">
            {heading}
          </span>
          <span className="mt-3 font-['Cinzel',serif] text-sm sm:text-lg md:text-xl font-semibold tracking-[0.2em] text-white">
            {supportingLine}
          </span>
        </h1>

        <p className="max-w-2xl font-['Cinzel',serif] text-base sm:text-lg md:text-xl italic text-[#a5f3fc] mb-3 drop-shadow-[0_0_12px_rgba(0,194,224,0.3)]">
          “{tagline}”
        </p>
        <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-[#e0f7fa]/90 mb-6">
          {description}
        </p>

        {/* Date & Venue Metadata Badges (Matches Reference Image) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-10 text-xs tracking-widest uppercase font-bold text-[#e0f7fa]">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#050d1a]/85 border border-[#00c2e0]/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,40,49,0.5)]">
            <Calendar className="w-3.5 h-3.5 text-[#00c2e0]" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#050d1a]/85 border border-[#00c2e0]/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,40,49,0.5)]">
            <MapPin className="w-3.5 h-3.5 text-[#00f5d4]" />
            <span>{venue}</span>
          </div>
        </div>

        {/* Interactive Play Button (Circular Glow from Reference) & CTA */}
        <div className="flex flex-col items-center gap-5 w-full sm:w-auto px-4">
          
          {/* PRIMARY CTA: Circular Play Button + WATCH THE TEASER */}
          <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setIsVideoModalOpen(true)}>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#062831] via-[#00c2e0] to-[#00f5d4] p-[2px] shadow-[0_0_30px_rgba(0,194,224,0.6)] group-hover:scale-110 group-active:scale-95 transition-all duration-300">
              <div className="w-full h-full rounded-full bg-[#02050b]/90 backdrop-blur-md flex items-center justify-center">
                <Play className="w-6 h-6 text-[#00f5d4] ml-1 fill-[#00f5d4] group-hover:drop-shadow-[0_0_10px_#00f5d4] transition-all" />
              </div>
            </div>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-[0.22em] text-[#a5f3fc] group-hover:text-white group-hover:drop-shadow-[0_0_8px_#00c2e0] transition-colors">
              Watch The Teaser
            </span>
          </div>

          {/* Primary ballot CTA */}
          <button
            onClick={onCastVoteClick}
            className="mt-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#062831] via-[#00c2e0] to-[#00f5d4] p-[1.5px] font-bold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,194,224,0.6)] active:scale-95"
          >
            <div className="px-6 py-2 rounded-[10px] bg-[#030712] hover:bg-[#030712]/40 transition-colors flex items-center justify-center gap-2.5 text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#00f5d4]" />
              <span>Vote Now</span>
              <Award className="w-3.5 h-3.5 text-[#a5f3fc]" />
            </div>
          </button>
        </div>

        {/* SPark Editorial Committee identity */}
        <div className="mt-12 flex flex-col items-center gap-1 opacity-80 pointer-events-none">
          <img 
            src="/spark-logo.png" 
            alt="SPark" 
            className="w-5 h-6 object-contain filter drop-shadow-[0_0_8px_#00c2e0]" 
          />
          <span className="font-['Cinzel',serif] text-[11px] tracking-[0.32em] uppercase font-bold text-white">
            SPARK
          </span>
          <span className="text-[9px] tracking-[0.25em] uppercase text-[#a5f3fc]/70 font-semibold">
            EDITORIAL COMMITTEE
          </span>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="mt-10 flex flex-col items-center gap-1.5 text-[#a5f3fc]/50 hover:text-[#00c2e0] transition-colors cursor-pointer" 
          onClick={onExploreClick}
        >
          <span className="text-[9px] uppercase tracking-[0.25em] font-medium">Explore The Event</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#00c2e0]" />
        </div>
      </div>

      {/* Dedicated Video Modal */}
      <TeaserVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </section>
  );
};
