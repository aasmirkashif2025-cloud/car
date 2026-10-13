import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import { VehicleCard } from '../components/VehicleCard';

interface FavoritesPageProps {
  vehicles: Vehicle[];
  favoriteIds: string[];
  comparedIds: string[];
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectVehicle: (id: string) => void;
  onNavigateToInventory: () => void;
  whatsappNumber: string;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  vehicles,
  favoriteIds,
  comparedIds,
  onToggleFavorite,
  onToggleCompare,
  onSelectVehicle,
  onNavigateToInventory,
  whatsappNumber,
}) => {
  const favoriteVehicles = vehicles.filter((v) => favoriteIds.includes(v.id));

  return (
    <div className="min-h-screen bg-[#08090a] pt-36 sm:pt-44 pb-32">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Header */}
        <div className="mb-14 pb-8 hairline-b">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#c5a880] font-semibold block mb-2">
            PRIVATE SHORTLIST
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white uppercase tracking-tight">
            SAVED AUTOMOBILES.
          </h1>
          <p className="text-xs sm:text-sm text-[#9ea3ae] max-w-xl mt-2 font-light">
            Your personal curation of exceptional automobiles. Inquire or reserve private viewing anytime.
          </p>
        </div>

        {favoriteVehicles.length === 0 ? (
          <div className="py-24 text-center">
            <Heart className="w-10 h-10 text-[#9ea3ae]/50 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-white mb-2 uppercase">
              Your Shortlist is Empty
            </h3>
            <p className="text-xs text-[#9ea3ae] max-w-sm mx-auto mb-8 font-light">
              Click the heart icon on any vehicle in our fleet to add it to your private portfolio.
            </p>
            <button
              onClick={onNavigateToInventory}
              className="px-8 py-4 bg-[#f4f2ec] text-[#08090a] font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors"
            >
              Discover Available Fleet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {favoriteVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isFavorite={true}
                isCompared={comparedIds.includes(vehicle.id)}
                onToggleFavorite={onToggleFavorite}
                onToggleCompare={onToggleCompare}
                onSelect={onSelectVehicle}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
