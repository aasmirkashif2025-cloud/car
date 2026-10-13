import React from 'react';
import { ShowroomSettings } from '../types/crm';
import { generateWhatsAppLink } from '../utils/formatters';

interface FooterProps {
  settings: ShowroomSettings;
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const whatsAppLink = generateWhatsAppLink(
    settings.whatsappNumber,
    'Assalam-o-Alaikum, I am inquiring with Maison Motors Pakistan.'
  );

  return (
    <footer className="bg-[#08090a] hairline-t text-[#9ea3ae] pt-20 pb-14">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Top Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 hairline-b">
          
          {/* Brand Manifesto Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex flex-col">
              <span className="font-editorial text-base sm:text-lg font-bold tracking-[0.28em] text-white uppercase leading-none">
                {settings.showroomName.toUpperCase()}
              </span>
              <span className="text-[8px] font-sans tracking-[0.4em] text-[#9ea3ae] uppercase pt-1">
                PAKISTAN ATELIER
              </span>
            </div>

            <p className="text-xs text-[#9ea3ae] leading-relaxed max-w-sm font-light font-sans">
              Pakistan’s premier automotive atelier. Verified Japanese CBU auction sheets, meticulous 210-point mechanical audits, and discreet executive delivery across Lahore, Karachi, and Islamabad.
            </p>

            <div className="pt-2 text-xs space-y-1.5 font-light">
              <div>
                <span className="text-white/40 uppercase text-[10px] tracking-wider block">UAN</span>
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-white hover:text-[#c5a880] transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div>
                <span className="text-white/40 uppercase text-[10px] tracking-wider block">WHATSAPP</span>
                <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline">
                  {settings.displayWhatsappNumber}
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white font-bold block mb-4">
              COLLECTION
            </span>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <button onClick={() => onNavigate('inventory')} className="hover:text-white transition-colors">
                  Cars for Sale
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('philosophy')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('locations')} className="hover:text-white transition-colors">
                  Showroom Locations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('trade-in')} className="hover:text-white transition-colors">
                  Sell / Exchange Vehicle
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} className="hover:text-white transition-colors">
                  Compare Vehicles
                </button>
              </li>
            </ul>
          </div>

          {/* Pakistan Showroom Lounges */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white font-bold block mb-4">
              SHOWROOM ATELIERS
            </span>
            <ul className="space-y-3.5 text-xs font-light">
              <li>
                <span className="text-white font-medium block">Lahore Flagship</span>
                <span className="text-[#9ea3ae]/80 block">Main Boulevard, Gulberg III</span>
              </li>
              <li>
                <span className="text-white font-medium block">Karachi Gallery</span>
                <span className="text-[#9ea3ae]/80 block">Clifton Marine Drive, Block 4</span>
              </li>
              <li>
                <span className="text-white font-medium block">Islamabad Diplomatic</span>
                <span className="text-[#9ea3ae]/80 block">Super Market, F-6/3</span>
              </li>
            </ul>
          </div>

          {/* Governance & Staff Portal */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white font-bold block mb-4">
              MANAGEMENT
            </span>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors">
                  Questions & Answers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms of Sale
                </button>
              </li>
              <li className="pt-2">
                <button 
                  onClick={() => onNavigate('admin')} 
                  className="text-[#c5a880] hover:text-white text-[11px] font-semibold tracking-wider uppercase transition-colors flex items-center space-x-1"
                >
                  <span>Admin Control Portal</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Clean typographic line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#9ea3ae]/60 font-light space-y-3 sm:space-y-0">
          <div>
            © {currentYear} {settings.showroomName} (Pvt) Ltd. Registered with SECP Pakistan.
          </div>
          <div className="flex items-center space-x-6 text-[10px] tracking-widest uppercase">
            <span>PKR CURRENCY STANDARD</span>
            <span>•</span>
            <span>PUNJAB & SINDH EXCISE VERIFIED</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
