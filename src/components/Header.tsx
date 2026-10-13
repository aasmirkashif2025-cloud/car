import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Shield, Phone, Sparkles } from 'lucide-react';
import { ShowroomSettings } from '../types/crm';

interface HeaderProps {
  settings: ShowroomSettings;
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenBookingModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activePage,
  onNavigate,
  onOpenBookingModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  // Easy, intuitive, and crystal-clear menu names
  const navigationItems = [
    { id: 'inventory', label: 'CARS FOR SALE' },
    { id: 'philosophy', label: 'ABOUT US' },
    { id: 'locations', label: 'SHOWROOMS' },
    { id: 'trade-in', label: 'SELL / EXCHANGE' },
    { id: 'contact', label: 'CONTACT US' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#08090a]/95 backdrop-blur-md py-3.5 hairline-b shadow-2xl'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5 sm:py-7'
        }`}
      >
        <div className="w-full px-5 sm:px-10 lg:px-14 flex items-center justify-between">
          
          {/* Showroom Logo & Brand Wordmark */}
          <button
            onClick={() => handleNav('home')}
            className="text-left group focus:outline-none flex items-center space-x-3.5"
          >
            {/* Custom Logo Image if uploaded, or Monogram */}
            {settings.customLogoUrl ? (
              <img
                src={settings.customLogoUrl}
                alt={settings.showroomName}
                className="h-9 w-auto object-contain filter brightness-100"
              />
            ) : (
              <div className="w-9 h-9 border border-[#c5a880]/60 bg-black/40 flex items-center justify-center font-editorial font-bold text-base text-[#c5a880] tracking-wider group-hover:border-[#c5a880] group-hover:bg-[#c5a880]/10 transition-all">
                {settings.customMonogram || 'M'}
              </div>
            )}
            
            <div className="flex flex-col">
              <span className="font-editorial text-sm sm:text-base font-bold tracking-[0.25em] text-[#f4f2ec] uppercase group-hover:text-white transition-colors leading-none">
                {settings.showroomName.toUpperCase()}
              </span>
              <span className="text-[8px] font-sans font-medium tracking-[0.38em] text-[#c5a880] uppercase leading-none pt-1">
                PAKISTAN ATELIER
              </span>
            </div>
          </button>

          {/* Center Navigation Links (Clear, Intuitive, Easy Names) */}
          <nav className="hidden xl:flex items-center space-x-8 lg:space-x-10">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-[11px] tracking-[0.22em] uppercase transition-colors relative py-1 focus:outline-none ${
                  activePage === item.id
                    ? 'text-white font-bold'
                    : 'text-[#9ea3ae] hover:text-white font-medium'
                }`}
              >
                {item.label}
                {activePage === item.id && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#c5a880]" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-4 lg:space-x-6">
            
            {/* Direct Test Drive / Viewing Button */}
            <button
              onClick={onOpenBookingModal}
              className="px-4 py-2 border border-[#c5a880]/40 hover:border-[#c5a880] bg-[#c5a880]/10 hover:bg-[#c5a880]/20 text-[#f4f2ec] hover:text-white text-[10px] tracking-[0.22em] uppercase font-bold transition-all flex items-center space-x-2 focus:outline-none"
            >
              <Sparkles className="w-3 h-3 text-[#c5a880]" />
              <span>BOOK A TEST DRIVE</span>
            </button>

            {/* Quick Admin Portal Button */}
            <button
              onClick={() => handleNav('admin')}
              className={`p-2 text-xs transition-colors border ${
                activePage === 'admin'
                  ? 'border-[#c5a880] text-[#c5a880] bg-black/60'
                  : 'border-white/10 hover:border-white/30 text-white/50 hover:text-white bg-black/30'
              }`}
              title="Admin Portal (Password Protected)"
            >
              <Shield className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center space-x-3">
            <button
              onClick={onOpenBookingModal}
              className="px-2.5 py-1.5 border border-[#c5a880]/40 text-[#c5a880] text-[9px] tracking-widest uppercase font-bold"
            >
              TEST DRIVE
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer (Responsive & Clean) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#08090a]/98 backdrop-blur-2xl xl:hidden flex flex-col justify-between pt-24 px-8 pb-10 animate-in fade-in duration-300">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white"
          >
            <X className="w-7 h-7" />
          </button>

          <div className="space-y-6 flex flex-col my-auto">
            <button
              onClick={() => handleNav('home')}
              className={`text-left font-editorial text-2xl font-bold tracking-widest uppercase ${
                activePage === 'home' ? 'text-[#c5a880]' : 'text-white'
              }`}
            >
              HOME
            </button>
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-left font-editorial text-2xl font-bold tracking-widest uppercase ${
                  activePage === item.id ? 'text-[#c5a880]' : 'text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('compare')}
              className="text-left font-editorial text-xl font-medium tracking-widest text-[#9ea3ae] uppercase"
            >
              COMPARE VEHICLES
            </button>
            <button
              onClick={() => handleNav('favorites')}
              className="text-left font-editorial text-xl font-medium tracking-widest text-[#9ea3ae] uppercase"
            >
              SAVED CARS
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="text-left font-editorial text-xl font-bold tracking-widest text-[#c5a880] uppercase flex items-center space-x-2 pt-2"
            >
              <Shield className="w-4 h-4" />
              <span>ADMIN PANEL</span>
            </button>
          </div>

          <div className="space-y-3 pt-6 hairline-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookingModal();
              }}
              className="w-full py-4 bg-[#f4f2ec] text-[#08090a] font-bold text-xs tracking-[0.2em] uppercase text-center flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#08090a]" />
              <span>BOOK A TEST DRIVE</span>
            </button>
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="w-full py-3.5 border border-white/20 text-white font-semibold text-xs tracking-wider uppercase text-center block"
            >
              CALL HOTLINE: {settings.phone}
            </a>
          </div>
        </div>
      )}
    </>
  );
};
