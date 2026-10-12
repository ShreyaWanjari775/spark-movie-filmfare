import React from 'react';
import { ShieldCheck, Film, CheckCircle2, Lock, Shuffle, Eye } from 'lucide-react';

export const VotingRules: React.FC = () => {
  const rules = [
    {
      icon: <Film className="w-5 h-5 text-[#00c2e0]" />,
      title: "Movie-Only Nominations",
      desc: "Every nominee is a celebrated film. We celebrate the storytelling, spectacle, and cinematic experience as a whole."
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#00f5d4]" />,
      title: "One Choice Per Category",
      desc: "Select one film in every required active category. Optional categories may be left blank."
    },
    {
      icon: <Shuffle className="w-5 h-5 text-[#a5f3fc]" />,
      title: "Cross-Genre Freedom",
      desc: "If a film is nominated in multiple genres (e.g., both Best Sci-Fi and Best Action), you are free to pick it in both."
    },
    {
      icon: <Lock className="w-5 h-5 text-[#00c2e0]" />,
      title: "Browser-Based Deterrence",
      desc: "A successful ballot is remembered in this browser to deter casual repeat voting. This is not identity verification, and another browser or cleared storage can submit again."
    },
    {
      icon: <Eye className="w-5 h-5 text-[#00f5d4]" />,
      title: "Live Ceremony Reveal",
      desc: "Final vote counts remain strictly sealed until the official awards announcement live at FnC Movie Night."
    }
  ];

  return (
    <section id="rules" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-b from-[#050d1a] to-[#02050b] border border-[#00c2e0]/25 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-[0_0_50px_rgba(6,40,49,0.5)]">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00c2e0]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#062831]/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#062831] border border-[#00c2e0]/30 text-[#00c2e0] text-[11px] uppercase tracking-widest font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00f5d4]" />
            <span>Fair Play & Voting Integrity</span>
          </div>
          <h2 className="font-['Cinzel',serif] text-3xl sm:text-4xl font-bold text-white tracking-wide mb-3">
            How The Ballot Works
          </h2>
          <p className="text-xs sm:text-sm text-[#a5f3fc]/70 font-light leading-relaxed">
            Built for college students scanning from promotional posters and reels. Here is everything you need to know before sealing your votes.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#030712]/70 border border-[#00c2e0]/15 hover:border-[#00c2e0]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#062831] border border-[#00c2e0]/30 flex items-center justify-center">
                  {rule.icon}
                </div>
                <h3 className="font-['Cinzel',serif] text-base font-bold text-white">
                  {rule.title}
                </h3>
                <p className="text-xs text-[#a5f3fc]/70 leading-relaxed font-light">
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Quick Stat / CTA Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#062831] to-[#030712] border border-[#00f5d4]/40 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#00f5d4]">
                FnC Movie Night
              </span>
              <h3 className="font-['Cinzel',serif] text-lg font-bold text-white">
                Under The Stars
              </h3>
              <p className="text-xs text-[#e0f7fa]/80 leading-relaxed font-light">
                Grab your popcorn, bring your friends, and watch the big screen unveil the films you chose.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-xs font-bold text-[#00c2e0]">
              <span>7:00 PM • Main Amphitheatre</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
