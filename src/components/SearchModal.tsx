import React, { useState } from 'react';
import { Search, X, ArrowUpRight, MapPin } from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import { formatPKR } from '../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onSelectVehicle: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onSelectVehicle,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim()
    ? vehicles.filter((v) => {
        const q = query.toLowerCase();
        return (
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.variant.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.bodyStyle.toLowerCase().includes(q) ||
          v.assembly.toLowerCase().includes(q) ||
          v.year.toString().includes(q)
        );
      })
    : vehicles.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#121316] border border-white/20 shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="relative border-b border-white/10 p-4 flex items-center">
          <Search className="w-5 h-5 text-[#c5a880] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search make, model, city (e.g. Civic, Land Cruiser, Porsche, Lahore)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-white/40 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#9ea3ae] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-white/[0.05]">
          <div className="text-[10px] uppercase tracking-widest text-[#9ea3ae] pb-2 font-semibold">
            {query.trim() ? `Search Results (${filtered.length})` : 'Curated Suggestions'}
          </div>

          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#9ea3ae]">
              No automobiles found matching "{query}".
            </div>
          ) : (
            filtered.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => {
                  onSelectVehicle(vehicle.id);
                  onClose();
                }}
                className="py-3 px-2 flex items-center justify-between hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={vehicle.coverImage}
                    alt={vehicle.model}
                    className="w-14 h-10 object-cover bg-black/50"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#c5a880] transition-colors">
                      {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.variant}
                    </h4>
                    <div className="flex items-center space-x-2 text-[11px] text-[#9ea3ae]">
                      <span>{vehicle.horsepower}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 text-[#c5a880] mr-0.5 inline" />
                        {vehicle.city}
                      </span>
                      <span>•</span>
                      <span>{vehicle.assembly}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-[#f4f2ec] block">
                    {formatPKR(vehicle.price)}
                  </span>
                  <span className="text-[10px] text-[#c5a880] tracking-wider uppercase group-hover:underline flex items-center justify-end">
                    <span>View</span>
                    <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
