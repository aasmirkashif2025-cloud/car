import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { SearchModal } from './components/SearchModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';

import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';

// Code-split secondary pages and heavy Admin panel for blazing fast initial page load
const VehicleDetailPage = lazy(() => import('./pages/VehicleDetailPage').then(m => ({ default: m.VehicleDetailPage })));
const ComparePage = lazy(() => import('./pages/ComparePage').then(m => ({ default: m.ComparePage })));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage').then(m => ({ default: m.FavoritesPage })));
const PhilosophyPage = lazy(() => import('./pages/PhilosophyPage').then(m => ({ default: m.PhilosophyPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const LocationsPage = lazy(() => import('./pages/LocationsPage').then(m => ({ default: m.LocationsPage })));
const TradeInPage = lazy(() => import('./pages/TradeInPage').then(m => ({ default: m.TradeInPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.FAQPage })));
const PrivacyPage = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.TermsPage })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

const LuxuryLoader = () => (
  <div className="w-full min-h-[50vh] flex flex-col items-center justify-center p-12">
    <div className="w-6 h-6 border-2 border-[#c5a880]/30 border-t-[#c5a880] rounded-full animate-spin mb-4" />
    <span className="text-[10px] tracking-[0.3em] uppercase text-[#c5a880]/70 font-mono">
      LOADING ATELIER...
    </span>
  </div>
);

import { StorageService } from './services/storageService';
import { Vehicle } from './types/vehicle';
import { Lead, ShowroomSettings } from './types/crm';
import { BrandInfo } from './data/seedSettings';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  
  // Data states
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [settings, setSettings] = useState<ShowroomSettings>(StorageService.getSettings());
  const [leads, setLeads] = useState<Lead[]>([]);
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  
  // User interactions
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparisons, setComparisons] = useState<string[]>([]);
  
  // Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingVehicle, setSelectedBookingVehicle] = useState<Vehicle | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filter params for navigation (e.g. when clicking a brand on homepage)
  const [inventoryInitialFilters, setInventoryInitialFilters] = useState<{ make?: string; city?: string } | undefined>(undefined);

  // Initialize and load data
  const loadData = () => {
    setVehicles(StorageService.getVehicles());
    setSettings(StorageService.getSettings());
    setLeads(StorageService.getLeads());
    setBrands(StorageService.getBrands());
    setFavorites(StorageService.getFavorites());
    setComparisons(StorageService.getComparisonIds());
  };

  useEffect(() => {
    loadData();

    // Check URL hash for direct deep linking
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('vehicle=')) {
        const id = hash.split('=')[1];
        setActivePage('vehicle');
        setActiveVehicleId(id);
      } else if (hash) {
        setActivePage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle page transitions & update hash
  const navigateTo = (page: string, params?: { vehicleId?: string; make?: string; city?: string }) => {
    if (page === 'vehicle' && params?.vehicleId) {
      setActiveVehicleId(params.vehicleId);
      window.location.hash = `vehicle=${params.vehicleId}`;
    } else {
      window.location.hash = page === 'home' ? '' : page;
    }

    if (params?.make || params?.city) {
      setInventoryInitialFilters({ make: params.make, city: params.city });
    } else if (page !== 'inventory') {
      setInventoryInitialFilters(undefined);
    }

    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVehicle = (id: string) => {
    navigateTo('vehicle', { vehicleId: id });
  };

  const handleToggleFavorite = (id: string) => {
    const updated = StorageService.toggleFavorite(id);
    setFavorites(updated);
  };

  const handleToggleCompare = (id: string) => {
    const updated = StorageService.toggleComparison(id);
    setComparisons(updated);
  };

  const handleClearCompare = () => {
    StorageService.clearComparison();
    setComparisons([]);
  };

  const openBookingForVehicle = (vehicle?: Vehicle) => {
    setSelectedBookingVehicle(vehicle);
    setIsBookingModalOpen(true);
  };

  // Find currently viewed vehicle
  const currentVehicle = activeVehicleId 
    ? vehicles.find((v) => v.id === activeVehicleId || v.slug === activeVehicleId)
    : undefined;

  // Render Admin separately if activePage === 'admin'
  if (activePage === 'admin') {
    return (
      <Suspense fallback={<LuxuryLoader />}>
        <AdminDashboard
          vehicles={vehicles}
          settings={settings}
          leads={leads}
          onRefreshData={loadData}
          onExitAdmin={() => navigateTo('home')}
          onViewVehicle={(id) => handleSelectVehicle(id)}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#f4f2ec] flex flex-col font-sans selection:bg-[#c5a880] selection:text-black">
      
      {/* 1. Header Navigation (Exact referral design) */}
      <Header
        settings={settings}
        activePage={activePage}
        onNavigate={(p) => navigateTo(p)}
        onOpenBookingModal={() => openBookingForVehicle()}
      />

      {/* 2. Main Page View Content */}
      <main className="flex-1 relative">
        <Suspense fallback={<LuxuryLoader />}>
          <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}>
            <motion.div
              key={activePage === 'vehicle' && activeVehicleId ? `vehicle-${activeVehicleId}` : activePage}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                duration: 0.38,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full flex-1"
            >
            {activePage === 'home' && (
              <HomePage
                vehicles={vehicles}
                settings={settings}
                brands={brands}
                favorites={favorites}
                comparisons={comparisons}
                onToggleFavorite={handleToggleFavorite}
                onToggleCompare={handleToggleCompare}
                onSelectVehicle={handleSelectVehicle}
                onNavigate={(p, params) => navigateTo(p, params)}
                onOpenBookingModal={() => openBookingForVehicle()}
              />
            )}

            {activePage === 'inventory' && (
              <InventoryPage
                vehicles={vehicles}
                settings={settings}
                favorites={favorites}
                comparisons={comparisons}
                onToggleFavorite={handleToggleFavorite}
                onToggleCompare={handleToggleCompare}
                onSelectVehicle={handleSelectVehicle}
                initialFilters={inventoryInitialFilters}
              />
            )}

            {activePage === 'vehicle' && currentVehicle && (
              <VehicleDetailPage
                vehicle={currentVehicle}
                allVehicles={vehicles}
                settings={settings}
                isFavorite={favorites.includes(currentVehicle.id)}
                isCompared={comparisons.includes(currentVehicle.id)}
                onToggleFavorite={handleToggleFavorite}
                onToggleCompare={handleToggleCompare}
                onBack={() => navigateTo('inventory')}
                onSelectVehicle={handleSelectVehicle}
                onOpenBookingModal={(v) => openBookingForVehicle(v)}
              />
            )}

            {activePage === 'compare' && (
              <ComparePage
                vehicles={vehicles}
                comparedIds={comparisons}
                onRemoveFromCompare={handleToggleCompare}
                onClearCompare={handleClearCompare}
                onSelectVehicle={handleSelectVehicle}
                onNavigateToInventory={() => navigateTo('inventory')}
                whatsappNumber={settings.whatsappNumber}
              />
            )}

            {activePage === 'favorites' && (
              <FavoritesPage
                vehicles={vehicles}
                favoriteIds={favorites}
                comparedIds={comparisons}
                onToggleFavorite={handleToggleFavorite}
                onToggleCompare={handleToggleCompare}
                onSelectVehicle={handleSelectVehicle}
                onNavigateToInventory={() => navigateTo('inventory')}
                whatsappNumber={settings.whatsappNumber}
              />
            )}

            {activePage === 'philosophy' && (
              <PhilosophyPage
                settings={settings}
                onExploreCollection={() => navigateTo('inventory')}
                onOpenBookingModal={() => openBookingForVehicle()}
              />
            )}

            {activePage === 'services' && (
              <ServicesPage
                settings={settings}
                onOpenBookingModal={() => openBookingForVehicle()}
                onNavigateToTradeIn={() => navigateTo('trade-in')}
              />
            )}

            {activePage === 'locations' && (
              <LocationsPage
                settings={settings}
                onOpenBookingModal={() => openBookingForVehicle()}
              />
            )}

            {activePage === 'trade-in' && (
              <TradeInPage
                vehicles={vehicles}
                onSelectVehicle={handleSelectVehicle}
              />
            )}

            {activePage === 'contact' && (
              <ContactPage
                settings={settings}
              />
            )}

            {activePage === 'faq' && <FAQPage />}
            {activePage === 'privacy' && <PrivacyPage settings={settings} />}
            {activePage === 'terms' && <TermsPage settings={settings} />}
          </motion.div>
        </AnimatePresence>
        </Suspense>
      </main>

      {/* 3. Global Luxury Footer */}
      <Footer
        settings={settings}
        onNavigate={(p) => navigateTo(p)}
      />

      {/* 4. Global Modals and Floating Concierge */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedVehicle={selectedBookingVehicle}
        allVehicles={vehicles}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        vehicles={vehicles}
        onSelectVehicle={handleSelectVehicle}
      />

      <WhatsAppFloatingButton
        whatsappNumber={settings.whatsappNumber}
        showroomName={settings.showroomName}
      />

    </div>
  );
}
