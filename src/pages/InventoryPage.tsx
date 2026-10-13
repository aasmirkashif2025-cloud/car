import React, { useState, useMemo } from 'react';
import { Search, X, RotateCcw, LayoutGrid, Rows3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VehicleCard } from '../components/VehicleCard';
import { Vehicle } from '../types/vehicle';
import { ShowroomSettings } from '../types/crm';

interface InventoryPageProps {
  vehicles: Vehicle[];
  settings: ShowroomSettings;
  favorites: string[];
  comparisons: string[];
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectVehicle: (id: string) => void;
  initialFilters?: { make?: string; city?: string; assembly?: string };
}

// Easing and motion presets for luxury automotive art-direction
const luxuryEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: luxuryEase,
    },
  },
};

export const InventoryPage: React.FC<InventoryPageProps> = ({
  vehicles,
  settings,
  favorites,
  comparisons,
  onToggleFavorite,
  onToggleCompare,
  onSelectVehicle,
  initialFilters,
}) => {
  const [search, setSearch] = useState('');
  const [selectedMake, setSelectedMake] = useState(initialFilters?.make || 'all');
  const [selectedCondition, setSelectedCondition] = useState<'all' | 'new' | 'used'>('all');
  const [selectedAssembly, setSelectedAssembly] = useState(initialFilters?.assembly || 'all');
  const [selectedCity, setSelectedCity] = useState(initialFilters?.city || 'all');
  const [priceBracket, setPriceBracket] = useState<'all' | 'under_50_lac' | '50_to_1_cr' | '1_to_3_cr' | 'above_3_cr'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc'>('featured');
  
  // View mode switcher: 'grid' (multi-card grid) or 'row' ("1 HI ROW MAIN SIRF 1 CAR")
  const [viewMode, setViewMode] = useState<'grid' | 'row'>('grid');

  // Pakistani brands list
  const PAKISTANI_POPULAR_MAKES = ['Toyota', 'Honda', 'Haval', 'Kia', 'Hyundai', 'Changan', 'Jaecoo', 'Suzuki'];

  const availableMakes = useMemo(() => {
    const fromVehicles = Array.from(new Set(vehicles.map((v) => v.make)));
    // Combine with Pakistani popular makes
    const combined = Array.from(new Set([...PAKISTANI_POPULAR_MAKES, ...fromVehicles])).sort();
    return combined;
  }, [vehicles]);

  const availableCities = useMemo(() => {
    return Array.from(new Set(vehicles.map((v) => v.city))).sort();
  }, [vehicles]);

  const resetFilters = () => {
    setSearch('');
    setSelectedMake('all');
    setSelectedCondition('all');
    setSelectedAssembly('all');
    setSelectedCity('all');
    setPriceBracket('all');
    setSortBy('featured');
  };

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => v.published)
      .filter((v) => {
        // Search query
        if (search.trim()) {
          const q = search.toLowerCase();
          const match =
            v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.variant.toLowerCase().includes(q) ||
            v.city.toLowerCase().includes(q) ||
            v.assembly.toLowerCase().includes(q) ||
            v.year.toString().includes(q);
          if (!match) return false;
        }

        // Make
        if (selectedMake !== 'all' && v.make.toLowerCase() !== selectedMake.toLowerCase()) {
          return false;
        }

        // Condition (New vs Used)
        if (selectedCondition === 'new') {
          if (v.mileage > 2000) return false;
        } else if (selectedCondition === 'used') {
          if (v.mileage <= 2000) return false;
        }

        // Assembly
        if (selectedAssembly !== 'all' && v.assembly !== selectedAssembly) {
          return false;
        }

        // City
        if (selectedCity !== 'all' && v.city !== selectedCity) {
          return false;
        }

        // Price Brackets
        if (priceBracket === 'under_50_lac' && v.price >= 5000000) return false;
        if (priceBracket === '50_to_1_cr' && (v.price < 5000000 || v.price > 10000000)) return false;
        if (priceBracket === '1_to_3_cr' && (v.price < 10000000 || v.price > 30000000)) return false;
        if (priceBracket === 'above_3_cr' && v.price <= 30000000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'year_desc') return b.year - a.year;
        if (sortBy === 'mileage_asc') return a.mileage - b.mileage;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    vehicles,
    search,
    selectedMake,
    selectedCondition,
    selectedAssembly,
    selectedCity,
    priceBracket,
    sortBy,
  ]);

  const hasActiveFilters =
    search ||
    selectedMake !== 'all' ||
    selectedCondition !== 'all' ||
    selectedAssembly !== 'all' ||
    selectedCity !== 'all' ||
    priceBracket !== 'all';

  return (
    <div className="min-h-screen bg-[#08090a] pt-28 sm:pt-36 pb-32">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-10 lg:px-14">
        
        {/* Open Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: luxuryEase }}
          className="mb-10 sm:mb-14 pb-8 hairline-b border-white/[0.08] flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center space-x-2 text-[10px] tracking-[0.35em] uppercase text-[#c5a880] font-semibold mb-2">
              <span className="w-8 h-[1px] bg-[#c5a880]" />
              <span>CURATED FLEET · PAKISTAN</span>
            </div>
            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight">
              CARS FOR SALE.
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#9ea3ae] max-w-md font-light leading-relaxed">
              Every vehicle inspected with verified Japanese auction sheets or 100% genuine factory finish. Available across Lahore, Karachi, and Islamabad.
            </p>

            {/* View Mode Switcher ("1 ROW = 1 CAR" vs "GRID") */}
            <div className="flex items-center space-x-1 p-1 bg-black/60 border border-white/10 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#c5a880] text-black font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
                title="Grid View (Multiple Cars Per Row)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">GRID</span>
              </button>

              <button
                onClick={() => setViewMode('row')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors ${
                  viewMode === 'row'
                    ? 'bg-[#c5a880] text-black font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
                title="Single Car Row View (1 Row = 1 Car)"
              >
                <Rows3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">1 ROW = 1 CAR</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* =========================================================================
            BRAND / MAKE SELECTOR (PAKISTANI POPULAR MAKES)
            Clean, unboxed horizontal scrollable chips
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: luxuryEase }}
          className="mb-8 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none"
        >
          <button
            onClick={() => setSelectedMake('all')}
            className={`px-4 py-2 text-xs tracking-wider uppercase font-semibold shrink-0 transition-all ${
              selectedMake === 'all'
                ? 'bg-white text-black font-bold'
                : 'text-[#9ea3ae] hover:text-white bg-white/[0.04] hover:bg-white/10'
            }`}
          >
            ALL MAKES ({vehicles.filter((v) => v.published).length})
          </button>
          {availableMakes.map((make) => {
            const count = vehicles.filter((v) => v.published && v.make.toLowerCase() === make.toLowerCase()).length;
            return (
              <button
                key={make}
                onClick={() => setSelectedMake(selectedMake.toLowerCase() === make.toLowerCase() ? 'all' : make)}
                className={`px-4 py-2 text-xs tracking-wider uppercase font-semibold shrink-0 transition-all flex items-center space-x-2 ${
                  selectedMake.toLowerCase() === make.toLowerCase()
                    ? 'bg-[#c5a880] text-black font-bold'
                    : 'text-[#9ea3ae] hover:text-white bg-white/[0.04] hover:bg-white/10'
                }`}
              >
                <span>{make}</span>
                {count > 0 && (
                  <span className={`text-[10px] ${selectedMake.toLowerCase() === make.toLowerCase() ? 'text-black/70' : 'text-white/40'}`}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* =========================================================================
            DETAILED FILTER TOOLBAR (CONDITION, ASSEMBLY, CITY, BUDGET & SORT)
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: luxuryEase }}
          className="mb-10 pb-8 hairline-b border-white/[0.08] space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="w-3.5 h-3.5 text-[#9ea3ae] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Civic RS, Land Cruiser, Haval, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 pl-9 pr-8 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#c5a880]"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Condition: All / Brand New / Certified Pre-Owned */}
            <div className="lg:col-span-2">
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value as any)}
                className="w-full bg-white/[0.04] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
              >
                <option value="all" className="bg-[#0b0c0e]">Condition: All</option>
                <option value="new" className="bg-[#0b0c0e]">Brand New / Zero Meter</option>
                <option value="used" className="bg-[#0b0c0e]">Certified Pre-Owned</option>
              </select>
            </div>

            {/* Assembly: CKD vs Japanese CBU */}
            <div className="lg:col-span-2">
              <select
                value={selectedAssembly}
                onChange={(e) => setSelectedAssembly(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
              >
                <option value="all" className="bg-[#0b0c0e]">Assembly: All</option>
                <option value="Local Assembled (CKD)" className="bg-[#0b0c0e]">Local Assembled (CKD)</option>
                <option value="Japanese CBU Import" className="bg-[#0b0c0e]">Japanese CBU Import</option>
              </select>
            </div>

            {/* City */}
            <div className="lg:col-span-2">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
              >
                <option value="all" className="bg-[#0b0c0e]">City: All Ateliers</option>
                {availableCities.map((c) => (
                  <option key={c} value={c} className="bg-[#0b0c0e]">{c}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-white/[0.04] border border-white/10 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a880]"
              >
                <option value="featured" className="bg-[#0b0c0e]">Sort: Featured</option>
                <option value="price_asc" className="bg-[#0b0c0e]">Price: Low to High</option>
                <option value="price_desc" className="bg-[#0b0c0e]">Price: High to Low</option>
                <option value="year_desc" className="bg-[#0b0c0e]">Model Year: Newest</option>
                <option value="mileage_asc" className="bg-[#0b0c0e]">Mileage: Lowest</option>
              </select>
            </div>

          </div>

          {/* Budget Price Chips & Reset button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#9ea3ae] mr-1">BUDGET:</span>
              {[
                { id: 'all', label: 'All Budgets' },
                { id: 'under_50_lac', label: 'Under 50 Lac' },
                { id: '50_to_1_cr', label: '50 Lac – 1 Crore' },
                { id: '1_to_3_cr', label: '1 – 3 Crore' },
                { id: 'above_3_cr', label: '3+ Crore' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setPriceBracket(b.id as any)}
                  className={`px-3 py-1 text-[11px] font-medium transition-colors ${
                    priceBracket === b.id
                      ? 'bg-white text-black font-bold'
                      : 'text-[#9ea3ae] hover:text-white bg-white/[0.03]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#c5a880] hover:text-white flex items-center space-x-1.5 tracking-wider uppercase font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Results Counter Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-8 flex items-center justify-between text-xs text-[#9ea3ae]"
        >
          <div>
            Showing <span className="text-white font-bold">{filteredVehicles.length}</span> of {vehicles.filter((v) => v.published).length} verified Pakistani vehicles
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#c5a880]">
            Current Pakistani Market Valuations
          </span>
        </motion.div>

        {/* =========================================================================
            VEHICLE LISTINGS DISPLAY WITH MOTION ANIMATIONS
            ========================================================================= */}
        <AnimatePresence mode="wait">
          {filteredVehicles.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: luxuryEase }}
              className="py-24 text-center space-y-4"
            >
              <p className="text-base text-white/80 font-light">
                No vehicles matched your current filter selection.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#f4f2ec] text-[#08090a] text-xs font-bold uppercase tracking-widest hover:bg-white"
              >
                Reset All Filters
              </button>
            </motion.div>
          ) : viewMode === 'row' ? (
            /* =======================================================================
               ROW VIEW: "1 HI ROW MAIN SIRF 1 CAR"
               Spacious panoramic editorial banner for each vehicle
               ======================================================================= */
            <motion.div
              key={`row-view-${selectedMake}-${selectedCondition}-${selectedCity}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {filteredVehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                >
                  <VehicleCard
                    vehicle={vehicle}
                    viewMode="row"
                    isFavorite={favorites.includes(vehicle.id)}
                    isCompared={comparisons.includes(vehicle.id)}
                    onToggleFavorite={onToggleFavorite}
                    onToggleCompare={onToggleCompare}
                    onSelect={onSelectVehicle}
                    whatsappNumber={settings.whatsappNumber}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* =======================================================================
               GRID VIEW: MULTI-COLUMN EDITORIAL CARDS
               ======================================================================= */
            <motion.div
              key={`grid-view-${selectedMake}-${selectedCondition}-${selectedCity}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
            >
              {filteredVehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                >
                  <VehicleCard
                    vehicle={vehicle}
                    viewMode="grid"
                    isFavorite={favorites.includes(vehicle.id)}
                    isCompared={comparisons.includes(vehicle.id)}
                    onToggleFavorite={onToggleFavorite}
                    onToggleCompare={onToggleCompare}
                    onSelect={onSelectVehicle}
                    whatsappNumber={settings.whatsappNumber}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
