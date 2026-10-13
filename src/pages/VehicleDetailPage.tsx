import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  GitCompare, 
  Share2, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  MessageSquare,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle } from '../types/vehicle';
import { ShowroomSettings } from '../types/crm';
import { formatPKR, formatExactPKR, formatMileage, generateWhatsAppLink } from '../utils/formatters';
import { FinancingCalculator } from '../components/FinancingCalculator';

interface VehicleDetailPageProps {
  vehicle: Vehicle;
  allVehicles: Vehicle[];
  settings: ShowroomSettings;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onBack: () => void;
  onSelectVehicle: (id: string) => void;
  onOpenBookingModal: (vehicle: Vehicle) => void;
}

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({
  vehicle,
  allVehicles,
  settings,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onBack,
  onSelectVehicle,
  onOpenBookingModal,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showAuctionSheetModal, setShowAuctionSheetModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.coverImage];

  const whatsAppMessage = `Assalam-o-Alaikum, I am inquiring about the ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant} (${formatPKR(vehicle.price)}) located at your ${vehicle.city} Atelier. Can I schedule a private inspection?`;
  const whatsappUrl = generateWhatsAppLink(settings.whatsappNumber, whatsAppMessage);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const relatedVehicles = allVehicles
    .filter((v) => v.id !== vehicle.id && (v.make === vehicle.make || v.bodyStyle === vehicle.bodyStyle))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0b0c0e] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: luxuryEase }}
          className="flex flex-wrap items-center justify-between gap-4 py-4 mb-4 border-b border-white/[0.08] text-xs"
        >
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-[#9ea3ae] hover:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="uppercase tracking-widest font-semibold">Back to Inventory</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggleCompare(vehicle.id)}
              className={`px-3 py-1.5 border text-xs tracking-wider uppercase flex items-center space-x-1.5 transition-colors cursor-pointer ${
                isCompared
                  ? 'border-[#c5a880] bg-[#c5a880] text-black font-semibold'
                  : 'border-white/10 text-[#9ea3ae] hover:text-white hover:border-white/30'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>{isCompared ? 'In Comparison' : 'Compare'}</span>
            </button>

            <button
              onClick={() => onToggleFavorite(vehicle.id)}
              className={`px-3 py-1.5 border text-xs tracking-wider uppercase flex items-center space-x-1.5 transition-colors cursor-pointer ${
                isFavorite
                  ? 'border-[#c5a880] bg-[#c5a880]/15 text-[#c5a880]'
                  : 'border-white/10 text-[#9ea3ae] hover:text-white hover:border-white/30'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#c5a880]' : ''}`} />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 border border-white/10 text-[#9ea3ae] hover:text-white hover:border-white/30 transition-colors cursor-pointer"
              title="Share Vehicle"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {shareCopied && (
              <span className="text-[10px] text-[#c5a880] tracking-wider animate-pulse">
                Link Copied!
              </span>
            )}
          </div>
        </motion.div>

        {/* Gallery & Main Vehicle Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          
          {/* Left Column: Gallery & Thumbnails */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: luxuryEase }}
            className="lg:col-span-7 space-y-4"
          >
            {/* Main Stage Image */}
            <div className="relative aspect-[16/10] bg-[#121316] border border-white/10 overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  src={images[activeImageIndex]}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  initial={{ opacity: 0.4, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.6 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-full h-full object-cover object-center cursor-zoom-in"
                  onClick={() => setLightboxOpen(true)}
                />
              </AnimatePresence>
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-2.5 bg-black/70 hover:bg-black text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
                title="Fullscreen Lightbox"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Prev / Next Image Overlays */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[16/10] overflow-hidden border transition-all cursor-pointer ${
                      idx === activeImageIndex
                        ? 'border-[#c5a880] ring-1 ring-[#c5a880]'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Pakistan Document & Provenance (Clean typographic line, no box) */}
            <div className="py-6 hairline-t hairline-b grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-light">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#9ea3ae] block">Assembly</span>
                <span className="font-semibold text-white block mt-1">{vehicle.assembly}</span>
              </div>
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#9ea3ae] block">Reg. Province</span>
                <span className="font-semibold text-white block mt-1">{vehicle.documentation.registrationCity}</span>
              </div>
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#9ea3ae] block">Token Tax</span>
                <span className="font-semibold text-[#c5a880] block mt-1">{vehicle.documentation.tokenTaxStatus}</span>
              </div>
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#9ea3ae] block">Excise Document</span>
                <span className="font-semibold text-emerald-400 block mt-1">Smart Card Verified</span>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Title, Pricing & Primary CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: luxuryEase }}
            className="lg:col-span-5 flex flex-col justify-between space-y-6"
          >
            <div>
              {/* Eyebrow & Stock # */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#c5a880] tracking-[0.25em] uppercase font-semibold">
                  {vehicle.year} • {vehicle.make.toUpperCase()}
                </span>
                <span className="text-[#9ea3ae] font-mono text-[11px]">
                  STOCK {vehicle.stockNumber}
                </span>
              </div>

              {/* Title & Variant */}
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
                {vehicle.model}
              </h1>
              <p className="text-base text-[#9ea3ae] font-light mb-4">
                {vehicle.variant}
              </p>

              {/* Tagline */}
              <div className="py-2 text-xs text-[#f4f2ec] italic mb-6 font-light">
                "{vehicle.tagline}"
              </div>

              {/* Price Block */}
              <div className="py-5 hairline-t hairline-b mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#9ea3ae] block">
                  Price (Pakistani Rupees)
                </span>
                <div className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
                  {formatPKR(vehicle.price)}
                </div>
                <div className="text-xs text-[#9ea3ae] mt-1 flex items-center justify-between font-light">
                  <span>{formatExactPKR(vehicle.price)}</span>
                  <span className="text-[#c5a880] text-[11px] font-medium tracking-wider uppercase">Commercial Duties Cleared</span>
                </div>
              </div>

              {/* Key Quick Specs Matrix (Zero boxes, clean dividers) */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-8">
                <div className="py-2 hairline-b">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#9ea3ae] block">Horsepower</span>
                  <span className="font-bold text-white text-sm">{vehicle.horsepower}</span>
                </div>
                <div className="py-2 hairline-b">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#9ea3ae] block">Engine</span>
                  <span className="font-bold text-white text-sm">{vehicle.engineCapacity}</span>
                </div>
                <div className="py-2 hairline-b">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#9ea3ae] block">Mileage</span>
                  <span className="font-bold text-white text-sm">{formatMileage(vehicle.mileage)}</span>
                </div>
                <div className="py-2 hairline-b">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#9ea3ae] block">Location</span>
                  <span className="font-bold text-white text-sm">{vehicle.city} Atelier</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => onOpenBookingModal(vehicle)}
                  className="w-full py-4 bg-[#f4f2ec] hover:bg-white text-black font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Private Viewing / Test Drive</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 border border-white/20 hover:border-white text-white font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>Inquire via WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Verification Sheet Buttons */}
            <div className="pt-4 hairline-t flex items-center space-x-4 text-xs">
              {vehicle.auctionSheet && (
                <button
                  onClick={() => setShowAuctionSheetModal(true)}
                  className="text-xs text-[#c5a880] hover:underline flex items-center space-x-1.5 font-medium tracking-wider uppercase cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Auction Sheet (Grade {vehicle.auctionSheet.grade})</span>
                </button>
              )}
              {vehicle.inspectionReport && (
                <button
                  onClick={() => setShowInspectionModal(true)}
                  className="text-xs text-white/80 hover:text-white flex items-center space-x-1.5 font-medium tracking-wider uppercase cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>210-Pt Report ({vehicle.inspectionReport.score}/100)</span>
                </button>
              )}
            </div>

          </motion.div>
        </div>

        {/* Detailed Open Sections (Zero boxes, clean editorial hierarchy) with entrance animations */}
        <div className="space-y-16 mb-24">
          
          {/* Narrative Overview */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease: luxuryEase }}
            className="py-12 hairline-t"
          >
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] font-semibold block mb-2">
              PROVENANCE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-6 uppercase">
              AUTOMOTIVE NARRATIVE.
            </h2>
            <p className="text-sm sm:text-base text-[#9ea3ae] leading-relaxed whitespace-pre-line font-light max-w-4xl">
              {vehicle.description}
            </p>

            {/* Custom Specifications if any */}
            {vehicle.customFields && vehicle.customFields.length > 0 && (
              <div className="mt-10 pt-6 hairline-t">
                <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold mb-4">
                  Distinguishing Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-light">
                  {vehicle.customFields.map((cf, idx) => (
                    <div key={idx} className="py-2 hairline-b">
                      <span className="text-[10px] text-[#9ea3ae] uppercase block">{cf.label}</span>
                      <span className="text-white font-medium block mt-0.5">{cf.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Manual Notes / Remarks if present */}
            {vehicle.additionalNotes && (
              <div className="mt-8 pt-6 hairline-t">
                <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold mb-2">
                  Additional Inspection Notes & Provenance
                </h4>
                <p className="text-xs sm:text-sm text-[#c8cbd2] leading-relaxed font-light whitespace-pre-line bg-white/[0.02] p-4 border border-white/[0.08]">
                  {vehicle.additionalNotes}
                </p>
              </div>
            )}
          </motion.div>

          {/* Full Specifications Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease: luxuryEase }}
            className="py-12 hairline-t"
          >
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] font-semibold block mb-2">
              ENGINEERING
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-8 uppercase">
              TECHNICAL SPECIFICATIONS.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-light">
              <div className="space-y-1 py-2 hairline-b">
                <span className="text-[10px] uppercase tracking-wider text-[#9ea3ae]">Drivetrain</span>
                <p className="text-white font-medium text-sm">{vehicle.drivetrain}</p>
              </div>
              <div className="space-y-1 py-2 hairline-b">
                <span className="text-[10px] uppercase tracking-wider text-[#9ea3ae]">Fuel / Powertrain</span>
                <p className="text-white font-medium text-sm">{vehicle.fuelType}</p>
              </div>
              <div className="space-y-1 py-2 hairline-b">
                <span className="text-[10px] uppercase tracking-wider text-[#9ea3ae]">Transmission</span>
                <p className="text-white font-medium text-sm">{vehicle.transmission}</p>
              </div>
              <div className="space-y-1 py-2 hairline-b">
                <span className="text-[10px] uppercase tracking-wider text-[#9ea3ae]">Exterior Finish</span>
                <p className="text-white font-medium text-sm">{vehicle.exteriorColor}</p>
              </div>
              <div className="space-y-1 py-2 hairline-b">
                <span className="text-[10px] uppercase tracking-wider text-[#9ea3ae]">Interior Upholstery</span>
                <p className="text-white font-medium text-sm">{vehicle.interiorColor}</p>
              </div>
              <div className="space-y-1 py-2 hairline-b">
                <span className="text-[10px] uppercase tracking-wider text-[#9ea3ae]">Seating Capacity</span>
                <p className="text-white font-medium text-sm">{vehicle.seatingCapacity} Passengers</p>
              </div>
              {vehicle.torque && (
                <div className="space-y-1 py-2 hairline-b">
                  <span className="text-[10px] uppercase tracking-wider text-[#9ea3ae]">Torque Output</span>
                  <p className="text-white font-medium text-sm">{vehicle.torque}</p>
                </div>
              )}
              {vehicle.acceleration0to100 && (
                <div className="space-y-1 py-2 hairline-b">
                  <span className="text-[10px] uppercase tracking-wider text-[#9ea3ae]">0 - 100 km/h</span>
                  <p className="text-white font-medium text-sm">{vehicle.acceleration0to100}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Features and Equipment */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease: luxuryEase }}
            className="py-12 hairline-t"
          >
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] font-semibold block mb-2">
              EQUIPMENT
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-8 uppercase">
              LUXURY APPOINTMENTS.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
              {vehicle.features.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-xs text-white/90 py-2 hairline-b font-light">
                  <span className="w-1.5 h-1.5 bg-[#c5a880]" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dedicated Financing Section for this Car */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease: luxuryEase }}
          >
            <FinancingCalculator
              initialPrice={vehicle.price}
              vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant}`}
              onApplyFinancing={() => onOpenBookingModal(vehicle)}
            />
          </motion.div>

        </div>

        {/* Related Vehicles */}
        {relatedVehicles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease: luxuryEase }}
            className="pt-12 border-t border-white/[0.08]"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                CURATED COMPANIONS IN STOCK
              </h3>
              <button
                onClick={onBack}
                className="text-xs text-[#c5a880] hover:underline uppercase tracking-wider cursor-pointer"
              >
                View Full Fleet
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedVehicles.map((rel, index) => (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.12, ease: luxuryEase }}
                  onClick={() => onSelectVehicle(rel.id)}
                  className="cursor-pointer transition-colors group flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#101114] mb-3">
                    <img
                      src={rel.coverImage}
                      alt={rel.model}
                      className="w-full h-full object-cover editorial-img-zoom filter contrast-[1.02] brightness-95 group-hover:brightness-100"
                    />
                  </div>
                  <div className="text-[10px] text-[#c5a880] uppercase tracking-[0.2em] font-semibold">
                    {rel.year} • {rel.make}
                  </div>
                  <h4 className="font-display font-bold text-white group-hover:text-[#c5a880] transition-colors text-base mt-1">
                    {rel.model} <span className="font-sans font-light text-xs text-[#9ea3ae] ml-1">{rel.variant}</span>
                  </h4>
                  <div className="flex justify-between items-center mt-2 text-xs hairline-t pt-2">
                    <span className="font-display font-bold text-[#f4f2ec] text-sm">{formatPKR(rel.price)}</span>
                    <span className="text-[#9ea3ae] uppercase text-[11px] tracking-wider">{rel.city} Atelier</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>

      {/* Lightbox Modal with AnimatePresence */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.35, ease: luxuryEase }}
              src={images[activeImageIndex]}
              alt="Fullscreen view"
              className="max-h-[90vh] max-w-[95vw] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Japanese Auction Sheet Modal with AnimatePresence */}
      <AnimatePresence>
        {showAuctionSheetModal && vehicle.auctionSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: luxuryEase }}
              className="bg-[#121316] border border-white/20 p-6 sm:p-8 max-w-xl w-full relative"
            >
              <button
                onClick={() => setShowAuctionSheetModal(false)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-semibold uppercase tracking-widest mb-2">
                <FileText className="w-4 h-4" />
                <span>Japanese Auction Verification</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-4">
                Certified Auction Scorecard
              </h3>
              
              <div className="space-y-3 text-xs bg-[#0b0c0e] p-4 border border-white/10 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#9ea3ae]">Auction House:</span>
                  <span className="text-white font-bold">{vehicle.auctionSheet.auctionHouse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ea3ae]">Overall Grade:</span>
                  <span className="text-[#c5a880] font-bold text-base">Grade {vehicle.auctionSheet.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ea3ae]">Interior / Exterior Grade:</span>
                  <span className="text-white font-medium">{vehicle.auctionSheet.interiorGrade} / {vehicle.auctionSheet.exteriorGrade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ea3ae]">Lot Reference:</span>
                  <span className="text-white font-mono">{vehicle.auctionSheet.lotNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ea3ae]">Odometer Verification:</span>
                  <span className="text-emerald-400 font-bold">100% Guaranteed Genuine</span>
                </div>
              </div>

              <p className="text-xs text-[#9ea3ae] leading-relaxed mb-6">
                {vehicle.auctionSheet.notes || 'This vehicle was inspected and verified at port arrival. Zero accidental damage or salvage history.'}
              </p>

              <button
                onClick={() => setShowAuctionSheetModal(false)}
                className="w-full py-3 bg-white text-black font-semibold uppercase text-xs tracking-wider cursor-pointer hover:bg-neutral-200"
              >
                Close Verification
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 210-Point Inspection Modal with AnimatePresence */}
      <AnimatePresence>
        {showInspectionModal && vehicle.inspectionReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: luxuryEase }}
              className="bg-[#121316] border border-white/20 p-6 sm:p-8 max-w-xl w-full relative"
            >
              <button
                onClick={() => setShowInspectionModal(false)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-semibold uppercase tracking-widest mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Maison Master Diagnostic</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                210-Point Technical Scorecard
              </h3>
              <div className="text-3xl font-display font-bold text-[#c5a880] mb-4">
                {vehicle.inspectionReport.score} <span className="text-sm font-sans text-white/50">/ 100 Overall</span>
              </div>

              <div className="space-y-2.5 text-xs bg-[#0b0c0e] p-4 border border-white/10 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#9ea3ae]">Body Paint Integrity:</span>
                  <span className="text-emerald-400 font-medium">{vehicle.inspectionReport.paintCondition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ea3ae]">Engine & Powertrain:</span>
                  <span className="text-white font-medium">{vehicle.inspectionReport.engineHealth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ea3ae]">Suspension & Steering:</span>
                  <span className="text-white font-medium">{vehicle.inspectionReport.suspensionHealth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ea3ae]">Electrical & Sensors:</span>
                  <span className="text-white font-medium">{vehicle.inspectionReport.electricalHealth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ea3ae]">Tires & Brakes:</span>
                  <span className="text-white font-medium">{vehicle.inspectionReport.tiresCondition}</span>
                </div>
              </div>

              <button
                onClick={() => setShowInspectionModal(false)}
                className="w-full py-3 bg-white text-black font-semibold uppercase text-xs tracking-wider cursor-pointer hover:bg-neutral-200"
              >
                Close Diagnostic Report
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
