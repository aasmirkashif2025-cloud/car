import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ShowroomSettings, HeroSlideConfig } from '../types/crm';
import { DEFAULT_HERO_SLIDES } from '../data/seedSettings';

interface HeroProps {
  settings: ShowroomSettings;
  onExploreCollection: () => void;
  onDiscoverPhilosophy: () => void;
  onOpenBookingModal?: () => void;
  onSelectVehicle?: (vehicleId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onExploreCollection,
  onSelectVehicle,
}) => {
  // Use dynamic slides from settings (added/edited/removed in admin panel)
  const activeSlides: HeroSlideConfig[] = (
    settings.heroSlides && settings.heroSlides.length > 0
      ? settings.heroSlides.filter((s) => s.enabled !== false)
      : DEFAULT_HERO_SLIDES
  );

  // If no slides enabled, fall back to default
  const slides = activeSlides.length > 0 ? activeSlides : DEFAULT_HERO_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const touchStartX = useRef<number | null>(null);

  // Timer interval: configurable from settings, default 4000ms
  const slideDuration = settings.heroSlideDurationMs || 4000;

  // Slide navigation handlers
  const advanceToNext = () => {
    setDirection('next');
    setCurrentIndex((curr) => {
      setPrevIndex(curr);
      return (curr + 1) % slides.length;
    });
  };

  const advanceToPrev = () => {
    setDirection('prev');
    setCurrentIndex((curr) => {
      setPrevIndex(curr);
      return (curr - 1 + slides.length) % slides.length;
    });
  };

  const handleSlideSelect = (targetIndex: number) => {
    if (targetIndex === currentIndex) return;
    setDirection(targetIndex > currentIndex ? 'next' : 'prev');
    setPrevIndex(currentIndex);
    setCurrentIndex(targetIndex);
  };

  // Preload next slide in browser memory for zero-latency, buttery smooth transitions
  useEffect(() => {
    if (slides.length > 1) {
      const nextIndex = (currentIndex + 1) % slides.length;
      const nextSlide = slides[nextIndex];
      if (nextSlide?.image) {
        const img = new Image();
        img.src = nextSlide.image;
      }
    }
  }, [currentIndex, slides]);

  // Robust, continuous interval timer that NEVER stalls or gets stuck
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      advanceToNext();
    }, slideDuration);

    return () => clearInterval(interval);
  }, [slideDuration, slides.length]);

  // Touch swipe support for mobile/tablet devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        advanceToNext();
      } else {
        advanceToPrev();
      }
    }
    touchStartX.current = null;
  };

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight * 0.98,
      behavior: 'smooth',
    });
  };

  const currentSlide = slides[currentIndex % slides.length] || slides[0];

  return (
    <section 
      className="relative w-full h-screen min-h-[720px] flex flex-col justify-between overflow-hidden bg-[#08090a] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* =========================================================================
          BACKGROUND AUTOMOTIVE SLIDESHOW
          Shows exactly ONE car in the background at any given time.
          Slides smoothly horizontally every 4 seconds.
          All cars can be added, edited, or removed from the Admin Panel.
          ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slides.map((slide, index) => {
          let transform = 'translateX(100%)';
          let zIndex = 0;
          let opacity = 0;
          let transition = 'transform 1100ms cubic-bezier(0.16, 1, 0.3, 1), opacity 700ms ease';

          if (index === currentIndex) {
            transform = 'translateX(0%)';
            zIndex = 2;
            opacity = 1;
          } else if (index === prevIndex) {
            transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
            zIndex = 1;
            opacity = 1;
          } else {
            transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
            zIndex = 0;
            opacity = 0;
            transition = 'none';
          }

          return (
            <div
              key={slide.id || index}
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform,
                zIndex,
                opacity,
                transition,
              }}
            >
              <img
                src={slide.image}
                alt={slide.name}
                className="w-full h-full object-cover filter contrast-[1.06] brightness-[0.88]"
                style={{
                  objectPosition: slide.objectPosition || 'center',
                }}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding={index === 0 ? 'sync' : 'async'}
                {...({ fetchPriority: index === 0 ? 'high' : 'auto' })}
              />
            </div>
          );
        })}

        {/* Cinematic Atmospheric Contrast Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090a]/92 via-[#08090a]/45 to-transparent w-full md:w-[68%] z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-transparent to-[#08090a]/50 z-10 pointer-events-none" />
      </div>

      {/* Top spacer below fixed header */}
      <div className="h-28 sm:h-32" />

      {/* =========================================================================
          OVERSIZED EDITORIAL HEADLINE — STABLE & ART-DIRECTED
          No card around headline. Clean, confident typography.
          ========================================================================= */}
      <div className="relative z-20 w-full px-6 sm:px-12 lg:px-16 my-auto max-w-[1600px] mx-auto pointer-events-auto">
        <div className="max-w-4xl">
          
          {/* Eyebrow marker */}
          <div className="flex items-center space-x-3 mb-5 sm:mb-7 opacity-80">
            <span className="w-10 h-[1.5px] bg-[#c5a880]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a880] font-sans font-medium">
              {settings.heroHeadlines?.eyebrow || 'THE ART OF PERFORMANCE'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[94px] font-bold tracking-tight text-[#f4f2ec] uppercase leading-[0.94] mb-6 sm:mb-8 drop-shadow-sm">
            NOT JUST<br />
            A MACHINE.<br />
            <span className="text-white/60 font-light italic">A STATEMENT.</span>
          </h1>

          {/* Supporting text */}
          <p className="text-sm sm:text-lg text-[#f4f2ec]/80 font-light tracking-wide leading-relaxed max-w-lg mb-8 sm:mb-10 font-sans">
            {settings.heroHeadlines?.subhead || 'A considered collection of exceptional automobiles in Pakistan.'}
          </p>

          {/* Discreet collection link */}
          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={onExploreCollection}
              className="group text-xs sm:text-sm tracking-[0.26em] uppercase font-bold text-[#f4f2ec] hover:text-[#c5a880] transition-colors flex items-center space-x-3 focus:outline-none py-2"
            >
              <span className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#c5a880] after:transition-all">
                VIEW CARS FOR SALE
              </span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-[#c5a880]" />
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
          BOTTOM META & DISCREET SLIDE INDICATOR
          Pure typography, subtle horizontal slide line ticks & minimal scroll bar
          ========================================================================= */}
      <div className="relative z-20 w-full px-6 sm:px-12 lg:px-16 pb-8 sm:pb-12 max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6 pointer-events-auto">
        
        {/* Discreet vehicle provenance note */}
        <button
          onClick={() => currentSlide.vehicleId && onSelectVehicle?.(currentSlide.vehicleId)}
          className="text-left group text-xs text-[#9ea3ae] hover:text-white transition-colors focus:outline-none max-w-md"
        >
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[9px] tracking-[0.28em] uppercase text-[#c5a880] font-semibold">
              EXHIBIT 0{currentIndex + 1} / 0{slides.length}
            </span>
            <span className="text-white/30 text-[10px]">·</span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-white/60">
              {currentSlide.category}
            </span>
          </div>
          <span className="text-white/95 font-sans text-xs tracking-wider block group-hover:text-[#c5a880] transition-colors font-medium">
            {currentSlide.provenance}
          </span>
        </button>

        {/* Slide Indicator & Minimal Scroll Indicator */}
        <div className="flex items-center space-x-6 sm:space-x-10">
          
          {/* Discreet Horizontal Slide Indicators with Arrow Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={advanceToPrev}
              className="p-1 text-white/50 hover:text-[#c5a880] transition-colors focus:outline-none"
              aria-label="Previous exhibit"
              title="Previous automobile"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-1.5 px-1">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id || idx}
                  onClick={() => handleSlideSelect(idx)}
                  className="group py-2 px-0.5 focus:outline-none"
                  aria-label={`Go to slide ${idx + 1}: ${slide.name}`}
                >
                  <div 
                    className={`h-[2px] transition-all duration-500 ${
                      idx === currentIndex 
                        ? 'w-8 sm:w-10 bg-[#c5a880]' 
                        : 'w-3 sm:w-4 bg-white/20 group-hover:bg-white/50'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={advanceToNext}
              className="p-1 text-white/50 hover:text-[#c5a880] transition-colors focus:outline-none"
              aria-label="Next exhibit"
              title="Next automobile"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Minimal Scroll Indicator */}
          <button
            onClick={scrollToNext}
            className="group flex flex-col items-center text-[#9ea3ae] hover:text-white transition-colors focus:outline-none"
            aria-label="Scroll to film scenes"
          >
            <span className="text-[9px] tracking-[0.3em] uppercase mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
              SCROLL
            </span>
            <div className="w-[1px] h-8 bg-white/20 relative overflow-hidden">
              <div className="w-full h-1/2 bg-[#c5a880] animate-pulse" />
            </div>
          </button>

        </div>

      </div>

    </section>
  );
};
