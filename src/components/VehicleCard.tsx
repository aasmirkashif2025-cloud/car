import React from 'react';
import { Heart, GitCompare, ArrowUpRight, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import { formatPKR, formatExactPKR, generateWhatsAppLink } from '../utils/formatters';
import { SafeImage } from './SafeImage';

interface VehicleCardProps {
  vehicle: Vehicle;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelect: (id: string) => void;
  whatsappNumber: string;
  viewMode?: 'grid' | 'row';
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onSelect,
  whatsappNumber,
  viewMode = 'grid',
}) => {
  const whatsAppMessage = `Assalam-o-Alaikum, I am inquiring regarding the ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant} (${formatPKR(vehicle.price)}) listed at Maison Motors.`;
  const whatsappUrl = generateWhatsAppLink(whatsappNumber, whatsAppMessage);

  // =========================================================================
  // VIEW MODE: ROW ("1 HI ROW MAIN SIRF 1 CAR") — FULL-WIDTH CINEMATIC BANNER
  // =========================================================================
  if (viewMode === 'row') {
    return (
      <div 
        onClick={() => onSelect(vehicle.id)}
        className="group relative w-full bg-[#0c0d10] hover:bg-[#111317] border-b border-white/[0.08] hover:border-[#c5a880]/50 transition-all duration-500 cursor-pointer overflow-hidden p-4 sm:p-6 lg:p-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left: Wide Panoramic Photograph */}
          <div className="lg:col-span-5 relative aspect-[16/10] overflow-hidden bg-[#16181d]">
            <SafeImage
              src={vehicle.coverImage}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fallbackText={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover object-center filter contrast-[1.04] brightness-95 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Condition / Assembly Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#f4f2ec] bg-black/80 backdrop-blur-sm px-2.5 py-1 font-semibold">
                {vehicle.assembly === 'Japanese CBU Import' && vehicle.auctionSheet
                  ? `GRADE ${vehicle.auctionSheet.grade} CBU`
                  : vehicle.assembly === 'Local Assembled (CKD)'
                  ? 'LOCAL CKD'
                  : vehicle.assembly}
              </span>
            </div>

            {/* City Atelier Badge */}
            <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1.5 text-[10px] text-white/90 font-mono bg-black/60 px-2 py-0.5">
              <span>{vehicle.city} ATELIER</span>
            </div>
          </div>

          {/* Right: Editorial Information & Direct Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            {/* Header / Brand & Year */}
            <div>
              <div className="flex items-center justify-between text-xs tracking-[0.25em] uppercase text-[#c5a880] font-semibold mb-1">
                <span>{vehicle.year} · {vehicle.make}</span>
                <span className="text-white/40 text-[10px]">{vehicle.stockNumber}</span>
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-white group-hover:text-[#c5a880] transition-colors tracking-tight">
                {vehicle.model}{' '}
                <span className="font-sans text-lg sm:text-xl font-light text-white/60 ml-1">
                  {vehicle.variant}
                </span>
              </h3>

              <p className="text-xs sm:text-sm text-[#9ea3ae] line-clamp-2 mt-2 font-light leading-relaxed">
                {vehicle.tagline || vehicle.description}
              </p>
            </div>

            {/* Technical Specifications Grid (Unboxed, Hairline Separated) */}
            <div className="py-3 hairline-t hairline-b border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#9ea3ae]/60 block">POWER</span>
                <span className="text-white font-medium text-xs sm:text-sm">{vehicle.horsepower || 'Factory Spec'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#9ea3ae]/60 block">ODOMETER</span>
                <span className="text-white font-medium text-xs sm:text-sm">{vehicle.mileage.toLocaleString()} km</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#9ea3ae]/60 block">GEARBOX</span>
                <span className="text-white font-medium text-xs sm:text-sm">{vehicle.transmission}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#9ea3ae]/60 block">INSPECTION</span>
                <span className="text-emerald-400 font-medium text-xs sm:text-sm flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{vehicle.inspectionReport?.score || 99}/100</span>
                </span>
              </div>
            </div>

            {/* Price & Action Row */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#9ea3ae] block">
                  VALUATION
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                    {formatPKR(vehicle.price)}
                  </span>
                  <span className="text-[10px] text-[#9ea3ae]/70 font-mono hidden sm:inline">
                    ({formatExactPKR(vehicle.price)})
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Compare */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCompare(vehicle.id);
                  }}
                  className={`p-2.5 border transition-colors ${
                    isCompared
                      ? 'border-[#c5a880] text-[#c5a880] bg-black/60'
                      : 'border-white/10 hover:border-white/30 text-white/70 hover:text-white bg-black/40'
                  }`}
                  title="Compare Vehicle"
                >
                  <GitCompare className="w-4 h-4" />
                </button>

                {/* Favorite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(vehicle.id);
                  }}
                  className={`p-2.5 border transition-colors ${
                    isFavorite
                      ? 'border-[#c5a880] text-[#c5a880] bg-black/60'
                      : 'border-white/10 hover:border-white/30 text-white/70 hover:text-white bg-black/40'
                  }`}
                  title="Save to Favorites"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#c5a880]' : ''}`} />
                </button>

                {/* WhatsApp Direct */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] text-xs font-semibold tracking-wider uppercase flex items-center space-x-2 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WHATSAPP</span>
                </a>

                {/* Dossier button */}
                <span className="px-5 py-2.5 bg-[#f4f2ec] text-[#08090a] hover:bg-white text-xs font-bold tracking-[0.2em] uppercase flex items-center space-x-1.5 transition-colors">
                  <span>VIEW DETAILS</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: GRID (MULTIPLE CARDS PER ROW) — SLEEK EDITORIAL CARD
  // =========================================================================
  return (
    <div 
      onClick={() => onSelect(vehicle.id)}
      className="group flex flex-col cursor-pointer transition-all duration-300 pb-4 hairline-b border-white/[0.06] hover:border-[#c5a880]/40"
    >
      
      {/* 1. Cinematic Full-Width Vehicle Photograph */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#101114] mb-4">
        <SafeImage
          src={vehicle.coverImage}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fallbackText={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover object-center filter contrast-[1.04] brightness-[0.93] group-hover:scale-[1.03] group-hover:brightness-100 transition-all duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Minimal Provenance Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[9px] tracking-[0.25em] uppercase text-[#f4f2ec] bg-black/75 backdrop-blur-sm px-2.5 py-1 font-semibold">
            {vehicle.assembly === 'Japanese CBU Import' && vehicle.auctionSheet
              ? `GRADE ${vehicle.auctionSheet.grade} CBU`
              : vehicle.assembly === 'Local Assembled (CKD)'
              ? 'LOCAL CKD'
              : vehicle.assembly}
          </span>
        </div>

        {/* Subtle Quick Actions (Top Right) */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(vehicle.id);
            }}
            className={`p-2 transition-colors ${
              isCompared
                ? 'text-[#c5a880] bg-black/80 border border-[#c5a880]'
                : 'text-white/70 hover:text-white bg-black/50 hover:bg-black/80'
            }`}
            title="Compare"
          >
            <GitCompare className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(vehicle.id);
            }}
            className={`p-2 transition-colors ${
              isFavorite
                ? 'text-[#c5a880] bg-black/80 border border-[#c5a880]'
                : 'text-white/70 hover:text-white bg-black/50 hover:bg-black/80'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#c5a880]' : ''}`} />
          </button>
        </div>

        {/* City tag bottom left */}
        <div className="absolute bottom-2.5 left-3 z-10 text-[9px] tracking-wider text-white/80 font-mono">
          {vehicle.city} ATELIER
        </div>
      </div>

      {/* 2. Editorial Typography & Specifications */}
      <div className="flex flex-col space-y-1.5">
        
        {/* Meta Line */}
        <div className="flex items-center justify-between text-[10px] tracking-[0.25em] uppercase text-[#c5a880] font-semibold">
          <span>{vehicle.year} · {vehicle.make}</span>
          <span className="text-white/40">{vehicle.mileage.toLocaleString()} km</span>
        </div>

        {/* Headline / Model */}
        <div className="flex items-baseline justify-between pt-0.5">
          <h3 className="font-editorial text-xl font-bold text-white group-hover:text-[#c5a880] transition-colors tracking-tight line-clamp-1">
            {vehicle.model} <span className="font-sans font-light text-xs text-[#9ea3ae] ml-1">{vehicle.variant}</span>
          </h3>
        </div>

        {/* Quick Specs Snippet */}
        <div className="text-[11px] text-[#9ea3ae] flex items-center space-x-2 pt-0.5 font-light">
          <span>{vehicle.engineCapacity}</span>
          <span>·</span>
          <span>{vehicle.horsepower}</span>
          <span>·</span>
          <span>{vehicle.transmission}</span>
        </div>

        {/* Price & Actions Row */}
        <div className="flex items-center justify-between pt-2.5 hairline-t border-white/[0.08]">
          <div className="font-editorial text-lg sm:text-xl font-bold text-[#f4f2ec]">
            {formatPKR(vehicle.price)}
          </div>

          <div className="flex items-center space-x-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#25D366] hover:bg-[#25D366]/10 p-1.5 transition-colors border border-[#25D366]/30"
              title="Inquire on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>

            <span className="text-[10px] text-white/90 group-hover:text-white flex items-center space-x-1 font-bold tracking-[0.2em] uppercase py-1 px-2.5 bg-white/5 hover:bg-white/15 transition-colors">
              <span>DOSSIER</span>
              <ArrowUpRight className="w-3 h-3 text-[#c5a880]" />
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
