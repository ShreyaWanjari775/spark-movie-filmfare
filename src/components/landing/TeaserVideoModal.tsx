import React, { useEffect, useRef } from 'react';
import { X, Film, Volume2 } from 'lucide-react';

interface TeaserVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
  posterSrc?: string;
}

export const TeaserVideoModal: React.FC<TeaserVideoModalProps> = ({
  isOpen,
  onClose,
  videoSrc = '/videos/fnc-teaser.mp4',
  posterSrc = 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Pause video if modal is closed
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="FnC Movie Night Event Teaser Video"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#050d1a] border border-[#00c2e0]/35 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,194,224,0.3)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-[#00c2e0]/20 flex items-center justify-between bg-[#030712]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#062831] border border-[#00c2e0]/30 flex items-center justify-center text-[#00f5d4]">
              <Film className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-['Cinzel',serif] text-sm sm:text-base font-bold text-white tracking-wider">
                FnC MOVIE NIGHT • OFFICIAL TEASER
              </h3>
              <p className="text-[10px] text-[#a5f3fc]/60 tracking-widest uppercase">
                SPark Cultural Committee
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#062831]/60 hover:bg-[#062831] text-[#a5f3fc] hover:text-white border border-[#00c2e0]/30 transition-all"
            aria-label="Close teaser player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 16:9 Video Player Container (User-controlled playback, NO autoplay sound) */}
        <div className="relative aspect-video w-full bg-[#02050b] flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            controls
            playsInline
            controlsList="nodownload"
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video streaming.
          </video>
        </div>

        {/* Footer Notes & Video Source Swapper Instructions */}
        <div className="px-5 py-3.5 bg-[#030712] border-t border-[#00c2e0]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#a5f3fc]/70">
          <div className="flex items-center gap-2 text-[11px]">
            <Volume2 className="w-3.5 h-3.5 text-[#00f5d4]" />
            <span>Sound is user-controlled. Adjust volume on playback controls.</span>
          </div>

          <div className="text-[10px] text-[#a5f3fc]/50">
            Replace video asset anytime via <code className="text-[#00f5d4] bg-[#062831] px-1 py-0.5 rounded">public/videos/fnc-teaser.mp4</code>
          </div>
        </div>
      </div>
    </div>
  );
};
