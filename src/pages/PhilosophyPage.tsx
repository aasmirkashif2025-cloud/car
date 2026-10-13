import React from 'react';
import { ShieldCheck, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { ShowroomSettings } from '../types/crm';

interface PhilosophyPageProps {
  settings: ShowroomSettings;
  onExploreCollection: () => void;
  onOpenBookingModal: () => void;
}

export const PhilosophyPage: React.FC<PhilosophyPageProps> = ({
  settings,
  onExploreCollection,
  onOpenBookingModal,
}) => {
  return (
    <div className="min-h-screen bg-[#0b0c0e] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <span className="w-8 h-[1px] bg-[#c5a880]" />
            <span>The Maison Manifesto</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl font-bold text-white uppercase tracking-tight leading-tight">
            EXCELLENCE AS A STANDARD.
          </h1>
          <p className="text-base sm:text-xl text-[#9ea3ae] mt-4 font-light leading-relaxed">
            "{settings.ourPhilosophy.quote}"
          </p>
        </div>

        {/* Narrative Section with Editorial Imagery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6 text-sm text-[#9ea3ae] leading-relaxed font-light">
            <p className="text-white text-base leading-relaxed">
              Maison Motors was established to transcend the conventional Pakistani dealership experience. For too long, luxury and imported car acquisitions across Lahore, Karachi, and Islamabad were characterized by opaque histories, altered auction grades, and undocumented odometer readings.
            </p>
            <p>
              We established an uncompromising protocol: every Japanese CBU import must possess a 100% verified auction sheet from USS Tokyo or CAA Gifu, every German sports car must undergo comprehensive DME diagnostic scanning, and every local CKD vehicle must verify 100% genuine factory paint.
            </p>
            <p>
              Our architectural ateliers in Gulberg III, Clifton, and F-6 are sanctuaries of automotive culture, designed for collectors and leaders who demand precision, discretion, and bespoke concierge delivery.
            </p>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[16/10] overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85"
                alt="Architectural Showroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-xs text-white">
                <span className="text-[#c5a880] font-semibold block text-[10px] tracking-widest uppercase">
                  Flagship Atelier
                </span>
                <span>Main Boulevard, Gulberg III, Lahore</span>
              </div>
            </div>
          </div>
        </div>

        {/* The 3 Tenets (Open editorial columns, zero boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-20 hairline-t hairline-b mb-24 font-light">
          <div className="space-y-3">
            <span className="font-display text-3xl font-light text-[#c5a880] block mb-2">01</span>
            <h3 className="font-display text-xl font-bold text-white mb-2 uppercase tracking-wide">Absolute Transparency</h3>
            <p className="text-xs text-[#9ea3ae] leading-relaxed">
              We never conceal an imperfection. All paint gauge measurements, Japanese auction sheets, and service stamps are shared proactively with the client before signing.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-display text-3xl font-light text-[#c5a880] block mb-2">02</span>
            <h3 className="font-display text-xl font-bold text-white mb-2 uppercase tracking-wide">Bespoke Acquisition</h3>
            <p className="text-xs text-[#9ea3ae] leading-relaxed">
              If an automobile is not currently in our showroom, our Tokyo and Frankfurt sourcing desks procure, inspect, and handle customs clearance directly to your door.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-display text-3xl font-light text-[#c5a880] block mb-2">03</span>
            <h3 className="font-display text-xl font-bold text-white mb-2 uppercase tracking-wide">Executive Hospitality</h3>
            <p className="text-xs text-[#9ea3ae] leading-relaxed">
              From our VIP private viewing lounges to doorstep test drive delivery in Lahore, Karachi, and Islamabad, we honor your time with utmost discretion.
            </p>
          </div>
        </div>

        {/* CTA Invitation (Clean minimal section, no card box) */}
        <div className="py-12 text-center max-w-3xl mx-auto">
          <h3 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 uppercase">
            Begin Your Acquisition Journey
          </h3>
          <p className="text-xs text-[#9ea3ae] mb-8 max-w-md mx-auto font-light leading-relaxed">
            Explore our curated inventory or schedule an intimate consultation with our senior automotive curators.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button
              onClick={onExploreCollection}
              className="px-8 py-4 bg-[#f4f2ec] text-[#08090a] font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors"
            >
              Explore Fleet
            </button>
            <button
              onClick={onOpenBookingModal}
              className="px-8 py-4 border border-white/20 text-white font-medium text-xs tracking-widest uppercase hover:border-white transition-colors"
            >
              Reserve Viewing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
