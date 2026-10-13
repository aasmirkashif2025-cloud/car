import React from 'react';
import { ArrowUpRight, ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Hero } from '../components/Hero';
import { Vehicle } from '../types/vehicle';
import { ShowroomSettings } from '../types/crm';
import { formatPKR, generateWhatsAppLink } from '../utils/formatters';
import section4Landscape from '../assets/images/section4_cinematic_landscape.webp';
import cinematicRoadImage from '../assets/images/cinematic_road_pk_1791629098965.webp';
import { BrandInfo } from '../data/seedSettings';
import { AUTHENTIC_SHOWROOM_ASSETS } from '../data/seedVehicles';
import { SafeImage } from '../components/SafeImage';
import lc300Img from '../assets/images/toyota_land_cruiser_300.webp';
import civicRsImg from '../assets/images/honda_civic_rs.webp';
import altisGrandeImg from '../assets/images/toyota_corolla_altis.webp';

interface HomePageProps {
  vehicles: Vehicle[];
  settings: ShowroomSettings;
  brands?: BrandInfo[];
  favorites: string[];
  comparisons: string[];
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectVehicle: (id: string) => void;
  onNavigate: (page: string, params?: any) => void;
  onOpenBookingModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  vehicles,
  settings,
  onSelectVehicle,
  onNavigate,
  onOpenBookingModal,
}) => {
  const published = vehicles.filter((v) => v.published);

  // Retrieve the 3 required vehicles for Scene 03
  const landCruiser = published.find((v) => v.id === 'toyota-land-cruiser-lc300-2024') || published[0];
  const civic = published.find((v) => v.id === 'honda-civic-rs-2024') || published[1];
  const corolla = published.find((v) => v.id === 'toyota-corolla-altis-grande-2024') || published[2];

  const whatsAppLink = generateWhatsAppLink(
    settings.whatsappNumber,
    'Assalam-o-Alaikum, I am inquiring through Maison Motors regarding an acquisition.'
  );

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f4f2ec] overflow-x-hidden selection:bg-[#c5a880] selection:text-black">
      
      {/* =========================================================================
          SCENE 01 — THE ARRIVAL
          Dramatic automotive image with oversized typography and minimal navigation
          ========================================================================= */}
      <Hero
        settings={settings}
        onExploreCollection={() => onNavigate('inventory')}
        onDiscoverPhilosophy={() => onNavigate('philosophy')}
        onOpenBookingModal={onOpenBookingModal}
        onSelectVehicle={onSelectVehicle}
      />

      {/* =========================================================================
          SCENE 02 — THE PHILOSOPHY
          A quiet, spacious editorial moment. Large text on one side, carefully cropped
          photograph on the other. Feels like a luxury magazine spread.
          ========================================================================= */}
      <section className="relative w-full py-32 sm:py-48 px-6 sm:px-12 lg:px-16 max-w-[1600px] mx-auto">
        
        {/* Subtle scene marker */}
        <div className="flex items-center space-x-3 mb-12 sm:mb-16 opacity-70">
          <span className="w-8 h-[1px] bg-[#c5a880]" />
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a880] font-sans font-medium">
            SCENE 02 / THE PHILOSOPHY
          </span>
        </div>

        {/* Magazine Spread Grid: Left Editorial Typography, Right Cropped Photograph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Expressive typography and deliberate line lengths */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-10"
          >
            <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-[0.98]">
              CRAFTED IN SILENCE.<br />
              VERIFIED WITH<br />
              <span className="text-[#c5a880] italic font-light">OBSESSION.</span>
            </h2>

            <div className="space-y-6 text-[#9ea3ae] text-base sm:text-lg font-light leading-relaxed max-w-xl font-sans">
              <p className="text-white/95 text-lg sm:text-xl font-normal leading-relaxed">
                We operate beyond the conventions of typical dealerships. In a market historically clouded by altered odometers and unverified histories, Maison Motors introduces absolute transparency.
              </p>
              <p>
                Every Japanese CBU import carries an unalterable USS Tokyo or CAA auction sheet. Every domestic prestige marque undergoes a 210-point paint-depth and computerized diagnostic audit. Every registration guarantees immediate Punjab, Sindh, or Islamabad biometric transfer.
              </p>
            </div>

            {/* Quiet typographic manifesto notes — Zero cards, pure text */}
            <div className="pt-8 hairline-t grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-white/90 font-sans">
              <div>
                <span className="text-[#c5a880] text-[10px] tracking-[0.28em] uppercase block font-semibold mb-1">
                  01 / PROVENANCE
                </span>
                <p className="text-[#9ea3ae] text-xs font-light">
                  100% Certified Japanese Auction Sheets
                </p>
              </div>
              <div>
                <span className="text-[#c5a880] text-[10px] tracking-[0.28em] uppercase block font-semibold mb-1">
                  02 / DIAGNOSTIC
                </span>
                <p className="text-[#9ea3ae] text-xs font-light">
                  210-Point Ultrasonic Paint & Mechanical Audit
                </p>
              </div>
              <div>
                <span className="text-[#c5a880] text-[10px] tracking-[0.28em] uppercase block font-semibold mb-1">
                  03 / CONCIERGE
                </span>
                <p className="text-[#9ea3ae] text-xs font-light">
                  Private Chamber Delivery in Lahore, Karachi & ICT
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('philosophy')}
                className="group text-xs tracking-[0.25em] uppercase font-semibold text-white/90 hover:text-[#c5a880] transition-colors inline-flex items-center space-x-2"
              >
                <span className="relative pb-0.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white/30 group-hover:after:bg-[#c5a880] after:transition-colors">
                  READ THE MAISON MANIFESTO
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#c5a880] transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Carefully Cropped Architectural Photograph */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-[#101114]">
              <SafeImage
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85"
                alt="Maison Motors Architectural Gallery"
                fallbackText="Maison Motors Atelier"
                className="w-full h-full object-cover filter contrast-[1.04] brightness-90 hover:scale-[1.02] transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090a]/80 via-transparent to-transparent" />
              
              {/* Editorial Caption in lower margin */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-xs text-white/80 font-sans">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.28em] text-[#c5a880] font-semibold block mb-0.5">
                    FLAGSHIP GALLERY
                  </span>
                  <span className="font-light text-white text-xs">
                    Main Boulevard, Gulberg III, Lahore
                  </span>
                </div>
                <span className="font-mono text-[10px] text-white/50">
                  31.5204° N, 74.3587° E
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>


      {/* =========================================================================
          SCENE 03 — THE COLLECTION
          Present three vehicles using large photographic compositions with alternating
          image alignment and generous space:
          1. Toyota Land Cruiser (near full viewport)
          2. Honda Civic (split-screen editorial layout)
          3. Toyota Corolla (horizontal panoramic layout with illustrative pricing)
          ========================================================================= */}
      <section className="relative w-full py-28 sm:py-40">
        
        {/* Section Header with generous space */}
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 mb-20 sm:mb-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 hairline-b">
            <div>
              <div className="flex items-center space-x-3 mb-3 opacity-70">
                <span className="w-8 h-[1px] bg-[#c5a880]" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a880] font-sans font-medium">
                  SCENE 03 / THE COLLECTION
                </span>
              </div>
              <h2 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase">
                SELECTED MARQUES.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#9ea3ae] font-light max-w-md font-sans">
              Three definitive pillars of the Pakistani automotive landscape, each inspected to zero-defect perfection.
            </p>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            VEHICLE 1: TOYOTA LAND CRUISER 300 ZX
            Occupies almost the entire viewport (near 85vh panoramic cinematic layout)
            ----------------------------------------------------------------------- */}
        {landCruiser && (
          <div className="relative w-full mb-36 sm:mb-48 group">
            <div 
              onClick={() => onSelectVehicle(landCruiser.id)}
              className="relative w-full h-[75vh] sm:h-[85vh] min-h-[560px] overflow-hidden bg-[#101114] cursor-pointer"
            >
              <SafeImage
                src={landCruiser.coverImage || lc300Img}
                alt={landCruiser.model}
                fallbackText="Toyota Land Cruiser 300 ZX"
                className="w-full h-full object-cover filter contrast-[1.06] brightness-[0.88] group-hover:scale-[1.025] transition-transform duration-1000 ease-out"
              />
              
              {/* Atmospheric gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-[#08090a]/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#08090a]/90 via-[#08090a]/40 to-transparent w-full md:w-[60%]" />

              {/* Overlaid Editorial Content */}
              <div className="absolute inset-0 z-10 max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-end pb-12 sm:pb-16">
                <div className="max-w-2xl">
                  
                  {/* Eyebrow */}
                  <div className="flex items-center space-x-3 text-xs tracking-[0.28em] uppercase text-[#c5a880] mb-3 font-semibold font-sans">
                    <span>MARQUE 01</span>
                    <span>·</span>
                    <span>JAPANESE CBU IMPORT</span>
                    <span>·</span>
                    <span>USS TOKYO GRADE 5.0</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-bold text-white uppercase tracking-tight leading-none mb-4 group-hover:text-[#c5a880] transition-colors">
                    LAND CRUISER 300 ZX
                  </h3>

                  {/* Subline */}
                  <p className="text-xs sm:text-sm text-[#f4f2ec]/80 font-light font-sans max-w-lg mb-6 leading-relaxed">
                    3.5L Twin-Turbo V6 · 409 Horsepower · Modellista Aero Package · Rear Executive Lounge · Islamabad Registered.
                  </p>

                  {/* Illustrative PKR Pricing & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-8 pt-4 hairline-t border-white/20">
                    <div>
                      <span className="text-[10px] tracking-[0.25em] uppercase text-[#9ea3ae] block">
                        ILLUSTRATIVE VALUATION
                      </span>
                      <div className="font-editorial text-3xl sm:text-4xl font-bold text-white">
                        {formatPKR(landCruiser.price)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-semibold tracking-[0.22em] uppercase text-[#f4f2ec] group-hover:text-[#c5a880] transition-colors pt-2 sm:pt-0">
                      <span>INSPECT THIS AUTOMOBILE</span>
                      <ArrowUpRight className="w-4 h-4 text-[#c5a880] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            VEHICLE 2: HONDA CIVIC RS 1.5 VTEC TURBO
            Split-screen editorial layout with generous negative space
            ----------------------------------------------------------------------- */}
        {civic && (
          <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 mb-36 sm:mb-48">
            <div 
              onClick={() => onSelectVehicle(civic.id)}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center cursor-pointer group"
            >
              
              {/* Left Editorial Half */}
              <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
                
                <div className="flex items-center space-x-3 text-xs tracking-[0.28em] uppercase text-[#c5a880] font-semibold font-sans">
                  <span>MARQUE 02</span>
                  <span>·</span>
                  <span>LOCAL CKD ASSEMBLED</span>
                  <span>·</span>
                  <span>LAHORE ATELIER</span>
                </div>

                <h3 className="font-editorial text-3xl sm:text-5xl font-bold text-white uppercase tracking-tight leading-tight group-hover:text-[#c5a880] transition-colors">
                  HONDA CIVIC RS<br />
                  <span className="font-light italic text-white/70">1.5 VTEC TURBO</span>
                </h3>

                <p className="text-sm sm:text-base text-[#9ea3ae] font-light leading-relaxed font-sans">
                  Finished in pristine White Orchid Pearl over black sport alcantara with red contrast stitching. Full Honda SENSING suite, 178 horsepower turbocharged response, paddle shifters, and Bose audio. 100% original factory paint verified by Maison technicians.
                </p>

                {/* Specs row */}
                <div className="py-4 hairline-t hairline-b grid grid-cols-3 gap-4 text-xs font-sans text-[#9ea3ae]">
                  <div>
                    <span className="text-[10px] uppercase text-[#9ea3ae]/60 block tracking-wider">POWER</span>
                    <span className="text-white font-medium text-sm">178 HP</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#9ea3ae]/60 block tracking-wider">ODOMETER</span>
                    <span className="text-white font-medium text-sm">4,800 KM</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#9ea3ae]/60 block tracking-wider">DOCUMENT</span>
                    <span className="text-emerald-400 font-medium text-sm">Smart Card</span>
                  </div>
                </div>

                {/* Illustrative PKR Pricing */}
                <div className="pt-2 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#9ea3ae] block">
                      ILLUSTRATIVE VALUATION
                    </span>
                    <div className="font-editorial text-3xl sm:text-4xl font-bold text-white">
                      {formatPKR(civic.price)}
                    </div>
                  </div>

                  <span className="text-xs font-semibold tracking-[0.22em] uppercase text-white group-hover:text-[#c5a880] transition-colors inline-flex items-center space-x-1.5">
                    <span>VIEW DOSSIER</span>
                    <ArrowUpRight className="w-4 h-4 text-[#c5a880]" />
                  </span>
                </div>

              </div>

              {/* Right Image Half */}
              <div className="lg:col-span-7 order-1 lg:order-2 overflow-hidden bg-[#101114]">
                <div className="relative aspect-[16/11] overflow-hidden">
                  <SafeImage
                    src={civic.coverImage || civicRsImg}
                    alt={civic.model}
                    fallbackText="Honda Civic RS 1.5 Turbo"
                    className="w-full h-full object-cover filter contrast-[1.04] brightness-95 group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090a]/50 via-transparent to-transparent" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            VEHICLE 3: TOYOTA COROLLA ALTIS GRANDE
            Inverted horizontal composition with illustrative PKR pricing
            ----------------------------------------------------------------------- */}
        {corolla && (
          <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 mb-28">
            <div 
              onClick={() => onSelectVehicle(corolla.id)}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center cursor-pointer group"
            >
              
              {/* Left Image Half */}
              <div className="lg:col-span-7 overflow-hidden bg-[#101114]">
                <div className="relative aspect-[16/11] overflow-hidden">
                  <SafeImage
                    src={corolla.coverImage || altisGrandeImg}
                    alt={corolla.model}
                    fallbackText="Toyota Corolla Altis Grande"
                    className="w-full h-full object-cover filter contrast-[1.04] brightness-95 group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090a]/50 via-transparent to-transparent" />
                </div>
              </div>

              {/* Right Editorial Half */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="flex items-center space-x-3 text-xs tracking-[0.28em] uppercase text-[#c5a880] font-semibold font-sans">
                  <span>MARQUE 03</span>
                  <span>·</span>
                  <span>EXECUTIVE SEDAN</span>
                  <span>·</span>
                  <span>ISLAMABAD ATELIER</span>
                </div>

                <h3 className="font-editorial text-3xl sm:text-5xl font-bold text-white uppercase tracking-tight leading-tight group-hover:text-[#c5a880] transition-colors">
                  TOYOTA COROLLA<br />
                  <span className="font-light italic text-white/70">ALTIS GRANDE 1.8</span>
                </h3>

                <p className="text-sm sm:text-base text-[#9ea3ae] font-light leading-relaxed font-sans">
                  Pakistan’s benchmark of unyielding resilience and effortless executive transport. Powered by the 1.8L Dual VVT-i engine paired with 7-speed sequential CVT, factory electric sunroof, cruise control, push-button start, and leather cabin.
                </p>

                {/* Specs row */}
                <div className="py-4 hairline-t hairline-b grid grid-cols-3 gap-4 text-xs font-sans text-[#9ea3ae]">
                  <div>
                    <span className="text-[10px] uppercase text-[#9ea3ae]/60 block tracking-wider">ENGINE</span>
                    <span className="text-white font-medium text-sm">1.8L VVT-i</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#9ea3ae]/60 block tracking-wider">TRANSMISSION</span>
                    <span className="text-white font-medium text-sm">7-Speed CVT</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#9ea3ae]/60 block tracking-wider">REGISTRATION</span>
                    <span className="text-white font-medium text-sm">Islamabad ICT</span>
                  </div>
                </div>

                {/* Illustrative PKR Pricing */}
                <div className="pt-2 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#9ea3ae] block">
                      ILLUSTRATIVE VALUATION
                    </span>
                    <div className="font-editorial text-3xl sm:text-4xl font-bold text-white">
                      {formatPKR(corolla.price)}
                    </div>
                  </div>

                  <span className="text-xs font-semibold tracking-[0.22em] uppercase text-white group-hover:text-[#c5a880] transition-colors inline-flex items-center space-x-1.5">
                    <span>VIEW DOSSIER</span>
                    <ArrowUpRight className="w-4 h-4 text-[#c5a880]" />
                  </span>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Collection Footer: Understated link to entire inventory catalog */}
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 pt-12 text-center">
          <button
            onClick={() => onNavigate('inventory')}
            className="group inline-flex items-center space-x-3 text-xs tracking-[0.3em] uppercase font-bold text-white hover:text-[#c5a880] transition-colors py-3 focus:outline-none"
          >
            <span className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white/40 group-hover:after:bg-[#c5a880] after:transition-colors">
              VIEW ALL CARS FOR SALE ({published.length} PAKISTANI VEHICLES)
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 text-[#c5a880]" />
          </button>
        </div>

      </section>


      {/* =========================================================================
          SCENE 04 — THE DRIVE
          An immersive, edge-to-edge automotive photograph with minimal overlaid
          typography and a subtle image reveal.
          ========================================================================= */}
      <section className="relative w-full h-[85vh] sm:h-screen min-h-[600px] flex items-center justify-center overflow-hidden select-none">
        
        {/* Full-Bleed Edge-to-Edge Drive Photography */}
        <SafeImage
          src={cinematicRoadImage || section4Landscape}
          alt="Cinematic Drive in Pakistan"
          fallbackText="Maison Motors Pakistan Grand Tour"
          className="absolute inset-0 w-full h-full object-cover filter contrast-[1.08] brightness-[0.72]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-black/40 to-[#08090a]/60" />

        {/* Overlaid Minimal Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 text-center"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#c5a880] font-sans font-semibold block mb-6">
            SCENE 04 / THE DRIVE
          </span>
          <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-tight leading-[0.96] mb-6">
            WHERE DISCIPLINE<br />
            MEETS HORIZON.
          </h2>
          <p className="text-sm sm:text-base text-[#f4f2ec]/80 tracking-widest uppercase font-light font-sans max-w-lg mx-auto">
            Curated for the open motorways and mountain passes of Pakistan.
          </p>
        </motion.div>

      </section>


      {/* =========================================================================
          SCENE 05 — THE INVITATION
          A quiet, refined final composition with one compelling headline and a direct
          enquiry action.
          ========================================================================= */}
      <section className="relative w-full py-36 sm:py-52 px-6 sm:px-12 lg:px-16 max-w-[1600px] mx-auto">
        
        <div className="max-w-4xl mx-auto text-center space-y-10">
          
          <div className="flex items-center justify-center space-x-3 opacity-70">
            <span className="w-8 h-[1px] bg-[#c5a880]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a880] font-sans font-medium">
              SCENE 05 / THE INVITATION
            </span>
            <span className="w-8 h-[1px] bg-[#c5a880]" />
          </div>

          <h2 className="font-editorial text-5xl sm:text-7xl lg:text-8xl font-bold text-white uppercase tracking-tight leading-[0.94]">
            THE ATELIER<br />
            <span className="text-[#c5a880] italic font-light">AWAITS.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#9ea3ae] font-light leading-relaxed max-w-xl mx-auto font-sans">
            Private viewing appointments arranged in our dedicated chambers across Lahore, Karachi, and Islamabad. Doorstep test drive delivery upon executive request.
          </p>

          {/* Minimal Direct Actions — No boxy button clusters */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <button
              onClick={onOpenBookingModal}
              className="px-10 py-5 bg-[#f4f2ec] text-[#08090a] hover:bg-white text-xs tracking-[0.24em] uppercase font-bold transition-all duration-300 flex items-center space-x-3 focus:outline-none"
            >
              <span>BOOK A TEST DRIVE / PRIVATE VIEWING</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#08090a]" />
            </button>

            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 border border-white/20 hover:border-white text-white hover:bg-white/5 text-xs tracking-[0.24em] uppercase font-semibold transition-all duration-300 flex items-center space-x-3 focus:outline-none"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WHATSAPP CONCIERGE</span>
            </a>
          </div>

          {/* Discreet Atelier Addresses */}
          <div className="pt-16 hairline-t grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs font-sans text-left">
            <div>
              <span className="text-white font-medium block uppercase tracking-wider mb-1">
                Lahore Flagship
              </span>
              <span className="text-[#9ea3ae] font-light block">
                Plot 12-A, Main Boulevard, Gulberg III
              </span>
            </div>
            <div>
              <span className="text-white font-medium block uppercase tracking-wider mb-1">
                Karachi Gallery
              </span>
              <span className="text-[#9ea3ae] font-light block">
                Suite 4B, Block 4, Clifton Marine Drive
              </span>
            </div>
            <div>
              <span className="text-white font-medium block uppercase tracking-wider mb-1">
                Islamabad Diplomatic
              </span>
              <span className="text-[#9ea3ae] font-light block">
                Plot 7, Super Market, F-6/3
              </span>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
};
