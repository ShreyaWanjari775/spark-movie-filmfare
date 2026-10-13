import React from 'react';
import { Film, Sparkles, Video, ArrowRight } from 'lucide-react';
import { Reveal } from '../common/Reveal';

interface EventTeaserBannerProps {
  onVoteClick: () => void;
}

export const EventTeaserBanner: React.FC<EventTeaserBannerProps> = ({ onVoteClick }) => {
  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden border border-[#00c2e0]/30 bg-[#050d1a] shadow-[0_0_60px_rgba(0,194,224,0.15)]">
        {/* Background Visual Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-[1px]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#050d1a]/90 to-[#062831]/75" />

        <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
          <Reveal delay={0} className="max-w-2xl space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#062831]/90 border border-[#00c2e0]/40 text-[#00f5d4] text-[11px] font-bold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cultural Fest Highlight</span>
            </div>

            <h3 className="font-['Cinzel',serif] text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide leading-tight">
              FnC Movie Night: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a5f3fc] via-[#00c2e0] to-[#00f5d4]">
                The Silver Screen Returns
              </span>
            </h3>

            <p className="text-sm sm:text-base text-[#a5f3fc]/80 font-light leading-relaxed">
              Every college semester needs an unforgettable night under the night sky. Join hundreds of students at the amphitheatre for giant open-air screenings, live student performances, and the crowning of this year's SPark Filmfare champions.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-[#e0f7fa]">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#030712]/70 border border-[#00c2e0]/20">
                <Video className="w-4 h-4 text-[#00c2e0]" />
                Giant 4K Open-Air Projection
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#030712]/70 border border-[#00c2e0]/20">
                <Film className="w-4 h-4 text-[#00f5d4]" />
                Certified Audience Winners
              </span>
            </div>
          </Reveal>

          {/* Right Action Box */}
          <Reveal delay={150} className="flex-shrink-0 w-full sm:w-auto flex flex-col items-center">
            <div className="p-6 rounded-2xl bg-[#030712]/90 border border-[#00c2e0]/35 text-center space-y-4 max-w-sm w-full backdrop-blur-md shadow-[0_0_30px_rgba(0,194,224,0.2)]">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#062831] border border-[#00c2e0]/40 flex items-center justify-center">
                <img 
                  src="/spark-logo.png" 
                  alt="SPark" 
                  className="w-7 h-8 object-contain filter drop-shadow-[0_0_8px_#00c2e0]" 
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-[#a5f3fc]/70 font-bold">
                  Your Vote Decides
                </p>
                <p className="text-sm font-['Cinzel',serif] font-bold text-white mt-1">
                  Don't Let Your Favourite Film Miss The Trophy
                </p>
              </div>

              <button
                onClick={onVoteClick}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#062831] via-[#00c2e0] to-[#00f5d4] text-white font-bold text-xs uppercase tracking-[0.16em] hover:shadow-[0_0_25px_rgba(0,194,224,0.6)] transition-all flex items-center justify-center gap-2"
              >
                <span>Vote In The Ballot</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
