import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  Calculator, 
  Compass, 
  Lock, 
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { FinancingCalculator } from '../components/FinancingCalculator';
import { ShowroomSettings } from '../types/crm';

interface ServicesPageProps {
  settings: ShowroomSettings;
  onOpenBookingModal: () => void;
  onNavigateToTradeIn: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  settings,
  onOpenBookingModal,
  onNavigateToTradeIn,
}) => {
  return (
    <div className="min-h-screen bg-[#0b0c0e] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <span className="w-8 h-[1px] bg-[#c5a880]" />
            <span>Ownership Ecosystem</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white uppercase tracking-tight leading-tight">
            SERVICES & AUTO IJARAH.
          </h1>
          <p className="text-sm sm:text-base text-[#9ea3ae] mt-4 font-light leading-relaxed">
            From Shariah-compliant Islamic financing facilitation to bespoke Japanese CBU import procurement and enclosed transit across Pakistan.
          </p>
        </div>

        {/* 4 Pillars of Services (Open editorial grid, zero boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-28">
          
          <div className="space-y-4 py-6 hairline-t">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] font-semibold block">
              01 / FINANCING DESK
            </span>
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
              Islamic Auto Ijarah & Corporate Banking
            </h3>
            <p className="text-xs sm:text-sm text-[#9ea3ae] leading-relaxed font-light">
              We maintain direct executive desks with Pakistan's leading Islamic and conventional financial institutions, including Meezan Bank Car Ijarah, Bank Alfalah Islamic, HBL, and Dubai Islamic Bank. Enjoy priority documentation, doorstep biometric processing, and competitive KIBOR margin rates.
            </p>
            <div className="pt-2 text-[11px] text-[#c5a880] font-semibold tracking-wider uppercase">
              Fast-Track SBP Approvals & Tax Advisory
            </div>
          </div>

          <div className="space-y-4 py-6 hairline-t">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] font-semibold block">
              02 / GLOBAL SOURCING
            </span>
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
              Bespoke CBU Import Sourcing
            </h3>
            <p className="text-xs sm:text-sm text-[#9ea3ae] leading-relaxed font-light">
              Our Tokyo and Frankfurt procurement desks allow you to acquire specific models directly from USS Tokyo, CAA, and European official dealership networks. We manage foreign remittance, customs valuation, port clearance at Karachi Port Trust, and luxury excise registration.
            </p>
            <div className="pt-2 text-[11px] text-[#c5a880] font-semibold tracking-wider uppercase">
              Full Customs & Duty Transparency
            </div>
          </div>

          <div className="space-y-4 py-6 hairline-t">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] font-semibold block">
              03 / SURFACE CARE
            </span>
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
              XPEL Paint Protection & Ceramic Detailing
            </h3>
            <p className="text-xs sm:text-sm text-[#9ea3ae] leading-relaxed font-light">
              Protect your acquisition from the demanding road conditions of Pakistan. Our climate-controlled atelier bays install official self-healing XPEL Ultimate Plus PPF and multi-stage 9H Gyeon Quartz ceramic coatings with comprehensive warranty coverage.
            </p>
            <div className="pt-2 text-[11px] text-[#c5a880] font-semibold tracking-wider uppercase">
              Dust-Free Cleanroom Installation
            </div>
          </div>

          <div className="space-y-4 py-6 hairline-t">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] font-semibold block">
              04 / LOGISTICS
            </span>
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
              Enclosed White-Glove Transit
            </h3>
            <p className="text-xs sm:text-sm text-[#9ea3ae] leading-relaxed font-light">
              We operate dedicated single-vehicle enclosed carriers with hydraulic lifts for inter-city transport across Pakistan. Your automobile travels fully insured, shielded from motorway road debris, weather, and unauthorized mileage accumulation.
            </p>
            <div className="pt-2 text-[11px] text-[#c5a880] font-semibold tracking-wider uppercase">
              Doorstep Delivery Across Pakistan
            </div>
          </div>

        </div>

        {/* Embedded Calculator */}
        <div className="mb-20">
          <FinancingCalculator
            initialPrice={11895000}
            vehicleTitle="2024 Haval H6 HEV Hybrid Electric"
            onApplyFinancing={() => onOpenBookingModal()}
          />
        </div>

        {/* Trade In Banner */}
        <div className="bg-[#121316] border border-white/10 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Upgrade Your Existing Automobile
            </h3>
            <p className="text-xs text-[#9ea3ae] max-w-lg">
              Exchange your current luxury vehicle towards a newer model from the Maison fleet. Immediate doorstep technical evaluation and instant settlement.
            </p>
          </div>
          <button
            onClick={onNavigateToTradeIn}
            className="px-8 py-3.5 bg-white text-black font-bold text-xs tracking-widest uppercase hover:bg-[#c5a880] transition-colors whitespace-nowrap shrink-0"
          >
            Request Trade-In Valuation
          </button>
        </div>

      </div>
    </div>
  );
};
