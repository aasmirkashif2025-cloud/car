import React from 'react';
import { MapPin, Phone, Clock, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { ShowroomSettings } from '../types/crm';
import { generateWhatsAppLink } from '../utils/formatters';

interface LocationsPageProps {
  settings: ShowroomSettings;
  onOpenBookingModal: () => void;
}

export const LocationsPage: React.FC<LocationsPageProps> = ({
  settings,
  onOpenBookingModal,
}) => {
  return (
    <div className="min-h-screen bg-[#0b0c0e] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <span className="w-8 h-[1px] bg-[#c5a880]" />
            <span>Presence & Ateliers</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl font-bold text-white uppercase tracking-tight leading-tight">
            SHOWROOM LOUNGES.
          </h1>
          <p className="text-sm sm:text-base text-[#9ea3ae] mt-4 font-light leading-relaxed">
            Our architectural viewing galleries are designed to offer an intimate, discreet atmosphere for evaluating the world’s finest automobiles in Pakistan.
          </p>
        </div>

        {/* 3 Ateliers Grid (Open, zero boxes) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-28">
          {settings.addresses.map((loc, idx) => {
            const wa = generateWhatsAppLink(
              settings.whatsappNumber,
              `Assalam-o-Alaikum, I would like to visit the Maison Motors atelier in ${loc.city}.`
            );

            return (
              <div
                key={idx}
                className="flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#101114] mb-6">
                    <img
                      src={
                        idx === 0
                          ? 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
                          : idx === 1
                          ? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
                          : 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt={loc.branch}
                      className="w-full h-full object-cover editorial-img-zoom filter brightness-95 group-hover:brightness-100"
                    />
                    <span className="absolute top-4 left-4 px-2.5 py-1 bg-black/70 text-[#f4f2ec] text-[9px] font-semibold tracking-[0.25em] uppercase">
                      {loc.city}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-display text-2xl font-bold text-white tracking-tight uppercase">
                      {loc.branch}
                    </h3>

                    <div className="space-y-3 text-xs text-[#9ea3ae] font-light">
                      <div className="flex items-start space-x-2.5 py-1 hairline-b">
                        <MapPin className="w-3.5 h-3.5 text-[#c5a880] shrink-0 mt-0.5" />
                        <span className="text-white/90">{loc.address}</span>
                      </div>
                      <div className="flex items-center space-x-2.5 py-1 hairline-b">
                        <Phone className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                        <a href={`tel:${loc.phone}`} className="hover:text-white transition-colors">
                          {loc.phone}
                        </a>
                      </div>
                      <div className="flex items-start space-x-2.5 py-1 hairline-b">
                        <Clock className="w-3.5 h-3.5 text-[#c5a880] shrink-0 mt-0.5" />
                        <span>{loc.timing}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-2">
                  <button
                    onClick={onOpenBookingModal}
                    className="w-full py-3.5 bg-[#f4f2ec] text-[#08090a] font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors"
                  >
                    Schedule Private Visit
                  </button>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 border border-white/20 hover:border-white text-white text-xs font-semibold tracking-widest uppercase flex items-center justify-center space-x-2 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Private Security & Confidentiality (Zero boxes) */}
        <div className="py-12 hairline-t max-w-2xl mx-auto text-center font-light">
          <ShieldCheck className="w-6 h-6 text-[#c5a880] mx-auto mb-3" />
          <h4 className="font-display text-lg font-bold text-white mb-2 uppercase tracking-wide">
            Discretion & Security Protocols
          </h4>
          <p className="text-xs text-[#9ea3ae] leading-relaxed">
            All our lounges provide private executive underground parking, biometric secure entrances, and private discussion chambers for prominent dignitaries, business leaders, and family offices.
          </p>
        </div>

      </div>
    </div>
  );
};
