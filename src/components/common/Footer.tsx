import React from 'react';
import { Calendar, MapPin, Award } from 'lucide-react';
import { EVENT_DETAILS } from '../../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-[#00c2e0]/20 bg-[#02050b] overflow-hidden pt-16 pb-12">
      {/* Background radial teal glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[#062831]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-[#00c2e0]/10">
          {/* Brand Column */}
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/spark-logo.png" 
                alt="SPark Logo" 
                className="w-8 h-10 object-contain drop-shadow-[0_0_12px_rgba(0,194,224,0.5)]" 
              />
              <div>
                <h3 className="font-['Cinzel',serif] text-base font-bold tracking-[0.16em] text-white">
                  SPARK MOVIE FILMFARE
                </h3>
                <p className="text-xs uppercase tracking-widest text-[#00c2e0] font-semibold">
                  {EVENT_DETAILS.eventName}
                </p>
              </div>
            </div>
            <p className="text-xs text-[#a5f3fc]/60 leading-relaxed max-w-sm">
              The flagship cinematic awards campaign presented by the SPark Cultural Society for FnC Movie Night. Celebrating the films that defined our collective imagination.
            </p>
          </div>

          {/* Event Schedule Info */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#a5f3fc] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00f5d4]" />
              Event Schedule
            </h4>
            <div className="space-y-2 text-xs text-[#e0f7fa]/80">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c2e0]" />
                <strong className="text-white">Voting Closes:</strong> Day of FnC at 4:00 PM
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]" />
                <strong className="text-white">Winners Crowned:</strong> Live during Movie Night (7:00 PM)
              </p>
              <p className="flex items-center gap-2 text-[#a5f3fc]/70">
                <MapPin className="w-3.5 h-3.5 text-[#00c2e0]" />
                {EVENT_DETAILS.venue}
              </p>
            </div>
          </div>

          {/* Fair Play & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#a5f3fc] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#00c2e0]" />
              Fair Play Guarantee
            </h4>
            <p className="text-xs text-[#a5f3fc]/60 leading-relaxed">
              Every sealed ballot is recorded with cryptographic integrity. Organizers will unveil certified audience vote counts on the big screen during the live screening.
            </p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#a5f3fc]/50 gap-4">
          <p>
            © {new Date().getFullYear()} SPark Cultural Committee • FnC Movie Night. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-[#a5f3fc]/70">
            Crafted with passion for cinema by SPark
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] inline-block animate-pulse" />
          </p>
        </div>
      </div>
    </footer>
  );
};
