import React, { useState, useEffect } from 'react';
import { Lock, Sparkles, Play, Share2, Ticket } from 'lucide-react';
import { MovieRecommendationForm } from '../common/MovieRecommendationForm';
import { TeaserVideoModal } from '../landing/TeaserVideoModal';
import { FNC_REGISTRATION_URL } from '../../lib/eventLinks';

interface PostVoteSequenceProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
}

export const PostVoteSequence: React.FC<PostVoteSequenceProps> = ({
  isOpen,
  selectedCount
}) => {
  // Step 1: "BALLOT SEALED"
  // Step 2: "BUT THE NIGHT HASN'T EVEN STARTED YET..."
  // Step 3: Dedicated FnC Teaser Section & "SEE YOU AT FnC"
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isTeaserOpen, setIsTeaserOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setIsTeaserOpen(false);
      return;
    }

    // Step 1 -> Step 2 after 1.8s
    const timer1 = setTimeout(() => {
      setStep(2);
    }, 1800);

    // Step 2 -> Step 3 after another 1.8s
    const timer2 = setTimeout(() => {
      setStep(3);
    }, 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#02050b]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fade-in">
      {/* Background radial ambiance */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-[#062831] via-[#00c2e0]/20 to-[#00f5d4]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* STEP 1: BALLOT SEALED */}
      {step === 1 && (
        <div className="relative z-10 max-w-md mx-auto space-y-6 animate-scale-up">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#00c2e0]/20 animate-ping" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#062831] to-[#00c2e0] border border-[#00f5d4] flex items-center justify-center shadow-[0_0_35px_rgba(0,245,212,0.6)]">
              <Lock className="w-9 h-9 text-[#02050b] stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#00f5d4]">
              SPark Movie Filmfare
            </span>
            <h2 className="font-['Cinzel',serif] text-3xl sm:text-4xl font-extrabold text-white tracking-[0.16em]">
              BALLOT SEALED.
            </h2>
            <p className="text-xs text-[#a5f3fc]/70 font-light max-w-xs mx-auto">
              Your ballot with {selectedCount} selections was recorded successfully.
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: BUT THE NIGHT HASN'T EVEN STARTED YET... */}
      {step === 2 && (
        <div className="relative z-10 max-w-xl mx-auto space-y-4 animate-fade-in">
          <div className="w-12 h-14 mx-auto mb-2 opacity-80">
            <img 
              src="/spark-logo.png" 
              alt="SPark Flame" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_#00c2e0]" 
            />
          </div>

          <h2 className="font-['Cinzel',serif] text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#a5f3fc] to-[#00c2e0] leading-snug">
            BUT THE NIGHT HASN'T <br /> EVEN STARTED YET...
          </h2>
          <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#00f5d4] font-semibold">
            FnC Movie Night Is Waiting For You
          </p>
        </div>
      )}

      {/* STEP 3: DEDICATED FnC TEASER EXPERIENCE */}
      {step === 3 && (
        <div className="relative z-10 max-w-3xl w-full mx-auto space-y-8 animate-fade-in py-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#062831]/80 border border-[#00c2e0]/40 text-[#00f5d4] text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>A Little Preview of What's Coming</span>
            </div>
            
            <h2 className="font-['Cinzel',serif] text-2xl sm:text-4xl font-bold text-white tracking-wide">
              FnC MOVIE NIGHT
            </h2>
            <p className="text-xs sm:text-sm text-[#a5f3fc]/70 max-w-md mx-auto font-light">
              Watch the exclusive teaser. Feel the energy of open-air cinema, student crowds, and live award announcements.
            </p>
          </div>

          {/* Teaser video */}
          <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-[#00c2e0]/40 bg-[#050d1a] shadow-[0_0_50px_rgba(0,194,224,0.3)] group">
            <button
              type="button"
              onClick={() => setIsTeaserOpen(true)}
              className="absolute inset-0 flex flex-col items-center justify-center bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(2,5,11,0.9), rgba(3,7,18,0.65)), url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop')`
              }}
              aria-label="Play FnC event teaser"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00f5d4] bg-[#02050b]/80 text-[#00f5d4] shadow-[0_0_35px_rgba(0,194,224,0.8)] transition-transform group-hover:scale-110 sm:h-20 sm:w-20">
                <Play className="ml-1 h-8 w-8 fill-current" />
              </span>
              <span className="mt-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#a5f3fc]">
                Watch FnC Event Teaser
              </span>
            </button>
          </div>

          <MovieRecommendationForm />

          {/* Shareable Instagram Story Digital Card */}
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#050d1a]/80 border border-[#00c2e0]/30 shadow-[0_0_30px_rgba(0,194,224,0.15)] text-left flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#00f5d4]">
                <Ticket className="w-3.5 h-3.5" />
                BALLOT SEALED
              </span>
              <h4 className="font-['Cinzel',serif] text-sm sm:text-base font-bold text-white">
                🎟️ SPARK MOVIE FILMFARE
              </h4>
              <p className="text-xs text-[#a5f3fc]/70">
                "I CAST MY VOTE 🍿"
              </p>
            </div>

            <button
              onClick={() => alert("Story card preview ready! In Phase 2 this exports an Instagram Story graphic.")}
              className="px-3.5 py-2 rounded-xl bg-[#062831] hover:bg-[#00c2e0]/20 border border-[#00c2e0]/30 text-xs font-bold text-[#a5f3fc] hover:text-white transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              <Share2 className="w-3.5 h-3.5 text-[#00f5d4]" />
              <span>Share</span>
            </button>
          </div>

          {/* Simple Final CTA */}
          <div className="pt-2">
            <a
              href={FNC_REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#062831] via-[#00c2e0] to-[#00f5d4] text-white font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,194,224,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              SEE YOU AT FnC
            </a>
          </div>
        </div>
      )}
      <TeaserVideoModal
        isOpen={isTeaserOpen}
        onClose={() => setIsTeaserOpen(false)}
      />
    </div>
  );
};
